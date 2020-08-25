import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import cx from 'classnames';

import { t } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import actions from '../../../store/actions';
import { CLASS_STRINGS, enumerateProgressionRewardItemState } from '../../../utils/destinyEnums';
import { progressionSeasonRank } from '../../../utils/destinyUtils';
import Button from '../../UI/Button';
import ProgressBar from '../../UI/ProgressBar';
import Items from '../../Items';

import './styles.css';

function getSeasonPassItemsPerPage(width) {
  if (width > 1280) return 10;
  if (width > 1024) return 8;
  if (width >= 768) return 5;
  if (width < 768) return 3;
  return 3;
}

export default function SeasonPass() {
  const viewport = useSelector((state) => state.viewport);
  const member = useSelector((state) => state.member);
  const dispatch = useDispatch();

  const characters = member.data.profile.characters.data;
  const character = characters.find((character) => character.characterId === member.characterId);
  const characterProgressions = member.data.profile.characterProgressions.data;

  const definitionSeason = manifest.DestinySeasonDefinition[manifest.settings.destiny2CoreSettings.currentSeasonHash];

  const seasonPassRank = characterProgressions[member.characterId].progressions[definitionSeason.seasonPassProgressionHash]?.level || 1;

  const [state, setState] = useState(() => ({ seasonPassRewardsPage: Math.ceil((Math.min(seasonPassRank, 99) + 1) / getSeasonPassItemsPerPage(viewport.width)) }));

  // progression changes, update season pass page if appropriate
  useEffect(() => {
    setState({
      seasonPassRewardsPage: Math.ceil((Math.min(seasonPassRank, 99) + 1) / getSeasonPassItemsPerPage(viewport.width)),
    });

    return () => {};
  }, [seasonPassRank]);

  // user viewport width change
  useEffect(() => {
    setState({
      seasonPassRewardsPage: Math.ceil((Math.min(seasonPassRank, 99) + 1) / getSeasonPassItemsPerPage(viewport.width)),
    });

    return () => {};
  }, [viewport.width]);

  // rebind tooltips on state.seasonPassRewardsPage change
  useEffect(() => {
    // runs on init for each socket. unsure how to fix cleanly
    dispatch(actions.tooltips.rebind());
  }, [dispatch, state.seasonPassRewardsPage]);

  function handler_seasonPassPrev(e) {
    setState((state) => ({
      seasonPassRewardsPage: state.seasonPassRewardsPage - 1,
    }));
  }

  function handler_seasonPassNext(e) {
    setState((state) => ({
      seasonPassRewardsPage: state.seasonPassRewardsPage + 1,
    }));
  }

  const seasonPassItemsPerPage = getSeasonPassItemsPerPage(viewport.width);

  const seasonPass = {
    slice: state.seasonPassRewardsPage * seasonPassItemsPerPage - seasonPassItemsPerPage,
    itemsPerPage: seasonPassItemsPerPage,
    ranks: manifest.DestinyProgressionDefinition[definitionSeason.seasonPassProgressionHash].steps.map((s, x) => {
      const rank = x + 1;
      const rewards = manifest.DestinyProgressionDefinition[definitionSeason.seasonPassProgressionHash].rewardItems
        .map((r, i) => {
          return {
            ...r,
            state: enumerateProgressionRewardItemState(characterProgressions[member.characterId].progressions[definitionSeason.seasonPassProgressionHash].rewardItemStates[i]),
          };
        })
        .filter((r, i) => r.rewardedAtProgressionLevel === rank);
      const rewardsFree = rewards
        .filter((r) => r.uiDisplayStyle === 'free')
        .filter((i) => {
          const definitionItem = manifest.DestinyInventoryItemDefinition[i.itemHash];

          // if package search contents
          if (definitionItem.itemCategoryHashes.includes(268598612)) {
            if (
              definitionItem.gearset &&
              definitionItem.gearset.itemList &&
              definitionItem.gearset.itemList.filter((t) => {
                const definitionItem = manifest.DestinyInventoryItemDefinition[t];

                if (definitionItem.classType > -1 && definitionItem.classType < 3 && definitionItem.classType !== character.classType) {
                  return true;
                } else {
                  return false;
                }
              }).length
            ) {
              return false;
            } else {
              return true;
            }
          } else if (definitionItem.classType > -1 && definitionItem.classType < 3 && definitionItem.classType !== character.classType) {
            return false;
          } else {
            return true;
          }
        });

      const rewardsPremium = rewards
        .filter((r) => r.uiDisplayStyle === 'premium')
        .filter((i) => {
          const definitionItem = manifest.DestinyInventoryItemDefinition[i.itemHash];

          // remove extra "Twisted Energy" from season 11 premium pass
          if (definitionItem.hash === 669434421 || definitionItem.hash === 686728455) return false;

          // if package, search contents
          if (definitionItem.itemCategoryHashes.includes(268598612)) {
            if (
              definitionItem.gearset?.itemList?.filter((t) => {
                const definitionItem = manifest.DestinyInventoryItemDefinition[t];

                if (definitionItem.classType > -1 && definitionItem.classType < 3 && definitionItem.classType !== character.classType) {
                  return true;
                } else {
                  return false;
                }
              }).length
            ) {
              return false;
            } else {
              return true;
            }
          } else if (
            // check if pre-approved based on traitIds
            definitionItem.traitIds?.filter((id) => ['emote', 'weapon_ornament'].filter((trait) => id.includes(trait)).length).length ||
            // check if pre-approved based on plugCategoryIdentifiers
            ['spawnfx', 'shader'].filter((identifier) => definitionItem.plug?.plugCategoryIdentifier?.includes(identifier)).length
          ) {
            return true;
          }
          // if it's not a shader, it might be an armour ornament in which case we only want the one matching our current class
          else if (definitionItem.plug?.plugCategoryIdentifier) {
            const classString = CLASS_STRINGS[character.classType];

            if (definitionItem.plug.plugCategoryIdentifier.indexOf(classString) > -1) {
              return true;
            } else {
              return false;
            }
          } else if (definitionItem.classType > -1 && definitionItem.classType < 3 && definitionItem.classType !== character.classType) {
            return false;
          } else {
            return true;
          }
        });

      return {
        rank,
        free: rewardsFree,
        premium: rewardsPremium,
      };
    }),
  };

  // accounts for pass ranks greater than 100
  const seasonRank = progressionSeasonRank(member);

  return (
    <div className='wrapper'>
      <div className='module status'>
        <div className='sub-header'>
          <div>{t('Season pass')}</div>
        </div>
        <div className='text'>
          <div className='name'>{definitionSeason.displayProperties.name}</div>
          <div className='description'>
            <p>{definitionSeason.displayProperties.description}</p>
          </div>
        </div>
        <div className='rank'>{seasonRank.level}</div>
      </div>
      <div className='page'>
        <Button text={<i className='segoe-mdl-chevron-left' />} action={handler_seasonPassPrev} disabled={state.seasonPassRewardsPage * seasonPassItemsPerPage - seasonPassItemsPerPage < 1} />
      </div>
      <div className='rewards'>
        {[...seasonPass.ranks, { filler: true }, { filler: true }].slice(seasonPass.slice, seasonPass.slice + seasonPass.itemsPerPage).map((r, i) => {
          const progressData = { ...characterProgressions[member.characterId].progressions[definitionSeason.seasonPassProgressionHash] };

          if (r.filler) {
            return (
              <div key={i} className='rank filler'>
                <div />
                <div className='free' />
                <div className='premium' />
              </div>
            );
          }

          if (progressData.level === progressData.levelCap) {
            progressData.nextLevelAt = 1000;
            progressData.progressToNextLevel = 1000;
          } else if (r.rank <= progressData.level) {
            progressData.progressToNextLevel = progressData.nextLevelAt;
          } else if (r.rank > progressData.level + 1) {
            progressData.progressToNextLevel = 0;
          }

          return (
            <div key={r.rank} className='rank' data-rank={r.rank}>
              <ProgressBar hideCheck {...progressData} />
              <div className={cx('free', { earned: r.free[0]?.state.Earned, claimed: r.free[0]?.state.Claimed, claimAllowed: r.free[0]?.state.ClaimAllowed })}>
                <ul className='list inventory-items'>
                  {r.free.length ? (
                    <Items
                      items={r.free.map((r) => {
                        return {
                          ...r,
                          state: null,
                        };
                      })}
                    />
                  ) : null}
                </ul>
              </div>
              <div className={cx('premium', { earned: r.premium[0]?.state.Earned, claimed: r.premium[0]?.state.Claimed, claimAllowed: r.premium[0]?.state.ClaimAllowed })}>
                <ul className='list inventory-items'>
                  {r.premium.length ? (
                    <Items
                      items={r.premium.map((r) => {
                        return {
                          ...r,
                          state: null,
                        };
                      })}
                    />
                  ) : null}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
      <div className='page'>
        <Button text={<i className='segoe-mdl-chevron-right' />} action={handler_seasonPassNext} disabled={seasonPass.slice + seasonPass.itemsPerPage >= 100} />
      </div>
    </div>
  );
}
