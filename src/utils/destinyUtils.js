import React from 'react';
import { once } from 'lodash';

import { t } from './i18n';
import manifest from './manifest';
import * as enums from './destinyEnums';
import { D2SeasonInfo } from '../data/d2-additional-info/d2-season-info.ts';
import * as SVG from '../svg';

export const neverProfileLinks = ['/maps', '/content-vault', '/solstice-of-heroes'];

export const isProfileRoute = (location) => {
  // if (location.pathname.indexOf('inventory') > -1) {
  //   return false;
  // } else
  if (location.pathname.match(/\/(?:[1|2|3|4|5])\/(?:[0-9]+)\/(?:[0-9]+)/)) {
    return true;
  } else {
    return false;
  }
};

export const pathSubDir = (location) => location.pathname.split('/')?.[1];

export function metricImages(metricHash) {
  const definitionMetric = manifest.DestinyMetricDefinition[metricHash];
  const definitionParent = manifest.DestinyPresentationNodeDefinition[definitionMetric?.parentNodeHashes?.[0]];

  const traitHash = definitionMetric.traitHashes.find((hash) => hash !== 1434215347);
  const definitionTrait = traitHash && manifest.DestinyTraitDefinition[traitHash];

  return {
    banner: definitionParent?.displayProperties.icon || '/img/misc/missing_icon_d2.png',
    trait: definitionTrait?.displayProperties.icon || '/img/misc/missing_icon_d2.png',
    metric: definitionMetric?.displayProperties.iconSequences?.[0].frames?.[definitionMetric.displayProperties.iconSequences[0].frames.length - 1] || '/img/misc/missing_icon_d2.png',
  };
}

export function totalValor() {
  return Object.keys(manifest.DestinyProgressionDefinition[2626549951].steps).reduce((sum, key) => {
    return sum + manifest.DestinyProgressionDefinition[2626549951].steps[key].progressTotal;
  }, 0);
}

export function totalGlory() {
  return Object.keys(manifest.DestinyProgressionDefinition[2000925172].steps).reduce((sum, key) => {
    return sum + manifest.DestinyProgressionDefinition[2000925172].steps[key].progressTotal;
  }, 0);
}

export function totalInfamy() {
  return Object.keys(manifest.DestinyProgressionDefinition[2772425241].steps).reduce((sum, key) => {
    return sum + manifest.DestinyProgressionDefinition[2772425241].steps[key].progressTotal;
  }, 0);
}

export function commonality(players = 0) {
  return (players / (manifest.statistics.scrapes?.last?.members || 10 * 10000)) * 100;
}

export function collectionTotal(data) {
  if (!data.profileCollectibles || !data.characterCollectibles) {
    console.warn('No data provided to destinyUtils.collectionTotal');
    return '0';
  }

  let collectionTotal = 0;
  let profileTempCollections = {};

  for (const [hash, collectible] of Object.entries(data.profileCollectibles.data.collectibles)) {
    const collectibleState = enums.enumerateCollectibleState(collectible.state);

    if (!collectibleState.NotAcquired) {
      if (!profileTempCollections[hash]) {
        profileTempCollections[hash] = 1;
      }
    }
  }

  for (const [characterId, character] of Object.entries(data.characterCollectibles.data)) {
    for (const [hash, collectible] of Object.entries(character.collectibles)) {
      const collectibleState = enums.enumerateCollectibleState(collectible.state);

      if (!collectibleState.NotAcquired) {
        if (!profileTempCollections[hash]) {
          profileTempCollections[hash] = 1;
        }
      }
    }
  }

  for (const [hash, collectible] of Object.entries(profileTempCollections)) {
    collectionTotal++;
  }

  return collectionTotal;
}

