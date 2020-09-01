import React from 'react';

import { t, BraytechText } from '../../../utils/i18n';
import { Miscellaneous } from '../../../svg';

import './styles.css';

export default function DreamingCityCurseCycle({ cycleInfo }) {
  const rotation = {
    1: {
      strength: t('Lesser'),
    },
    2: {
      strength: t('Middling'),
    },
    3: {
      strength: t('Greater'),
    },
  };

  return (
    <div className='user-module dreaming-city-curse-cycle'>
      <div className='sub-header'>
        <div>{t("Savathûn's Curse")}</div>
      </div>
      <h3>{rotation[cycleInfo.week.curse].strength}</h3>
      <BraytechText className='text' value={t("UserModules.DreamingCityCurseCycle.Description", { week: cycleInfo.week.curse })} />
      <div className='icon'>
        <Miscellaneous.CurseCycle />
      </div>
    </div>
  );
}
