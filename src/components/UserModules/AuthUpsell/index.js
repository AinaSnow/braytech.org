import React from 'react';
import { useSelector } from 'react-redux';

import { t } from '../../../utils/i18n';
import { BungieAuthButton } from '../../BungieAuth';
import DismissTip from '../../UI/DismissTip';

import './styles.css';

export default function AuthUpsell() {
  const member = useSelector((state) => state.member);

  return (
    <div className='wrap'>
      <div className='headline'>{t('UserModules.AuthUpsell.Headline', { displayName: member.data.profile.profile.data.userInfo.displayName })}</div>
      <div className='text'>
        <p>{t('UserModules.AuthUpsell.Text')}</p>
        <ul className='feature-sell'>
          <li>
            <div className='icon pursuits' />
            <div className='text'>
              <div className='name'>{t('Quests')}</div>
              <div className='description'>
                <p>{t('UserModules.AuthUpsell.Upsell1.Description')}</p>
              </div>
            </div>
          </li>
          <li>
            <div className='icon admin' />
            <div className='text'>
              <div className='name'>{t('Clan Admin')}</div>
              <div className='description'>
                <p>{t('UserModules.AuthUpsell.Upsell2.Description')}</p>
              </div>
            </div>
          </li>
          <li>
            <div className='icon inventory' />
            <div className='text'>
              <div className='name'>{t('Inventory')}</div>
              <div className='description'>
                <p>{t('UserModules.AuthUpsell.Upsell3.Description')}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div className='actions'>
        <BungieAuthButton />
        <DismissTip value='AuthUpsellModule' />
      </div>
    </div>
  );
}