export const calculateResets = (progressionHash, characterId, characterProgressions, characterRecords, profileRecords) => {
  if (progressionHash === 2626549951) {
    // if valor adjust hash
    progressionHash = 3882308435;
  }

  const infamySeasons = [{ recordHash: 3901785488, objectiveHash: 4210654397 }].map((season) => {
    const definitionRecord = manifest.DestinyRecordDefinition[season.recordHash];

    const recordScope = definitionRecord.scope || 0;
    const recordData = recordScope === 1 ? characterRecords && characterRecords[characterId].records[definitionRecord.hash] : profileRecords && profileRecords[definitionRecord.hash];

    season.resets = (recordData && recordData.objectives && recordData.objectives.find((o) => o.objectiveHash === season.objectiveHash) && recordData.objectives.find((o) => o.objectiveHash === season.objectiveHash).progress) || 0;

    return season;
  });

  const valorSeasons = [
    // {
    //   recordHash: 3641080561, // Season 3
    //   objectiveHash: 4212711651,
    // },
    {
      recordHash: 1341325320,
      objectiveHash: 1089010148,
    },
    {
      recordHash: 2462707519,
      objectiveHash: 2048068317,
    },
    {
      recordHash: 3666883430,
      objectiveHash: 3211089622,
    },
    {
      recordHash: 2110987253,
      objectiveHash: 1898743615,
    },
    {
      recordHash: 510151900,
      objectiveHash: 2011701344,
    },
    {
      recordHash: 2282573299,
      objectiveHash: 18453481,
    },
    {
      recordHash: 1745319359,
      objectiveHash: 1305109085,
    },
    {
      recordHash: 623937160,
      objectiveHash: 346050916,
    },
  ].map((season) => {
    const definitionRecord = manifest.DestinyRecordDefinition[season.recordHash];

    const recordScope = definitionRecord.scope || 0;
    const recordData = recordScope === 1 ? characterRecords && characterRecords[characterId].records[definitionRecord.hash] : profileRecords && profileRecords[definitionRecord.hash];

    season.resets = (recordData && recordData.objectives && recordData.objectives.find((o) => o.objectiveHash === season.objectiveHash) && recordData.objectives.find((o) => o.objectiveHash === season.objectiveHash).progress) || 0;

    return season;
  });

  return {
    resetsSeason: characterProgressions[characterId].progressions[progressionHash] && Number.isInteger(characterProgressions[characterId].progressions[progressionHash].currentResetCount) ? characterProgressions[characterId].progressions[progressionHash].currentResetCount : '?',
    // total:
    //   characterProgressions[characterId].progressions[progressionHash] && characterProgressions[characterId].progressions[progressionHash].seasonResets
    //     ? characterProgressions[characterId].progressions[progressionHash].seasonResets.reduce((acc, curr) => {
    //         if (curr.season > 3) {
    //           return acc + curr.resets;
    //         } else {
    //           return acc;
    //         }
    //       }, 0)
    //     : '?'
    resetsTotal: (progressionHash === 3882308435 ? valorSeasons : infamySeasons).reduce((a, v) => a + v.resets, 0),
  };
};

export function progressionSeasonRank(member) {
  if (!member?.data || !member.data.profile?.characters?.data.length || !member.data.profile.characters.data[0].characterId || !member.data.profile?.characterProgressions?.data || !member.data.profile?.characterProgressions?.data[member.data.profile.characters.data[0].characterId]) {
    console.warn('No member data provided');

    return false;
  }

  const definitionSeason = manifest.DestinySeasonDefinition[manifest.settings.destiny2CoreSettings.currentSeasonHash];
  const definitionSeasonPass = manifest.DestinySeasonPassDefinition[definitionSeason.seasonPassHash];

  const characterId = member.characterId || member.data.profile.characters.data[0].characterId;

  const progressionHash = member.data.profile.characterProgressions.data[characterId]?.progressions[definitionSeasonPass.rewardProgressionHash]?.level === member.data.profile.characterProgressions.data[characterId]?.progressions[definitionSeasonPass.rewardProgressionHash]?.levelCap ? definitionSeasonPass.prestigeProgressionHash : definitionSeasonPass.rewardProgressionHash;

  const progression = {
    ...member.data.profile.characterProgressions.data[characterId].progressions[progressionHash],
  };

  if (progressionHash === definitionSeasonPass.prestigeProgressionHash) {
    progression.level += 100;
  }

  return progression;
}

