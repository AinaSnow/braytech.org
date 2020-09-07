import React from 'react';
import { connect } from 'react-redux';
import { orderBy } from 'lodash';
import cx from 'classnames';

import { t, fromNow } from '../../utils/i18n';
import * as enums from '../../utils/destinyEnums';
import * as utils from '../../utils/destinyUtils';
import { classHashToIcon } from '../../utils/destinyConverters';
import { ProfileLink } from '../../components/ProfileLink';
import getGroupMembers from '../../utils/getGroupMembers';
import MemberLink from '../MemberLink';

import './styles.css';

class Roster extends React.Component {
  state = {
    order: {
      sort: false,
      dir: 'desc',
    },
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
    const { member, auth, groupMembers } = this.props;
    const isAuthed = auth && auth.destinyMemberships && auth.destinyMemberships.find((m) => m.membershipId === member.membershipId);

    const now = new Date().getTime();

    if (!groupMembers.loading && this.props.member.data.groups.clan && (now - groupMembers.lastUpdated > 30000 || this.props.member.data.groups.clan.groupId !== groupMembers.groupId)) {
      await getGroupMembers(this.props.member.data.groups.clan, this.props.member.data.groups.clan.self.memberType > 2 && isAuthed);
    }
  };

  startInterval() {
    this.refreshClanDataInterval = window.setInterval(this.callGetGroupMembers, 60000);
  }

  clearInterval() {
    window.clearInterval(this.refreshClanDataInterval);
  }

  handler_changeSortTo = ({ sort, dir }) => (e) => {
    this.setState((p) => ({
      order: {
        dir: (dir && dir !== p.order.dir && dir) || (p.order.sort === sort && p.order.dir === 'desc' ? 'asc' : 'desc'),
        sort,
      },
    }));
  };

