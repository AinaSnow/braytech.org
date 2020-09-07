import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import { t, BraytechText } from '../../../utils/i18n';
import { BungieAuthButton } from '../../BungieAuth';

import { Common } from '../../../svg';

import './styles.css';

export default function Upsell(props) {
  const { pathname } = useLocation();

  if (props.auth) {
    return (
      <div className='upsell'>
        <div className='wrap'>
          <div className='icon'>
            <Common.SeventhColumn />
          </div>
          <BraytechText className='text' value={t('Upsell.Auth.Description')} />
          <BungieAuthButton />
        </div>
      </div>
    );
  }

  return (
    <div className='upsell'>
      <div className='wrap'>
        <div className='icon'>
          <Common.SeventhColumn />
        </div>
        <BraytechText className='text' value={t('Upsell.Profile.Description')} />
        <Link className='button cta' to={{ pathname: '/character-select', state: { from: { pathname } } }}>
          <div className='text'>{t('Upsell.Profile.Action')}</div>
          <i className='segoe-mdl-arrow-right' />
        </Link>
      </div>
    </div>
  );
}
