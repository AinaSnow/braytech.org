import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import { ProfileLink } from '../../../components/ProfileLink';
import { DestinyKey } from '../../../components/UI/Button';

import CustomiseTip from '../../../components/UserModules/CustomiseTip';

import Flashpoint from '../../../components/UserModules/Flashpoint';
import { Events, eventsCalendar } from '../../../components/UserModules/Events';
import WeeklyVanguardSinge from '../../../components/UserModules/WeeklyVanguardSinge';
import CrucibleRotators from '../../../components/UserModules/CrucibleRotators';
import Nightfalls from '../../../components/UserModules/Nightfalls';
import Raid from '../../../components/UserModules/Raid';
import DreamingCityAscendantChallenge from '../../../components/UserModules/DreamingCityAscendantChallenge';
import DreamingCityCurse from '../../../components/UserModules/DreamingCityCurse';
import DreamingCityCurseCycle from '../../../components/UserModules/DreamingCityCurseCycle';
import DreamingCityShatteredThrone from '../../../components/UserModules/DreamingCityShatteredThrone';
import Menagerie from '../../../components/UserModules/Menagerie';
import EscalationProtocol from '../../../components/UserModules/EscalationProtocol';
import Reckoning from '../../../components/UserModules/Reckoning';
import LunasRecall from '../../../components/UserModules/LunasRecall';
import NightmareHunts from '../../../components/UserModules/NightmareHunts';

import { moduleRules, headOverride, getCols } from '../Customise';

import './styles.css';

