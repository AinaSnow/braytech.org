import React from 'react';
import { connect } from 'react-redux';
import { orderBy } from 'lodash';
import cx from 'classnames';

import { t, duration, timestampToDuration, BungieText } from '../../utils/i18n';
import manifest from '../../utils/manifest';
import * as enums from '../../utils/destinyEnums';
import * as bungie from '../../utils/bungie';
import itemComponents from '../../utils/destinyItems/itemComponents';
import { removeMemberIds } from '../../utils/paths';

import { NoAuth, DiffProfile } from '../../components/BungieAuth';
import ObservedImage from '../../components/ObservedImage';
import Items from '../../components/Items';
import { ProfileLink, ProfileNavLink } from '../../components/ProfileLink';
import { QuestLine, questFilters } from '../../components/QuestLine';

import Spinner from '../../components/UI/Spinner';
import ProgressBar from '../../components/UI/ProgressBar';
import { DestinyKey } from '../../components/UI/Button';
import { Common } from '../../svg';

import './styles.css';

function navLinkBountiesIsActive(match, location) {
  const pathname = removeMemberIds(location.pathname);

  if (pathname === '/quests' || pathname.indexOf('/quests/bounties') > -1) {
    return true;
  }

  return false;
}

function navLinkQuestsAllIsActive(match, location) {
  const pathname = removeMemberIds(location.pathname);

  if (pathname.indexOf('/quests/all') > -1) {
    return true;
  }

  return false;
}

const filters = ['bounties', 'all', 'new-light', 'expansion', 'seasonal', 'playlists', 'exotics', 'past'];

class QuestItem extends React.Component {
  state = {};

  static getDerivedStateFromProps(p, s) {
    if (p.member.updated === s.memberUpdated) {
      return null;
    }

    const tracked = enums.enumerateItemState(p.item.state).Tracked;

    return {
      memberUpdated: p.member.updated,
      tracked,
    };
  }

  handler_toggleTrack = (item) => async (e) => {
    const tracked = this.state.tracked;

    this.setState({ tracked: !tracked });

    const response = await bungie.SetQuestTrackedState({
      state: !tracked,
      itemId: item.itemInstanceId || item.itemHash,
      characterId: this.props.member.characterId,
      membershipType: this.props.member.membershipType,
    });

    if (response?.ErrorCode !== 1) {
      this.setState({ tracked });
    }
  };

