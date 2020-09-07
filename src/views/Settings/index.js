import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, NavLink } from 'react-router-dom';

import { updateServiceWorker } from '../../serviceWorker';
import i18n, { t, BraytechText, getLanguageInfo } from '../../utils/i18n';
import ls from '../../utils/localStorage';
import manifest from '../../utils/manifest';
import { useIsMounted } from '../../utils/hooks';
import translationStats from '../../data/translation-stats';

import { BungieAuth } from '../../components/BungieAuth';
import Checkbox from '../../components/UI/Checkbox';
import Button from '../../components/UI/Button';

import * as SVG from '../../svg';

import './styles.css';
import actions from '../../store/actions';

function NavLinks() {
  return (
    <div className='module views'>
      <ul className='list'>
        <li className='linked'>
          <div className='icon'>
            <SVG.Common.SeventhColumn />
          </div>
          <NavLink to='/settings' exact />
        </li>
        <li className='linked'>
          <div className='icon'>
            <SVG.Common.SeventhColumn />
          </div>
          <NavLink to='/settings/advanced' />
        </li>
      </ul>
    </div>
  );
}

export default function Settings() {
  const { category } = useParams();

  return (
    <div className='view' id='settings'>
      <div className='module head'>
        <div className='icon'>
          <SVG.Common.Settings />
        </div>
        <div className='page-header'>
          <div className='sub-name'>{t('Settings')}</div>
          <div className='name'>{category === 'advanced' ? t('Settings.Category.Advanced.Name') : t('Settings.Category.Common.Name')}</div>
        </div>
      </div>
      <div className='buff'>
        <NavLinks />
        {category === 'advanced' ? <Advanced /> : <Common />}
      </div>
    </div>
  );
}