export function getCollectibleState(member, collectibleHash) {
  if (!member?.data) {
    return 4;
  }

  const characterId = member.characterId;
  const characterCollectibles = member.data.profile?.characterCollectibles.data;
  const profileCollectibles = member.data.profile?.profileCollectibles.data;

  const definitionCollectible = manifest.DestinyCollectibleDefinition[collectibleHash];

  const data = definitionCollectible?.scope === 1 ? characterCollectibles[characterId].collectibles[definitionCollectible?.hash] : profileCollectibles.collectibles[definitionCollectible?.hash];

  if (data) {
    return data.state || 0;
  }

  return 4;
}

export const gameVersion = (versionsOwned, versionHash) => {
  const owned = versionsOwned && enums.enumerateDestinyGameVersions(versionsOwned);

  if (versionHash === 'base') {
    return {
      hash: 'base',
      unlock: {
        text: 'Requires Destiny 2',
      },
      eligible: owned.Base,
      displayProperties: {
        icon: SVG.Campaign.RedWar,
      },
    };
  } else if (versionHash === 'osiris') {
    return {
      hash: 'osiris',
      unlock: {
        text: t('Requires Destiny 2: Curse of Osiris'),
      },
      eligible: owned.Osiris,
      displayProperties: {
        icon: SVG.Campaign.CurseOfOsiris,
      },
    };
  } else if (versionHash === 'warmind') {
    return {
      hash: 'warmind',
      unlock: {
        text: t('Requires Destiny 2: Warmind'),
      },
      eligible: owned.Warmind,
      displayProperties: {
        icon: SVG.Campaign.Warmind,
      },
    };
  } else if (versionHash === 'forsaken') {
    return {
      hash: 'forsaken',
      unlock: {
        text: t('Requires Destiny 2: Forsaken'),
      },
      eligible: owned.Forsaken,
      displayProperties: {
        icon: SVG.Campaign.Forsaken,
      },
    };
  } else if (versionHash === 'shadowkeep') {
    return {
      hash: 'shadowkeep',
      unlock: {
        text: t('Requires Destiny 2: Shadowkeep'),
      },
      eligible: owned.Shadowkeep,
      displayProperties: {
        icon: SVG.Campaign.Shadowkeep,
      },
    };
  } else {
    return {
      hash: '',
      unlock: {
        text: '',
      },
      displayProperties: {
        icon: null,
      },
    };
  }
};

// matches first bracketed thing in the string, or certain private unicode characters
const iconPlaceholder = /(\[[^\]]+\]|[\uE000-\uF8FF])/g;

const baseConversionTable = [
  // Damage Types
  { objectiveHash: 2178780271, unicode: '', substring: null },
  { objectiveHash: 220763483, unicode: '', substring: null },
  { objectiveHash: 2994623161, unicode: '', substring: null },
  { objectiveHash: 1554970245, unicode: '', substring: null },
  // Precision
  { objectiveHash: 2258255959, unicode: '', substring: null },
  // Abilities
  { objectiveHash: 314405660, unicode: '', substring: null },
  { objectiveHash: 3711356257, unicode: '', substring: null },
  // All Rifle-class
  { objectiveHash: 532914921, unicode: '', substring: null },
  { objectiveHash: 2161000034, unicode: '', substring: null },
  { objectiveHash: 2062881933, unicode: '', substring: null },
  { objectiveHash: 3527067345, unicode: '', substring: null },
  { objectiveHash: 3296270292, unicode: '', substring: null },
  { objectiveHash: 3080184954, unicode: '', substring: null },
  { objectiveHash: 3296270293, unicode: '', substring: null },
  // Remaining weapons, that are not heavy
  { objectiveHash: 53304862, unicode: '', substring: null },
  { objectiveHash: 635284441, unicode: '', substring: null },
  { objectiveHash: 2722409947, unicode: '', substring: null },
  { objectiveHash: 1242546978, unicode: '', substring: null },
  { objectiveHash: 299893109, unicode: '', substring: null },
  { objectiveHash: 2258101260, unicode: '', substring: null },
  // Heavy Weapons
  { objectiveHash: 2152699013, unicode: '', substring: null },
  { objectiveHash: 2203404732, unicode: '', substring: null },
  { objectiveHash: 1788114534, unicode: '', substring: null },
  { objectiveHash: 989767424, unicode: '', substring: null },
  // Artifacts that can be picked up and used as weapons
  { objectiveHash: 4231452845, unicode: '', substring: null },
  // Gambit - Blockers
  { objectiveHash: 276438067, unicode: '', substring: null },
  { objectiveHash: 3792840449, unicode: '', substring: null },
  { objectiveHash: 2031240843, unicode: '', substring: null },
  // Quest Markers
  { objectiveHash: 3915460773, unicode: '', substring: null },
  // Breakers
  { sandboxPerk: 3068403538, unicode: '', substring: null },
  { sandboxPerk: 2678922819, unicode: '', substring: null },
  { sandboxPerk: 3879088617, unicode: '', substring: null },
  // Supers
  { objectiveHash: 269520342, unicode: '', substring: null },
  { objectiveHash: 1043633269, unicode: '', substring: null },
  { objectiveHash: 1363382181, unicode: '', substring: null },
  { objectiveHash: 1633845729, unicode: '', substring: null },
  { objectiveHash: 1733112051, unicode: '', substring: null },
  { objectiveHash: 2904388000, unicode: '', substring: null },
  { objectiveHash: 2905697046, unicode: '', substring: null },
  { objectiveHash: 2975056954, unicode: '', substring: null },
];

