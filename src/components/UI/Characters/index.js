import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import cx from 'classnames';

import { fromNow } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import { removeMemberIds } from '../../../utils/paths';
import { neverProfileLinks, lastPlayerActivity, metricImages } from '../../../utils/destinyUtils';
import { classHashToString, displayValue, raceHashToString } from '../../../utils/destinyConverters';

import Button from '../../../components/UI/Button';
import ObservedImage from '../../ObservedImage';

import { Common } from '../../../svg';

import './styles.css';

export default function Characters({ member, mini, colourised, ...props }) {
  const viewport = useSelector((state) => state.viewport);
  const location = useLocation();

  const characters = member.data.profile.characters;
  const characterActivities = member.data.profile.characterActivities;
  const characterEquipment = member.data.profile.characterEquipment.data;

  const lastActivities = lastPlayerActivity({ profile: { characters, characterActivities } });

  const goto = removeMemberIds((location && location.state?.from?.pathname) || '/now');

  return (
    <div className={cx('characters-list', { responsive: viewport.width < 1024, mini })}>
      {characters.data.map((character) => {
        const lastActivity = lastActivities.find((a) => a.characterId === character.characterId);

        const state = (
          <>
            <div className='activity'>{lastActivity.lastActivityString}</div>
            <time>{fromNow(lastActivity.lastPlayed, false, true)}</time>
          </>
        );

        const to = !neverProfileLinks.filter((path) => goto.indexOf(path) > -1).length ? `/${member.membershipType}/${member.membershipId}/${character.characterId}${goto}` : goto;

        const emblem = characterEquipment[character.characterId].items.find((i) => i.bucketHash === 4274335291);
        const metric = emblem?.metricHash && metricImages(emblem.metricHash);

        const emblemPath = mini ? character.emblemPath : character.emblemBackgroundPath;

        return (
          <div key={character.characterId} className='char'>
            <Button className='linked' anchor to={to} action={props.onClickCharacter(character.characterId)}>
              <ObservedImage
                className={cx('image', 'emblem', {
                  missing: !emblemPath,
                })}
                src={`https://www.bungie.net${emblemPath || '/img/misc/missing_icon_d2.png'}`}
              />
              {!mini && metric ? (
                <div className='metric'>
                  <div className='progress'>{displayValue(emblem.metricObjective.progress, emblem.metricObjective.objectiveHash)}</div>
                  <div className={cx('gonfalon', { complete: emblem.metricObjective.complete })}>
                    <ObservedImage className='image banner' src={`https://www.bungie.net${metric.banner}`} />
                    <ObservedImage className='image trait' src={`https://www.bungie.net${metric.trait}`} />
                    <ObservedImage className='image metric' src={`https://www.bungie.net${metric.metric}`} />
                    <ObservedImage className='image banner complete' src='/static/images/extracts/ui/metrics/01E3-10F0.png' />
                  </div>
                </div>
              ) : null}
              <div className='class'>{classHashToString(character.classHash, character.genderHash)}</div>
              <div className='species'>{raceHashToString(character.raceHash, character.genderHash)}</div>
              <div className='light'>{character.light}</div>
            </Button>
            {character.titleRecordHash ? (
              <div className={cx('title', { colourised })}>
                <div className='icon'>
                  <Common.SealTitle />
                </div>
                <div className='text'>{manifest.DestinyRecordDefinition[character.titleRecordHash].titleInfo.titlesByGenderHash[character.genderHash]}</div>
              </div>
            ) : null}
            <div className='state'>{state}</div>
          </div>
        );
      })}
    </div>
  );
}