function Common() {
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.settings);
  const theme = useSelector((state) => state.theme);
  const sync = useSelector((state) => state.sync);
  const member = useSelector((state) => state.member);
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [language, setLanguage] = useState({
    active: i18n.language,
    selected: i18n.language,
  });

  const handler_toggle = (key) => (event) => {
    const path = key.split('.');

    dispatch(
      actions.settings.set({
        [path[0]]: {
          [path[1]]: !settings[path[0]][path[1]],
        },
      })
    );
  };

  const handler_theme = (value) => (event) => {
    dispatch(actions.theme.set(value));
  };

  const handler_languageSelect = (selected) => (event) => {
    setLanguage((state) => ({
      ...state,
      selected,
    }));
  };

  function handler_languageReload(event) {
    i18n.setCurrentLanguage(language.selected);

    setTimeout(() => {
      window.location.reload();
    }, 50);
  }

  function handler_toggleSync(event) {
    dispatch(
      actions.sync.set({
        enabled: !sync.enabled,
        bnetMembershipId: auth.bnetMembershipId,
      })
    );
  }

  return (
    <div className='content common'>
      <div className='module'>
        <div className='sub-header'>
          <div>{t('Bungie.net profile')}</div>
        </div>
        <BungieAuth />
      </div>
      <div className='module'>
        <div className='sub-header'>
          <div>{t('Theme')}</div>
        </div>
        <ul className='list settings'>
          <li>
            <Checkbox linked checked={theme.user === 'light'} text={t('Settings.Theme.Light')} action={handler_theme('light')} />
          </li>
          <li>
            <Checkbox linked checked={theme.user === 'dark'} text={t('Settings.Theme.Dark')} action={handler_theme('dark')} />
          </li>
          <li>
            <Checkbox linked checked={!theme.user} text={t('Settings.Theme.SystemPreference')} action={handler_theme('system')} />
          </li>
        </ul>
        <div className='sub-header'>
          <div>{t('Synchronisation')}</div>
        </div>
        <BraytechText className='text' value={t('Settings.Sync.Info')} />
        <ul className='list settings'>
          <li>
            <Checkbox linked checked={sync.enabled} disabled={!auth || !member.membershipId} text={t('Settings.Sync.Name')} action={handler_toggleSync} />
            <BraytechText className='info' value={t('Settings.Sync.Description')} />
          </li>
        </ul>
      </div>
      <div className='module'>
        <div className='sub-header'>
          <div>{t('Item visibility')}</div>
        </div>
        <ul className='list settings'>
          <li>
            <Checkbox linked checked={settings.itemVisibility.hideCompletedChecklistItems} text={t('Settings.ItemVisibility.HideCompletedChecklistItems.Name')} action={handler_toggle('itemVisibility.hideCompletedChecklistItems')} />
            <BraytechText className='info' value={t('Settings.ItemVisibility.HideCompletedChecklistItems.Description')} />
          </li>
          <li>
            <Checkbox linked checked={settings.itemVisibility.hideCompletedRecords} text={t('Settings.ItemVisibility.HideCompletedRecords.Name')} action={handler_toggle('itemVisibility.hideCompletedRecords')} />
            <BraytechText className='info' value={t('Settings.ItemVisibility.HideCompletedRecords.Description')} />
          </li>
          <li>
            <Checkbox linked checked={settings.itemVisibility.hideInvisibleRecords} text={t('Settings.ItemVisibility.HideInvisibleRecords.Name')} action={handler_toggle('itemVisibility.hideInvisibleRecords')} />
            <BraytechText className='info' value={t('Settings.ItemVisibility.HideInvisibleRecords.Description')} />
          </li>
          <li>
            <Checkbox linked checked={settings.itemVisibility.hideUnobtainableRecords} text={t('Settings.ItemVisibility.HideUnobtainableRecords.Name')} action={handler_toggle('itemVisibility.hideUnobtainableRecords')} />
            <BraytechText className='info' value={t('Settings.ItemVisibility.HideUnobtainableRecords.Description')} />
          </li>
          <li>
            <Checkbox linked checked={settings.itemVisibility.hideDudRecords} text={t('Settings.ItemVisibility.HideDudRecords.Name')} action={handler_toggle('itemVisibility.hideDudRecords')} />
            <BraytechText className='info' value={t('Settings.ItemVisibility.HideDudRecords.Description')} />
          </li>
          <li>
            <Checkbox linked checked={settings.itemVisibility.hideCompletedCollectibles} text={t('Settings.ItemVisibility.HideCompletedCollectibles.Name')} action={handler_toggle('itemVisibility.hideCompletedCollectibles')} />
            <BraytechText className='info' value={t('Settings.ItemVisibility.HideCompletedCollectibles.Description')} />
          </li>
          <li>
            <Checkbox linked checked={settings.itemVisibility.hideInvisibleCollectibles} text={t('Settings.ItemVisibility.HideInvisibleCollectibles.Name')} action={handler_toggle('itemVisibility.hideInvisibleCollectibles')} />
            <BraytechText className='info' value={t('Settings.ItemVisibility.HideInvisibleCollectibles.Description')} />
          </li>
          <li>
            <Checkbox linked checked={settings.itemVisibility.suppressVaultWarnings} text={t('Settings.ItemVisibility.SuppressVaultWarnings.Name')} action={handler_toggle('itemVisibility.suppressVaultWarnings')} />
            <BraytechText className='info' value={t('Settings.ItemVisibility.SuppressVaultWarnings.Description')} />
          </li>
        </ul>
      </div>
      <div className='module'>
        <div className='sub-header'>
          <div>{t('Language')}</div>
        </div>
        <ul className='list settings'>
          {manifest.languages.map((code, c) => {
            const { name } = getLanguageInfo(code);

            return (
              <li key={c}>
                <Checkbox linked checked={language.selected === code} action={handler_languageSelect(code)}>
                  <div className='text'>
                    <div className='name'>{name || code}</div>
                    <div className='coverage tooltip' data-hash='coverage' data-type='braytech'>
                      {translationStats[code] && Math.floor(((translationStats['en'].translated - translationStats[code].notTranslated) / translationStats['en'].translated) * 100)}%
                    </div>
                  </div>
                </Checkbox>
              </li>
            );
          })}
        </ul>
        <Button text={t('Save and restart')} disabled={language.active === language.selected} action={handler_languageReload} />
      </div>
    </div>
  );
}

