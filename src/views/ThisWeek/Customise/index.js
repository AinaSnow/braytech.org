import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import { defaultState } from '../../../store/reducers/layouts';
import { ProfileLink } from '../../../components/ProfileLink';
import { Button, DestinyKey } from '../../../components/UI/Button';
import Checkbox from '../../../components/UI/Checkbox';

import './styles.css';

// reorders a list
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

// moves an item from one list to another list
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  if (moduleRules.full.includes(removed.component) || moduleRules.double.includes(removed.component)) {
    destClone.splice(0, destClone.length, removed);
  } else {
    destClone.splice(droppableDestination.index, 0, removed);
  }

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

// adds an item to a list
const add = (destination, item) => {
  // if a mod is "full" or "double", it occupies the entire column, erasing previous mods... mostly because i said so
  const result = moduleRules.full.includes(item.component) || moduleRules.double.includes(item.component) ? [item] : [...destination, item];

  return result;
};

// removes an item from a list
const remove = (destination, item) => {
  const result = [...destination].filter(i => i.id !== item.id);

  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer

  // change background colour if dragging
  background: isDragging ? 'rgba(255, 255, 255, 0.4)' : '',

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'rgba(255, 255, 255, 0.2)' : ''
});

export const getCols = cols => {
  const full = cols.findIndex(c => c.mods.find(m => moduleRules.full.includes(m.component)));
  const doubleIndexes = cols.map((c, i) => c.mods.filter(m => moduleRules.double.includes(m.component)).length ? i : -1).filter(i => i > -1);
  const doubleCount = cols.filter(c => c.mods.find(m => moduleRules.double.includes(m.component))).length;

  // if (doubleCount > 0) console.log(cols, doubleIndexes, doubleCount)

  if (full > -1) {
    return cols.filter(c => c.mods.find(m => moduleRules.full.includes(m.component)))
  } else if (doubleCount > 0 && doubleCount < 3) {
    return cols.filter((c, i) => doubleIndexes.indexOf(i - 1) < 0);
  } else {
    return cols;
  }
}

const getUniqueGroupID = groups => {
  const bodies = groups.filter(g => g.type === 'body');

  let unique = 0;
  while (bodies.filter(g => g.id === `body-${unique}`).length) {
    unique++;
  }

  return unique;
}

export const moduleRules = {
  full: ['Nightfalls', 'Events'],
  double: ['DreamingCityShatteredThrone'],
  head: []
};

export const headOverride = {
  id: 'head',
  type: 'head',
  cols: [
    {
      id: 'head-col-0',
      mods: [
        {
          id: 'Flashpoint-0',
          component: 'Flashpoint'
        }
      ]
    },
    {
      id: 'head-col-1',
      mods: [
        {
          id: 'WeeklyVanguardSinge-0',
          component: 'WeeklyVanguardSinge'
        }
      ]
    },
    {
      id: 'head-col-2',
      mods: [
        {
          id: 'DreamingCityCurseCycle-0',
          component: 'DreamingCityCurseCycle'
        }
      ]
    },
    {
      id: 'head-col-3',
      mods: [
        {
          id: 'CrucibleRotators-0',
          component: 'CrucibleRotators'
        }
      ]
    }
  ]
};

class Customise extends React.Component {
  state = this.props.layout;

  getList = id => {
    const group = this.state.groups.find(g => g.cols.find(c => c.id === id));
    const col = group.cols.find(c => c.id === id);

    return {
      group,
      col
    };
  };

  pushNotification = value => {
    this.props.pushNotification({
      date: new Date().toISOString(),
      expiry: 86400000,
      displayProperties: {
        name: 'Braytech',
        description: value,
        timeout: 10
      }
    });
  }

  onDragEnd = result => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceList = this.getList(source.droppableId);
    const destinationList = this.getList(destination.droppableId);

    // prevents modules being added or moved to columns with "full" modules i.e. SeasonPass or "double" modules
    if (destinationList.col.mods.filter(m => moduleRules.full.filter(f => f === m.component).length || moduleRules.double.filter(f => f === m.component).length).length) {
      this.pushNotification(this.props.t('Double and full-width modules are column exclusives. Try adding a module to another column.'));
      
      return;
    };

