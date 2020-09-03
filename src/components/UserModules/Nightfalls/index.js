import React from 'react';
import { useSelector } from 'react-redux';

import { t } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import * as enums from '../../../utils/destinyEnums';
import Collectibles from '../../Collectibles';
import Records from '../../Records';
import ObservedImage from '../../ObservedImage';

import './styles.css';

export default function Nightfalls() {
  const member = useSelector((state) => state.member);

  // console.log(member.data.profile.characterActivities.data[member.characterId].availableActivities.map(m => ({ name: manifest.DestinyActivityDefinition[m.activityHash].displayProperties.name, ...m })));

  // get all available nightfall strikes
  const weeklyNightfallStrikeActivities = member.data.profile.characterActivities.data[member.characterId].availableActivities.filter((a) => {
    if (!a.activityHash) return false;

    const definitionActivity = manifest.DestinyActivityDefinition[a.activityHash];

    if (definitionActivity && definitionActivity.activityModeTypes && definitionActivity.activityModeTypes.includes(46) && !definitionActivity.guidedGame && definitionActivity.modifiers && definitionActivity.modifiers.length > 2) return true;

    return false;
  });

  // find the canonical hash of the active nightfall: ordeal
  const weeklyNightfallStrikesOrdealHash = Object.keys(enums.nightfalls).find((hash) => enums.nightfalls[hash]?.ordealHashes.find((ordealHash) => weeklyNightfallStrikeActivities.filter((activity) => activity.recommendedLight < 1100).find((activity) => activity.activityHash === ordealHash)));
  // collect and sort available difficulties of the active nightfall: ordeal
  const weeklyNightfallStrikesOrdealVersions = weeklyNightfallStrikeActivities.filter((activity) => enums.nightfalls[weeklyNightfallStrikesOrdealHash]?.ordealHashes.includes(activity.activityHash)).sort((a, b) => b.recommendedLight - a.recommendedLight);
  // get old-style active nightfalls
  const weeklyNightfallStrikesScored = weeklyNightfallStrikeActivities.filter((activity) => !Object.keys(enums.nightfalls).find((k) => enums.nightfalls[k].ordealHashes.find((ordealHash) => ordealHash === activity.activityHash)) && activity.recommendedLight < 1000);

  // sub-header string localisations
  const stringNightfall = manifest.DestinyPresentationNodeDefinition[4213993861]?.displayProperties?.name;
  const stringNightfallOrdeal = manifest.DestinyPresentationNodeDefinition[656562339]?.displayProperties?.name;

  // collate for render
  const nightfalls = [{ activityHash: weeklyNightfallStrikesOrdealHash, ordeal: true }, ...weeklyNightfallStrikesScored];

  return nightfalls.map((activity, a) => {
    const definitionNightfall = manifest.DestinyActivityDefinition[activity.activityHash];

    if (!definitionNightfall) {
      return (
        <div key={a} className='column'>
          <div className='module'>
            <div className='sub-header'>
              <div>???</div>
            </div>
            <h3>???</h3>
          </div>
        </div>
      );
    }

    const modifierHashes = (activity.ordeal ? weeklyNightfallStrikesOrdealVersions[0].modifierHashes : weeklyNightfallStrikeActivities.find((a) => a.activityHash === activity.activityHash)?.modifierHashes) || [];

    return (
      <div key={a} className='column'>
        <div className='module'>
          <div className='sub-header'>
            <div>{activity.ordeal ? stringNightfallOrdeal : stringNightfall}</div>
          </div>
          <h3>{definitionNightfall.selectionScreenDisplayProperties.name}</h3>
          <h4>{t('Active modifiers')}</h4>
          {modifierHashes.length ? (
            <ul className='list modifiers condensed'>
              {modifierHashes.map((hash, h) => {
                const definitionModifier = manifest.DestinyActivityModifierDefinition[hash];

                return (
                  <li key={h} className='tooltip' data-hash={hash} data-type='modifier'>
                    <div className='icon'>
                      <ObservedImage className='image' src={`https://www.bungie.net${definitionModifier.displayProperties.icon}`} />
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className='info'>{t('UserModules.Nightfalls.ModifiersUnavailable')}</div>
          )}
          <h4>{t('Collectibles')}</h4>
          {enums.nightfalls[definitionNightfall.hash]?.collectibles.length ? (
            <>
              <ul className='list collection-items'>
                <Collectibles selfLinkFrom='/this-week' hashes={enums.nightfalls[definitionNightfall.hash].collectibles} showInvisible />
              </ul>
            </>
          ) : (
            <div className='info'>
              <p>
                <em>{t('UserModules.Nightfalls.NoCollectibles')}</em>
              </p>
            </div>
          )}
          <h4>{t('Triumphs')}</h4>
          {enums.nightfalls[definitionNightfall.hash]?.records.length ? (
            <>
              <ul className='list record-items'>
                <Records selfLinkFrom='/this-week' hashes={enums.nightfalls[definitionNightfall.hash].records} ordered showInvisible />
              </ul>
            </>
          ) : (
            <div className='info'>
              <p>
                <em>{t('UserModules.Nightfalls.NoRecords')}</em>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  });
}