  createRow = (m) => {
    const isPrivate = !m.profile || !m.profile.characterActivities.data || !m.profile.characters.data.length;
    const isSelf = !isPrivate ? m.profile.profile.data.userInfo.membershipType.toString() === this.props.member.membershipType && m.profile.profile.data.userInfo.membershipId === this.props.member.membershipId : false;

    const characterIds = !isPrivate ? m.profile.characters.data.map((c) => c.characterId) : [];

    const lastActivities = utils.lastPlayerActivity(m);
    const { characterId: lastCharacterId, lastPlayed, lastActivity, lastActivityString, lastMode } = orderBy(lastActivities, [(a) => a.lastPlayed], ['desc'])[0];

    const lastCharacter = !isPrivate ? m.profile.characters.data.find((c) => c.characterId === lastCharacterId) : false;

    const LastClassIcon = !isPrivate ? classHashToIcon(lastCharacter.classHash) : null;

    const weeklyXp = !isPrivate
      ? characterIds.reduce((currentValue, characterId) => {
          let characterProgress = m.profile.characterProgressions.data[characterId].progressions[540048094].weeklyProgress || 0;
          return characterProgress + currentValue;
        }, 0)
      : 0;

    const seasonRank = !isPrivate ? utils.progressionSeasonRank({ characterId: m.profile.characters.data[0].characterId, data: m }).level : 0;

    const triumphScore = !isPrivate ? m.profile.profileRecords.data.score : 0;

    let valorPoints = !isPrivate ? m.profile.characterProgressions.data[m.profile.characters.data[0].characterId].progressions[2626549951].currentProgress : 0;
    let valorResets = !isPrivate ? utils.calculateResets(3882308435, m.profile.characters.data[0].characterId, m.profile.characterProgressions.data, m.profile.characterRecords.data, m.profile.profileRecords.data.records).resetsTotal : 0;
    let gloryPoints = !isPrivate ? m.profile.characterProgressions.data[m.profile.characters.data[0].characterId].progressions[2000925172].currentProgress : 0;
    let infamyPoints = !isPrivate ? m.profile.characterProgressions.data[m.profile.characters.data[0].characterId].progressions[2772425241].currentProgress : 0;
    let infamyResets = !isPrivate ? utils.calculateResets(2772425241, m.profile.characters.data[0].characterId, m.profile.characterProgressions.data, m.profile.characterRecords.data, m.profile.profileRecords.data.records).resetsTotal : 0;

    const totalValor = utils.totalValor();
    const totalInfamy = utils.totalInfamy();

    valorPoints = valorResets * totalValor + valorPoints;
    infamyPoints = infamyResets * totalInfamy + infamyPoints;

    if (m.isOnline || m.destinyUserInfo?.membershipId === '4611686018449662397') {
      // console.log(m);
      // console.log(lastCharacterId, lastPlayed, lastActivity, lastActivityString, lastMode);
    }
    
    return {
      sorts: {
        private: isPrivate,
        isOnline: m.isOnline,
        fireteamId: m.fireteamId,
        displayName: m.destinyUserInfo?.LastSeenDisplayName?.toLowerCase(),
        lastPlayed,
        lastCharacter,
        triumphScore,
        gloryPoints,
        valorPoints,
        infamyPoints,
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
              {!isPrivate ? (
                <>
                  <li className='col last'>
                    <div className={cx('icon', 'character', enums.CLASS_STRINGS[lastCharacter.classType])}>
                      <LastClassIcon />
                    </div>
                    <div className={cx('icon', 'light', { 'max-ish': lastCharacter.light >= 1000, max: lastCharacter.light >= 1010 })}>{lastCharacter.light}</div>
                    <div className='icon season-rank'>{seasonRank}</div>
                  </li>
                  <li className={cx('col', 'activity', { display: m.isOnline && lastActivityString })}>
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
                  <li className='col triumph-score'>{triumphScore.toLocaleString()}</li>
                  <li className='col progression glory'>{gloryPoints.toLocaleString()}</li>
                  <li className='col progression valor'>
                    {valorPoints.toLocaleString()} {valorResets ? <div className='resets'>({valorResets})</div> : null}
                  </li>
                  <li className='col progression infamy'>
                    {infamyPoints.toLocaleString()} {infamyResets ? <div className='resets'>({infamyResets})</div> : null}
                  </li>
                  <li className='col weekly-xp'>
                    <span>{weeklyXp.toLocaleString()}</span> / {(characterIds.length * 5000).toLocaleString()}
                  </li>
                </>
              ) : (
                <>
                  <li className='col last'>–</li>
                  <li className='col activity'>–</li>
                  <li className='col triumph-score'>–</li>
                  <li className='col glory'>–</li>
                  <li className='col valor'>–</li>
                  <li className='col infamy'>–</li>
                  <li className='col weekly-xp'>–</li>
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
    };
  };

  render() {
    const { groupMembers, mini, showOnline, filter } = this.props;

    let results = [...groupMembers.members];

    if (showOnline) {
      results = results.filter((r) => r.isOnline);
    }

    if (filter && filter === 'admins') {
      results = results.filter((m) => m.memberType > 2);
    }

    const fireteams = [];
    let roster = [];

    results
      .filter((r) => r.profile && r.profile.profileTransitoryData && r.profile.profileTransitoryData.data)
      .forEach((m, i) => {
        const membershipId = m.profile.profile.data.userInfo.membershipId;
        const transitory = m.profile.profileTransitoryData.data;

        const index = fireteams.findIndex((f) => f.members.find((m) => m.membershipId === membershipId));

        if (index < 0 && transitory.partyMembers.length > 1) {
          fireteams.push({
            id: i,
            currentActivity: transitory.currentActivity,
            members: transitory.partyMembers,
          });
        }
      });

    const order = this.state.order;

    if (!order.sort) {
      fireteams.forEach((f) => {
        const group = [];

        f.members.forEach((n) => {
          const m = results.find((m) => m.destinyUserInfo.membershipId === n.membershipId);

          if (!m) return;
          // they're not a clan member

          const isPrivate = !m.profile || !m.profile.characterActivities.data || !m.profile.characters.data.length;

          const fireteam = !isPrivate ? fireteams.find((f) => f.members.find((n) => n.membershipId === m.profile.profile.data.userInfo.membershipId)) : false;
          m.fireteamId = fireteam && fireteam.id;

          const row = this.createRow(m);

          group.push(row);
        });

        roster.push({
          isFireteam: true,
          sorts: {
            private: false,
            isOnline: true,
            fireteamId: f.id + 10,
            lastPlayed: f.currentActivity.startTime,
          },
          group,
        });
      });

      results
        .filter((r) => !fireteams.find((f) => f.members.find((n) => n.membershipId === r.destinyUserInfo.membershipId)))
        .forEach((m) => {
          const fireteam = fireteams.find((f) => f.members.find((n) => n.membershipId === m.destinyUserInfo.membershipId));
          m.fireteamId = fireteam && fireteam.id;

          const row = this.createRow(m);

          roster.push(row);
        });
    } else {
      results.forEach((m) => {
        const isPrivate = !m.profile || !m.profile.characterActivities.data || !m.profile.characters.data.length;

        const fireteam = !isPrivate ? fireteams.find((f) => f.members.find((n) => n.membershipId === m.profile.profile.data.userInfo.membershipId)) : false;
        m.fireteamId = fireteam && fireteam.id;

        const row = this.createRow(m);

        roster.push(row);
      });
    }

    if (order.sort === 'display-name') {
      roster = orderBy(roster, [(m) => m.sorts.private, (m) => m.sorts.displayName, (m) => m.sorts.lastPlayed], ['asc', order.dir, 'desc']);
    } else if (order.sort === 'last') {
      roster = orderBy(roster, [(m) => m.sorts.private, (m) => m.sorts.lastCharacter.light, (m) => m.sorts.lastPlayed], ['asc', order.dir, order.dir]);
    } else if (order.sort === 'triumph-score') {
      roster = orderBy(roster, [(m) => m.sorts.private, (m) => m.sorts.triumphScore, (m) => m.sorts.lastPlayed], ['asc', order.dir, 'desc']);
    } else if (order.sort === 'valor') {
      roster = orderBy(roster, [(m) => m.sorts.private, (m) => m.sorts.valorPoints, (m) => m.sorts.lastPlayed], ['asc', order.dir, 'desc']);
    } else if (order.sort === 'glory') {
      roster = orderBy(roster, [(m) => m.sorts.private, (m) => m.sorts.gloryPoints, (m) => m.sorts.lastPlayed], ['asc', order.dir, 'desc']);
    } else if (order.sort === 'infamy') {
      roster = orderBy(roster, [(m) => m.sorts.private, (m) => m.sorts.infamyPoints, (m) => m.sorts.lastPlayed], ['asc', order.dir, 'desc']);
    } else if (order.sort === 'weekly-xp') {
      roster = orderBy(roster, [(m) => m.sorts.private, (m) => m.sorts.weeklyXp, (m) => m.sorts.lastPlayed], ['asc', order.dir, 'desc']);
    } else {
      roster = orderBy(roster, [(m) => m.sorts.private, (m) => m.sorts.isOnline, (m) => m.sorts.lastPlayed, (m) => m.sorts.seasonRank], ['asc', 'desc', 'desc', 'desc']);
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
                <li className={cx('col', 'last', { sort: this.state.order.sort === 'last', asc: this.state.order.dir === 'asc' })} onClick={this.handler_changeSortTo({ sort: 'last' })}>
                  <div className='full'>{t('Last character')}</div>
                  <div className='abbr'>{t('Char')}</div>
                </li>
                <li className={cx('col', 'activity', { sort: !this.state.order.sort })} onClick={this.handler_changeSortTo({})}>
                  <div className='full'>{t('Last activity')}</div>
                  <div className='abbr'>{t('Activity')}</div>
                </li>
                <li className={cx('col', 'triumph-score', { sort: this.state.order.sort === 'triumph-score', asc: this.state.order.dir === 'asc' })} onClick={this.handler_changeSortTo({ sort: 'triumph-score' })}>
                  <div className='full'>{t('Triumph score')}</div>
                  <div className='abbr'>{t('T. Scr')}</div>
                </li>
                <li className={cx('col', 'glory', { sort: this.state.order.sort === 'glory', asc: this.state.order.dir === 'asc' })} onClick={this.handler_changeSortTo({ sort: 'glory' })}>
                  <div className='full'>{t('Glory')}</div>
                  <div className='abbr'>{t('Gly')}</div>
                </li>
                <li className={cx('col', 'valor', { sort: this.state.order.sort === 'valor', asc: this.state.order.dir === 'asc' })} onClick={this.handler_changeSortTo({ sort: 'valor' })}>
                  <div className='full'>{t('Valor (Resets)')}</div>
                  <div className='abbr'>{t('Vlr (R)')}</div>
                </li>
                <li className={cx('col', 'infamy', { sort: this.state.order.sort === 'infamy', asc: this.state.order.dir === 'asc' })} onClick={this.handler_changeSortTo({ sort: 'infamy' })}>
                  <div className='full'>{t('Infamy (Resets)')}</div>
                  <div className='abbr'>{t('Inf (R)')}</div>
                </li>
                <li className={cx('col', 'weekly-xp', { sort: this.state.order.sort === 'weekly-xp', asc: this.state.order.dir === 'asc' })} onClick={this.handler_changeSortTo({ sort: 'weekly-xp' })}>
                  <div className='full'>{t('Weekly Clan XP')}</div>
                  <div className='abbr'>{t('Clan XP')}</div>
                </li>
              </ul>
            </li>
          ),
        },
      });
    }

