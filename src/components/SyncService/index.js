import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import actions from '../../store/actions';
import ls from '../../utils/localStorage';
import { dedupePromise } from '../../utils/promises';
import { useIsMounted, useInterval, useDebounce } from '../../utils/hooks';
import { BungieAuth } from '../../utils/bungie';
import { GetMemberSettings, PostMemberSettings } from '../../utils/voluspa';

export default function SyncService() {
  const dispatch = useDispatch();
  const sync = useSelector((state) => state.sync);
  const { visual, developer, ...settings } = useSelector((state) => state.settings);
  const auth = useSelector((state) => state.auth);
  const member = useSelector((state) => state.member);
  const isMounted = useIsMounted();

  const [isSetup, setIsSetup] = useState(false);
  const isActive = member.membershipId && auth.destinyMemberships?.find((m) => m.membershipId === member.membershipId) && sync.enabled;

  // setup
  useEffect(() => {
    if (isMounted.current && !isSetup) {
      setIsSetup(true);
    }
  }, []);

  useEffect(() => {
    if (isMounted.current && isActive) {
      download();
    }
  }, []);

  useInterval(() => {
    if (isMounted.current && isActive) {
      download();
    }
  }, 1800 * 1000);

  // if a user spams settings changes,
  // we wait 500ms before setting a value, trigegring the effect
  const debouncedSettingsUpdated = useDebounce(settings.updated, 2000);

  // sync changes
  useEffect(() => {
    // if sync is enabled, sync then save
    if (isMounted.current && isSetup && isActive && settings.updated > sync.updated) {
      update();
    }
    // just save
    else {
      ls.set('settings', settings);
    }
  }, [debouncedSettingsUpdated]);

  // download state
  const download = dedupePromise(async () => {
    console.log(`%cSettings downloading...`, 'color:cyan');

    const response = await GetMemberSettings({
      params: {
        bnetMembershipId: auth.bnetMembershipId,
      },
    });

    // settings available
    if (response?.ErrorCode === 1) {
      const membership = response.Response.memberships.find((m) => m.membershipId === member.membershipId);

      if (membership) {
        const settings = JSON.parse(membership.settings);

        if (settings) {
          if (membership.updated > sync.updated) {
            dispatch(actions.sync.set({ updated: membership.updated }));
            dispatch(
              actions.settings.sync({
                ...settings,
                updated: membership.updated,
              })
            );

            ls.set('settings', {
              ...settings,
              updated: membership.updated,
            });

            dispatch(
              actions.notifications.push({
                displayProperties: {
                  name: 'Voluspa',
                  description: 'Settings downloaded successfully',
                  timeout: 4,
                },
              })
            );

            console.log(`%cSettings downloaded: last updated ${membership.updated}`, 'color:cyan');
          } else {
            console.log(`%cSettings downloaded: current ${membership.updated}`, 'color:cyan');
          }
        } else {
          console.log(`%cSettings downloaded: no relevant membership found.`, 'color:cyan');
        }
      }
    }
    // no settings found
    else if (response?.ErrorCode === 4) {
      dispatch(actions.sync.reset());

      console.log(`%cSettings downloaded: no settings found.`, 'color:cyan');
    } else {
      console.log(`%cSettings download failed.`, 'color:cyan');
      console.log(response);
      dispatch(
        actions.notifications.push({
          displayProperties: {
            name: 'Voluspa',
            description: 'Settings download failed',
            timeout: 10,
          },
          error: true,
        })
      );
    }
  });

  const update = dedupePromise(async () => {
    console.log(`%cSettings syncing...`, 'color:lime');

    const auth = await BungieAuth();
    const response = await PostMemberSettings({
      bnetMembershipId: auth.bnetMembershipId,
      membershipId: member.membershipId,
      settings,
    });

    if (response?.ErrorCode === 1) {
      dispatch(actions.sync.set({ updated: response.Response.updated }));

      dispatch(
        actions.notifications.push({
          displayProperties: {
            name: 'Voluspa',
            description: 'Settings synced successfully',
            timeout: 4,
          },
        })
      );

      console.log(`%cSettings synced at: ${response.Response.updated}`, 'color:lime');
    } else {
      console.log(`%cSettings sync failed.`, 'color:lime');
      console.log(auth);
      console.log(response);
      dispatch(
        actions.notifications.push({
          displayProperties: {
            name: 'Voluspa',
            description: 'Settings sync fail',
            timeout: 10,
          },
          error: true,
        })
      );
    }

    ls.set('settings', settings);
  });

  return null;
}
