import React from 'react';
import { connect } from 'react-redux';
import { orderBy } from 'lodash';
import cx from 'classnames';

import { t, fromNow } from '../../utils/i18n';
import * as enums from '../../utils/destinyEnums';
import * as utils from '../../utils/destinyUtils';
import { classHashToIcon, groupMemberTypeToString } from '../../utils/destinyConverters';
import * as bungie from '../../utils/bungie';
import { ProfileLink } from '../ProfileLink';
import getGroupMembers from '../../utils/getGroupMembers';
import MemberLink from '../MemberLink';
import Button from '../UI/Button';

import './styles.css';

class Actions extends React.Component {
  state = {
    frozen: false,
    primed: false,
  };

  memberRank = (membershipId, promote = false) => async (e) => {
    const { groupMembers } = this.props;

    let member = groupMembers.members.concat(groupMembers.pending).find((r) => r.destinyUserInfo.membershipId === membershipId);

    if (member) {
      this.setState((p) => ({
        ...p,
        frozen: true,
      }));

      let memberType = promote ? member.memberType + 1 : member.memberType - 1;

      const response = await bungie.EditGroupMembership(member.groupId, member.destinyUserInfo.membershipType, member.destinyUserInfo.membershipId, memberType);

      if (response && response.ErrorCode === 1) {
        member.memberType = memberType;

        // update parent component through state :s
        this.props.softUpdate();
      }

      this.setState((p) => ({
        ...p,
        frozen: false,
      }));
    }
  };

  memberKick = (membershipId) => async (e) => {
    const { groupMembers } = this.props;

    let member = groupMembers.members.concat(groupMembers.pending).find((r) => r.destinyUserInfo.membershipId === membershipId);

    if (member) {
      if (this.state.primed) {
        this.setState((p) => ({
          ...p,
          frozen: true,
        }));

        const response = await bungie.KickMember(member.groupId, member.destinyUserInfo.membershipType, member.destinyUserInfo.membershipId);

        if (response && response.ErrorCode === 1) {
          member.ignore = true;

          // update parent component through state :s
          this.props.softUpdate();
        }
        this.setState((p) => ({
          ...p,
          frozen: false,
          primed: false,
        }));
      } else {
        this.setState((p) => ({
          ...p,
          frozen: false,
          primed: true,
        }));
      }
    }
  };

  memberApprove = (membershipId) => async (e) => {
    const member = this.props.groupMembers.members.concat(this.props.groupMembers.pending).find((r) => r.destinyUserInfo.membershipId === membershipId);

    if (member) {
      this.setState((p) => ({
        ...p,
        frozen: true,
      }));

      const response = await bungie.ApprovePendingForList(member.groupId, {
        memberships: [
          {
            membershipType: member.destinyUserInfo.membershipType,
            membershipId: member.destinyUserInfo.membershipId,
            displayName: member.destinyUserInfo.displayName,
          },
        ],
        message: 'This is an approve member reasoning message',
      });
      if (response && response.ErrorCode === 1) {
        member.memberType = this.props.member.data.groups.clan.features.joinLevel;
        member.pending = false;

        this.props.softUpdate();
      }
      this.setState((p) => ({
        ...p,
        frozen: false,
      }));
    }
  };

  memberDeny = (membershipId) => async (e) => {
    const member = this.props.groupMembers.members.concat(this.props.groupMembers.pending).find((r) => r.destinyUserInfo.membershipId === membershipId);

    if (member) {
      this.setState((p) => ({
        ...p,
        frozen: true,
      }));

      const response = await bungie.DenyPendingForList(member.groupId, {
        memberships: [
          {
            membershipType: member.destinyUserInfo.membershipType,
            membershipId: member.destinyUserInfo.membershipId,
            displayName: member.destinyUserInfo.displayName,
          },
        ],
        message: 'This is a deny member reasoning message',
      });
      if (response && response.ErrorCode === 1) {
        member.pending = false;
        member.ignore = true;

        this.props.softUpdate();
      }

      this.setState((p) => ({
        ...p,
        frozen: false,
      }));
    }
  };

