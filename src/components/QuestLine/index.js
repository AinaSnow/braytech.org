import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import cx from 'classnames';

import { t, BungieText } from '../../utils/i18n';
import manifest from '../../utils/manifest';
import { cartographer } from '../../utils/maps';
import { stepsWithRecords, rewardsQuestLineOverrides, rewardsQuestLineOverridesShadowkeep, setDataQuestLineOverrides } from '../../data/quest-lines';
import { removeMemberIds } from '../../utils/paths';

import Records from '../Records/';
import Items from '../Items';
import ProgressBar from '../UI/ProgressBar';

import { Views } from '../../svg';

import './styles.css';

function questTrait(hash) {
  const definitionItem = manifest.DestinyInventoryItemDefinition[hash];

  if (!definitionItem) return 'all';

  if (definitionItem.traitIds?.indexOf('quest.new_light') > -1) {
    return 'new-light';
  } else if (definitionItem.traitIds?.indexOf('quest.current_release') > -1) {
    return 'expansion';
  } else if (definitionItem.traitIds?.indexOf('quest.seasonal') > -1) {
    return 'seasonal';
  } else if (definitionItem.traitIds?.indexOf('quest.playlists') > -1) {
    return 'playlists';
  } else if (definitionItem.traitIds?.indexOf('quest.exotic') > -1) {
    return 'exotics';
  } else if (definitionItem.traitIds?.indexOf('quest.past') > -1) {
    return 'past';
  } else {
    return 'all';
  }
}

export function questFilters(key) {
  if (key === 'bounties') {
    return {
      displayProperties: {
        name: t('Bounties'),
        icon: <Views.Quests.Bounties />,
      },
    };
  } else if (key === 'new-light') {
    return {
      displayProperties: {
        name: t('New Light'),
        description: t('Quests related to New Light, tutorials, and introductions'),
        icon: <Views.Quests.NewLight />,
      },
    };
  } else if (key === 'seasonal') {
    return {
      displayProperties: {
        name: t('Seasonal'),
        description: t('Quests from the current season'),
        icon: <Views.Quests.Seasonal />,
      },
      preview: '/static/images/extracts/ui/quests/01e3-00001729.png',
    };
  } else if (key === 'expansion') {
    return {
      displayProperties: {
        name: t('Shadowkeep'),
        description: t('Quests from the latest expansion'),
        icon: <Views.Quests.Expansion />,
      },
      preview: '/static/images/extracts/ui/quests/01E3-06CA.png',
    };
  } else if (key === 'playlists') {
    return {
      displayProperties: {
        name: t('Playlists'),
        description: t('Vanguard, Crucible, and Gambit quests'),
        icon: <Views.Quests.Playlists />,
      },
      preview: '/static/images/extracts/ui/quests/01E3-06D3.png',
    };
  } else if (key === 'exotics') {
    return {
      displayProperties: {
        name: t('Exotics'),
        description: t('Exotic Gear and Catalyst quests'),
        icon: <Views.Quests.Exotics />,
      },
      preview: '/static/images/extracts/ui/quests/01E3-06C5.png',
    };
  } else if (key === 'past') {
    return {
      displayProperties: {
        name: t('The Past'),
        description: t('Quests from past expansions'),
        icon: <Views.Quests.Past />,
      },
      preview: '/static/images/extracts/ui/quests/01E3-06BB.png',
    };
  } else {
    return {
      displayProperties: {
        name: t('All quests'),
        description: t('All quests and related items in your inventory'),
        icon: <Views.Quests.All />,
      },
    };
  }
}

function getSetDataQuestLine(questLine) {
  let setData = (questLine.setData?.itemList?.length && questLine.setData.itemList) || [];

  if (setDataQuestLineOverrides[questLine.hash]) setData = setDataQuestLineOverrides[questLine.hash];

  return setData;
}

export function getRewardsQuestLine(definition, classType) {
  let rewards =
    definition.value?.itemValue.filter(
      (value) =>
        value.itemHash !== 0 && // ...
        // try and filter for class items if class type is provided
        (classType
          ? (manifest.DestinyInventoryItemDefinition[value.itemHash].classType < 3 && manifest.DestinyInventoryItemDefinition[value.itemHash].classType === classType) ||
            // send class items
            manifest.DestinyInventoryItemDefinition[value.itemHash].classType > 2 ||
            // and everything else
            manifest.DestinyInventoryItemDefinition[value.itemHash].classType === undefined
          : true)
    ) || [];

  if (rewardsQuestLineOverrides[definition.hash]) rewards = rewardsQuestLineOverrides[definition.hash];

  const setData = getSetDataQuestLine(definition);
  const rewardsShadowkeep = setData && rewardsQuestLineOverridesShadowkeep.find((s) => setData.find((d) => d.itemHash === s.itemHash));

  if (rewardsShadowkeep) rewards = rewardsShadowkeep.rewards;

  return rewards;
}

