import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import actions from '../../store/actions';
import ls from '../../utils/localStorage';
import { useIsMounted, useInterval } from '../../utils/hooks';
import { BungieAuth } from '../../utils/bungie';
import { GetMemberSettings, PostMemberSettings } from '../../utils/voluspa';

function save(payload) {
  ls.set('settings', payload);
}

export default function SyncService() {
  const dispatch = useDispatch();
  const sync = useSelector((state) => state.sync);
  const { visual, developer, ...settings } = useSelector((state) => state.settings);
  const member = useSelector((state) => state.member);
  const isMounted = useIsMounted();

  const [isSetup, setIsSetup] = useState(false);

  // setup
  useEffect(() => {
    if (isMounted.current && !isSetup) {
      setIsSetup(true);
    }
  }, []);

  // download state
  async function download() {
    console.log(`%cSettings downloading...`, 'color:cyan');

    const response = await GetMemberSettings({
      params: {
        membershipId: member.membershipId,
      },
    });

    if (response?.ErrorCode === 1) {
      const settings = JSON.parse(response.Response.settings);

      if (settings) {
        if (response.Response.updated > sync.updated) {
          dispatch(actions.sync.set({ updated: response.Response.updated }));
          dispatch(
            actions.settings.sync({
              ...settings,
              updated: response.Response.updated,
            })
          );

          save({
            ...settings,
            updated: response.Response.updated,
          });

          dispatchNotification({
            hash: 'SettingsSyncSuccess',
            displayProperties: {
              name: 'Voluspa',
              description: 'Settings downloaded successfully',
              timeout: 4,
            },
          });

          console.log(`%cSettings downloaded: last updated ${response.Response.updated}`, 'color:cyan');
        } else {
          console.log(`%cSettings downloaded: current ${response.Response.updated}`, 'color:cyan');
        }
      }
    } else {
      console.log(`%cSettings download failed.`, 'color:cyan');
      console.log(response);
      dispatchNotification({
        hash: 'SettingsDownloadSuccess',
        displayProperties: {
          name: 'Voluspa',
          description: 'Settings download failed',
          timeout: 10,
        },
        error: true,
      });
    }
  }

  useEffect(() => {
    if (isMounted.current && sync.enabled) {
      download();
    }
  }, []);

  useInterval(() => {
    if (isMounted.current && sync.enabled) {
      download();
    }
  }, 1800 * 1000);

  // sync changes
  useEffect(() => {
    async function distribute() {
      console.log(`%cSettings syncing...`, 'color:lime');

      const auth = await BungieAuth();
      const response = await PostMemberSettings({
        bnetMembershipId: auth.bnetMembershipId,
        membershipId: member.membershipId,
        settings,
      });

      if (response?.ErrorCode === 1) {
        dispatch(actions.sync.set({ updated: response.Response.updated }));

        dispatchNotification({
          hash: 'SettingsSyncSuccess',
          displayProperties: {
            name: 'Voluspa',
            description: 'Settings synced successfully',
            timeout: 4,
          },
        });

        console.log(`%cSettings synced at: ${response.Response.updated}`, 'color:lime');
      } else {
        console.log(`%cSettings sync failed.`, 'color:lime');
        console.log(auth);
        console.log(response);
        dispatchNotification({
          hash: 'SettingsSyncFailure',
          displayProperties: {
            name: 'Voluspa',
            description: 'Settings sync fail',
            timeout: 10,
          },
          error: true,
        });
      }

      save(settings);
    }

    // if sync is enabled, sync then save
    if (isMounted.current && isSetup && sync.enabled && settings.updated > sync.updated) {
      distribute();
    }
    // just save
    else {
      save(settings);
    }
  }, [settings.updated]);

  function dispatchNotification(payload) {
    dispatch(
      actions.notifications.push({
        date: new Date().toISOString(),
        expiry: 86400 * 1000,
        ...payload,
      })
    );
  }

  return null;
}