class ThisWeek extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);

    this.props.rebindTooltips();
  }

  components = {
    CustomiseTip: {
      reference: CustomiseTip
    },
    Flashpoint: {
      reference: Flashpoint
    },
    Events: {
      reference: Events
    },
    CrucibleRotators: {
      reference: CrucibleRotators
    },
    WeeklyVanguardSinge: {
      reference: WeeklyVanguardSinge
    },
    Nightfalls: {
      reference: Nightfalls
    },
    Raid: {
      reference: Raid
    },
    DreamingCityAscendantChallenge: {
      reference: DreamingCityAscendantChallenge
    },
    DreamingCityCurse: {
      reference: DreamingCityCurse
    },
    DreamingCityCurseCycle: {
      reference: DreamingCityCurseCycle
    },
    DreamingCityShatteredThrone: {
      reference: DreamingCityShatteredThrone
    },
    Menagerie: {
      reference: Menagerie
    },
    EscalationProtocol: {
      reference: EscalationProtocol
    },
    Reckoning: {
      reference: Reckoning
    },
    Luna: {
      reference: LunasRecall
    },
    NightmareHunts: {
      reference: NightmareHunts
    }
  };

  render() {
    const { t, layout, tips } = this.props;

    const cycleInfo = {
      epoch: {
        // start of cycle in UTC
        ascendant: new Date(`2018-09-04T17:00:00Z`).getTime(),
        curse: new Date(`2018-09-11T17:00:00Z`).getTime(),
        ep: new Date(`2018-05-08T17:00:00Z`).getTime(),
        reckoning: new Date(`2019-05-21T17:00:00Z`).getTime(),
        whisper: new Date(`2019-05-28T17:00:00Z`).getTime(),
        zerohour: new Date(`2019-05-28T17:00:00Z`).getTime(),
        menagerie: new Date(`2019-06-04T17:00:00Z`).getTime()
      },
      cycle: {
        // how many week cycle
        ascendant: 6,
        curse: 3,
        ep: 5,
        reckoning: 2,
        whisper: 3,
        zerohour: 3,
        menagerie: 3
      },
      elapsed: {}, // elapsed time since cycle started
      week: {} // current week in cycle
    };

    const time = new Date().getTime();
    const msPerWk = 604800000;

    for (var cycle in cycleInfo.cycle) {
      cycleInfo.elapsed[cycle] = time - cycleInfo.epoch[cycle];
      cycleInfo.week[cycle] = Math.floor((cycleInfo.elapsed[cycle] / msPerWk) % cycleInfo.cycle[cycle]) + 1;
    }

    const userHeadGroup = {
      ...layout.groups.find(g => g.id === 'head'),
      ...headOverride,
      type: 'user',
      className: ['head']
    };

    userHeadGroup.cols = userHeadGroup.cols.map(c => {
      const className = [];

      if (c.mods.filter(m => moduleRules.double.filter(f => f === m.component).length).length) className.push('double');

      return {
        ...c,
        className
      };
    });

    const userBodyGroup = layout.groups
      .filter(g => g.type === 'body')
      .map(group => {
        const className = [];

        if (group.cols.filter(c => c.mods.filter(m => m.component === 'Nightfalls').length).length) {
          return {
            ...group,
            className,
            type: 'user',
            components: ['Nightfalls']
          };
        }

        if (group.cols.filter(c => c.mods.filter(m => moduleRules.full.filter(f => f === m.component).length).length).length) className.push('full');
        if (group.cols.filter(c => c.mods.filter(m => 'SeasonPass' === m.component).length).length) className.push('season-pass');

        const cols = group.cols.map(c => {
          const className = [];

          if (c.mods.filter(m => moduleRules.double.filter(f => f === m.component).length).length) className.push('double');

          return {
            ...c,
            className
          };
        });

        return {
          ...group,
          className,
          type: 'user',
          cols
        };
      });

    const groups = [
      {
        className: ['full', 'events'],
        condition: eventsCalendar.filter((event) => this.props.member.data.profile.characterActivities.data[this.props.member.characterId].availableActivities.filter((activity) => event.hashes.filter(hash => activity.activityHash === hash).length).length),
        components: ['Events']
      },
      userHeadGroup,
      {
        className: ['full', 'tip', 'customise-tip'],
        condition: tips.indexOf('CustomiseTipModule') < 0,
        components: ['CustomiseTip']
      },
      ...userBodyGroup
    ];

    return (
      <>
        <div className='groups'>
          {groups.filter(m => m).map((group, g) => {
            if (group.components) {
              if (group.condition === undefined || group.condition) {
                return (
                  <div key={g} className={cx('group', group.className)}>
                    {group.components.map((c, i) => {
                      const Component = this.components[c].reference;

                      return <Component key={i} />;
                    })}
                  </div>
                );
              } else {
                return null;
              }
            } else {
              const groupDoubleSpan = group.cols.filter(c => c.mods.find(m => moduleRules.double.includes(m.component))).length;

              const cols = getCols(group.cols);

              return (
                <div key={g} className={cx('group', group.className, { 'double-pear': groupDoubleSpan > 1 } )}>
                  {cols
                    .map((col, c) => {
                      if ((col.condition === undefined || col.condition) && col.mods.length) {
                        return (
                          <div key={c} className={cx('column', col.className)}>
                            {col.mods
                              .map((mod, m) => {
                                if (mod.condition === undefined || mod.condition) {
                                  const Component = this.components[mod.component]?.reference;
                                  const settings = (mod.settings || []).reduce(function(map, obj) {
                                    map[obj.id] = obj.value;
                                    return map;
                                  }, {});

                                  if (!Component) {
                                    return (
                                      <div key={m} className={cx('module', mod.className)}>
                                        <div className='info'>
                                          <p>
                                            {t('An error occurred while attempting to render module: {{moduleName}}', { moduleName: mod.component })}
                                          </p>
                                        </div>
                                      </div>
                                    );
                                  }

                                  return (
                                    <div key={m} className={cx('module', mod.className)}>
                                      <Component cycleInfo={cycleInfo} {...settings} />
                                    </div>
                                  );
                                } else {
                                  return false;
                                }
                              })
                              .map(m => m)}
                          </div>
                        );
                      } else {
                        return false;
                      }
                    })
                    .map(c => c)}
                </div>
              );
            }
          })}
        </div>
        <div className='sticky-nav'>
          <div className='wrapper'>
            <div />
            <ul>
              <li>
                <ProfileLink className='button' to='/this-week/customise'>
                  <DestinyKey type='modify' />
                  {t('Customise')}
                </ProfileLink>
              </li>
            </ul>
          </div>
        </div>
      </>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    auth: state.auth,
    layout: state.layouts['this-week'],
    settings: state.settings,
    tips: state.tips
  };
}

function mapDispatchToProps(dispatch) {
  return {
    rebindTooltips: value => {
      dispatch({ type: 'TOOLTIPS_REBIND', payload: new Date().getTime() });
    }
  };
}

export default compose(connect(mapStateToProps, mapDispatchToProps), withTranslation())(ThisWeek);
