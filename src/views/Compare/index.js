import React from 'react';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { orderBy } from 'lodash';
import ReactMarkdown from 'react-markdown';
import queryString from 'query-string';
import cx from 'classnames';

import manifest from '../../utils/manifest';
import * as enums from '../../utils/destinyEnums';
import { DestinyKey } from '../../components/UI/Button';

import AddPlayer from './AddPlayer';
import PlayerHistory from './PlayerHistory';

import './styles.css';

function getItemsPerPage(width) {
  if (width >= 1600) return 5;
  if (width >= 1400) return 4;
  if (width >= 1024) return 3;
  if (width >= 768) return 2;
  if (width < 768) return 1;
  return 1;
}

class Compare extends React.Component {
  state = {};

  handler_addPlayer = (membershipType, membershipId) => {
    if (this.mounted) {
      this.setState(p => ({
        ...p,
        members: [
          ...p.members,
          {
            membershipType,
            membershipId
          }
        ]
      }));
    }
  };

  handler_removePlayer = membershipId => e => {
    if (this.mounted) {
      this.setState(p => ({
        ...p,
        members: p.members.filter(m => m.membershipId !== membershipId)
      }));
    }
  };

  componentDidMount() {
    this.mounted = true;

    window.scrollTo(0, 0);
    this.props.rebindTooltips();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { t, viewport, member, location, match } = this.props;
    const object = match.params?.object;
    const query = queryString.parse(location.search);
    const members =
      query.members?.split('|').map(m => {
        const pizza = m.split(':');

        return {
          membershipType: pizza[0],
          membershipId: pizza[1]
        };
      }) || [];

    const itemsPerPage = getItemsPerPage(viewport.width);

    if (['nightfalls', 'nightmare-hunts'].includes(object)) {
      let name = t('Nightfalls');
      let mode = '46';
      let activityDisplayHashes = orderBy(Object.keys(enums.nightfalls), [key => enums.nightfalls[key].sort], ['asc']);
      if (object === 'nightmare-hunts') {
        name = t('Nightmare Hunts');
        mode = '79';
        activityDisplayHashes = enums.nightmareHunts.map(a => orderBy(a.activities, [hash => manifest.DestinyActivityDefinition[hash].activityLightLevel], ['desc'])?.[0]);
      }

      return (
        <>
          <div className={cx('view', object)} id='compare'>
            <div className='module head'>
              <div className='page-header'>
                <div className='sub-name'>{t('Compare')}</div>
                <div className='name'>{name}</div>
              </div>
            </div>
            <div className={cx('buff', 'cols-' + itemsPerPage)}>
              <div className='data'>
                <div className='column activities'>
                  <ul className='list member'>
                    <li />
                  </ul>
                  <ul className='list'>
                    {activityDisplayHashes.map(key => (
                      <li key={key} className='row'>
                        {object === 'nightmare-hunts' ? (
                          <div className='text tooltip' data-hash={key} data-type='activity'>
                            {manifest.DestinyActivityDefinition[key].originalDisplayProperties.name.replace('Nightmare Hunt: ', '')}
                          </div>
                        ) : (
                          <div className='text tooltip' data-hash={key} data-type='activity'>
                            {manifest.DestinyActivityDefinition[key].selectionScreenDisplayProperties.name}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                  <ul className='list sums'>
                    <li className='row'>
                      <div className='text'>{t('Total duration')}</div>
                    </li>
                    {object === 'nightfalls' ? (
                      <li className='row'>
                        <div className='text tooltip' data-hash='1987790789'>
                          {t('{{object}} duration', { object: manifest.DestinyCollectibleDefinition[319846607].displayProperties.name })}
                        </div>
                      </li>
                    ) : null}
                  </ul>
                </div>
                {members.map(m => (
                  <PlayerHistory key={m.membershipId} {...m} order={activityDisplayHashes} action={this.handler_removePlayer} query={members} mode={mode} />
                ))}
                {members.length < itemsPerPage ? <AddPlayer action={this.handler_addPlayer} query={members} /> : null}
              </div>
            </div>
          </div>
          <div className='sticky-nav'>
            <div className='wrapper'>
              <div />
              <ul>
                <li>
                  <Link className='button' to='/compare'>
                    <DestinyKey type='dismiss' />
                    {t('Back')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </>
      );
    } else {
      return (
        <div className='view' id='compare'>
          <div className='module head'>
            <div className='page-header'>
              <div className='name'>{t('Compare')}</div>
            </div>
          </div>
          <div className='buff'>
            <div className='module'>
              <h3>{t('Nightfalls')}</h3>
              <ReactMarkdown className='text' source={t('Compare Nightfall strike activity durations between players for bragging rights and to track progress towards the _{{emblemName}}_ emblem.', { emblemName: manifest.DestinyCollectibleDefinition[319846607].displayProperties.name })} />
              <Link className='button' to={member.membershipId ? `/compare/nightfalls?members=${member.membershipType}:${member.membershipId}` : `/compare/nightfalls`}>
                <div className='text'>{t('Compare Nightfalls')}</div>
              </Link>
            </div>
            <div className='module'>
              <h3>{t('Nightmare Hunts')}</h3>
              <ReactMarkdown className='text' source={t('Compare Nightmare Hunt activity durations between players for bragging rights and to track progress towards their respective time trial triumph records.')} />
              <Link className='button' to={member.membershipId ? `/compare/nightmare-hunts?members=${member.membershipType}:${member.membershipId}` : `/compare/nightmare-hunts`}>
                <div className='text'>{t('Compare Nightmare Hunts')}</div>
              </Link>
            </div>
          </div>
        </div>
      );
    }
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    viewport: state.viewport
  };
}

function mapDispatchToProps(dispatch) {
  return {
    rebindTooltips: value => {
      dispatch({ type: 'TOOLTIPS_REBIND', payload: new Date().getTime() });
    }
  };
}

export default compose(connect(mapStateToProps, mapDispatchToProps), withTranslation())(Compare);