    // if reordering a list (column), else list to list
    if (source.droppableId === destination.droppableId) {
      const result = reorder(sourceList.col.mods, source.index, destination.index);

      this.setState(p => {
        const groups = p.groups;

        const group = groups.find(g => g.id === sourceList.group.id);

        if (group) {
          const index = group.cols.findIndex(c => c.id === sourceList.col.id);

          if (index > -1) {
            group.cols[index].mods = result;
          }
        }

        return {
          ...p,
          groups
        };
      });
    } else {
      // enforces 1 module limit on header group
      if (destinationList.col.mods.length && destinationList.group.id === 'head') {
        this.pushNotification(this.props.t('The header group supports no more than one module per column.'));

        return;
      }
      // no full or double mods in header group
      if (sourceList.col.mods.find(m => moduleRules.full.includes(m.component) || moduleRules.double.includes(m.component)) && destinationList.group.id === 'head') {
        this.pushNotification(this.props.t('The header group supports single column modules only.'));

        return;
      }
      // permit only approved mods to head
      if (!moduleRules.head.includes(sourceList.col.mods[source.index].component) && destinationList.group.id === 'head') {
        this.pushNotification(this.props.t("That module isn't allowed here."));

        return;
      }
      // force full mods to first column
      if (sourceList.col.mods.find(m => moduleRules.full.includes(m.component))) {
        destination.droppableId = destinationList.group.cols[0].id;
      }
      // force double mods to third or less column
      if (sourceList.col.mods.find(m => moduleRules.double.includes(m.component))) {
        // find intended insertion index
        const index = destinationList.group.cols.findIndex(c => c.id === destinationList.col.id);
        // make sure index is less than 3 (4th column) as the mod occupies 2 columns
        const ratifiedIndex = Math.min(index, 2);

        destination.droppableId = destinationList.group.cols[ratifiedIndex].id;
      }

      const result = move(sourceList.col.mods, destinationList.col.mods, source, destination);

      this.setState(p => {
        const groups = p.groups;

        const sourceGroup = groups.find(g => g.id === sourceList.group.id);

        // apply changes to source list
        if (sourceGroup) {
          Object.keys(result).forEach(id => {
            const index = sourceGroup.cols.findIndex(c => c.id === id);

            if (index > -1) {
              sourceGroup.cols[index].mods = result[id];
            }
          });
        }

        // apply changes to destination list
        const destinationGroup = groups.find(g => g.id === destinationList.group.id);

        if (destinationGroup) {
          Object.keys(result).forEach(id => {
            const index = destinationGroup.cols.findIndex(c => c.id === id);

            if (index > -1) {
              destinationGroup.cols[index].mods = result[id];
            }
          });
        }

        return {
          ...p,
          groups
        };
      });
    }
  };

  handler_addGroup = e => {
    this.setState(p => {
      const groupId = getUniqueGroupID(p.groups);
      
      const group = {
        id: `body-${groupId}`,
        type: 'body',
        cols: [
          {
            id: `body-${groupId}-col-0`,
            mods: []
          },
          {
            id: `body-${groupId}-col-1`,
            mods: []
          },
          {
            id: `body-${groupId}-col-2`,
            mods: []
          },
          {
            id: `body-${groupId}-col-3`,
            mods: []
          }
        ]
      };

      return {
        ...p,
        groups: [...p.groups, group]
      };
    });
  };

  handler_removeGroup = id => e => {
    this.setState(p => {
      return {
        ...p,
        groups: p.groups.filter(g => g.id !== id)
      };
    });
  };

  handler_addMod = (groupId, key) => {
    const destinationList = this.getList(groupId);

    if (!destinationList) {
      console.warn(`Could not find a destinationList for: ${groupId}, ${key}`);
      return;
    }

    const { instances } = this.inUse(key);
    const id = `${key}-${instances + 1}`;

    const result = add(destinationList.col.mods, { id, component: key });

    this.setState(p => {
      const groups = p.groups;

      const group = groups.find(g => g.id === destinationList.group.id);

      if (group && moduleRules.full.includes(key)) {
        group.cols[0].mods = result;
      } else if (group && moduleRules.double.includes(key)) {
        // find intended insertion index
        const index = group.cols.findIndex(c => c.id === destinationList.col.id);
        // make sure index is less than 3 (4th column) as the mod occupies 2 columns
        const ratifiedIndex = Math.min(index, 2);

        group.cols[ratifiedIndex].mods = result;
      } else if (group) {
        const index = group.cols.findIndex(c => c.id === destinationList.col.id);

        if (index > -1) {
          group.cols[index].mods = result;
        }
      }

      return {
        ...p,
        groups
      };
    });
  };

  handler_removeMod = (groupId, id) => e => {
    const destinationList = this.getList(groupId);

    const result = remove(destinationList.col.mods, { id });

    this.setState(p => {
      const groups = p.groups;

      const group = groups.find(g => g.id === destinationList.group.id);

      if (group) {
        const index = group.cols.findIndex(c => c.id === destinationList.col.id);

        if (index > -1) {
          group.cols[index].mods = result;
        }
      }

      return {
        ...p,
        groups
      };
    });
  };

  handler_setSettings = (col, mod, value) => {
    const destinationList = this.getList(col);

    this.setState(p => {
      const groups = p.groups;

      const group = groups.find(g => g.id === destinationList.group.id);

      if (group) {
        const colIndex = group.cols.findIndex(c => c.id === destinationList.col.id);
        const modIndex = colIndex > -1 && group.cols[colIndex].mods.findIndex(m => m.id === mod);

        if (modIndex > -1) {
          group.cols[colIndex].mods[modIndex].settings = [
            //...group.cols[colIndex].settings || [],
            value
          ];
        }
      }

      return {
        ...p,
        groups
      };
    });
  };

  handler_resetLayout = e => {
    if (this.mounted) this.setState(defaultState['this-week']);
  }

  componentDidMount() {
    this.mounted = true;

    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate(p, s) {
    if (s !== this.state) {
      this.props.setLayout(this.state);
    }
  }

  modules = {
    Flashpoint: {
      name: manifest.DestinyMilestoneDefinition[463010297]?.displayProperties.name,
      description: manifest.DestinyMilestoneDefinition[463010297]?.displayProperties.description
    },
    WeeklyVanguardSinge: {
      name: this.props.t('Vanguard singe'),
      description: this.props.t('The elemental burn shared by most activities this week.')
    },
    CrucibleRotators: {
      name: manifest.DestinyPlaceDefinition[4088006058]?.displayProperties.name,
      description: this.props.t('Crucible modes that are currently in rotation and available for you to test your vigour in against other Guardians.')
    },
    Nightfalls: {
      name: manifest.DestinyActivityModeDefinition[3789021730].displayProperties.name,
      description: this.props.t('Your light is restricted in the most daring of strike operations.')
    },
    Raid: {
      name: manifest.DestinyActivityTypeDefinition[2043403989].displayProperties.name,
      description: manifest.DestinyActivityTypeDefinition[2043403989].displayProperties.description,
      limit: 5,
      settings: [
        {
          id: 'raidKey',
          name: this.props.t('Selected raid'),
          options: {
            name: raidKey => {
              if (raidKey === 'gos') {
                return manifest.DestinyActivityDefinition[2659723068].displayProperties.name;
              } else if (raidKey === 'cos') {
                return manifest.DestinyRecordDefinition[31686901]?.displayProperties.name || 'cos';
              } else if (raidKey === 'sotp') {
                return manifest.DestinyActivityDefinition[548750096].displayProperties.name;
              } else if (raidKey === 'lw') {
                return manifest.DestinyPresentationNodeDefinition[1500485992].displayProperties.name;
              } else if (raidKey === 'levi') {
                return manifest.DestinyActivityDefinition[89727599].displayProperties.name;
              } else {
                return this.props.t('Unknown');
              }
            },
            values: ['gos', 'cos', 'sotp', 'lw', 'levi']
          }
        }
      ]
    },
    DreamingCityAscendantChallenge: {
      name: `${manifest.DestinyPresentationNodeDefinition[2516503814]?.displayProperties.name}: ${this.props.t('Ascendant Challenge')}`,
      description: manifest.DestinyInventoryItemDefinition[128980839]?.displayProperties.description
    },
    DreamingCityCurse: {
      name: `${manifest.DestinyPresentationNodeDefinition[2516503814]?.displayProperties.name}: ${this.props.t("Savathûn's Curse")}`,
      description: manifest.DestinyActivityDefinition[1893059148]?.displayProperties.description
    },
    DreamingCityCurseCycle: {
      name: `${manifest.DestinyPresentationNodeDefinition[2516503814]?.displayProperties.name}: ${this.props.t("Savathûn's Curse")}`,
      description: manifest.DestinyActivityDefinition[1893059148]?.displayProperties.description
    },
    DreamingCityShatteredThrone: {
      name: `${manifest.DestinyPresentationNodeDefinition[2516503814]?.displayProperties.name}: ${this.props.t('The Shattered Throne')}`,
      description: manifest.DestinyActivityDefinition[1893059148]?.displayProperties.description
    },
    Menagerie: {
      name: manifest.DestinyPlaceDefinition[2096719558]?.displayProperties.name,
      description: manifest.DestinyPlaceDefinition[2096719558]?.displayProperties.description
    },
    EscalationProtocol: {
      name: this.props.t('Escalation Protocol'),
      description: manifest.DestinyInventoryItemDefinition[4132073280]?.displayProperties.description
    },
    Reckoning: {
      name: manifest.DestinyPlaceDefinition[4148998934]?.displayProperties.name,
      description: manifest.DestinyPlaceDefinition[4148998934]?.displayProperties.description
    },
    Luna: {
      name: manifest.DestinyObjectiveDefinition[1296970487]?.displayProperties.name,
      description: manifest.DestinyInventoryItemDefinition[2178015352]?.displayProperties.description
    },
    NightmareHunts: {
      name: this.props.t('Nightmare Hunts'),
      description: this.props.t(`Hunt down this week's available nightmares for... satisfaction.`)
    }
  };

  inUse = key => {
    const limit = this.modules[key].limit || 1;

    const instances = this.state.groups.reduce((a, g) => {
      return a + g.cols.reduce((a, c) => {
        return a + c.mods.filter(m => m.component === key).length;
      }, 0);
    }, 0);

    return {
      used: instances >= limit,
      instances,
      limit
    };
  };

  render() {
    const { t } = this.props;

    // mark used modules
    Object.keys(this.modules).forEach(key => {
      const { used, instances } = this.inUse(key);

      this.modules[key].used = used;
      this.modules[key].instances = instances;
    });

    return (
      <>
        <div className='groups'>
          <DragDropContext onDragEnd={this.onDragEnd}>
            {this.state.groups.map((group, i) => {
              if (group.id === 'head') group = headOverride;

              const groupFullSpan = group.cols.findIndex(c => c.mods.find(m => moduleRules.full.includes(m.component)));
              const groupDoubleSpan = group.cols.filter(c => c.mods.find(m => moduleRules.double.includes(m.component))).length;
              
              const cols = getCols(group.cols);

              return (
                <div key={i} className={cx('group', 'user', { head: group.id === 'head', full: groupFullSpan > -1, 'double-pear': groupDoubleSpan > 1 })}>
                  {cols.map((col, i) => {
                    const colDoubleSpan = col.mods.filter(m => moduleRules.double.includes(m.component));
                    const columnFilled = (group.id === 'head' && col.mods.length > 0) || colDoubleSpan.length > 0;

                    return (
                      <div key={col.id} className={cx('column', { double: colDoubleSpan.length })}>
                        <div className='col-id'>{col.id}</div>
                        <Droppable droppableId={col.id}>
                          {(provided, snapshot) => (
                            <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)} className='column-inner'>
                              {col.mods.map((mod, i) => {
                                if (!this.modules[mod.component]) {
                                  return (
                                    <div key={mod.id} className='module button'>
                                      <div className='text'>
                                        <div className='name'>{t('Error')}</div>
                                        <div className='description'>{t('An error occurred while attempting to render module: {{moduleName}}', { moduleName: mod.component })}</div>
                                      </div>
                                      <Button className='remove' action={this.handler_removeMod(col.id, mod.id)}>
                                        <i className='segoe-mdl-cancel' />
                                      </Button>
                                    </div>
                                  );
                                }

                                const { name, description } = this.modules[mod.component];

                                const settings =
                                  (this.modules[mod.component].settings &&
                                    this.modules[mod.component].settings.map(setting => ({
                                      ...setting,
                                      options: {
                                        ...setting.options,
                                        value: mod.settings && mod.settings.find(u => u.id === setting.id) && mod.settings.find(u => u.id === setting.id).value
                                      }
                                    }))) ||
                                  false;

                                return (
                                  <Draggable key={mod.id} draggableId={mod.id} index={i}>
                                    {(provided, snapshot) => (
                                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)} className={cx('module', 'button', { disabled: group.id === 'head' })}>
                                        <div className='text'>
                                          <div className='name'>{name}</div>
                                          <div className='description'>{description}</div>
                                        </div>
                                        {settings ? <ModulesSettings settings={settings} column={col.id} mod={mod.id} setSettings={this.handler_setSettings} /> : null}
                                        <Button className='remove' disabled={group.id === 'head'} action={this.handler_removeMod(col.id, mod.id)}>
                                          <i className='segoe-mdl-cancel' />
                                        </Button>
                                      </div>
                                    )}
                                  </Draggable>
                                );
                              })}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                        <ModulesSelector disabled={columnFilled || groupFullSpan > -1 || group.id === 'head'} modules={this.modules} groupType={group.type} column={col.id} addMod={this.handler_addMod} />
                      </div>
                    );
                  })}
                  {group.id === 'head' ? null : <Button className='remove row' text={t('Remove group')} action={this.handler_removeGroup(group.id)} />}
                </div>
              );
            })}
          </DragDropContext>
        </div>
        <div className='sticky-nav'>
          <div className='wrapper'>
            <div />
            <ul>
              <li>
                <Button action={this.handler_resetLayout}>
                  <DestinyKey type='more' />
                  {t('Reset')}
                </Button>
              </li>
              <li>
                <Button action={this.handler_addGroup}>
                  <DestinyKey type='accept' />
                  {t('Add group')}
                </Button>
              </li>
              <li>
                <ProfileLink className='button' to='/this-week'>
                  <DestinyKey type='dismiss' />
                  {t('Back')}
                </ProfileLink>
              </li>
            </ul>
          </div>
        </div>
      </>
    );
  }
}

