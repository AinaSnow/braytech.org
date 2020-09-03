import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { t } from '../../../utils/i18n';
import { GetHistoricalStats, GetActivityHistory } from '../../../utils/bungie';
import { DestinyActivityModeType } from '../../../utils/destinyEnums';
import { useInterval } from '../../../utils/hooks';

import Spinner from '../../../components/UI/Spinner';
import Mode, { Details } from '../../../components/Reports/Mode';
import Matches from '../../../components/Reports/Matches';
import { useParams } from 'react-router-dom';

export default function Root(props) {
  const auth = useSelector((state) => state.auth);
  const member = useSelector((state) => state.member);

  const [state, setState] = useState({
    loading: true,
    data: undefined,
  });

  const options = {
    defaultMode: false,
    root: '/reports/all',
    limit: 20,
    updateInterval: 300000,
    groups: [
      {
        modes: [
          DestinyActivityModeType.AllPvP, //
          DestinyActivityModeType.AllStrikes,
          DestinyActivityModeType.AllPvECompetitive,
        ],
      },
    ],
  };

  async function updateData() {
    const { membershipType, membershipId, characterId } = member;

    setState((state) => ({
      ...state,
      loading: true,
    }));

    const data = await Promise.all(
      options.groups.map(async (group) => ({
        ...group,
        modes: await Promise.all(
          group.modes.map(async (mode) => {
            const [historicalStats, activityHistory] = await Promise.all([
              await GetHistoricalStats(membershipType, membershipId, characterId, '1', mode, '0'),
              await GetActivityHistory({
                params: {
                  membershipType,
                  membershipId,
                  characterId,
                  count: 100,
                  mode,
                  page: 0,
                },
                withAuth: auth?.destinyMemberships?.find((d) => d.membershipId === membershipId) && true,
              }),
            ]);

            return {
              mode,
              historicalStats: historicalStats?.ErrorCode === 1 && historicalStats.Response[Object.keys(historicalStats.Response)?.[0]].allTime,
              activityHistory: activityHistory?.ErrorCode === 1 && activityHistory.Response.activities,
            };
          })
        ),
      }))
    );

    setState({
      loading: false,
      data,
    });
  }

  useEffect(() => {
    if (!state.data) {
      updateData();
    }

    window.scrollTo(0, 0);
  }, []);

  useInterval(() => {
    if (!state.loading) {
      updateData();
    }
  }, options.updateInterval);

  const params = useParams();

  return (
    <div className='type'>
      {state.data ? (
        <div className='modes'>
          {state.data.map((group, g) => (
            <React.Fragment key={g}>
              {group.name ? <h4>{group.name}</h4> : null}
              <div className='content'>
                <ul className='modes'>
                  {group.modes.map((data, m) => (
                    <li key={m}>
                      <ul>
                        <li>
                          <Mode data={data} root={options.root} defaultMode={options.defaultMode} />
                        </li>
                        {(params.mode && data.mode === +params.mode) || (!params.mode && data.mode === options.defaultMode) ? (
                          <li>
                            <Details data={data} />
                          </li>
                        ) : null}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            </React.Fragment>
          ))}
        </div>
      ) : (
        <div className='modes loading'>
          <Spinner />
        </div>
      )}
      <Matches mode={props.mode || options.defaultMode} limit={options.limit} offset={props.offset} root={options.root} />
    </div>
  );
}
