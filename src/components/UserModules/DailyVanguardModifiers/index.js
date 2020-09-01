import React from 'react';
import { useSelector } from 'react-redux';

import { t } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import ObservedImage from '../../ObservedImage';

import './styles.css';

export default function DailyVanguardModifiers() {
  const member = useSelector((state) => state.member);
  const characterActivities = member.data.profile.characterActivities.data;

  // console.log(characterActivities[member.characterId].availableActivities.map(m => ({ name: manifest.DestinyActivityDefinition[m.activityHash].displayProperties.name, ...m })));

  const vanguardStrikes = characterActivities[member.characterId].availableActivities.find((a) => a.activityHash === 4252456044);

  const activityNames = [
    {
      hash: 4252456044,
      table: 'DestinyActivityDefinition',
    },
    {
      hash: 3028486709,
      table: 'DestinyPresentationNodeDefinition',
    },
    {
      hash: 175275639,
      table: 'DestinyActivityModeDefinition',
    },
    {
      hash: 1117466231,
      table: 'DestinyPresentationNodeDefinition',
    },
  ]
    .map((l) => {
      try {
        if (manifest[l.table][l.hash].displayProperties.name === 'Heroic Adventure') {
          return manifest[l.table][l.hash].displayProperties.name + 's';
        } else {
          return manifest[l.table][l.hash].displayProperties.name;
        }
      } catch (e) {
        return false;
      }
    })
    .map((n) => n);

  if (vanguardStrikes) {
    return (
      <div className='user-module daily-vanguard-modifiers'>
        <div className='sub-header'>
          <div>{t('UserModules.DailyVanguardModifiers.Name')}</div>
        </div>
        <div className='text'>
          <p>
            <em>
              {t('Activities including')} {activityNames.join(', ')}.
            </em>
          </p>
        </div>
        <h4>{t('Active modifiers')}</h4>
        <ul className='list modifiers'>
          {vanguardStrikes.modifierHashes.map((hash, h) => {
            const definitionModifier = manifest.DestinyActivityModifierDefinition[hash];

            return (
              <li key={h}>
                <div className='icon'>
                  <ObservedImage className='image' src={`https://www.bungie.net${definitionModifier.displayProperties.icon}`} />
                </div>
                <div className='text'>
                  <div className='name'>{definitionModifier.displayProperties.name}</div>
                  <div className='description'>{definitionModifier.displayProperties.description}</div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  } else {
    return (
      <div className='user-module daily-vanguard-modifiers'>
        <div className='sub-header'>
          <div>{t('UserModules.DailyVanguardModifiers.Name')}</div>
        </div>
        <div className='text'>
          <p>
            <em>{t('UserModules.DailyVanguardModifiers.Unavailable')}</em>
          </p>
        </div>
      </div>
    );
  }
}