  memberBan = (membershipId) => async (e) => {
    const member = this.props.groupMembers.members.concat(this.props.groupMembers.pending).find((r) => r.destinyUserInfo.membershipId === membershipId);

    if (member) {
      if (this.state.primed) {
        this.setState((p) => ({
          ...p,
          frozen: true,
        }));

        const response = await bungie.BanMember(member.groupId, member.destinyUserInfo.membershipType, member.destinyUserInfo.membershipId);
        if (response && response.ErrorCode === 1) {
          member.pending = false;
          member.ignore = true;

          this.props.softUpdate();
        }
        this.setState((p) => ({
          ...p,
          frozen: false,
          primed: false,
        }));
      } else {
        this.setState((p) => ({
          ...p,
          frozen: false,
          primed: true,
        }));
      }
    }
  };

  render() {
    const { m: member, available } = this.props;

    if (member.pending) {
      return (
        <>
          <Button text={t('Approve')} disabled={this.state.frozen || !available} action={this.memberApprove(member.destinyUserInfo.membershipId)} />
          <Button text={t('Deny')} disabled={this.state.frozen || !available} action={this.memberDeny(member.destinyUserInfo.membershipId)} />
          <Button text={t('Ban')} className={cx({ primed: this.state.primed })} disabled={this.state.frozen || !available} action={this.memberBan(member.destinyUserInfo.membershipId)} />
        </>
      );
    } else {
      return (
        <>
          <Button text={t('Promote')} disabled={this.state.frozen || !available || member.memberType > 2} action={this.memberRank(member.destinyUserInfo.membershipId, true)} />
          <Button text={t('Demote')} disabled={this.state.frozen || !available || member.memberType > 3 || member.memberType === 1} action={this.memberRank(member.destinyUserInfo.membershipId, false)} />
          <Button text={t('Kick')} className={cx({ primed: this.state.primed })} disabled={this.state.frozen || !available || member.memberType === 5} action={this.memberKick(member.destinyUserInfo.membershipId)} />
        </>
      );
    }
  }
}

class DownloadData extends React.Component {
  state = {
    generated: false,
  };

  handler_generate = (e) => {
    const { groupMembers } = this.props;

    if (!groupMembers.members?.length) {
      return;
    }

    const members = groupMembers.members.map((m) => {
      const isPrivate = !m.profile || !m.profile.characterActivities.data || !m.profile.characters.data.length;

      const characterIds = !isPrivate ? m.profile.characters.data.map((c) => c.characterId) : [];

      const lastActivities = utils.lastPlayerActivity(m);
      const { characterId: lastCharacterId, lastPlayed, lastActivity, lastActivityString, lastMode } = orderBy(lastActivities, [(a) => a.lastPlayed], ['desc'])[0];

      const weeklyXp = !isPrivate
        ? characterIds.reduce((currentValue, characterId) => {
            let characterProgress = m.profile.characterProgressions.data[characterId].progressions[540048094].weeklyProgress || 0;
            return characterProgress + currentValue;
          }, 0)
        : 0;

      const seasonRank = !isPrivate ? utils.progressionSeasonRank({ characterId: m.profile.characters.data[0].characterId, data: m }).level : 0;

      const triumphScore = !isPrivate ? m.profile.profileRecords.data.score : 0;

      let valorPoints = !isPrivate ? m.profile.characterProgressions.data[m.profile.characters.data[0].characterId].progressions[2626549951].currentProgress : 0;
      let valorResets = !isPrivate ? utils.calculateResets(3882308435, m.profile.characters.data[0].characterId, m.profile.characterProgressions.data, m.profile.characterRecords.data, m.profile.profileRecords.data.records).total : 0;
      let gloryPoints = !isPrivate ? m.profile.characterProgressions.data[m.profile.characters.data[0].characterId].progressions[2000925172].currentProgress : 0;
      let infamyPoints = !isPrivate ? m.profile.characterProgressions.data[m.profile.characters.data[0].characterId].progressions[2772425241].currentProgress : 0;
      let infamyResets = !isPrivate ? utils.calculateResets(2772425241, m.profile.characters.data[0].characterId, m.profile.characterProgressions.data, m.profile.characterRecords.data, m.profile.profileRecords.data.records).total : 0;

      const preferredClass = !isPrivate ? m.profile.characters.data[0].classType : null;

      // required by CSV spec
      const displayName = `"${(m.destinyUserInfo.LastSeenDisplayName || m.destinyUserInfo.displayName).replace(/"/g, '""')}"`;

      return {
        isPrivate,
        membershipId: m.destinyUserInfo.membershipId,
        displayName,
        lastPlayed,
        preferredClass,
        joinDate: m.joinDate,
        weeklyClanXP: weeklyXp,
        seasonRank,
        triumphScore,
        glorySeason: gloryPoints,
        valorSeason: valorPoints,
        valorResets,
        infamySeason: infamyPoints,
        infamyResets,
      };
    });

    const keys = members && members.length && Object.keys(members[0]);
    const values = members.reduce((a, v) => {
      const values = v.isPrivate ? [true, v.membershipId, v.displayName, '', '', v.joinDate, '', '', '', '', '', '', '', ''] : Object.values(v);

      return [...a, values];
    }, []);

    const csv = `${keys.join(',')}\n${values.map((m) => `${m.join(',')}`).join(`\n`)}`;

    const url = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);

