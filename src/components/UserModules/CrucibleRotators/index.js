import React from 'react';
import { useSelector } from 'react-redux';

import { t } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import { Activities } from '../../../svg';

import './styles.css';

const crucibleRotators = [
  3753505781, // Iron Banner
  2303927902, // Clash
  3780095688, // Supremacy
  1219083526, // Team Scorched
  4209226441, // Hardware
  952904835, // Momentum Control
  1102379070, // Mayhem
  3011324617, // Breakthrough
  3646079260, // Countdown
  1457072306, // Showdown
  3239164160, // Lockdown
  // 740422335, // Survival
  920826395, // Doubles
  3633915199, // Crimson Doubles
];

const crucibleModeIcons = {
  3753505781: <Activities.Crucible.IronBanner />,
  2303927902: <Activities.Crucible.Clash />,
  3780095688: <Activities.Crucible.Supremacy />,
  1219083526: <Activities.Crucible.TeamScorched />,
  4209226441: <Activities.Crucible.Default />,
  952904835: <Activities.Crucible.MomentumControl />,
  1102379070: <Activities.Crucible.Mayhem />,
  3011324617: <Activities.Crucible.Breakthrough />,
  3646079260: <Activities.Crucible.Countdown />,
  1457072306: <Activities.Crucible.Showdown />,
  3239164160: <Activities.Crucible.Lockdown />,
  740422335: <Activities.Crucible.Survival />,
  920826395: <Activities.Crucible.Doubles />,
  3633915199: <Activities.Crucible.CrimsonDoubles />,
};

export default function CrucibleRotators() {
  const member = useSelector((state) => state.member);
  const characterActivities = member.data.profile.characterActivities.data;

  // console.log(characterActivities[member.characterId].availableActivities.map(a => {
  //   if (!a.activityHash) return false;
  //   const definitionActivity = manifest.DestinyActivityDefinition[a.activityHash];

  //   return {
  //     name: definitionActivity.displayProperties.name,
  //     ...a,
  //     definitionActivity
  //   }
  // }));

  const featuredCrucibleModes = characterActivities[member.characterId].availableActivities.filter((a) => {
    if (!a.activityHash) return false;
    const definitionActivity = manifest.DestinyActivityDefinition[a.activityHash];

    if (definitionActivity && crucibleRotators.includes(definitionActivity.hash)) {
      a.displayProperties = definitionActivity.displayProperties;
      a.icon = crucibleModeIcons[definitionActivity.hash] || null;
      return true;
    }

    return false;
  });

  return (
    <div className='user-module crucible-rotators'>
      <div className='sub-header'>
        <div>{manifest.DestinyPlaceDefinition[4088006058]?.displayProperties.name}</div>
      </div>
      <div className='text'>
        <p>
          <em>{t('UserModules.CrucibleRotators.Description')}</em>
        </p>
      </div>
      <h4>{t('Rotator playlists')}</h4>
      <div className='modes'>
        {featuredCrucibleModes.map((f, i) => {
          return (
            <div key={i}>
              <div className='icon mode'>{f.icon}</div>
              <div className='text'>{f.displayProperties.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
