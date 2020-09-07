import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import actions from '../../store/actions';
import ls from '../../utils/localStorage';
import { t, BraytechText } from '../../utils/i18n';
import { dedupePromise } from '../../utils/promises';
import { useIsMounted } from '../../utils/hooks';
import { BungieAuth } from '../../utils/bungie';
import { GetMemberSettings, PostMemberSettings, DeleteMemberSettings } from '../../utils/voluspa';

import Checkbox from '../UI/Checkbox';
import Button from '../UI/Button';

export default function Sync() {
  const dispatch = useDispatch();
  const sync = useSelector((state) => state.sync);
  const settings = useSelector((state) => state.settings);
  const member = useSelector((state) => state.member);
  const auth = useSelector((state) => state.auth);
  const isMounted = useIsMounted();

  const [loading, setLoading] = useState(false);

  async function handler_toggle(event) {
    if (isMounted.current && !loading) {
      setLoading(true);
    }

    if (!sync.enabled) {
      const auth = await BungieAuth();

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
              dispatch(
                actions.sync.set({
                  enabled: true,
                  bnetMembershipId: auth.bnetMembershipId,
                  updated: membership.updated,
                })
              );
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
        console.log(`%cSettings downloaded: no settings found.`, 'color:cyan');

        const response = await PostMemberSettings({
          bnetMembershipId: auth.bnetMembershipId,
          membershipId: member.membershipId,
          settings,
        });

        if (response?.ErrorCode === 1) {
          dispatch(
            actions.sync.set({
              enabled: true,
              bnetMembershipId: auth.bnetMembershipId,
              updated: response.Response.updated,
            })
          );

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
    } else {
      dispatch(actions.sync.reset());
    }

    if (isMounted.current) {
      setLoading(false);
    }
  }

  async function handler_onClickDeleteSyncedSettings(event) {
    if (isMounted.current && !loading) {
      setLoading(true);
    }

    const response = await DeleteMemberSettings({
      params: {
        bnetMembershipId: auth.bnetMembershipId,
      },
    });

    if (isMounted.current) {
      if (response?.ErrorCode === 1) {
        dispatch(actions.sync.reset());

        dispatch(
          actions.notifications.push({
            displayProperties: {
              name: 'Voluspa',
              description: 'Settings deleted successfully',
              timeout: 4,
            },
          })
        );

        console.log(`%cSettings successfully deleted.`, 'color:lime');
      } else {
        dispatch(
          actions.notifications.push({
            displayProperties: {
              name: 'Voluspa',
              description: 'Settings failed to delete',
              timeout: 10,
            },
            error: true,
          })
        );

        console.log(`%cSettings failed to delete.`, 'color:lime');
      }

      setLoading(false);
    }
  }

  return (
    <>
      <BraytechText className='text' value={t('Settings.Sync.Info')} />
      <ul className='list settings'>
        <li>
          <Checkbox linked checked={sync.enabled} disabled={!auth || !(member.data && member.membershipId) || loading} text={t('Settings.Sync.Name')} action={handler_toggle} />
          <BraytechText className='info' value={t('Settings.Sync.Description')} />
        </li>
      </ul>
      <Button text='Delete synced settings' disabled={!sync.enabled || loading} action={handler_onClickDeleteSyncedSettings} />
      <BraytechText className='text' value='' />
    </>
  );
}
