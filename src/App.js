import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import cx from 'classnames';

import i18n from './utils/i18n';
import ls from './utils/localStorage';
import dexie from './utils/dexie';
import * as bungie from './utils/bungie';
import * as voluspa from './utils/voluspa';
import * as enums from './utils/destinyEnums';
import manifest from './utils/manifest';

// polyfills
import 'intersection-observer';

// core styles
import './Core.css';
import './App.css';
import './components/PresentationNode.css';

// core components
import GoogleAnalytics from './components/GoogleAnalytics';
import Header from './components/UI/Header';
import Tooltip from './components/Tooltip';
import Footer from './components/UI/Footer';
import NotificationService from './components/Notifications/NotificationService';
import NotificationProgress from './components/Notifications/NotificationProgress';
import ServiceWorkerUpdate from './components/Notifications/ServiceWorkerUpdate';
import RefreshService from './components/RefreshService';
import ErrorBoundary from './components/ErrorBoundary';
import { AppLoading, SuspenseLoading } from './components/Loading';

// routes
import ProfileRoutes from './routes/Profile';
import ArchivesRoutes from './routes/Archives';

// core views
import Index from './views/Index';
import CharacterSelect from './views/CharacterSelect';
import Settings from './views/Settings';
import OOB from './views/OOB';

// feature views
//import PGCR from './views/PGCR';
import Read from './views/Read';

// standalones
import FAQ from './views/FAQ';
import ContentVault from './views/ContentVault';
import Compare from './views/Compare';
import Commonality from './views/Commonality';
import ClanBannerBuilder from './views/ClanBannerBuilder';
import SolsticeOfHeroes from './views/SolsticeOfHeroes';

import Test from './views/Test';

// slow down lazy imports for testing purposes
export function slowImport(value, ms = 1) {
  if (process.env.NODE_ENV === 'development') {
    return new Promise((resolve) => {
      setTimeout(() => resolve(value), ms);
    });
  } else {
    return value;
  }
}

// lazy load components
const Inspect = React.lazy(() => slowImport(import('./views/Inspect')));
const Maps = React.lazy(() => slowImport(import('./views/Maps')));
const TestThree = React.lazy(() => slowImport(import('./views/TestThree')));

// redirects /triumphs to /0/0000000000/0000000000/triumphs
const RedirectRoute = (props) => <Route {...props} render={({ location }) => <Redirect to={{ pathname: '/character-select', state: { from: location } }} />} />;

// wrap lazy-loaded components with react-router and ErrorBoundary component
export const SuspenseRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(route) => (
      <ErrorBoundary>
        <React.Suspense fallback={<SuspenseLoading {...route} />}>
          <Component {...route} />
        </React.Suspense>
      </ErrorBoundary>
    )}
  />
);

// print timings of promises to console (and performance logger)
// if we're running in development mode.
async function timed(name, promise) {
  if (process.env.NODE_ENV === 'development') console.time(name);
  const result = await promise;
  if (process.env.NODE_ENV === 'development') console.timeEnd(name);
  return result;
}

// Girl, bye, modernizr
function CSSFeatureDetects() {
  if (document.body.style.backdropFilter === undefined) {
    document.documentElement.classList.add('no-backdrop-filter');
  }
}

