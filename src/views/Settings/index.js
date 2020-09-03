import React from 'react';
import { connect } from 'react-redux';

import { updateServiceWorker } from '../../serviceWorker';
import i18n, { t, BraytechText, getLanguageInfo } from '../../utils/i18n';
import ls from '../../utils/localStorage';
import { BungieAuth } from '../../components/BungieAuth';
import Checkbox from '../../components/UI/Checkbox';
import Button from '../../components/UI/Button';

import translationStats from '../../data/translation-stats';

import './styles.css';

class Settings extends React.Component {
  constructor(props) {
    super(props);

    const initLanguage = i18n.getCurrentLanguage();

    this.state = {
      language: {
        current: initLanguage,
        selected: initLanguage,
      },
      swInstalled: false,
      swUpdateAttempt: false,
      swUnregisterAttempt: false,
    };
  }

  selectLanguage = (lang) => (e) => {
    this.setState((state) => ({
      language: {
        ...state.language,
        selected: lang,
      },
    }));
  };

  saveAndRestart = () => {
    i18n.setCurrentLanguage(this.state.language.selected);

    setTimeout(() => {
      window.location.reload();
    }, 50);
  };

  async componentDidMount() {
    this.mounted = true;

    window.scrollTo(0, 0);

    const swInstalled = await this.swInstalled();

    if (this.mounted && swInstalled) this.setState({ swInstalled: true });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  swAvailable = process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator;

  swInstalled = async () => {
    if (this.swAvailable) {
      const registration = await navigator.serviceWorker.getRegistration('/');

      if (registration) return true;
    }

    return false;
  };

  handler_swUpdate = async () => {
    if (this.mounted) this.setState({ swUpdateAttempt: true });

    await updateServiceWorker();
    
    if (this.mounted) this.setState({ swUpdateAttempt: false });
  };

  handler_swDump = () => {
    if (this.mounted) this.setState({ swUnregisterAttempt: true });

    navigator.serviceWorker.getRegistration('/').then((registration) => {
      registration.unregister();

      console.log(registration);
    });
  };

  handler_setTheme = (theme) => (e) => {
    this.props.setTheme(theme);
  };

  handler_toggle = (key) => (e) => {
    const path = key.split('.');

    this.props.set({
      [path[0]]: {
        [path[1]]: !this.props.settings[path[0]][path[1]],
      },
    });
  };

  handler_resetLayouts = (e) => {
    this.props.resetLayouts({ target: false });
  };

  handler_resetTrackedTriumphs = (e) => {
    this.props.setTrackedTriumphs([]);
  };

  handler_resetTipsState = (e) => {
    this.props.setTips([]);
  };

  handler_resetEverything = (e) => {
    window.localStorage.clear();

    setTimeout(() => {
      window.location.reload();
    }, 50);
  };

  handler_resetProfileHistory = (e) => {
    ls.set('history.profiles', []);
  };

  handler_resetNotificationsState = (e) => {
    this.props.resetNotifications();
  };

  handler_reloadApp = (e) => {
    setTimeout(() => {
      window.location.reload();
    }, 50);
  };

  render() {
    const { settings, location } = this.props;

    const languageButtons = this.props.availableLanguages.map((code) => {
      const langInfo = getLanguageInfo(code);

      return (
        <li key={code}>
          <Checkbox linked checked={this.state.language.selected === code} action={this.selectLanguage(code)}>
            <div className='text'>
              <div className='name'>{langInfo.name || langInfo.code}</div>
              <div className='coverage tooltip' data-hash='coverage' data-type='braytech'>
                {translationStats[langInfo.code] && Math.floor(((translationStats['en'].translated - translationStats[langInfo.code].notTranslated) / translationStats['en'].translated) * 100)}%
              </div>
            </div>
          </Checkbox>
        </li>
      );
    });

    return (
      <div className='view' id='settings'>
        <div className='module head'>
          <div className='page-header'>
            <div className='name'>{t('Settings')}</div>
          </div>
        </div>
        <div className='buff'>
          <div className='module'>
            <div className='sub-header sub'>
              <div>{t('Bungie.net profile')}</div>
            </div>
            <BungieAuth location={location} />
          </div>
          <div className='module'>
            <div className='sub-header sub'>
              <div>{t('Item visibility')}</div>
            </div>
            <ul className='list settings'>
              <li>
                <Checkbox linked checked={settings.itemVisibility.hideCompletedChecklistItems} text={t('Settings.ItemVisibility.HideCompletedChecklistItems.Name')} action={this.handler_toggle('itemVisibility.hideCompletedChecklistItems')} />
                <BraytechText className='info' value={t('Settings.ItemVisibility.HideCompletedChecklistItems.Description')} />
              </li>
              <li>
                <Checkbox linked checked={settings.itemVisibility.hideCompletedRecords} text={t('Settings.ItemVisibility.HideCompletedRecords.Name')} action={this.handler_toggle('itemVisibility.hideCompletedRecords')} />
                <BraytechText className='info' value={t('Settings.ItemVisibility.HideCompletedRecords.Description')} />
              </li>
              <li>
                <Checkbox linked checked={settings.itemVisibility.hideInvisibleRecords} text={t('Settings.ItemVisibility.HideInvisibleRecords.Name')} action={this.handler_toggle('itemVisibility.hideInvisibleRecords')} />
                <BraytechText className='info' value={t('Settings.ItemVisibility.HideInvisibleRecords.Description')} />
              </li>
              <li>
                <Checkbox linked checked={settings.itemVisibility.hideUnobtainableRecords} text={t('Settings.ItemVisibility.HideUnobtainableRecords.Name')} action={this.handler_toggle('itemVisibility.hideUnobtainableRecords')} />
                <BraytechText className='info' value={t('Settings.ItemVisibility.HideUnobtainableRecords.Description')} />
              </li>
              <li>
                <Checkbox linked checked={settings.itemVisibility.hideDudRecords} text={t('Settings.ItemVisibility.HideDudRecords.Name')} action={this.handler_toggle('itemVisibility.hideDudRecords')} />
                <BraytechText className='info' value={t('Settings.ItemVisibility.HideDudRecords.Description')} />
              </li>
              <li>
                <Checkbox linked checked={settings.itemVisibility.hideCompletedCollectibles} text={t('Settings.ItemVisibility.HideCompletedCollectibles.Name')} action={this.handler_toggle('itemVisibility.hideCompletedCollectibles')} />
                <BraytechText className='info' value={t('Settings.ItemVisibility.HideCompletedCollectibles.Description')} />
              </li>
              <li>
                <Checkbox linked checked={settings.itemVisibility.hideInvisibleCollectibles} text={t('Settings.ItemVisibility.HideInvisibleCollectibles.Name')} action={this.handler_toggle('itemVisibility.hideInvisibleCollectibles')} />
                <BraytechText className='info' value={t('Settings.ItemVisibility.HideInvisibleCollectibles.Description')} />
              </li>
              <li>
                <Checkbox linked checked={settings.itemVisibility.suppressVaultWarnings} text={t('Settings.ItemVisibility.SuppressVaultWarnings.Name')} action={this.handler_toggle('itemVisibility.suppressVaultWarnings')} />
                <BraytechText className='info' value={t('Settings.ItemVisibility.SuppressVaultWarnings.Description')} />
              </li>
            </ul>
          </div>
          <div className='module'>
            <div className='sub-header sub'>
              <div>{t('Theme')}</div>
            </div>
            <ul className='list settings'>
              <li>
                <Checkbox linked checked={this.props.theme.user === 'light'} text={t('Settings.Theme.Light')} action={this.handler_setTheme('light')} />
              </li>
              <li>
                <Checkbox linked checked={this.props.theme.user === 'dark'} text={t('Settings.Theme.Dark')} action={this.handler_setTheme('dark')} />
              </li>
              <li>
                <Checkbox linked checked={!this.props.theme.user} text={t('Settings.Theme.SystemPreference')} action={this.handler_setTheme('system')} />
              </li>
            </ul>
            <div className='sub-header sub'>
              <div>{t('Visual fidelity')}</div>
            </div>
            <ul className='list settings'>
              <li>
                <Checkbox linked checked={settings.visual.passiveAnimations} text={t('Settings.VisualFidelity.PassiveAnimations.Name')} action={this.handler_toggle('visual.passiveAnimations')} />
                <BraytechText className='info' value={t('Settings.VisualFidelity.PassiveAnimations.Description')} />
              </li>
              <li>
                <Checkbox linked checked={settings.visual.three} text={t('Settings.VisualFidelity.Three.Name')} disabled={3 === 3} action={this.handler_toggle('visual.three')} />
                <BraytechText className='info' value={t('Settings.VisualFidelity.Three.Description')} />
              </li>
              <li>
                <Checkbox linked checked={settings.visual.threeShadows} text={t('Settings.VisualFidelity.ThreeShadows.Name')} disabled={!settings.visual.three || 3 === 3} action={this.handler_toggle('visual.threeShadows')} />
                <div className='info'>
                  <p>{t('Settings.VisualFidelity.ThreeShadows.Description')}</p>
                </div>
              </li>
              <li>
                <Checkbox linked checked={settings.visual.gay} text={t('Settings.VisualFidelity.Gay.Name')} action={this.handler_toggle('visual.gay')} />
                <BraytechText className='info' value={t('Settings.VisualFidelity.Gay.Description')} />
              </li>
            </ul>
            <div className='sub-header sub'>
              <div>{t('Developer')}</div>
            </div>
            <ul className='list settings'>
              <li>
                <Checkbox linked checked={settings.visual.threeDebug} text={t('Settings.VisualFidelity.ThreeDebug.Name')} action={this.handler_toggle('visual.threeDebug')} />
                <BraytechText className='info' value={t('Settings.VisualFidelity.ThreeDebug.Description')} />
              </li>
              <li>
                <Checkbox linked checked={settings.maps.debug} text={t('Settings.Maps.Debug.Name')} action={this.handler_toggle('maps.debug')} />
                <BraytechText className='info' value={t('Settings.Maps.Debug.Description')} />
              </li>
              <li>
                <Checkbox linked checked={settings.maps.noScreenshotHighlight} text={t('Settings.Maps.NoScreenshotHighlight.Name')} disabled={!settings.maps.debug} action={this.handler_toggle('maps.noScreenshotHighlight')} />
                <BraytechText className='info' value={t('Settings.Maps.NoScreenshotHighlight.Description')} />
              </li>
              <li>
                <Checkbox linked checked={settings.maps.logDetails} text={t('Settings.Maps.LogDetails.Name')} disabled={!settings.maps.debug} action={this.handler_toggle('maps.logDetails')} />
                <BraytechText className='info' value={t('Settings.Maps.LogDetails.Description')} />
              </li>
              <li>
                <Checkbox linked checked={settings.developer.lists} text={t('Settings.Developer.Lists.Name')} action={this.handler_toggle('developer.lists')} />
                <BraytechText className='info' value={t('Settings.Developer.Lists.Description')} />
              </li>
            </ul>
          </div>
          <div className='module'>
            <div className='sub-header sub'>
              <div>{t('Language')}</div>
            </div>
            <ul className='list settings'>{languageButtons}</ul>
            <Button text={t('Save and restart')} disabled={this.state.language.current === this.state.language.selected} action={this.saveAndRestart} />
          </div>
          <div className='module'>
            <div className='sub-header sub'>
              <div>{t('Local data')}</div>
            </div>
            <div className='buttons'>
              <Button text={t('Settings.LocalData.ResetProfileHistory.Name')} action={this.handler_resetProfileHistory} />
              <BraytechText className='info' value={t('Settings.LocalData.ResetProfileHistory.Description')} />
              <Button text={t('Settings.LocalData.ResetTrackedTriumphs.Name')} action={this.handler_resetTrackedTriumphs} />
              <BraytechText className='info' value={t('Settings.LocalData.ResetTrackedTriumphs.Description')} />
              <Button text={t('Settings.LocalData.ResetTips.Name')} action={this.handler_resetTipsState} />
              <BraytechText className='info' value={t('Settings.LocalData.ResetTips.Description')} />
              <Button text={t('Settings.LocalData.ResetNotifications.Name')} action={this.handler_resetNotificationsState} />
              <BraytechText className='info' value={t('Settings.LocalData.ResetNotifications.Description')} />
              <Button text={t('Settings.LocalData.ResetCustomisableLayouts.Name')} action={this.handler_resetLayouts} />
              <BraytechText className='info' value={t('Settings.LocalData.ResetCustomisableLayouts.Description')} />
              <Button text={t('Settings.LocalData.ResetEverything.Name')} action={this.handler_resetEverything} />
              <BraytechText className='info' value={t('Settings.LocalData.ResetEverything.Description')} />
            </div>
            <div className='sub-header sub'>
              <div>{t('Troubleshooting')}</div>
            </div>
            <div className='buttons'>
              <Button text={t('Reload')} action={this.handler_reloadApp} />
              <BraytechText className='info' value={t('Reload the app')} />
              {this.swAvailable && this.state.swInstalled ? (
                <>
                  <Button text={t('Settings.Troubleshooting.UpdateServiceWorker.Name')} disabled={!this.state.swInstalled || this.state.swUpdateAttempt || this.state.swUnregisterAttempt} action={this.handler_swUpdate} />
                  <BraytechText className='info' value={t('Settings.Troubleshooting.UpdateServiceWorker.Description')} />
                  <Button text={t('Settings.Troubleshooting.DumpServiceWorker.Name')} disabled={!this.state.swInstalled || this.state.swUnregisterAttempt} action={this.handler_swDump} />
                  <BraytechText className='info' value={t('Settings.Troubleshooting.DumpServiceWorker.Description')} />
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
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
    set: (payload) => {
      dispatch({ type: 'SET_SETTING', payload });
    },
    setTheme: (value) => {
      dispatch({ type: 'SET_THEME', payload: value });
    },
    setTrackedTriumphs: (value) => {
      dispatch({ type: 'SET_TRACKED_TRIUMPHS', payload: value });
    },
    setTips: (value) => {
      dispatch({ type: 'SET_TIPS', payload: value });
    },
    resetLayouts: (value) => {
      dispatch({ type: 'RESET_LAYOUTS', payload: value });
    },
    resetNotifications: () => {
      dispatch({ type: 'RESET_NOTIFICATIONS' });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