/**
 * given defs, uses known examples from the manifest
 * and returns a localized string-to-icon conversion table
 *           "[Rocket Launcher]" -> <svg>
 */
const generateConversionTable = once(() => {
  // loop through conversionTable entries to update them with manifest string info
  baseConversionTable.forEach((iconEntry) => {
    const def = (iconEntry.sandboxPerk && manifest.DestinySandboxPerkDefinition[iconEntry.sandboxPerk]) || manifest.DestinyObjectiveDefinition[iconEntry.objectiveHash];
    if (!def) {
      return;
    }
    const string = def.progressDescription || def.displayProperties.description;
    // lookup this lang's string for the objective
    const progressDescriptionMatch = string.match(iconPlaceholder);
    const iconString = progressDescriptionMatch && progressDescriptionMatch[0];
    // this language's localized replacement, which we will detect and un-replace back into an icon
    iconEntry.substring = iconString;
  });
  return baseConversionTable;
});

const replaceWithIcon = (conversionRules, textSegment) => {
  const replacement = conversionRules.find((r) => r.substring === textSegment || r.unicode === textSegment);
  return (replacement && replacement.unicode) || textSegment;
};

export function stringToIcons(string, returnString) {
  // powered by DIM brilliance: @delphiactual, @sundevour, @bhollis
  // https://github.com/DestinyItemManager/DIM/blob/master/src/app/progress/ObjectiveDescription.tsx

  if (returnString) {
    return string
      .split(iconPlaceholder)
      .filter(Boolean)
      .map((t) => replaceWithIcon(generateConversionTable(), t))
      .join('');
  } else {
    return string
      .split(iconPlaceholder)
      .filter(Boolean)
      .map((t) => replaceWithIcon(generateConversionTable(), t));
  }
}

// thank you DIM (https://github.com/DestinyItemManager/DIM/blob/master/src/app/inventory/store/well-rested.ts)
export function isWellRested(characterProgression) {
  // We have to look at both the regular progress and the "legend" levels you gain after hitting the cap.
  // Thanks to expansions that raise the level cap, you may go back to earning regular XP after getting legend levels.
  const levelProgress = characterProgression.progressions[1716568313];
  const legendProgressDef = manifest.DestinyProgressionDefinition[2030054750];
  const legendProgress = characterProgression.progressions[2030054750];

  // You can only be well-rested if you've hit the normal level cap.
  // And if you haven't ever gained 3 legend levels, no dice.
  if (levelProgress.level < levelProgress.levelCap || legendProgress.level < 4) {
    return {
      wellRested: false,
    };
  }

  const progress = legendProgress.weeklyProgress;

  const requiredXP = xpRequiredForLevel(legendProgress.level, legendProgressDef) + xpRequiredForLevel(legendProgress.level - 1, legendProgressDef) + xpRequiredForLevel(legendProgress.level - 2, legendProgressDef);

  // Have you gained XP equal to three full levels worth of XP?
  return {
    wellRested: progress < requiredXP,
    progress,
    requiredXP,
  };
}