const serviceWorkerAvailable = process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator;

async function serviceWorkerInstalled() {
  if (serviceWorkerAvailable) {
    const registration = await navigator.serviceWorker.getRegistration('/');

    if (registration) return true;
  }

  return false;
}

function handler_reloadApp(event) {
  setTimeout(() => {
    window.location.reload();
  }, 50);
}

function Advanced() {
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.settings);
  const isMounted = useIsMounted();

  const [serviceWorker, setServiceWorker] = useState({
    installed: false,
    updateAttempt: false,
    unregisterAttempt: false,
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    (async function () {
      const installed = await serviceWorkerInstalled();

      if (isMounted.current && installed) {
        setServiceWorker((state) => ({
          ...state,
          installed,
        }));
      }
    })();
  }, []);

  async function handler_serviceWorkerUpdate() {
    if (isMounted.current) {
      setServiceWorker((state) => ({
        ...state,
        updateAttempt: true,
      }));
    }

    await updateServiceWorker();

    if (isMounted.current) {
      setServiceWorker((state) => ({
        ...state,
        updateAttempt: false,
      }));
    }
  }

  function handler_serviceWorkerDump() {
    if (isMounted.current) {
      setServiceWorker((state) => ({
        ...state,
        unregisterAttempt: true,
      }));
    }

    navigator.serviceWorker.getRegistration('/').then((registration) => {
      registration.unregister();

      console.log(registration);
    });
  }

  const handler_toggle = (key) => (event) => {
    const path = key.split('.');

    dispatch(
      actions.settings.set({
        [path[0]]: {
          [path[1]]: !settings[path[0]][path[1]],
        },
      })
    );
  };

  const handler_layoutsReset = (event) => {
    dispatch(actions.layouts.reset({ target: false }));
  };

  const handler_trackedTriumphsReset = (event) => {
    dispatch(actions.triumphs.reset());
  };

  const handler_tipsReset = (event) => {
    dispatch(actions.tips.reset());
  };

  const handler_globalReset = (event) => {
    window.localStorage.clear();

    setTimeout(() => {
      window.location.reload();
    }, 50);
  };

  const handler_profileHistoryReset = (event) => {
    dispatch(actions.member.resetHistory());
  };

  const handler_notificationsReset = (event) => {
    dispatch(actions.notifications.reset());
  };

  return (
    <div className='content'>
      <div className='module'>
        <div className='sub-header'>
          <div>{t('Visual fidelity')}</div>
        </div>
        <ul className='list settings'>
          <li>
            <Checkbox linked checked={settings.visual.passiveAnimations} text={t('Settings.VisualFidelity.PassiveAnimations.Name')} action={handler_toggle('visual.passiveAnimations')} />
            <BraytechText className='info' value={t('Settings.VisualFidelity.PassiveAnimations.Description')} />
          </li>
          <li>
            <Checkbox linked checked={settings.visual.three} text={t('Settings.VisualFidelity.Three.Name')} disabled={3 === 3} action={handler_toggle('visual.three')} />
            <BraytechText className='info' value={t('Settings.VisualFidelity.Three.Description')} />
          </li>
          <li>
            <Checkbox linked checked={settings.visual.threeShadows} text={t('Settings.VisualFidelity.ThreeShadows.Name')} disabled={!settings.visual.three || 3 === 3} action={handler_toggle('visual.threeShadows')} />
            <div className='info'>
              <p>{t('Settings.VisualFidelity.ThreeShadows.Description')}</p>
            </div>
          </li>
          <li>
            <Checkbox linked checked={settings.visual.gay} text={t('Settings.VisualFidelity.Gay.Name')} action={handler_toggle('visual.gay')} />
            <BraytechText className='info' value={t('Settings.VisualFidelity.Gay.Description')} />
          </li>
        </ul>
      </div>
      <div className='module'>
        <div className='sub-header'>
          <div>{t('Developer')}</div>
        </div>
        <ul className='list settings'>
          <li>
            <Checkbox linked checked={settings.visual.threeDebug} text={t('Settings.VisualFidelity.ThreeDebug.Name')} action={handler_toggle('visual.threeDebug')} />
            <BraytechText className='info' value={t('Settings.VisualFidelity.ThreeDebug.Description')} />
          </li>
          <li>
            <Checkbox linked checked={settings.maps.debug} text={t('Settings.Maps.Debug.Name')} action={handler_toggle('maps.debug')} />
            <BraytechText className='info' value={t('Settings.Maps.Debug.Description')} />
          </li>
          <li>
            <Checkbox linked checked={settings.maps.noScreenshotHighlight} text={t('Settings.Maps.NoScreenshotHighlight.Name')} disabled={!settings.maps.debug} action={handler_toggle('maps.noScreenshotHighlight')} />
            <BraytechText className='info' value={t('Settings.Maps.NoScreenshotHighlight.Description')} />
          </li>
          <li>
            <Checkbox linked checked={settings.maps.logDetails} text={t('Settings.Maps.LogDetails.Name')} disabled={!settings.maps.debug} action={handler_toggle('maps.logDetails')} />
            <BraytechText className='info' value={t('Settings.Maps.LogDetails.Description')} />
          </li>
          <li>
            <Checkbox linked checked={settings.developer.lists} text={t('Settings.Developer.Lists.Name')} action={handler_toggle('developer.lists')} />
            <BraytechText className='info' value={t('Settings.Developer.Lists.Description')} />
          </li>
        </ul>
      </div>
      <div className='module'>
        <div className='sub-header'>
          <div>{t('Local data')}</div>
        </div>
        <div className='buttons'>
          <Button text={t('Settings.LocalData.ResetProfileHistory.Name')} action={handler_profileHistoryReset} />
          <BraytechText className='info' value={t('Settings.LocalData.ResetProfileHistory.Description')} />
          <Button text={t('Settings.LocalData.ResetTrackedTriumphs.Name')} action={handler_trackedTriumphsReset} />
          <BraytechText className='info' value={t('Settings.LocalData.ResetTrackedTriumphs.Description')} />
          <Button text={t('Settings.LocalData.ResetTips.Name')} action={handler_tipsReset} />
          <BraytechText className='info' value={t('Settings.LocalData.ResetTips.Description')} />
          <Button text={t('Settings.LocalData.ResetNotifications.Name')} action={handler_notificationsReset} />
          <BraytechText className='info' value={t('Settings.LocalData.ResetNotifications.Description')} />
          <Button text={t('Settings.LocalData.ResetCustomisableLayouts.Name')} action={handler_layoutsReset} />
          <BraytechText className='info' value={t('Settings.LocalData.ResetCustomisableLayouts.Description')} />
          <Button text={t('Settings.LocalData.ResetEverything.Name')} action={handler_globalReset} />
          <BraytechText className='info' value={t('Settings.LocalData.ResetEverything.Description')} />
        </div>
      </div>
      <div className='module'>
        <div className='sub-header'>
          <div>{t('Troubleshooting')}</div>
        </div>
        <div className='buttons'>
          <Button text={t('Reload')} action={handler_reloadApp} />
          <BraytechText className='info' value={t('Reload the app')} />
          {serviceWorkerAvailable && serviceWorker.installed ? (
            <>
              <Button text={t('Settings.Troubleshooting.UpdateServiceWorker.Name')} disabled={!serviceWorker.installed || serviceWorker.updateAttempt || serviceWorker.unregisterAttempt} action={handler_serviceWorkerUpdate} />
              <BraytechText className='info' value={t('Settings.Troubleshooting.UpdateServiceWorker.Description')} />
              <Button text={t('Settings.Troubleshooting.DumpServiceWorker.Name')} disabled={!serviceWorker.installed || serviceWorker.unregisterAttempt} action={handler_serviceWorkerDump} />
              <BraytechText className='info' value={t('Settings.Troubleshooting.DumpServiceWorker.Description')} />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
