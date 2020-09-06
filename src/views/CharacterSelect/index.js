import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';

import actions from '../../store/actions';
import ls from '../../utils/localStorage';
import { t } from '../../utils/i18n';
import { PLATFORM_STRINGS } from '../../utils/destinyEnums';

import Spinner from '../../components/UI/Spinner';
import { BungieAuthMini } from '../../components/BungieAuth';
import ProfileSearch from '../../components/ProfileSearch';

import { Common } from '../../svg';

import './styles.css';

import ProfileError from './ProfileError';
import Profile from './Profile';

export default function CharacterSelect() {
  const dispatch = useDispatch();
  const viewport = useSelector((state) => state.viewport);
  const member = useSelector((state) => state.member);

  const reverseUI = viewport.width <= 600;
  const savedProfile = ls.get('setting.profile') || {};

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handler_clickCharacter = (characterId) => (event) => {
    dispatch(actions.member.setCharacterID({ membershipType: member.membershipType, membershipId: member.membershipId, characterId }));

    ls.set('setting.profile', { membershipType: member.membershipType, membershipId: member.membershipId, characterId });
  };

  const handler_clickProfile = (membershipType, membershipId, displayName) => async (event) => {
    window.scrollTo(0, 0);

    dispatch(actions.member.load({ membershipType, membershipId }));

    if (displayName) {
      dispatch(actions.member.pushHistory({ membershipType, membershipId, displayName }));
    }
  };

  const resultsListItems = (profiles) =>
    profiles.map((profile, p) => (
      <li key={p} className='linked' onClick={handler_clickProfile(profile.membershipType, profile.membershipId, profile.displayName)}>
        <div className={cx('icon', `braytech-platform_${PLATFORM_STRINGS[profile.membershipType]}`)} />
        <div className='displayName'>{profile.displayName}</div>
      </li>
    ));

  const profileCharacterSelect = member.loading ? (
    <Spinner />
  ) : member.data && member.characterId ? (
    <>
      <div className='sub-header'>
        <div>{member && member.membershipId === savedProfile.membershipId ? t('CharacterSelect.SavedProfile') : t('CharacterSelect.ActiveProfile')}</div>
      </div>
      {member.data && <Profile member={member} onClickCharacter={handler_clickCharacter} />}
    </>
  ) : (
    false
  );

  return (
    <div className={cx('view', { loading: member.loading })} id='character-select'>
      <div className='module head'>
        <div className='page-header'>
          <div className='name'>{t('Character select')}</div>
        </div>
      </div>
      <div className='padder'>
        <div className='device'>
          <Common.Braytech />
        </div>
        {reverseUI && profileCharacterSelect && !(member.error && !member.error.recoverable) ? <div className='module profile'>{profileCharacterSelect}</div> : null}
        <div className='module search'>
          <div className='sub-header'>
            <div>{t('Bungie.net profile')}</div>
          </div>
          <BungieAuthMini />
          {member.error && <ProfileError error={member.error} />}
          <ProfileSearch resultsListItems={resultsListItems} />
        </div>
        {!reverseUI && profileCharacterSelect && !(member.error && !member.error.recoverable) ? <div className='module profile'>{profileCharacterSelect}</div> : null}
      </div>
    </div>
  );
}