/**
 * How much XP was required to achieve the given level?
 */
function xpRequiredForLevel(level, progressDef) {
  const stepIndex = Math.min(Math.max(0, level), progressDef.steps.length - 1);
  return progressDef.steps[stepIndex].progressTotal;
}

export function lastPlayerActivity(member) {
  if (!member.profile || !member.profile.characterActivities.data || !member.profile.characters.data.length) {
    return [{}];
  }

  return member.profile.characters.data.map((character) => {
    const lastActivity = member.profile.characterActivities.data[character.characterId];

    // small adjustment to Garden of Salvation
    // https://github.com/Bungie-net/api/issues/1184
    if (lastActivity.currentActivityModeHash === 2166136261) {
      lastActivity.currentActivityModeHash = 2043403989;
    }

    const definitionActivity = lastActivity.currentActivityHash && manifest.DestinyActivityDefinition[lastActivity.currentActivityHash];
    const definitionActivityMode = lastActivity.currentActivityModeHash && manifest.DestinyActivityModeDefinition[lastActivity.currentActivityModeHash];
    const definitionPlace = manifest.DestinyPlaceDefinition[definitionActivity.placeHash];
    const definitionDestination = manifest.DestinyDestinationDefinition[definitionActivity.destinationHash];
    const definitionActivityPlaylist = lastActivity.currentPlaylistActivityHash && manifest.DestinyActivityDefinition[lastActivity.currentPlaylistActivityHash];

    let lastActivityString = false;
    if (definitionActivity && !definitionActivity.redacted) {
      if (enums.adventures.includes(definitionActivity.hash)) {
        // Adventures

        lastActivityString = `${t('Adventure')}: ${definitionActivity.displayProperties.name}`;
      } else if (definitionActivityMode?.hash === 3497767639) {
        // Explore

        if (
          definitionDestination?.displayProperties.name &&
          definitionActivity.displayProperties.name !== definitionDestination.displayProperties.name &&
          // because fuck
          definitionActivity.hash !== 4166562681 &&
          definitionActivity.hash !== 4159221189 &&
          definitionActivity.hash !== 3966792859
        ) {
          lastActivityString = `${definitionDestination.displayProperties.name}: ${definitionActivity.displayProperties.name}`;
        } else if (definitionDestination) {
          lastActivityString = `${definitionDestination.displayProperties.name}: ${definitionActivityMode.displayProperties.name}`;
        } else {
          lastActivityString = `${definitionActivityMode.displayProperties.name}: ${definitionActivity.displayProperties.name}`;
        }
      } else if (definitionActivity.activityTypeHash === 400075666) {
        // Menagerie

        lastActivityString = `${definitionActivity.selectionScreenDisplayProperties?.name ? definitionActivity.selectionScreenDisplayProperties.name : definitionActivity.displayProperties && definitionActivity.displayProperties.name}`;
      } else if (lastActivity.currentActivityModeHash === 547513715 && enums.ordealHashes.includes(lastActivity.currentActivityHash)) {
        // Nightfall ordeals

        lastActivityString = definitionActivity.displayProperties.name;
      } else if (lastActivity.currentActivityModeHash === 547513715) {
        // Scored Nightfall Strikes

        lastActivityString = definitionActivity.selectionScreenDisplayProperties?.name ? `${definitionActivityMode.displayProperties.name}: ${definitionActivity.selectionScreenDisplayProperties.name}` : `${definitionActivityMode.displayProperties.name}: ${definitionActivity.displayProperties.name}`;
      } else if (definitionActivity.activityTypeHash === 838603889) {
        // Forge Ignition

        lastActivityString = `${definitionActivity.displayProperties.name}: ${definitionActivityPlaylist.displayProperties.name}`;
      } else if (definitionActivity.activityTypeHash === 3005692706 && definitionActivity.placeHash === 4148998934) {
        // The Reckoning

        lastActivityString = `${definitionActivity.displayProperties.name}`;
      } else if (lastActivity.currentActivityModeTypes?.indexOf(5) > -1) {
        // Crucible

        lastActivityString = `${manifest.DestinyActivityModeDefinition[1164760504].displayProperties.name}: ${definitionActivityPlaylist.displayProperties.name}: ${definitionActivity.displayProperties.name}`;
      } else if ([135537449, 740891329].includes(lastActivity.currentPlaylistActivityHash)) {
        // Survival, Survival: Freelance

        lastActivityString = `${definitionActivityPlaylist.displayProperties.name}: ${definitionActivity.displayProperties.name}`;
      } else if (definitionActivity?.activityTypeHash === 332181804) {
        // Nightmare Hunts

        lastActivityString = definitionActivity.displayProperties.name;
      } else if (definitionActivityPlaylist?.hash === 2032534090) {
        // Convert Story: The Shattered Throne -> Dungeon: The Shattered Throne

        lastActivityString = `${manifest.DestinyActivityTypeDefinition[608898761].displayProperties.name}: ${definitionActivity.displayProperties.name}`;
      } else if (definitionActivityPlaylist?.hash === 4148187374) {
        // Convert Raid: Prophecy -> Dungeon: Prophecy

        lastActivityString = `${manifest.DestinyActivityTypeDefinition[608898761].displayProperties.name}: ${definitionActivity.displayProperties.name}`;
      } else if (definitionActivity.placeHash === 2961497387) {
        // Orbit

        lastActivityString = manifest.DestinyPlaceDefinition[2961497387].displayProperties.name;
      } else if (definitionActivityMode) {
        // Default

        lastActivityString = `${definitionActivityMode.displayProperties.name}: ${definitionActivity.displayProperties.name}`;
      } else {
        lastActivityString = definitionActivity.displayProperties.name;
      }
    } else if (definitionActivity && definitionActivity.redacted) {
      lastActivityString = t('Classified');
    } else {
      lastActivityString = false;
    }

    const lastMode = (definitionActivityMode && definitionActivityMode.parentHashes && definitionActivityMode.parentHashes.map((hash) => manifest.DestinyActivityModeDefinition[hash])) || [];

    return {
      characterId: character.characterId,
      lastPlayed: lastActivity ? lastActivity.dateActivityStarted : member.profile.profile.data.dateLastPlayed,
      lastActivity,
      lastActivityString,
      lastMode,
      matchmakingProperties: definitionActivityPlaylist?.matchmaking || definitionActivity?.matchmaking,
    };
  });
}