export function QuestLine({ item, ...props }) {
  const member = useSelector((state) => state.member);
  const location = useLocation();
  const characters = member.data.profile.characters.data;
  const character = characters.find((character) => character.characterId === member.characterId);
  const itemComponents = member.data.profile.itemComponents;
  const characterUninstancedItemComponents = member.data.profile.characterUninstancedItemComponents[member.characterId].objectives.data;

  const definitionItem = manifest.DestinyInventoryItemDefinition[manifest.DestinyInventoryItemDefinition[item.itemHash]?.objectives?.questlineItemHash] || manifest.DestinyInventoryItemDefinition[item.itemHash];

  if (definitionItem) {
    const setData = getSetDataQuestLine(definitionItem);

    let assumeCompleted = true;
    const steps = setData?.map((step, s) => {
      step.i = s + 1;
      step.definitionStep = manifest.DestinyInventoryItemDefinition[step.itemHash];
      step.completed = assumeCompleted;

      if (step.itemHash === item.itemHash || setData.length === 1) {
        assumeCompleted = false;
        step.completed = false;
        step.active = true;
        step.itemInstanceId = item.itemInstanceId || null;
      }

      let progressData =
        item.itemInstanceId && itemComponents.objectives.data[item.itemInstanceId]
          ? // profile instanced data is available
            itemComponents.objectives.data[item.itemInstanceId].objectives
          : characterUninstancedItemComponents?.[item.itemHash]
          ? // character instanced data is available
            characterUninstancedItemComponents[item.itemHash].objectives
          : // nothing is available
            false;

      let stepMatch = false;
      if (progressData && step.definitionStep.objectives && step.definitionStep.objectives.objectiveHashes.length === progressData.length) {
        progressData.forEach((o) => {
          if (step.definitionStep.objectives.objectiveHashes.includes(o.objectiveHash)) {
            stepMatch = true;
          } else {
            stepMatch = false;
          }
        });
      }

      if (stepMatch) {
        step.progress = progressData;
      } else if (assumeCompleted && step.definitionStep.objectives && step.definitionStep.objectives.objectiveHashes.length) {
        step.progress = step.definitionStep.objectives.objectiveHashes.map((o) => {
          let definitionObjective = manifest.DestinyObjectiveDefinition[o];

          return {
            complete: true,
            progress: definitionObjective.completionValue,
            completionValue: definitionObjective.completionValue,
            objectiveHash: definitionObjective.hash,
          };
        });
      } else {
        step.progress = [];
      }

      return step;
    });

    const questLineName = (definitionItem.setData?.questLineName && definitionItem.setData.questLineName !== '' && definitionItem.setData.questLineName) || definitionItem.displayProperties.name;

    const questLineDescription =
      definitionItem.displaySource && definitionItem.displaySource !== ''
        ? // use displaySource if available
          definitionItem.displaySource
        : // otherwise use displayProperties description
        definitionItem.displayProperties.description && definitionItem.displayProperties.description !== ''
        ? definitionItem.displayProperties.description
        : // else, use first step description
          steps?.[0]?.definitionStep.displayProperties.description;

    const rewardsQuestLine = getRewardsQuestLine(definitionItem, character.classType);

    const node = cartographer({ key: 'itemHash', value: definitionItem.hash });

    return (
      <div className='quest-line'>
        <div className='module'>
          <div className='summary'>
            <div className='icon'>{questFilters(questTrait(definitionItem.hash)).displayProperties.icon}</div>
            <div className='text'>
              <div className='name'>{questLineName}</div>
              {node.checklist?.items?.[0]?.recordHash ? (
                <div className='highlight'>
                  <div className='text'>{t('This item has an associated map node')}</div>
                  <Link className='button' to={`/maps/${node.destinationHash}/${node.checklist.items[0].recordHash}`}>
                    <div className='text'>{t('View Map')}</div>
                  </Link>
                </div>
              ) : null}
              <BungieText className='display-source' value={questLineDescription} />
              {rewardsQuestLine.length ? (
                <>
                  <h4>{t('Rewards')}</h4>
                  <ul className='list inventory-items'>
                    <Items items={rewardsQuestLine} />
                  </ul>
                </>
              ) : null}
            </div>
          </div>
        </div>
        {steps?.length ? (
          <div className='module'>
            <h4>{t('Steps')}</h4>
            <div className='steps'>
              {steps &&
                steps.length &&
                steps.map((step) => {
                  const description = step.definitionStep.displayProperties.description && step.definitionStep.displayProperties.description !== '' && step.definitionStep.displayProperties.description;
                  const displaySource = step.definitionStep.displaySource && step.definitionStep.displaySource !== '' && definitionItem.displaySource !== step.definitionStep.displaySource && step.definitionStep.displaySource;

                  return (
                    <div key={step.itemHash} className={cx('step', { completed: step.completed })}>
                      <div className='header'>
                        <div className='number'>{step.i}</div>
                        <div className='name'>{step.definitionStep.displayProperties.name}</div>
                      </div>
                      {description ? <BungieText className='description' value={description} /> : null}
                      {step.definitionStep.objectives?.objectiveHashes &&
                      // no need to show objectives if there's only 1, it has no progressDescription, and a completionValue of 1
                      !(step.definitionStep.objectives.objectiveHashes.length === 1 && step.definitionStep.objectives.objectiveHashes.filter((hash) => manifest.DestinyObjectiveDefinition[hash].progressDescription === '' && manifest.DestinyObjectiveDefinition[hash].completionValue === 1).length) ? (
                        <div className='objectives'>
                          {step.definitionStep.objectives.objectiveHashes.map((hash, h) => {
                            const definitionObjective = manifest.DestinyObjectiveDefinition[hash];

                            const progress = {
                              complete: false,
                              progress: 0,
                              completionValue: definitionObjective.completionValue,
                              objectiveHash: definitionObjective.hash,
                              ...step.progress.find((o) => o.objectiveHash === definitionObjective.hash),
                            };

                            const relatedRecords = stepsWithRecords.filter((record) => record.objectiveHash === definitionObjective.hash).map((record) => record.recordHash);

                            return (
                              <React.Fragment key={h}>
                                <ProgressBar {...progress} />
                                {relatedRecords && relatedRecords.length ? (
                                  <ul className='list record-items'>
                                    <Records selfLinkFrom={removeMemberIds(location.pathname)} showCompleted hashes={relatedRecords} />
                                  </ul>
                                ) : null}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      ) : null}
                      {displaySource ? <BungieText className='display-source' value={displaySource} /> : null}
                    </div>
                  );
                })}
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return null;
}

export default QuestLine;