  render() {
    const { viewport, filter, item } = this.props;

    const timestamp = new Date().getTime();

    const definitionItem = manifest.DestinyInventoryItemDefinition[item.itemHash];
    const definitionQuestLine = manifest.DestinyInventoryItemDefinition[manifest.DestinyInventoryItemDefinition[item.itemHash]?.objectives?.questlineItemHash];
    const definitionBucket = manifest.DestinyInventoryBucketDefinition[item.bucketHash];

    const expirationDate = item.itemComponents?.item?.expirationDate;
    const timestampExpiry = expirationDate && new Date(expirationDate).getTime();

    const completed = item.itemComponents?.objectives && item.itemComponents?.objectives.filter((o) => !o.complete).length === 0;
    const expired = !completed && timestamp > timestampExpiry;
    const expiresSoon = !completed && timestamp + 7200 * 1000 > timestampExpiry;
    const masterworked = enums.enumerateItemState(item.state).Masterworked;
    const tracked = this.state.tracked && !(expired || expiresSoon);

    const bucketName = definitionBucket?.displayProperties?.name?.replace(' ', '-').toLowerCase();

    const objectives = definitionItem.objectives?.objectiveHashes?.map((hash, h) => {
      const definitionObjective = manifest.DestinyObjectiveDefinition[hash];

      const instanceProgressObjective = item.itemComponents?.objectives?.length && item.itemComponents.objectives.find((o) => o.objectiveHash === hash);

      const playerProgress = {
        complete: false,
        progress: 0,
        objectiveHash: definitionObjective.hash,
        ...instanceProgressObjective,
      };

      return <ProgressBar key={h} objectiveHash={definitionObjective.hash} {...playerProgress} />;
    });

    const objectivesProgress =
      (!completed &&
        item.itemComponents?.objectives?.reduce((acc, curr) => {
          return acc + curr.progress;
        }, 0)) ||
      0;
    const objectivesCompletionValue =
      (!completed &&
        item.itemComponents?.objectives?.reduce((acc, curr) => {
          return acc + curr.completionValue;
        }, 0)) ||
      0;

    // it's a bounty
    if (definitionItem.traitIds?.indexOf('inventory_filtering.bounty') > -1) {
      if (viewport.width > 1023) {
        return (
          <li key={item.itemHash} className={cx({ completed })}>
            <ul>
              <li className='col bounty-item'>
                <ul className='list inventory-items'>
                  <li
                    className={cx(
                      {
                        linked: true,
                        tooltip: true,
                        completed,
                        expired,
                        tracked,
                        masterworked,
                        exotic: definitionItem.inventory?.tierType === 6,
                      },
                      bucketName
                    )}
                    data-hash={item.itemHash}
                    data-instanceid={item.itemInstanceId}
                    data-quantity={item.quantity && item.quantity > 1 ? item.quantity : null}
                  >
                    <div className='icon'>
                      <ObservedImage className='image' src={definitionItem.displayProperties.localIcon ? `${definitionItem.displayProperties.icon}` : `https://www.bungie.net${definitionItem.displayProperties.icon}`} />
                    </div>
                    {tracked ? (
                      <div className='tracked'>
                        <Common.Tracking />
                      </div>
                    ) : null}
                    {item.quantity && item.quantity > 1 ? <div className={cx('quantity', { 'max-stack': definitionItem.inventory?.maxStackSize === item.quantity })}>{item.quantity}</div> : null}
                    {completed ? (
                      <div className='completed'>
                        <Common.Completed />
                      </div>
                    ) : null}
                    {expired || expiresSoon ? (
                      <div className='expired'>
                        <Common.Expired />
                      </div>
                    ) : null}
                  </li>
                </ul>
              </li>
              <li className='col bounty-text'>
                <div className='name'>
                  <BungieText value={definitionItem.displayProperties?.name} textOnly energy />
                </div>
                <BungieText className='description' value={definitionItem.displayProperties?.description} energy />
              </li>
              <li className='col objectives'>{objectives}</li>
              <li className='col reward-items'>
                <ul className='list inventory-items'>
                  <Items items={definitionItem.value?.itemValue?.filter((item) => item.itemHash !== 0)} noBorder hideQuantity />
                </ul>
              </li>
              <li className='col expires'>
                <div>{!completed && expirationDate ? timestampExpiry > timestamp ? <>{duration(timestampToDuration(expirationDate), { relative: true })}</> : <>{t('Expired')}</> : '–'}</div>
              </li>
            </ul>
          </li>
        );
      } else {
        return (
          <li
            className={cx(
              {
                linked: true,
                tooltip: true,
                completed,
                expired,
                tracked,
                masterworked,
                exotic: definitionItem.inventory?.tierType === 6,
              },
              bucketName
            )}
            data-hash={item.itemHash}
            data-instanceid={item.itemInstanceId}
            data-quantity={item.quantity && item.quantity > 1 ? item.quantity : null}
          >
            <div className='icon'>
              <ObservedImage className='image' src={definitionItem.displayProperties.localIcon ? `${definitionItem.displayProperties.icon}` : `https://www.bungie.net${definitionItem.displayProperties.icon}`} />
            </div>
            {tracked ? (
              <div className='track'>
                <Common.Tracking />
              </div>
            ) : null}
            {item.quantity && item.quantity > 1 ? <div className={cx('quantity', { 'max-stack': definitionItem.inventory?.maxStackSize === item.quantity })}>{item.quantity}</div> : null}
            {completed ? (
              <div className='completed'>
                <Common.Completed />
              </div>
            ) : null}
            {expired || expiresSoon ? (
              <div className='expired'>
                <Common.Expired />
              </div>
            ) : null}
            {!completed ? <ProgressBar objectiveHash={item.itemComponents.objectives[0].objectiveHash} progress={objectivesProgress} completionValue={objectivesCompletionValue} hideCheck /> : null}
          </li>
        );
      }
    }

    const questLineName = (definitionQuestLine?.setData?.questLineName && definitionQuestLine.setData.questLineName !== '' && definitionQuestLine.setData.questLineName) || definitionQuestLine?.displayProperties.name;

    // it's a quest item
    return (
      <li
        key={item.itemHash}
        className={cx('linked', {
          tooltip: viewport.width > 600,
          exotic: definitionItem.inventory?.tierType === 6,
          completed,
          expired,
          tracked,
        })}
        data-hash={item.itemHash}
        data-instanceid={item.itemInstanceId}
        data-quantity={item.quantity && item.quantity > 1 ? item.quantity : null}
      >
        <ul className='list inventory-items'>
          <li key={item.itemHash} className={cx({ masterworked }, bucketName)}>
            <div className='icon'>
              <ObservedImage src={definitionItem.displayProperties.localIcon ? `${definitionItem.displayProperties.icon}` : `https://www.bungie.net${definitionItem.displayProperties.icon}`} />
            </div>
            {item.quantity && item.quantity > 1 ? <div className={cx('quantity', { 'max-stack': definitionItem.inventory && definitionItem.inventory.maxStackSize === item.quantity })}>{item.quantity}</div> : null}
            {completed ? <div className='completed' /> : null}
            {expired || expiresSoon ? <div className='expired' /> : null}
          </li>
        </ul>
        {definitionItem.itemType === enums.DestinyItemType.QuestStep || definitionItem.itemType === enums.DestinyItemType.QuestStepComplete || definitionItem.itemType === enums.DestinyItemType.Quest ? (
          <div className='track' onClick={this.handler_toggleTrack(item)}>
            <Common.Tracking />
          </div>
        ) : null}
        <div className='text'>
          <div className='name'>{questLineName || definitionItem.displayProperties.name}</div>
          <BungieText className='description' value={definitionItem.displayProperties.description} single trim='70' />
        </div>
        {!expired && item.itemComponents?.objectives?.length ? (
          <ProgressBar
            objectiveHash={item.itemComponents?.objectives[0].objectiveHash}
            progress={item.itemComponents?.objectives.reduce((acc, curr) => {
              return acc + curr.progress;
            }, 0)}
            completionValue={item.itemComponents?.objectives.reduce((acc, curr) => {
              return acc + curr.completionValue;
            }, 0)}
            hideCheck
            hideFraction
            hideDescription
          />
        ) : null}
        <ProfileLink to={`/quests/${filter}/${item.itemHash}`} />
      </li>
    );
  }
}

