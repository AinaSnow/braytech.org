import React from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';

import { t } from '../../utils/i18n';
import { enumerateRecordState } from '../../utils/destinyEnums';

import { ProfileLink } from '../../components/ProfileLink';

import Records from '../Records';

export default function RecordsTracked({ limit, ...props }) {
  const settings = useSelector((state) => state.settings);
  const member = useSelector((state) => state.member);

  const characterRecords = member.data.profile.characterRecords.data;
  const profileRecords = member.data.profile.profileRecords.data.records;
  const profileRecordsTracked = member && member.data.profile.profileRecords.data.trackedRecordHash ? [member.data.profile.profileRecords.data.trackedRecordHash] : [];

  const hashes = settings.triumphs.tracked
    .concat(profileRecordsTracked)
    .reduce((array, hash) => {
      if (array.indexOf(hash) === -1) {
        array.push(hash);
      }
      return array;
    }, [])
    .filter((hash) => {
      let state;
      if (profileRecords[hash]) {
        state = profileRecords[hash] ? profileRecords[hash].state : 0;
      } else if (characterRecords[member.characterId].records[hash]) {
        state = characterRecords[member.characterId].records[hash] ? characterRecords[member.characterId].records[hash].state : 0;
      } else {
        state = 0;
      }

      return !enumerateRecordState(state).RecordRedeemed && enumerateRecordState(state).ObjectiveNotCompleted;
    });

  return (
    <>
      <ul className={cx('list record-items')}>
        <Records hashes={hashes} ordered='progress' limit={limit} selfLinkFrom={props.selfLinkFrom} />
        {hashes.length < 1 ? (
          <li key='none-tracked' className='none-tracked'>
            <div className='text'>{t("You aren't tracking any records yet!")}</div>
          </li>
        ) : null}
      </ul>
      {props.pageLink && hashes.length > 0 ? (
        <ProfileLink className='button' to={{ pathname: '/triumphs/tracked', state: { from: '/triumphs' } }}>
          <div className='text'>{t('See all tracked')}</div>
        </ProfileLink>
      ) : null}
    </>
  );
}
