import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

import { t } from '../../utils/i18n';
import ls from '../../utils/localStorage';
import * as enums from '../../utils/destinyEnums';
import Spinner from '../../components/UI/Spinner';
import { BungieAuthMini } from '../../components/BungieAuth';
import ProfileSearch from '../../components/ProfileSearch';
import { Common } from '../../svg';

import ProfileError from './ProfileError';
import Profile from './Profile';

import './styles.css';

class CharacterSelect extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  handler_clickCharacter = (characterId) => (e) => {
    const { membershipType, membershipId } = this.props.member;

    this.props.setMemberCharacterId({ membershipType, membershipId, characterId });

    ls.set('setting.profile', { membershipType, membershipId, characterId });
  };

  handler_clickProfile = (membershipType, membershipId, displayName) => async (e) => {
    window.scrollTo(0, 0);

    this.props.setMember({ membershipType, membershipId });

    if (displayName) {
      ls.update('history.profiles', { membershipType, membershipId, displayName }, true, 9);
    }
  };

  resultsListItems = (profiles) =>
    profiles.map((profile, p) => (
      <li key={p} className='linked' onClick={this.handler_clickProfile(profile.membershipType, profile.membershipId, profile.displayName)}>
        <div className={cx('icon', `braytech-platform_${enums.PLATFORM_STRINGS[profile.membershipType]}`)} />
        <div className='displayName'>{profile.displayName}</div>
      </li>
    ));

  render() {
    const { member, viewport, location } = this.props;
    const { error, loading } = member;

    const reverseUI = viewport.width <= 600;

    const savedProfile = ls.get('setting.profile') || {};

    const profileCharacterSelect = loading ? (
      <Spinner />
    ) : member.data && member.characterId ? (
      <>
        <div className='sub-header'>
          <div>{t(member && member.membershipId === savedProfile.membershipId ? 'Saved profile' : 'Active profile')}</div>
        </div>
        {member.data && <Profile member={member} onClickCharacter={this.handler_clickCharacter} location={location} />}
      </>
    ) : (
      false
    );

    return (
      <div className={cx('view', { loading })} id='character-select'>
        <div className='module head'>
          <div className='page-header'>
            <div className='name'>{t('Character Select')}</div>
          </div>
        </div>
        <div className='padder'>
          <div className='device'>
            <Common.Braytech />
          </div>
          {reverseUI && profileCharacterSelect && !(error && !error.recoverable) ? <div className='module profile'>{profileCharacterSelect}</div> : null}
          <div className='module search'>
            {error && <ProfileError error={error} />}
            <div className='sub-header'>
              <div>{t('Bungie.net profile')}</div>
            </div>
            <BungieAuthMini />
            <ProfileSearch resultsListItems={this.resultsListItems} />
          </div>
          {!reverseUI && profileCharacterSelect && !(error && !error.recoverable) ? <div className='module profile'>{profileCharacterSelect}</div> : null}
        </div>
      </div>
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
    setMember: (value) => {
      dispatch({ type: 'MEMBER_LOAD_MEMBERSHIP', payload: value });
    },
    setMemberCharacterId: (value) => {
      dispatch({ type: 'MEMBER_SET_CHARACTERID', payload: value });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CharacterSelect);