    if (mini && showOnline && groupMembers.members.filter((member) => member.isOnline).length < 1) {
      return (
        <div className='roster'>
          <div className='info'>{t("There's no one here right now.")}</div>
          <ProfileLink className='button' to='/clan/roster'>
            <div className='text'>{t('See full roster')}</div>
          </ProfileLink>
        </div>
      );
    } else {
      return (
        <>
          <ul className={cx('list', 'roster', { mini: mini })}>
            {mini
              ? this.props.limit
                ? roster.slice(0, this.props.limit).map((r) => {
                    if (r.isFireteam) {
                      return (
                        <li key={r.sorts.fireteamId} className='fireteam'>
                          <ul>{r.group.map((m) => m.el.mini)}</ul>
                        </li>
                      );
                    } else {
                      return r.el.mini;
                    }
                  })
                : roster.map((r) => {
                    if (r.isFireteam) {
                      return (
                        <li key={r.sorts.fireteamId} className='fireteam'>
                          <ul>{r.group.map((m) => m.el.mini)}</ul>
                        </li>
                      );
                    } else {
                      return r.el.mini;
                    }
                  })
              : roster.map((r) => {
                  if (r.isFireteam) {
                    return (
                      <li key={r.sorts.fireteamId} className='fireteam'>
                        <ul>{r.group.map((m) => m.el.full)}</ul>
                      </li>
                    );
                  } else {
                    return r.el.full;
                  }
                })}
          </ul>
          {mini ? (
            <ProfileLink className='button' to='/clan/roster'>
              <div className='text'>{t('See full roster')}</div>
            </ProfileLink>
          ) : null}
        </>
      );
    }
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
    rebindTooltips: (value) => {
      dispatch({ type: 'TOOLTIPS_REBIND', payload: new Date().getTime() });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Roster);