export function activityModeExtras(mode) {
  const extras = [
    {
      modes: [73],
      name: manifest.DestinyActivityDefinition[3176544780]?.displayProperties.name,
      icon: <SVG.Activities.Crucible.Control />,
    },
    {
      modes: [37],
      icon: <SVG.Activities.Crucible.Survival />,
    },
    {
      modes: [71],
      name: manifest.DestinyActivityDefinition[2303927902]?.displayProperties.name,
      icon: <SVG.Activities.Crucible.Clash />,
    },
    {
      modes: [80],
      icon: <SVG.Activities.Crucible.Elimination />,
    },
    {
      modes: [43],
      name: manifest.DestinyActivityDefinition[3753505781]?.displayProperties.name,
      icon: <SVG.Activities.Crucible.IronBanner />,
    },
    {
      modes: [31],
      name: manifest.DestinyActivityDefinition[3780095688]?.displayProperties.name,
      icon: <SVG.Activities.Crucible.Supremacy />,
    },
    {
      modes: [79],
      name: manifest.DestinyActivityTypeDefinition[332181804]?.displayProperties.name,
    },
    {
      modes: [48],
      icon: <SVG.Activities.Crucible.Rumble />,
    },
    {
      modes: [81],
      name: manifest.DestinyActivityDefinition[952904835]?.displayProperties.name,
      icon: <SVG.Activities.Crucible.MomentumControl />,
    },
    {
      modes: [50],
      icon: <SVG.Activities.Crucible.Doubles />,
    },
    {
      modes: [15],
      icon: <SVG.Activities.Crucible.CrimsonDoubles />,
    },
    {
      modes: [60],
      icon: <SVG.Activities.Crucible.Lockdown />,
    },
    {
      modes: [65],
      icon: <SVG.Activities.Crucible.Breakthrough />,
    },
    {
      modes: [59],
      icon: <SVG.Activities.Crucible.Showdown />,
    },
    {
      modes: [38],
      name: manifest.DestinyActivityDefinition[3646079260]?.displayProperties.name,
      icon: <SVG.Activities.Crucible.Countdown />,
    },
    {
      modes: [25],
      icon: <SVG.Activities.Crucible.Mayhem />,
    },
    {
      modes: [61, 62],
      icon: <SVG.Activities.Crucible.TeamScorched />,
    },
    {
      modes: [84],
      icon: <SVG.Activities.Crucible.TrialsOfOsiris />,
    },

    // Gambit
    {
      modes: [63, 64],
      name: manifest.DestinyActivityModeDefinition[1848252830]?.displayProperties.name,
      icon: <SVG.Activities.Gambit.Gambit />,
    },
    {
      modes: [75],
      icon: <SVG.Activities.Gambit.GambitPrime />,
    },
    {
      modes: [76],
      icon: <SVG.Activities.Gambit.Reckoning />,
    },

    // Raid
    {
      modes: [4],
      name: manifest.DestinyPresentationNodeDefinition[1162218545]?.displayProperties.name,
      icon: <SVG.Activities.Raid.Raid />,
    },

    // Dungeon
    {
      modes: [82],
      icon: <SVG.Activities.Dungeon.Dungeon />,
    },

    // Vanguard
    {
      modes: [18],
      icon: <SVG.Activities.Strikes.Strikes />,
    },
    {
      modes: [46],
      icon: <SVG.Activities.Strikes.ScoredNightfallStrikes />,
    },

    // Default
    {
      modes: [5],
      icon: <SVG.Activities.Crucible.Default />,
    },
  ];

  return extras.find((m) => (Array.isArray(mode) ? m.modes.filter((n) => mode.indexOf(n) > -1) : m.modes.indexOf(mode) > -1));
}