const android = document.referrer.includes('android-app://');

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      status: {
        code: false,
        detail: false,
      },
    };

    // Get stored language
    this.currentLanguage = i18n.getCurrentLanguage();
    if (this.currentLanguage === 'debug') this.currentLanguage = 'en';

    // We do these as early as possible - we don't want to wait
    // for the component to mount before starting the web requests
    this.startupRequests = window.navigator.onLine && {
      storedManifest: timed('getStoredManifest', this.getStoredManifest()),
      manifestIndex: timed('GetDestinyManifest', bungie.GetDestinyManifest({ errors: { hide: true } })),
      bungieSettings: timed('GetCommonSettings', bungie.GetCommonSettings({ errors: { hide: true } })),
      voluspaStatistics: timed('GetStatistics', voluspa.GetStatistics()),
    };

    // Set initial profile to saved profile but may be overridden by URL
    const profile = ls.get('setting.profile');
    if (profile) this.props.setMemberByRoute(profile);
  }

  // Called on window resize and dispatches changes to redux
  handler_resizeViewport = () => {
    this.props.setViewport({ width: window.innerWidth, height: window.innerHeight });
  };

  // Upon App.js mount; bind window reisze handler,
  // check if client online, start fetching manifest
  async componentDidMount() {
    this.handler_resizeViewport();

    window.addEventListener('resize', this.handler_resizeViewport);

    CSSFeatureDetects();

    if (!window.navigator.onLine) {
      this.setState({ status: { code: 'navigator_offline' } });
      return;
    }

    try {
      await timed('setUpManifest', this.setUpManifest());
    } catch (e) {
      console.log(e);

      if (e.message === 'Failed to fetch') {
        this.setState({ status: { code: 'error_fetchingManifest', detail: e } });
      } else if (e.message === 'maintenance') {
        this.setState({ status: { code: 'error_maintenance', detail: e } });
      } else if (e.name === 'OpenFailedError') {
        this.setState({ status: { code: 'error_indexedDb', detail: e } });
      } else {
        this.setState({ status: { code: 'error_setUpManifest', detail: e } });
      }
    }
  }

  async getStoredManifest() {
    const manifest = {};

    await dexie.table('manifest').each((row) => {
      manifest[row.table] = row.definitions;
      manifest.version = row.version;
    });

    return manifest;
  }

  async setUpManifest() {
    this.setState({ status: { code: 'checkManifest' } });

    const storedManifest = await this.startupRequests.storedManifest;
    const manifestIndex = await this.startupRequests.manifestIndex;
    const bungieSettings = await this.startupRequests.bungieSettings;

    // in case for whatever reason we don't get anything back from the internet
    if (!manifestIndex || !bungieSettings) throw Error();

    if ((bungieSettings.ErrorCode === 1 && !bungieSettings.Response?.systems?.D2Profiles?.enabled) || bungieSettings.ErrorCode === 5 || manifestIndex.ErrorCode === 5) {
      throw new Error('maintenance');
    }

    const currentVersion = manifestIndex && manifestIndex.ErrorCode === 1 && manifestIndex.Response.jsonWorldContentPaths[this.currentLanguage];
    const paths = manifestIndex && manifestIndex.ErrorCode === 1 && manifestIndex.Response.jsonWorldComponentContentPaths[this.currentLanguage];

    let tmpManifest = null;

    if (
      // no manifest available
      !storedManifest ||
      // manifest version mismatch
      currentVersion !== storedManifest.version ||
      // missing tables
      enums.manifestTableNames.filter((key) => Object.keys(storedManifest).indexOf(key) === -1).length
    ) {
      // Manifest missing from IndexedDB or doesn't match the current version -
      // download a new one and store it.
      tmpManifest = await this.downloadNewManifest(currentVersion, paths);
    } else {
      tmpManifest = storedManifest;
    }

    tmpManifest.settings = bungieSettings && bungieSettings.ErrorCode === 1 && bungieSettings.Response;

    this.availableLanguages = Object.keys(manifestIndex.Response.jsonWorldContentPaths);

    if (process.env.NODE_ENV === 'development') this.availableLanguages.unshift('debug');

    tmpManifest.statistics = (await this.startupRequests.voluspaStatistics).Response?.data || {};

    manifest.set(tmpManifest, this.currentLanguage);

    this.setState({ status: { code: 'ready' } });
  }

  async downloadNewManifestTables(paths) {
    // paths is an object where key is table name and value is json file path
    return Promise.all(
      // download each of these individual JSON files and return them
      // as a key value pair where key is table name and value is response value
      enums.manifestTableNames.map(async (key) => [key, await bungie.DownloadJsonFile(paths[key])])
    );
  }

  async downloadNewManifest(version, paths) {
    this.setState({ status: { code: 'fetchManifest' } });

    const [tables, DestinyHistoricalStatsDefinition] = await Promise.all([timed('downloadManifest', this.downloadNewManifestTables(paths)), timed('downloadManifestHistoricalStats', bungie.GetHistoricalStatsDefinition({ params: { locale: this.currentLanguage } }))]);

    // translate array of arrays to an object key value pair
    // it's expected as such by the rest of the app
    const manifest = tables.reduce((manifest, [key, value]) => {
      manifest[key] = value;

      return manifest;
    }, {});

    // add DestinyHistoricalStatsDefinition table to manifest, it's downloaded from a different endpoint
    if (DestinyHistoricalStatsDefinition.ErrorCode === 1 && DestinyHistoricalStatsDefinition.Response) {
      manifest.DestinyHistoricalStatsDefinition = DestinyHistoricalStatsDefinition.Response;
    } else {
      throw new Error('manifest');
    }

    this.setState({ status: { code: 'setManifest' } });

    try {
      await timed('clearTable', dexie.table('manifest').clear());
      await timed('storeManifest', dexie.table('manifest').bulkAdd(Object.keys(manifest).map((table) => ({ table, definitions: manifest[table], version }))));
    } catch (error) {
      // Can't write a manifest if we're in private mode in safari
      console.warn(`Error while trying to store the manifest in indexeddb: ${error}`);
    }

    return manifest;
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handler_resizeViewport);
  }

  render() {
    if (!window.ga) {
      GoogleAnalytics.init();
    }

    const ready = this.state.status.code === 'ready';

    return (
      <BrowserRouter>
        <Route
          render={(route) => (
            <div
              className={cx('wrapper', this.props.theme.active, {
                'reduced-motion': !this.props.settings.visual.passiveAnimations,
                'gay-it-up': this.props.settings.visual.gay,
                standalone: window.matchMedia && window.matchMedia('(display-mode: standalone)').matches,
                'service-worker-update': this.props.updateAvailable,
                // android
              })}
            >
              <Route component={GoogleAnalytics.GoogleAnalytics} />

              <ServiceWorkerUpdate updateAvailable={this.props.updateAvailable} />
              <NotificationService />

              <React.Suspense fallback={<SuspenseLoading full />}>
                {!ready ? (
                  <AppLoading state={this.state.status} />
                ) : (
                  <>
                    <NotificationProgress />

                    <Tooltip {...route} />

                    <div className='main'>
                      <Route component={Header} />

                      <Switch>
                        <Route path='/:membershipType([1|2|3|4|5])/:membershipId([0-9]+)/:characterId([0-9]+)?' component={ProfileRoutes} />
                        <Route path='/archives' component={ArchivesRoutes} />

                        <RedirectRoute path='/clan' />
                        <RedirectRoute path='/collections' />
                        <RedirectRoute path='/triumphs' />
                        <RedirectRoute path='/trackers' />
                        <RedirectRoute path='/checklists' exact />
                        <RedirectRoute path='/this-week' />
                        <RedirectRoute path='/now' />
                        <RedirectRoute path='/character' />
                        <RedirectRoute path='/quests' />
                        <RedirectRoute path='/reports' />

                        <Route path='/character-select' exact component={CharacterSelect} />

                        <SuspenseRoute path='/maps/:map?/:highlight?' component={Maps} />
                        <Route path='/clan-banner-builder/:decalBackgroundColorId?/:decalColorId?/:decalId?/:gonfalonColorId?/:gonfalonDetailColorId?/:gonfalonDetailId?/:gonfalonId?/' exact component={ClanBannerBuilder} />
                        {/* <Route path='/pgcr/:instanceId?' exact component={PGCR} /> */}
                        <SuspenseRoute path='/inspect/:type?/:itemHash?' exact component={Inspect} />
                        <Route path='/read/:kind?/:hash?' exact component={Read} />
                        <Route path='/compare/:object?' exact component={Compare} />

                        <Route path='/commonality' exact component={Commonality} />
                        <Route path='/settings' exact render={(route) => <Settings {...route} availableLanguages={this.availableLanguages} />} />
                        <Route path='/faq' exact component={FAQ} />
                        <Route path='/content-vault/:season([0-9]+)?/:slug?' exact component={ContentVault} />
                        <Route path='/solstice-of-heroes/:type?' exact component={SolsticeOfHeroes} />

                        <Route path='/oob' component={OOB} />
                        <Route path='/test' component={Test} />
                        <SuspenseRoute path='/three' exact component={TestThree} />

                        <Route path='/' component={Index} />
                      </Switch>
                    </div>

                    {/* Don't run the refresh service if we're currently selecting
                    a character, as the refresh will cause the member to
                    continually reload itself */}
                    <Route path='/character-select' children={(route) => !route.match && <RefreshService {...route} />} />

                    <Route component={Footer} />
                  </>
                )}
              </React.Suspense>
            </div>
          )}
        />
      </BrowserRouter>
    );
  }
}

function mapStateToProps(state) {
  return {
    settings: state.settings,
    theme: state.theme,
    member: state.member,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setViewport: (value) => {
      dispatch({ type: 'VIEWPORT_CHANGED', payload: value });
    },
    setMemberByRoute: (value) => {
      dispatch({ type: 'MEMBER_SET_BY_PROFILE_ROUTE', payload: value });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