class ModulesSelector extends React.Component {
  state = {
    expanded: false
  };

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handler_expand = e => {
    if (this.mounted) this.setState({ expanded: true });
  };

  handler_compress = e => {
    if (this.mounted) this.setState({ expanded: false });
  };

  handler_select = key => e => {
    if (this.mounted) {
      this.props.addMod(this.props.column, key);
      this.setState({ expanded: false });
    }
  };

  render() {
    const { t, disabled, modules, groupType } = this.props;
    const { expanded } = this.state;

    if (!disabled && expanded) {
      return (
        <div className='modules-selector expanded'>
          <Button text={t('Cancel')} action={this.handler_compress} />
          <div className='list'>
            {Object.keys(modules).filter(key => !headOverride?.cols.filter(c => c.mods.filter(m => m.component === key).length).length).sort((a, b) => modules[a].used - modules[b].used).map(key => {
              const { name, description, used, limit, instances } = modules[key];

              const unavailable = groupType === 'head' && !moduleRules.head.includes(key);

              if (unavailable) return null;

              return (
                <div key={key} className={cx('module', 'button', { disabled: used || unavailable })} onClick={!used ? this.handler_select(key) : undefined}>
                  <div className='text'>
                    <div className='name'>{name}</div>
                    {limit > 1 ? <div className='limit'>{instances}/{limit}</div> : null}
                    <div className='description'>{description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    } else {
      return (
        <div className='modules-selector'>
          <Button text={t('Add module')} disabled={disabled} action={this.handler_expand} />
        </div>
      );
    }
  }
}

class ModulesSettings extends React.Component {
  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handler_optionsSelect = payload => e => {
    if (this.mounted) {
      this.props.setSettings(this.props.column, this.props.mod, payload);
    }
  };

  render() {
    const { settings } = this.props;

    return (
      <div className='modules-settings'>
        {settings.map((setting, s) => (
          <div key={s} className='setting'>
            <div className='name'>{setting.name}</div>
            <ul className='list settings'>
              {setting.options.values.map((value, v) => {
                const id = setting.id;
                const name = setting.options.name(value);
                const checked = setting.options.multi ? setting.options.value.includes(value) : setting.options.value === value;

                return (
                  <li key={v} onClick={this.handler_optionsSelect({ id, value })}>
                    <Checkbox linked checked={checked} text={name} />
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    );
  }
}

ModulesSelector = compose(withTranslation())(ModulesSelector);

ModulesSettings = compose(withTranslation())(ModulesSettings);

function mapStateToProps(state, ownProps) {
  return {
    layout: state.layouts['this-week']
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setLayout: value => {
      dispatch({
        type: 'LAYOUTS_SET',
        payload: {
          target: 'this-week',
          value
        }
      });
    },
    resetLayout: value => {
      dispatch({
        type: 'LAYOUTS_RESET',
        payload: {
          target: 'this-week'
        }
      });
    },
    pushNotification: value => {
      dispatch({ type: 'NOTIFICATIONS_PUSH', payload: value });
    }
  };
}

export default compose(connect(mapStateToProps, mapDispatchToProps), withTranslation())(Customise);