QuestItem = connect(mapStateToProps, mapDispatchToProps)(QuestItem);

class Quests extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);

    this.props.rebindTooltips();
  }

  componentDidUpdate(p, s) {
    if (p.match.params.filter !== this.props.match.params.filter || p.match.params.variable !== this.props.match.params.variable) {
      window.scrollTo(0, 0);
    }
  }

  getItems = (items = []) => {
    const filter = this.props.match.params.filter || 'bounties';

    return items.map((item, i) => {
      const definitionItem = manifest.DestinyInventoryItemDefinition[item.itemHash];

      item.itemComponents = itemComponents(item, this.props.member);

      const expirationDate = item.itemComponents?.item?.expirationDate;
      const timestampExpiry = expirationDate && new Date(expirationDate).getTime();

      const completed = item.itemComponents?.objectives && item.itemComponents?.objectives.filter((o) => !o.complete).length === 0;

      const objectivesProgress =
        (!completed &&
          item.itemComponents?.objectives?.reduce((acc, curr) => {
            return acc + curr.progress;
          }, 0)) ||
        0;
      const objectivesCompletionValue =
        (!completed &&
          item.itemComponents?.objectives?.reduce((acc, curr) => {
            return acc + curr.completionValue;
          }, 0)) ||
        0;

      return {
        ...item,
        sorts: {
          name: definitionItem.displayProperties?.name,
          rarity: definitionItem.inventory?.tierType,
          objectives: objectivesCompletionValue === 0 ? -1 : objectivesProgress / objectivesCompletionValue,
          timestampExpiry: (objectivesCompletionValue !== 0 && timestampExpiry) || 10000 * 10000 * 10000 * 10000,
        },
        element: <QuestItem key={item.itemHash} filter={filter} item={item} />,
      };
    });
  };

  render() {
    const { member, auth, viewport } = this.props;
    const filter = (this.props.match.params.filter && filters.indexOf(this.props.match.params.filter) > -1 && this.props.match.params.filter) || 'bounties';
    const variable = this.props.match.params.variable || (filter === 'bounties' ? 'objectives' : 'rarity');
    const order = this.props.match.params.order || (variable === 'objectives' || variable === 'rarity' ? 'desc' : 'asc');

    if (!member.data.profile.profileInventory?.data && !auth) {
      return <NoAuth />;
    }

    if (!member.data.profile.profileInventory?.data && auth && !auth.destinyMemberships.find((m) => m.membershipId === member.membershipId)) {
      return <DiffProfile />;
    }

    if (!member.data.profile.profileInventory?.data && auth && auth.destinyMemberships.find((m) => m.membershipId === member.membershipId)) {
      return (
        <div className='view' id='quests'>
          <Spinner />
        </div>
      );
    }

    const inventory = member.data.inventory.filter((item) => (item.characterId === undefined ? true : item.characterId === member.characterId));

    const total = inventory.filter((item) => {
      const definitionItem = manifest.DestinyInventoryItemDefinition[item.itemHash];

      if (!definitionItem) return false;

      // milestone-lookin' quest steps
      if (definitionItem.inventory?.bucketTypeHash === 1801258597) return false;

      if (definitionItem.traitIds?.indexOf('inventory_filtering.bounty') > -1 || definitionItem.traitIds?.indexOf('inventory_filtering.quest') > -1 || definitionItem.traitIds?.indexOf('inventory_filtering.quest.featured') > -1) {
        return true;
      }

      return false;
    });
    const context = inventory.filter((item) => {
      const definitionItem = manifest.DestinyInventoryItemDefinition[item.itemHash];

      if (!definitionItem) return false;

      // milestone-lookin' quest steps
      if (definitionItem.inventory?.bucketTypeHash === 1801258597) return false;

      if (filter === 'bounties') {
        if (definitionItem.traitIds?.indexOf('inventory_filtering.bounty') > -1) {
          return true;
        }
      } else {
        if (definitionItem.traitIds?.indexOf('inventory_filtering.quest') > -1 || definitionItem.traitIds?.indexOf('inventory_filtering.quest.featured') > -1) {
          return true;
        }
      }

      if (definitionItem.traitIds?.indexOf(filter !== 'bounties' ? 'inventory_filtering.quest' : 'inventory_filtering.bounty') > -1) {
        return true;
      }

      return false;
    });
    const filtered = inventory.filter((item) => {
      const definitionItem = manifest.DestinyInventoryItemDefinition[item.itemHash];

      if (!definitionItem) return false;

      // milestone-lookin' quest steps
      if (definitionItem.inventory?.bucketTypeHash === 1801258597) return false;

      if (filter === 'bounties' && definitionItem.traitIds?.indexOf('inventory_filtering.bounty') > -1) {
        return true;
      } else if (filter === 'new-light' && definitionItem.traitIds?.indexOf('quest.new_light') > -1) {
        return true;
      } else if (filter === 'expansion' && definitionItem.traitIds?.indexOf('quest.current_release') > -1) {
        return true;
      } else if (filter === 'seasonal' && definitionItem.traitIds?.indexOf('quest.seasonal') > -1) {
        return true;
      } else if (filter === 'playlists' && definitionItem.traitIds?.indexOf('quest.playlists') > -1) {
        return true;
      } else if (filter === 'exotics' && definitionItem.traitIds?.indexOf('quest.exotic') > -1) {
        return true;
      } else if (filter === 'past' && definitionItem.traitIds?.indexOf('quest.past') > -1) {
        return true;
      } else if (filter === 'all' && (definitionItem.traitIds?.indexOf('inventory_filtering.quest') > -1 || definitionItem.traitIds?.indexOf('inventory_filtering.quest.featured') > -1)) {
        return true;
      }

      return false;
    });

    const items = orderBy(this.getItems(filtered), [(item) => item.sorts[variable], (item) => item.sorts.timestampExpiry, (item) => item.sorts.name], [order, 'desc', 'asc']);
    const newLight = inventory.filter((item) => {
      const definitionItem = manifest.DestinyInventoryItemDefinition[item.itemHash];

      if (!definitionItem) return false;

      // milestone-lookin' quest steps
      if (definitionItem.inventory?.bucketTypeHash === 1801258597) return false;

      if (definitionItem.traitIds?.indexOf('quest.new_light') > -1) {
        return true;
      }

      return false;
    }).length;

    const inspect = variable && filter !== 'bounties' && items.find((item) => item.itemHash === +variable);

    return (
      <>
        <div className={cx('view', filter, { inspect: inspect, 'has-preview': questFilters(filter).preview && !inspect })} id='quests'>
          <div className='filter background' />
          <div className='module views'>
            <ul className='list'>
              <li className='linked'>
                <div className='icon'>{questFilters('bounties').displayProperties.icon}</div>
                <ProfileNavLink to='/quests' isActive={navLinkBountiesIsActive} />
              </li>
              {newLight > 0 ? (
                <li className='linked'>
                  <div className='icon'>{questFilters('new-light').displayProperties.icon}</div>
                  <ProfileNavLink to='/quests/new-light' />
                </li>
              ) : null}
              <li className='linked'>
                <div className='icon quest'>{questFilters('all').displayProperties.icon}</div>
                <ProfileNavLink to={`/quests/all${filter === 'all' && !this.props.match.params.order && !inspect ? '/objectives/desc' : ''}`} isActive={navLinkQuestsAllIsActive} />
              </li>
              <li className='linked'>
                <div className='icon'>{questFilters('seasonal').displayProperties.icon}</div>
                <ProfileNavLink to='/quests/seasonal' />
              </li>
              <li className='linked'>
                <div className='icon'>{questFilters('expansion').displayProperties.icon}</div>
                <ProfileNavLink to='/quests/expansion' />
              </li>
              <li className='linked'>
                <div className='icon'>{questFilters('playlists').displayProperties.icon}</div>
                <ProfileNavLink to='/quests/playlists' />
              </li>
              <li className='linked'>
                <div className='icon'>{questFilters('exotics').displayProperties.icon}</div>
                <ProfileNavLink to='/quests/exotics' />
              </li>
              <li className='linked'>
                <div className='icon'>{questFilters('past').displayProperties.icon}</div>
                <ProfileNavLink to='/quests/past' />
              </li>
            </ul>
          </div>
          <div className='content'>
            {inspect ? (
              <QuestLine item={inspect} />
            ) : (
              <div className={cx('module', 'items', { quests: filter !== 'bounties' })}>
                <div className='module filter inline-description'>
                  <div className='text'>
                    <div className='name'>{questFilters(filter).displayProperties.name}</div>
                    <div className='quantity'>
                      <span>{filtered.length > 0 ? <>1-{filtered.length}</> : <>0</>}</span> / {context.length}
                    </div>
                  </div>
                </div>
                {filter === 'bounties' ? (
                  viewport.width > 1023 ? (
                    items.length ? (
                      <ul className='list bounties'>
                        <li className='header'>
                          <ul>
                            <li className={cx('col', 'bounty-item', 'no-sort')} />
                            <li className={cx('col', 'bounty-text', { sort: variable === 'name' })}>
                              <div className='full'>{t('Name')}</div>
                              <ProfileLink to={`/quests/bounties/name/${order === 'asc' ? 'desc' : 'asc'}`} />
                            </li>
                            <li className={cx('col', 'objectives', { sort: variable === 'objectives' })}>
                              <div className='full'>{t('Objectives')}</div>
                              <ProfileLink to={`/quests/bounties/objectives/${variable !== 'objectives' ? 'desc' : order === 'asc' ? 'desc' : 'asc'}`} />
                            </li>
                            <li className={cx('col', 'reward-items', 'no-sort')}>
                              <div className='full'>{t('Rewards')}</div>
                            </li>
                            <li className={cx('col', 'expires', { sort: variable === 'timestampExpiry' })}>
                              <div className='full'>{t('Expiry')}</div>
                              <ProfileLink to={`/quests/bounties/timestampExpiry/${order === 'asc' ? 'desc' : 'asc'}`} />
                            </li>
                          </ul>
                        </li>
                        {items.map((item) => item.element)}
                      </ul>
                    ) : (
                      <div className='info'>
                        <p>{t('Bounties you acquire will appear here.')}</p>
                      </div>
                    )
                  ) : items.length ? (
                    <ul className='list inventory-items'>{items.map((item) => item.element)}</ul>
                  ) : (
                    <div className='info'>
                      <p>{t('Bounties you acquire will appear here.')}</p>
                    </div>
                  )
                ) : items.length ? (
                  <ul className='list quests'>{items.map((item) => item.element)}</ul>
                ) : (
                  <div className='info'>
                    <p>{t('Quests you acquire will appear here.')}</p>
                  </div>
                )}
              </div>
            )}
            {!inspect && filter !== 'bounties' && viewport.width > 1024 && questFilters(filter).preview ? (
              <div className='module filter description'>
                <div className='preview'>
                  <ObservedImage src={questFilters(filter).preview} />
                </div>
                <div className='text'>
                  <div className='name'>{questFilters(filter).displayProperties.name}</div>
                  <div className='description'>{questFilters(filter).displayProperties.description}</div>
                </div>
                <div className='corners large b' />
              </div>
            ) : null}
          </div>
          {!inspect ? (
            <div className='inventory-capacity'>
              <span>{total.length} / 63</span>
              {t('Total Quest and Bounty Capacity')}
            </div>
          ) : null}
        </div>
        {inspect ? (
          <div className='sticky-nav'>
            <div className='wrapper'>
              <div />
              <ul>
                <li>
                  <ProfileLink className='button' to={`/quests/${filter}`}>
                    <DestinyKey type='dismiss' />
                    {t('Back')}
                  </ProfileLink>
                </li>
              </ul>
            </div>
          </div>
        ) : null}
      </>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    auth: state.auth,
    viewport: state.viewport,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    rebindTooltips: () => {
      dispatch({ type: 'TOOLTIPS_REBIND' });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Quests);
