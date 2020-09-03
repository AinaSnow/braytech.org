import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';

import { t } from '../../../utils/i18n';

import { NoAuth } from '../../../components/BungieAuth';
import RosterAdmin from '../../../components/RosterAdmin';
import TimeTilRefresh from '../../../components/UI/TimeTilRefresh';
import Spinner from '../../../components/UI/Spinner';

import './styles.css';

export default function AdminView() {
  const auth = useSelector((state) => state.auth);
  const groupMembers = useSelector((state) => state.groupMembers);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!auth) {
    return <NoAuth />;
  }

  const loading = groupMembers.loading && groupMembers.members.length < 1;
  const error = !groupMembers.loading && groupMembers.error && groupMembers.members.length < 1;

  return (
    <>
      <div className='module header'>
        <div className='text'>{t('Administration')}</div>
        {groupMembers.members.length > 0 ? (
          <>
            <TimeTilRefresh isLoading={groupMembers.loading} />
            {groupMembers.loading ? (
              <div className='state'>
                <Spinner mini />
              </div>
            ) : (
              <div className='state'>{t('{{online}} online', { online: groupMembers.online })}</div>
            )}
          </>
        ) : null}
      </div>
      <div className={cx('module', 'roster', { loading: loading || error })}>
        {loading ? <Spinner /> : null}
        {error ? <div className='info'>{t('There was a network error')}</div> : null}
        <RosterAdmin />
      </div>
    </>
  );
}
