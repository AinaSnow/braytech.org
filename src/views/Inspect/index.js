import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useParams, Link } from 'react-router-dom';

import { t } from '../../utils/i18n';
import { DestinyKey } from '../../components/UI/Button';

import Default from './Default';
import Talents from './Talents';

const FRAMES = {
  Default,
  item: Default,
  talents: Talents
}

export default function Inspect() {
  const member = useSelector((state) => state.member);
  const location = useLocation();
  const [referrer] = useState(location.state?.from || (member.characterId && `/${member.membershipType}/${member.membershipId}/${member.characterId}/collections`) || '/collections');
  const { type } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const Component = FRAMES[type] || Default;

  return (
    <>
      <Component />
      <div className='sticky-nav'>
        <div className='wrapper'>
          <div />
          <ul>
            <li>
              <Link className='button' to={referrer}>
                <DestinyKey type='dismiss' />
                {t('Dismiss')}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}