    this.setState({ generated: url });
  };

  componentDidUpdate(p, s) {
    if (p.groupMembers.lastUpdated !== this.props.groupMembers.lastUpdated) {
      this.handler_generate();
    }
  }

  componentDidMount() {
    this.handler_generate();
  }

  render() {
    const { groupMembers } = this.props;

    const buttonDisabled = !groupMembers.groupId || groupMembers.loading;
    const time = new Date().toISOString();

    return (
      <div className='download-data'>
        <a className={cx('button', { disabled: buttonDisabled })} href={this.state.generated || undefined} download={`Braytech-Clans_${groupMembers.groupId}_${time}.csv`}>
          <div className='text'>{t('Download roster data')}</div>
        </a>
      </div>
    );
  }
}

Actions = connect(mapStateToProps, mapDispatchToProps)(Actions);
DownloadData = connect(mapStateToProps, mapDispatchToProps)(DownloadData);

class RosterAdmin extends React.Component {
  state = {
    order: {
      sort: false,
      dir: 'desc',
    },
    softUpdate: new Date().getTime(),
  };

  componentDidMount() {
    this.mounted = true;

    if (this.props.member.data.groups.clan) {
      this.callGetGroupMembers();
      this.startInterval();
    }

    this.props.rebindTooltips();
  }

  componentWillUnmount() {
    this.mounted = false;

    this.clearInterval();
  }

  componentDidUpdate(p) {
    if (p.groupMembers.lastUpdated !== this.props.groupMembers.lastUpdated) {
      this.props.rebindTooltips();
    }
  }

  callGetGroupMembers = async () => {
    const now = new Date().getTime();

    if (!this.props.groupMembers.loading && this.props.member.data.groups.clan && (now - this.props.groupMembers.lastUpdated > 30000 || this.props.member.data.groups.clan.groupId !== this.props.groupMembers.groupId)) {
      await getGroupMembers(this.props.member.data.groups.clan, true);
    }
  };

  startInterval() {
    this.refreshClanDataInterval = window.setInterval(this.callGetGroupMembers, 60000);
  }

  clearInterval() {
    window.clearInterval(this.refreshClanDataInterval);
  }

  softUpdate = () => {
    this.setState({
      softUpdate: new Date().getTime(),
    });
  };

  handler_changeSortTo = ({ sort, dir }) => (e) => {
    this.setState((p) => ({
      order: {
        dir: (dir && dir !== p.order.dir && dir) || (p.order.sort === sort && p.order.dir === 'desc' ? 'asc' : 'desc'),
        sort,
      },
    }));
  };