export function isContentVaulted(hash) {
  for (let content = 0; content < enums.DestinyContentVault.length; content++) {
    const season = enums.DestinyContentVault[content];

    for (let index = 0; index < season.vault.length; index++) {
      const vault = season.vault[index];

      const collectibles = [
        ...vault.buckets.collectibles, // static collectibles
        ...vault.buckets.nodes
          .reduce(
            (array, presentationNodeHash) => [
              // derived from presentation nodes
              ...array,
              manifest.DestinyPresentationNodeDefinition[presentationNodeHash].children.collectibles.map((collectible) => collectible.collectibleHash),
            ],
            []
          )
          .flat(),
      ];
      const records = [
        ...vault.buckets.records, // static records
        ...vault.buckets.nodes
          .reduce(
            (array, presentationNodeHash) => [
              // derived from presentation nodes
              ...array,
              manifest.DestinyPresentationNodeDefinition[presentationNodeHash].children.records.map((record) => record.recordHash),
            ],
            []
          )
          .flat(),
      ];

      const isVaulted = collectibles.includes(hash) || records.includes(hash);

      if (isVaulted) return D2SeasonInfo[season.season];
    }
  }

  return false;
}

export function isChildOfNodeVaulted(presentationNodeHash) {
  const hashes = getHashesFromNode(presentationNodeHash);

  return hashes.filter((hash) => isContentVaulted(hash)).length;
}

function getHashesFromNode(presentationNodeHash) {
  const definitionNode = manifest.DestinyPresentationNodeDefinition[presentationNodeHash];

  return [
    ...definitionNode.children.presentationNodes.map((node) => getHashesFromNode(node.presentationNodeHash)).flat(), // Nodes
    ...definitionNode.children.collectibles.map((collectible) => collectible.collectibleHash), // Collectibles
    ...definitionNode.children.records.map((record) => record.recordHash), // Records
    ...definitionNode.children.metrics.map((metric) => metric.metricHash), // Metrics
  ].filter((hash, index, array) => array.indexOf(hash) === index); // De-dupe
}
