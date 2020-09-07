import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import moment from 'moment';

import { t, duration } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import Items from '../../Items';
import ObservedImage from '../../ObservedImage';
import ProgressBar from '../../UI/ProgressBar';

import './styles.css';

class SeasonArtifact extends React.Component {
  state = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };

  calculateTime = () => {
    const profile = this.props.member.data.profile.profile.data;
    const definitionSeason = manifest.DestinySeasonDefinition[profile.currentSeasonHash];

    const then = moment(definitionSeason.endDate);
    const now = moment();

    const distance = moment(then - now).unix() * 1000;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (this.mounted) this.setState({ days, hours, minutes, seconds });
  };

  componentDidMount() {
    this.mounted = true;

    if (this.mounted) {
      this.calculateTime();

      this.interval = setInterval(this.calculateTime, 1000);
    }
  }

  componentWillUnmount() {
    this.mounted = false;

    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  render() {
    const member = this.props.member;
    const profile = member.data.profile.profile.data;
    const profileProgression = member.data.profile.profileProgression.data;
    const characterEquipment = member.data.profile.characterEquipment.data[member.characterId].items;
    const characterProgressions = member.data.profile.characterProgressions.data[member.characterId];

    const equippedArtifact = characterEquipment.find(i => i.bucketHash === 1506418338) || false;

    if (!equippedArtifact) {
      return (
        <div className='seasonal-artifact'>
          <div className='head'>
            <div className='sub-header'>
              <div>{t('Seasonal progression')}</div>
            </div>
            <div className='info'>
              <p>{t("This profile hasn't received an artifact yet.")}</p>
            </div>
          </div>
        </div>
      );
    }

    const profileArtifact = profileProgression.seasonalArtifact;
    const characterArtifact = characterProgressions.seasonalArtifact;

    const definitionArtifact = profileArtifact.artifactHash && manifest.DestinyArtifactDefinition[profileArtifact.artifactHash];
    const definitionEquipment = manifest.DestinyInventoryItemDefinition[equippedArtifact.itemHash];
    // const definitionVendor = profileArtifact.artifactHash && manifest.DestinyVendorDefinition[profileArtifact.artifactHash];

    // let string = ''
    //     definitionArtifact.tiers.forEach(tier => {
    //       tier.items.forEach(item => {
    //         const definitionItem = manifest.DestinyInventoryItemDefinition[item.itemHash]
    // string = string + `
    // // ${definitionItem.displayProperties.name}
    // ${item.itemHash}: {
    //   hash: ${item.itemHash},
    //   active: '/static/images/extracts/ui/artifact/3360014173/0000000.png',
    //   inactive: '/static/images/extracts/ui/artifact/3360014173/0000000.png'
    // },`
    //       })
    //     })
    //     console.log(string)

    // console.log(characterArtifact)

    if (!definitionArtifact) {
      return (
        <div className='seasonal-artifact'>
          <div className='head'>
            <div className='sub-header'>
              <div>{t('Seasonal progression')}</div>
            </div>
            <div className='artifact'></div>
          </div>
        </div>
      );
    }


    return (
      <div className='seasonal-artifact'>
        <div className='head'>
          <div className='sub-header'>
            <div>{t('Seasonal progression')}</div>
          </div>
          <div className='artifact'>
            <ul className='list inventory-items'>
              <Items items={[equippedArtifact]} />
            </ul>
            <div className='text'>
              <div className='name'>{definitionEquipment.displayProperties.name}</div>
              <div className='type'>{t('Seasonal artifact')}</div>
            </div>
            <div className='description'>
              <p>{definitionEquipment.displayProperties.description}</p>
            </div>
          </div>
        </div>
        <div className='grid'>
          <div className='mods'>
            <h4>{t('Mods')}</h4>
            <div className='tiers'>
              {definitionArtifact.tiers.map((tier, t) => {
                const tierUnlocksUsed = characterArtifact.tiers[t]?.items.filter(i => i.isActive).length || 0;

                return (
                  <div
                    key={t}
                    className={cx('tier', {
                      available: characterArtifact.pointsUsed >= tier.minimumUnlockPointsUsedRequirement,
                      last: (t < 4 && characterArtifact.pointsUsed < definitionArtifact.tiers[t + 1]?.minimumUnlockPointsUsedRequirement && tierUnlocksUsed > 0) || t === 4
                    })}
                  >
                    <ul className='list inventory-items'>
                      {(characterArtifact.tiers[t]?.items || tier.items).map((item, i) => {
                        const definitionItem = manifest.DestinyInventoryItemDefinition[item.itemHash];

                        const energyCost = definitionItem?.plug?.energyCost?.energyCost || 0;

                        return (
                          <li
                            key={i}
                            className={cx({
                              tooltip: true,
                              linked: true,
                              'no-border': true,
                              unavailable: !item.isActive
                            })}
                            data-hash={item.itemHash}
                            data-instanceid={item.itemInstanceId}
                            data-state={item.state}
                            // data-vendorhash={item.vendorHash}
                            // data-vendorindex={item.vendorItemIndex}
                            // data-vendorstatus={item.saleStatus}
                            data-quantity={item.quantity && item.quantity > 1 ? item.quantity : null}
                          >
                            <div className='icon'>
                              {!item.isActive ? <ObservedImage className='image background' src='/static/images/extracts/ui/artifact/01A3_12DB_00.png' /> : null}
                              <ObservedImage src={`https://www.bungie.net${definitionItem?.displayProperties.icon}`} />
                              <div className='cost'>{energyCost}</div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
          <div className='progression'>
            <h4>{t('Season')}</h4>
            <p>
              <em>{t('{{seasonName}} has {{timeRemaining}} remaining.', {
                seasonName: manifest.DestinySeasonDefinition[profile.currentSeasonHash]?.displayProperties?.name, timeRemaining: duration(this.state)
              })}</em>
            </p>
            <h4>{t('Progression')}</h4>
            <p>
              <em>{t('Earning XP grants Power bonuses and unlocks powerful mods that can be slotted into weapons and armor.')}</em>
            </p>
            <div className='integers'>
              <div>
                <div className='name'>{t('Artifact unlocks')}</div>
                <div className='value'>
                  {profileArtifact.pointProgression?.level ? (
                    <>
                      {profileArtifact.pointProgression.level} / {profileArtifact.pointProgression.levelCap}
                    </>
                  ) : (
                    <>—</>
                  )}
                </div>
              </div>
              <div>
                <div className='name'>{t('Power bonus')}</div>
                {profileArtifact.powerBonus > 0 ? <div className='value power'>+{profileArtifact.powerBonus}</div> : <div className='value'>—</div>}
              </div>
            </div>
            <p>{t('Next power bonus')}</p>
            <ProgressBar {...profileArtifact.powerBonusProgression} hideCheck />
            {profileArtifact.pointProgression?.level < profileArtifact.pointProgression?.levelCap ? (
              <>
                <p>{t('Next artifact unlock')}</p>
                <ProgressBar {...profileArtifact.pointProgression} hideCheck />
              </>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

function mapDispatchToProps(dispatch) {
  return {
    rebindTooltips: value => {
      dispatch({ type: 'TOOLTIPS_REBIND', payload: new Date().getTime() });
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SeasonArtifact);
