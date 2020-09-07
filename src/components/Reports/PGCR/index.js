import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { orderBy, groupBy } from 'lodash';
import cx from 'classnames';

import actions from '../../../store/actions';
import { t } from '../../../utils/i18n';
import { GetProfile } from '../../../utils/bungie';
import { GetElo } from '../../../utils/thirdPartyApis';
import { calculateResets } from '../../../utils/destinyUtils';
import { Button, DestinyKey } from '../../UI/Button';
import MemberLink from '../../MemberLink';

import { ReportHeader, ReportHeaderLarge } from './ReportHeader';
import { EntryHeader, EntryDetail } from './EntryRow';

import './styles.css';

const unfinishableActivityModes = [
  6, // Patrol
  76, // Reckoning
];

function headInViewport(element) {
  const bounding = element.getBoundingClientRect();

  return bounding.top >= 0;
}

export default function ReportItem({ report, expanded }) {
  const member = useSelector((state) => state.member);
  const dispatch = useDispatch();
  const ref_parent = useRef();

  const [isExpanded, setExpanded] = useState(expanded && true);
  const [expandedPlayers, setExpandedPlayers] = useState([]);
  const [playerCache, setPlayerCache] = useState([]);

  useEffect(() => {
    if (isExpanded) {
      updatePlayerCache();
    }
  }, []);

  useEffect(() => {
    dispatch(actions.tooltips.rebind());
  }, [expandedPlayers]);

  function handler_expand(event) {
    setExpanded(true);

    updatePlayerCache();
  }

  function handler_contract(event) {
    setExpanded(false);
    setExpandedPlayers([]);

    if (!headInViewport(ref_parent.current)) {
      ref_parent.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const handler_togglePlayer = (characterId) => (event) => {
    if (expandedPlayers.includes(characterId)) {
      setExpandedPlayers((state) => [...state.filter((c) => c !== characterId)]);
    } else {
      setExpandedPlayers((state) => [...state, characterId]);
    }
  };

  function updatePlayerCache() {
    if (report) {
      report.entries.forEach(async (entry) => {
        const { membershipType, membershipId } = entry.player.destinyUserInfo;

        if (!membershipType || !membershipId) return;

        const progression = await getProgression(membershipType, membershipId, report.activityDetails.mode);

        // if (this.mounted) {
        setPlayerCache((state) => [
          ...state,
          {
            membershipId,
            ...progression,
          },
        ]);
        // }
      });
    }
  }

  const characters = member.data && member.data.profile.characters.data;
  const characterIds = characters && characters.map((c) => c.characterId);

  const isFinishable = !unfinishableActivityModes.filter((mode) => report.activityDetails.modes.indexOf(mode) > -1).length;

  if (isExpanded) console.log(report);

  const entry = characterIds && report.entries.find((entry) => characterIds.includes(entry.characterId));
  const standing = entry && entry.values.standing && entry.values.standing.basic.value !== undefined ? entry.values.standing.basic.value : -1;

  const entries = report.entries.map((entry) => {
    const dnf = entry.values.completed.basic.value === 0 && isFinishable ? true : false;
    const isExpandedPlayer = expandedPlayers.includes(entry.characterId);

    return {
      teamId: report.teams && report.teams.length ? entry.values.team.basic.value : null,
      fireteamId: entry.values.fireteamId ? entry.values.fireteamId.basic.value : null,
      element: (
        <li key={entry.characterId} className={cx({ expanded: isExpandedPlayer })}>
          <ul>
            <li className={cx('linked', 'inline', { dnf: dnf })} onClick={handler_togglePlayer(entry.characterId)}>
              <div className='member'>
                <MemberLink type={entry.player.destinyUserInfo.membershipType} id={entry.player.destinyUserInfo.membershipId} displayName={entry.player.destinyUserInfo.displayName} characterId={entry.characterId} />
              </div>
              <EntryHeader activityDetails={report.activityDetails} entry={entry} playerCache={playerCache} />
            </li>
            {isExpandedPlayer ? (
              <li>
                <EntryDetail activityDetails={report.activityDetails} entry={entry} playerCache={playerCache} />
              </li>
            ) : null}
          </ul>
        </li>
      ),
    };
  });

  const body = (
    <>
      <ReportHeaderLarge characterIds={characterIds} {...report} />
      <div className='entries'>
        {report.teams && report.teams.length ? (
          orderBy(report.teams, [(t) => t.score.basic.value], ['desc']).map((team) => {
            const fireteams = Object.values(
              groupBy(
                entries.filter((e) => e.teamId === team.teamId),
                'fireteamId'
              )
            );

            return (
              <ul key={team.teamId} className='team'>
                <li className={cx('header team', team.teamId === 17 ? 'alpha' : 'bravo')}>
                  <div className='team name'>{team.teamId === 17 ? t('Alpha team') : t('Bravo team')}</div>
                  <EntryHeader activityDetails={report.activityDetails} team />
                  <div className='team score hideInline'>{team.score.basic.displayValue}</div>
                </li>
                {fireteams.map((f, i) => {
                  return (
                    <li key={i}>
                      <ul className={cx('list', 'fireteam', { stacked: f.length > 1 })}>{f.map((e) => e.element)}</ul>
                    </li>
                  );
                })}
              </ul>
            );
          })
        ) : (
          <ul className='team'>
            <li className={cx('header team')}>
              <div className='team name' />
              <EntryHeader activityDetails={report.activityDetails} team />
              <div className='team score hideInline' />
            </li>
            {Object.values(groupBy(entries, 'fireteamId')).map((f, i) => {
              return (
                <li key={i}>
                  <ul className={cx('list', 'fireteam', { stacked: f.length > 1 })}>{f.map((e) => e.element)}</ul>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {!expanded && (
        <div className='sticky-nav inline'>
          <div className='wrapper'>
            <div />
            <ul>
              <li>
                <a className='button' href={`/pgcr/${report.activityDetails.instanceId}`} target='_blank'>
                  <DestinyKey type='more' />
                  {t('New tab')}
                </a>
              </li>
              <li>
                <Button action={handler_contract}>
                  <DestinyKey type='dismiss' />
                  {t('Close')}
                </Button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );

  return (
    <li key={report.activityDetails.instanceId} ref={ref_parent} className={cx('linked', { isExpanded, standing: standing > -1, victory: standing === 0 })} onClick={!isExpanded ? handler_expand : undefined}>
      {!isExpanded ? <ReportHeader characterIds={characterIds} {...report} /> : body}
    </li>
  );
}

async function getElo(membershipId, mode, season) {
  const response = await GetElo({ params: { membershipId, mode, season } });

  if (response) {
    return response.find((m) => m.mode === mode) || {};
  }

  return {};
}

async function getProgression(membershipType, membershipId, mode) {
  const response = await GetProfile({
    params: {
      membershipType,
      membershipId,
      components: '202,900',
    },
  });

  if (!response || (response && response.ErrorCode !== 1) || (response && response.ErrorCode === 1 && !response.Response.characterProgressions.data)) {
    return {
      points: {},
      resets: {},
      trials: {},
      elo: {},
    };
  }

  const elo = mode === 84 && (await getElo(membershipId, 84, 11));

  // in case the PGCR refers to a character that has since been deleted, as is the case with "5364501167"
  const characterId = Object.keys(response.Response.characterProgressions.data)[0];

  const characterProgressions = response.Response.characterProgressions.data;
  const characterRecords = response.Response.characterRecords.data;
  const profileRecords = response.Response.profileRecords.data.records;

  const gloryPoints = characterProgressions[characterId].progressions[2000925172].currentProgress;
  const valorPoints = characterProgressions[characterId].progressions[2626549951].currentProgress;
  const infamyPoints = characterProgressions[characterId].progressions[2772425241].currentProgress;
  const trialsWins = characterProgressions[characterId].progressions[1062449239].level;
  const trialsLosses = characterProgressions[characterId].progressions[2093709363].level;

  return {
    points: {
      glory: gloryPoints,
      valor: valorPoints,
      infamy: infamyPoints,
    },
    resets: {
      valor: calculateResets(3882308435, characterId, characterProgressions, characterRecords, profileRecords).resetsTotal,
      infamy: calculateResets(2772425241, characterId, characterProgressions, characterRecords, profileRecords).resetsTotal,
    },
    trials: {
      wins: trialsWins,
      losses: trialsLosses,
    },
    elo,
  };
}