  render() {
    const { member, auth, groupMembers, mini, showOnline = false } = this.props;

    const isAdmin =
      member.data.groups.results.find((group) => {
        const authed = auth.destinyMemberships.find((authMember) => authMember.membershipId === member.membershipId);

        if (group.member.memberType > 2 && authed && group.member.destinyUserInfo.membershipId === authed.membershipId) {
          return true;
        } else {
          return false;
        }
      }) || member.membershipId === '4611686018449662397';

    const results = showOnline ? groupMembers.members.filter((member) => member.isOnline) : groupMembers.members.concat(groupMembers.pending);

    let roster = [];

    results.forEach((m) => {
      if (m.ignore) {
        return;
      }

      const isPrivate = !m.profile || !m.profile.characterActivities.data || !m.profile.characters.data.length;
      const isSelf = !isPrivate ? m.profile.profile.data.userInfo.membershipType.toString() === member.membershipType && m.profile.profile.data.userInfo.membershipId === member.membershipId : false;

      const characterIds = !isPrivate ? m.profile.characters.data.map((c) => c.characterId) : [];

      const lastActivities = utils.lastPlayerActivity(m);
      const { characterId: lastCharacterId, lastPlayed, lastActivity, lastActivityString, lastMode } = orderBy(lastActivities, [(a) => a.lastPlayed], ['desc'])[0];
      
      const lastPlatform = m.destinyUserInfo.LastSeenDisplayNameType;

      const lastCharacter = !isPrivate ? m.profile.characters.data.find((c) => c.characterId === lastCharacterId) : false;

      const LastClassIcon = !isPrivate ? classHashToIcon(lastCharacter.classHash) : null;

      const weeklyXp = !isPrivate
        ? characterIds.reduce((currentValue, characterId) => {
            let characterProgress = m.profile.characterProgressions.data[characterId].progressions[540048094].weeklyProgress || 0;
            return characterProgress + currentValue;
          }, 0)
        : 0;

      const seasonRank = !isPrivate ? utils.progressionSeasonRank({ characterId: m.profile.characters.data[0].characterId, data: m }).level : 0;

      // if (m.isOnline) {
      //   console.log(lastPlayed);
      // }

      // if (m.destinyUserInfo.membershipId == '4611686018449662397') {
      //   console.log(m)
      // }

      roster.push({
        pending: m.pending,
        sorts: {
          private: isPrivate,
          isOnline: m.isOnline,
          displayName: m.destinyUserInfo?.LastSeenDisplayName?.toLowerCase(),
          joinDate: m.joinDate,
          lastPlayed,
          lastPlatform,
          lastActivity,
          lastCharacter: !isPrivate ? lastCharacter : false,
          weeklyXp: (weeklyXp / characterIds.length) * 5000,
          seasonRank,
          rank: m.memberType,
        },
        el: {
          full: (
            <li key={m.destinyUserInfo.membershipType + m.destinyUserInfo.membershipId} className={cx('row', { self: isSelf })}>
              <ul>
                <li className='col member'>
                  <MemberLink type={m.destinyUserInfo.membershipType} id={m.destinyUserInfo.membershipId} groupId={m.destinyUserInfo.groupId} displayName={m.destinyUserInfo.LastSeenDisplayName || m.destinyUserInfo.displayName} hideEmblemIcon={!m.isOnline} />
                </li>
                <li className='col last-platform'>{<div className={cx('icon', `braytech-platform_${enums.PLATFORM_STRINGS[lastPlatform]}`)} />}</li>
                {!isPrivate ? (
                  <>
                    <li className='col last-character'>
                      <div className={cx('icon', 'character', enums.CLASS_STRINGS[lastCharacter.classType])}>
                        <LastClassIcon />
                      </div>
                      <div className={cx('icon', 'light', { 'max-ish': lastCharacter.light >= 100, max: lastCharacter.light >= 1010 })}>{lastCharacter.light}</div>
                      <div className='icon season-rank'>{seasonRank}</div>
                    </li>
                    <li className={cx('col', 'last-activity', { display: m.isOnline && lastActivityString })}>
                      {m.isOnline && lastActivityString ? (
                        <div className='tooltip' data-type='activity' data-context='roster' data-hash={lastActivity.currentActivityHash} data-mode={lastActivity.currentActivityModeHash} data-playlist={lastActivity.currentPlaylistActivityHash} data-membershipid={m.destinyUserInfo?.membershipId}>
                          <div>
                            {lastActivityString}
                            <span>{fromNow(lastPlayed, true)}</span>
                          </div>
                        </div>
                      ) : (
                        <div>{fromNow(lastPlayed, true)}</div>
                      )}
                    </li>
                    <li className='col join-date'>{!m.pending ? fromNow(m.joinDate, true) : null}</li>
                    <li className='col weekly-xp'>
                      <span>{weeklyXp.toLocaleString()}</span> / {(characterIds.length * 5000).toLocaleString()}
                    </li>
                    <li className='col rank'>{m.memberType && groupMemberTypeToString(m.memberType)}</li>
                    <li className='col actions'>
                      <Actions m={m} softUpdate={this.softUpdate} available={isAdmin} />
                    </li>
                  </>
                ) : (
                  <>
                    <li className='col last-character'>–</li>
                    <li className='col last-activity'>–</li>
                    <li className='col join-date'>–</li>
                    <li className='col weekly-xp'>–</li>
                    <li className='col rank'>{m.memberType && groupMemberTypeToString(m.memberType)}</li>
                    <li className='col actions'>
                      <Actions m={m} softUpdate={this.softUpdate} available={isAdmin} />
                    </li>
                  </>
                )}
              </ul>
            </li>
          ),
          mini: (
            <li key={m.destinyUserInfo.membershipType + m.destinyUserInfo.membershipId} className='row'>
              <ul>
                <li className='col member'>
                  <MemberLink type={m.destinyUserInfo.membershipType} id={m.destinyUserInfo.membershipId} groupId={m.destinyUserInfo.groupId} displayName={m.destinyUserInfo.displayName} hideEmblemIcon={!m.isOnline} />
                </li>
              </ul>
            </li>
          ),
        },
      });
    });

    let order = this.state.order;

    if (order.sort === 'display-name') {
      roster = orderBy(roster, [(m) => m.sorts.private, (m) => m.sorts.displayName, (m) => m.sorts.lastPlayed], ['asc', order.dir, 'desc']);
    } else if (order.sort === 'last-platform') {
      roster = orderBy(roster, [(m) => m.sorts.private, (m) => m.sorts.lastPlatform, (m) => m.sorts.lastPlayed], ['asc', order.dir, 'desc']);
    } else if (order.sort === 'last-character') {
      roster = orderBy(roster, [(m) => m.sorts.private, (m) => m.sorts.lastCharacter.light, (m) => m.sorts.lastPlayed], ['asc', order.dir, order.dir]);
    } else if (order.sort === 'join-date') {
      roster = orderBy(roster, [(m) => m.sorts.private, (m) => m.sorts.joinDate, (m) => m.sorts.lastPlayed], ['asc', order.dir, 'desc']);
    } else if (order.sort === 'weekly-xp') {
      roster = orderBy(roster, [(m) => m.sorts.private, (m) => m.sorts.weeklyXp, (m) => m.sorts.lastPlayed], ['asc', order.dir, 'desc']);
    } else if (order.sort === 'rank') {
      roster = orderBy(roster, [(m) => m.sorts.private, (m) => m.sorts.rank, (m) => m.sorts.lastPlayed], ['asc', order.dir, 'desc']);
    } else {
      roster = orderBy(roster, [(m) => m.sorts.private, (m) => m.sorts.isOnline, (m) => m.sorts.lastActivity, (m) => m.sorts.lastPlayed, (m) => m.sorts.seasonRank], ['asc', 'desc', 'desc', 'desc', 'desc']);
    }

    if (!mini && roster.length) {
      roster.unshift({
        sorts: {},
        el: {
          full: (
            <li key='header-row' className='row header'>
              <ul>
                <li className={cx('col', 'display-name', { sort: this.state.order.sort === 'display-name', asc: this.state.order.dir === 'asc' })} onClick={this.handler_changeSortTo({ sort: 'display-name', dir: 'asc' })}>
                  <div className='full'>{t('Display name')}</div>
                  <div className='abbr'>{t('Name')}</div>
                </li>
                <li className={cx('col', 'last-platform', { sort: this.state.order.sort === 'last-platform' })} onClick={this.handler_changeSortTo({ sort: 'last-platform' })}>
                  <div className='full'>{t('Platform')}</div>
                  <div className='abbr'>{t('Plat')}</div>
                </li>
                <li className={cx('col', 'last-character', { sort: this.state.order.sort === 'last-character', asc: this.state.order.dir === 'asc' })} onClick={this.handler_changeSortTo({ sort: 'last-character' })}>
                  <div className='full'>{t('Last character')}</div>
                  <div className='abbr'>{t('Char')}</div>
                </li>
                <li className={cx('col', 'activity', { sort: !this.state.order.sort })} onClick={this.handler_changeSortTo({})}>
                  <div className='full'>{t('Last activity')}</div>
                  <div className='abbr'>{t('Activity')}</div>
                </li>
                <li className={cx('col', 'join-date', { sort: this.state.order.sort === 'join-date', asc: this.state.order.dir === 'asc' })} onClick={this.handler_changeSortTo({ sort: 'join-date' })}>
                  <div className='full'>{t('Joined')}</div>
                  <div className='abbr'>{t('Jind')}</div>
                </li>
                <li className={cx('col', 'weekly-xp', { sort: this.state.order.sort === 'weekly-xp', asc: this.state.order.dir === 'asc' })} onClick={this.handler_changeSortTo({ sort: 'weekly-xp' })}>
                  <div className='full'>{t('Weekly Clan XP')}</div>
                  <div className='abbr'>{t('Clan XP')}</div>
                </li>
                <li className={cx('col', 'rank', { sort: this.state.order.sort === 'rank', asc: this.state.order.dir === 'asc' })} onClick={this.handler_changeSortTo({ sort: 'rank' })}>
                  <div className='full'>{t('Rank')}</div>
                  <div className='abbr'>{t('Rank')}</div>
                </li>
                <li className='col actions no-sort' />
              </ul>
            </li>
          ),
        },
      });
    }

    return (
      <>
        {!mini && roster.filter((m) => m.pending).length ? <ul className={cx('list', 'roster', 'admin', 'pending')}>{roster.filter((m) => m.pending).map((m) => m.el.full)}</ul> : null}
        <ul className={cx('list', 'roster', 'admin', { mini: mini })}>
          {mini
            ? this.props.limit
              ? roster
                  .filter((m) => !m.pending)
                  .slice(0, this.props.limit)
                  .map((m) => m.el.mini)
              : roster.filter((m) => !m.pending).map((m) => m.el.mini)
            : roster.filter((m) => !m.pending).map((m) => m.el.full)}
        </ul>
        {!mini && roster.length > 0 && <DownloadData />}
        {mini ? (
          <ProfileLink className='button' to='/clan/roster'>
            <div className='text'>{t('See full roster')}</div>
          </ProfileLink>
        ) : null}
      </>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    auth: state.auth,
    groupMembers: state.groupMembers,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    pushNotification: (value) => {
      dispatch({ type: 'NOTIFICATIONS_PUSH', payload: value });
    },
    markStale: (member) => {
      dispatch({ type: 'MEMBER_IS_STALE', payload: { membershipType: member.membershipType, membershipId: member.membershipId } });
    },
    rebindTooltips: (value) => {
      dispatch({ type: 'TOOLTIPS_REBIND', payload: new Date().getTime() });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RosterAdmin);
