import React from 'react';
import { connect } from 'react-redux';
import { flattenDepth, groupBy } from 'lodash';
import cx from 'classnames';

import { t } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import * as enums from '../../../utils/destinyEnums';
import ObservedImage from '../../../components/ObservedImage';
import { Button, DestinyKey } from '../../../components/UI/Button';
import Items from '../../../components/Items';

import { NavLinks } from '../';
import ChaliceCombos from '../../../data/chalice-data';

import './styles.css';

function breakUpRuneAbbreviations(combo) {
  let runes = combo.slice();

  runes.forEach((e, i) => {
    if (e === 'braytech_purple_rune') {
      runes[i] = [e, ...enums.chaliceRunes.purple.slice()];
    } else if (e === 'braytech_red_rune') {
      runes[i] = [e, ...enums.chaliceRunes.red.slice()];
    } else if (e === 'braytech_green_rune') {
      runes[i] = [e, ...enums.chaliceRunes.green.slice()];
    } else if (e === 'braytech_blue_rune') {
      runes[i] = [e, ...enums.chaliceRunes.blue.slice()];
    }
  });

  return flattenDepth(runes, 1);
}

function initialClassType(member) {
  if (member.data?.profile?.characters?.data?.length) {
    const character = member.data.profile.characters.data.find((c) => c.characterId === member.characterId);

    return character.classType || 0;
  }

  return 0;
}

const RefinedChaliceCombos = ChaliceCombos.filter((c) => {
  if (c.combo[0].length === 1 && c.combo[1].length === 1 && ['braytech_purple_rune', 'braytech_red_rune', 'braytech_green_rune', 'braytech_blue_rune'].includes(c.combo[1][0]) && c.combo[2].length === 0) {
    return true;
  } else {
    return false;
  }
});

const armorSetNameMap = {
  'Tangled Web': {
    0: 3110922166,
    1: 3986530602,
    2: 2983784769,
  },
  'Exodus Down': {
    0: 3952745158,
    1: 3476818394,
    2: 4139791855,
  },
  Opulent: {
    0: 3760158863,
    1: 327169819,
    2: 2551808106,
  },
  'Reverie Dawn': {
    0: 3952745160,
    1: 3476818388,
    2: 4139791841,
  },
};

