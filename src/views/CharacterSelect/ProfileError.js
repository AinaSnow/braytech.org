import React from 'react';

import { t } from '../../utils/i18n';
import Button from '../../components/UI/Button';

function handler_goToBungiePrivacy(event) {
  window.open('https://www.bungie.net/en/Profile/Settings?category=Privacy', '_blank');
}

export default function ProfileError({ error, ...props }) {
  console.log(error);

  if (error.ErrorCode && error.ErrorStatus && error.Message) {
    return (
      <div className='error'>
        <div className='sub-header'>
          <div>{t('Bungie error')}</div>
        </div>
        <p>
          {error.ErrorCode} {error.ErrorStatus}
        </p>
        <p>
          <em>{error.Message}</em>
        </p>
      </div>
    );
  }

  if (error.message === 'BUNGIE') {
    return (
      <div className='error'>
        <div className='sub-header'>
          <div>{t('Bungie error')}</div>
        </div>
        <p>{t('Unknown error')}</p>
      </div>
    );
  }

  if (error.ErrorCode === 'private') {
    return (
      <div className='error'>
        <div className='sub-header'>
          <div>{t('Private profile')}</div>
        </div>
        <p>{t("Your profile's progression data isn't available. Your profile may be set to private on Bungie.net.")}</p>
        <p>{t('You may change your privacy settings on Bungie.net or authenticate Braytech with Bungie.net')}</p>
        <Button text={t('Go to Bungie.net')} action={handler_goToBungiePrivacy} />
      </div>
    );
  }

  if (error.ErrorCode === 'character_unavailable') {
    return (
      <div className='error'>
        <div className='sub-header'>
          <div>{t('Character unavailable')}</div>
        </div>
        <p>{t("The character you tried to load is unavailable—maybe it's been deleted.")}</p>
      </div>
    );
  }

  if (error.ErrorCode === 'member_banned') {
    return (
      <div className='error'>
        <div className='sub-header'>
          <div>{t('Profile banned')}</div>
        </div>
        <p>{t("This Destiny profile has been banned from this app. This isn't an error.")}</p>
      </div>
    );
  }

  return (
    <div className='error'>
      <div className='sub-header'>
        <div>{t('Error')}</div>
      </div>
      <p>{error.message || t('Unknown error')}</p>
    </div>
  );
}