class ChaliceRecipes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      slots: {
        slot1: false,
        slot2: false,
        slot3: false,
      },
      slotsPanelOpen: false,
      matches: [],
      armorClassType: initialClassType(this.props.member),
    };

    this.ref_chaliceUI = React.createRef();
  }

  handler_toggleSlotsPanel = (slot) => (e) => {
    if (this.state.slotsPanelOpen === slot) {
      this.setState((p) => ({
        ...p,
        slotsPanelOpen: false,
      }));
    } else {
      this.setState((p) => ({
        ...p,
        slotsPanelOpen: slot,
      }));
    }

    this.props.rebindTooltips();
  };

  handler_filterClassType = (e) => {
    this.setState((p) => ({
      armorClassType: p.armorClassType < 2 ? p.armorClassType + 1 : 0,
    }));
  };

  hanlder_resetState = (e) => {
    this.setState((prevState, props) => {
      let change = {
        slots: {
          slot1: false,
          slot2: false,
          slot3: false,
        },
        slotsPanelOpen: false,
      };
      return { ...prevState, ...change };
    });
  };

  handler_rewardItemClick = (item) => (e) => {
    console.log(item);

    if (!item || !item.combo) {
      return;
    }

    this.setState((p) => ({
      ...p,
      slots: {
        slot1: item.combo[0]?.[0] || false,
        slot2: item.combo[1]?.[0] || false,
        slot3: item.combo[2]?.[0] || false,
      },
      slotsPanelOpen: false,
    }));

    window.scrollTo({
      top: this.ref_chaliceUI.current.offsetTop + this.ref_chaliceUI.current.offsetHeight / 2 - window.innerHeight / 2,
    });
  };

  handler_runeItemClick = (item) => (e) => {
    this.setState((p) => ({
      ...p,
      slots: {
        ...p.slots,
        [item.slot]: item.hash === 'braytech_remove_rune' ? false : item.hash,
      },
      slotsPanelOpen: false,
    }));

    window.scrollTo({
      top: this.ref_chaliceUI.current.offsetTop + this.ref_chaliceUI.current.offsetHeight / 2 - window.innerHeight / 2,
    });
  };

  checkForCombo = () => {
    const { slot1, slot2, slot3 } = this.state.slots;

    const matches = ChaliceCombos.filter((m) => {
      const combo1 = m.combo[0];
      const combo2 = breakUpRuneAbbreviations(m.combo[1]);
      const combo3 = breakUpRuneAbbreviations(m.combo[2]);

      // console.log(combo1, combo2, combo3)

      if (combo1.length && combo1.includes(slot1) && combo2.length && combo2.includes(slot2) && combo3.length && combo3.includes(slot3)) {
        return true;
      } else if (!slot3 && !combo3.length && combo1.length && combo1.includes(slot1) && combo2.length && combo2.includes(slot2)) {
        return true;
      } else if (!slot2 && !combo2.length && !slot3 && !combo3.length && combo1.length && combo1.includes(slot1)) {
        return true;
      } else {
        return false;
      }
    });

    console.log(matches);
    matches.forEach((m) => {
      if (m.items.length) {
        const definitionItem = manifest.DestinyInventoryItemDefinition[m.items[0]];
        console.log(definitionItem.displayProperties.name);
      } else {
        console.log(':(');
      }
    });

    this.setState((p) => ({
      matches,
    }));

    this.props.rebindTooltips();
  };

  componentDidMount() {
    window.scrollTo(0, 0);

    this.checkForCombo();
  }

  componentDidUpdate(p, s) {
    if (s.slots.slot1 !== this.state.slots.slot1 || s.slots.slot2 !== this.state.slots.slot2 || s.slots.slot3 !== this.state.slots.slot3 || s.slotsPanelOpen !== this.state.slotsPanelOpen) {
      this.checkForCombo();
    }
  }

  render() {
    return (
      <>
        <div className='view chalice-of-opulence' id='archives'>
          <div className='module head'>
            <div className='page-header'>
              <div className='sub-name'>{t('Archives')}</div>
              <div className='name'>{manifest.DestinyInventoryItemDefinition[1115550924].displayProperties.name}</div>
            </div>
          </div>
          <div className='buff'>
            <NavLinks />
            <div className='content'>
              <div className='module'>
                <div className='frame' ref={this.ref_chaliceUI}>
                  <div className={cx('flair', { active: Object.values(this.state.slots).filter((s) => s).length > 2 })}>
                    <ObservedImage className='image corner' padded src='/static/images/extracts/ui/01E3-00000700.png' />
                    <ObservedImage className='image corner active' src='/static/images/extracts/ui/01E3-00000700-A.png' />
                    <ObservedImage className='image leviathan' src='/static/images/extracts/ui/01E3-00000702.png' />
                    <ObservedImage className='image leviathan active' src='/static/images/extracts/ui/01E3-00000702-A.png' />
                    <ObservedImage className='image ring-outer' src='/static/images/extracts/ui/01E3-00000777.png' />
                    <ObservedImage className='image ring-outer active' src='/static/images/extracts/ui/01E3-00000777-A.png' />
                    <ObservedImage className='image ring-inner' src='/static/images/extracts/ui/01E3-00000709.png' />
                    <ObservedImage className='image ring-inner active' src='/static/images/extracts/ui/01E3-00000709-A.png' />
                    <ObservedImage className='image chalice' src='/static/images/extracts/ui/01A3-00006414.png' />
                    <ObservedImage className='image chalice active' src='/static/images/extracts/ui/01A3-00006414-A.png' />
                  </div>
                  <div className='ui'>
                    <div className='slots'>
                      {Object.entries(this.state.slots).map(([key, value]) => {
                        const hash = this.state.slots[key] || 'braytech_no_rune';
                        const definitionActivePlug = manifest.DestinyInventoryItemDefinition[hash] || manifest.BraytechDefinition[hash];

                        if (!definitionActivePlug) {
                          console.log(this.state.slots[key]);

                          return null;
                        }

                        const activePlug = (
                          <li className='linked' data-tooltip='mouse' data-hash={hash} onClick={this.handler_toggleSlotsPanel(key)}>
                            <div className='icon'>
                              <ObservedImage src={definitionActivePlug.displayProperties.localIcon ? `${definitionActivePlug.displayProperties.icon}` : `https://www.bungie.net${definitionActivePlug.displayProperties.icon}`} />
                            </div>
                          </li>
                        );

                        let nextPlug;
                        if (this.state.slots.slot1 === false && key === 'slot1') {
                          nextPlug = true;
                        } else if (this.state.slots.slot2 === false && this.state.slots.slot1 && key === 'slot2') {
                          nextPlug = true;
                        } else if (this.state.slots.slot3 === false && this.state.slots.slot1 && this.state.slots.slot2 && key === 'slot3') {
                          nextPlug = true;
                        } else {
                          nextPlug = false;
                        }

                        return (
                          <div key={key} className={cx(key, { slotZ: this.state.slotsPanelOpen === key })}>
                            <div className='slot-inner'>
                              <div className='active-plug'>
                                {nextPlug ? <ObservedImage className='image next-plug' src='/static/images/extracts/ui/01A3-00004579.png' /> : null}
                                <ul className='list chalice-items'>{activePlug}</ul>
                              </div>
                              {this.state.slotsPanelOpen === key ? (
                                <div className='overlay'>
                                  <ul className='list chalice-items'>
                                    {enums.chaliceRunes[key].map((hash, i) => {
                                      const definitionPlug = manifest.DestinyInventoryItemDefinition[hash] || manifest.BraytechDefinition[hash];

                                      if (!definitionPlug) {
                                        console.log(`Items: Couldn't find item definition for ${hash}`);

                                        return null;
                                      }

                                      return (
                                        <ul className='list' key={i}>
                                          <li
                                            className={cx({
                                              linked: true,
                                              active: this.state.slots[key] === hash,
                                            })}
                                            data-tooltip
                                            data-hash={hash}
                                            onClick={this.handler_runeItemClick({ slot: key, hash })}
                                          >
                                            <div className='icon'>
                                              <ObservedImage className='image' src={definitionPlug.displayProperties.localIcon ? `${definitionPlug.displayProperties.icon}` : `https://www.bungie.net${definitionPlug.displayProperties.icon}`} />
                                            </div>
                                            <div className='text'>
                                              <div className='name'>{definitionPlug.displayProperties.name}</div>
                                            </div>
                                          </li>
                                          <li
                                            className={cx('apply', {
                                              linked: true,
                                              active: this.state.slots[key] === hash,
                                            })}
                                            onClick={this.handler_runeItemClick({ slot: key, hash })}
                                          >
                                            <i className='segoe-mdl-place-inside' />
                                          </li>
                                        </ul>
                                      );
                                    })}
                                  </ul>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className='module items'>
                <div className='results'>
                  <div className='sub-header'>
                    <div>{t('Selected runes')}</div>
                  </div>
                  {this.state.matches.length > 0 ? (
                    <ul className='list inventory-items'>
                      <Items
                        items={this.state.matches.reduce((a, v) => {
                          return [...a, ...v.items.filter((hash) => (this.state.armorClassType > -1 && manifest.DestinyInventoryItemDefinition[hash].classType < 3 && manifest.DestinyInventoryItemDefinition[hash].classType === this.state.armorClassType) || manifest.DestinyInventoryItemDefinition[hash].classType > 2 || this.state.armorClassType < 0).map((hash) => ({ combo: v.combo, itemHash: hash }))];
                        }, [])}
                        handler={this.handler_rewardItemClick}
                      />
                    </ul>
                  ) : (
                    <div className='info'>{t('Socket runes or select item to auto-fill')}</div>
                  )}
                </div>
                <div className='shortcuts'>
                  <div className='weapons'>
                    <div className='sub-header'>
                      <div>{t('Weapons')}</div>
                    </div>
                    <ul className='list inventory-items'>
                      <Items
                        items={RefinedChaliceCombos.filter((c) => c.itemType === 3).reduce((a, v) => {
                          return [...a, ...v.items.map((hash) => ({ combo: v.combo, itemHash: hash }))];
                        }, [])}
                        handler={this.handler_rewardItemClick}
                        tooltips='mouse'
                      />
                    </ul>
                  </div>
                  <div className='armor'>
                    {Object.entries(
                      groupBy(
                        RefinedChaliceCombos.filter((c) => c.itemType !== 3),
                        (c) => c.armorSetName
                      )
                    ).map(([setName, combos], i) => {
                      return (
                        <React.Fragment key={i}>
                          <div className='sub-header'>
                            <div>{manifest.DestinyPresentationNodeDefinition[armorSetNameMap[setName][this.state.armorClassType]].displayProperties.name}</div>
                          </div>
                          <ul className='list inventory-items'>
                            <Items
                              items={combos
                                .map((c) => ({
                                  ...c,
                                  items: c.items.filter((hash) => (this.state.armorClassType > -1 && manifest.DestinyInventoryItemDefinition[hash].classType < 3 && manifest.DestinyInventoryItemDefinition[hash].classType === this.state.armorClassType) || manifest.DestinyInventoryItemDefinition[hash].classType > 2 || this.state.armorClassType < 0),
                                }))
                                .reduce((a, v) => {
                                  return [...a, ...v.items.map((hash) => ({ combo: v.combo, itemHash: hash }))];
                                }, [])}
                              handler={this.handler_rewardItemClick}
                              tooltips='mouse'
                            />
                          </ul>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='sticky-nav'>
          <div className='wrapper'>
            <div />
            <ul>
              <li>
                {this.props.viewport.width <= 1024 && this.state.slotsPanelOpen ? (
                  <Button action={this.handler_toggleSlotsPanel(this.state.slotsPanelOpen)}>
                    <DestinyKey type='dismiss' /> {t('Dismiss')}
                  </Button>
                ) : (
                  <>
                    <Button action={this.handler_filterClassType}>
                      {this.state.armorClassType === -1 ? (
                        <>
                          <i className='segoe-mdl-filter' />
                          {t('All class types')}
                        </>
                      ) : (
                        <>
                          <i className='segoe-mdl-filter' />
                          {Object.values(manifest.DestinyClassDefinition).find((i) => i.classType === this.state.armorClassType).displayProperties.name}
                        </>
                      )}
                    </Button>
                    <Button action={this.hanlder_resetState}>
                      <i className='segoe-mdl-reset' />
                      {t('Reset')}
                    </Button>
                  </>
                )}
              </li>
            </ul>
          </div>
        </div>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    member: state.member,
    viewport: state.viewport,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    rebindTooltips: () => {
      dispatch({ type: 'REBIND_TOOLTIPS' });
    },
    pushInstance: (value) => {
      dispatch({ type: 'PUSH_INSTANCE', payload: value });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChaliceRecipes);
