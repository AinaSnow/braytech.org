import React from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';

import { t } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import { talentGridNodeStepDefinition } from '../../../utils/destinyTalentGrids';
import ObservedImage from '../../ObservedImage';

import './styles.css';

import Default from './Default';
import Braytech from './Braytech';
import Talent from './Talent';

const woolworths = {
  braytech: Braytech,
  talent: Talent,
};

function UI({ ...props }) {
  const viewport = useSelector((state) => state.viewport);

  const item = {
    hash: props.hash,
    relatedHash: props.related,
    talentGridHash: props.talentgridhash,
    quantity: +props.quantity || 1,
    state: +props.state || 0,
    rarity: 'common',
    type: props.type,
  };

  const definition =
    item.type === 'braytech'
      ? // Braytech custom definitions
        manifest.BraytechDefinition[item.hash]
      : // Stats, either or
      item.type === 'stat'
      ? manifest.DestinyStatDefinition[item.hash] || manifest.DestinyHistoricalStatsDefinition[item.hash]
      : // Activity modifiers
      item.type === 'modifier'
      ? manifest.DestinyActivityModifierDefinition[item.hash]
      : // Talent grid node step
      item.type === 'talent'
      ? talentGridNodeStepDefinition(item.talentGridHash, item.hash)
      : // Nothing
        false;

  if (!definition) {
    return null;
  }

  if (definition.redacted) {
    return (
      <>
        <div className='acrylic' />
        <div className={cx('frame', 'common')}>
          <div className='header'>
            <div className='name'>{t('Classified')}</div>
            <div>
              <div className='kind'>{t('Insufficient clearance')}</div>
            </div>
          </div>
          <div className='black'>
            <div className='description'>
              <pre>{t('Keep it clean.')}</pre>
            </div>
          </div>
        </div>
      </>
    );
  }

  const Meat = item.type && woolworths[item.type];

  return (
    <>
      <div className='acrylic' />
      <div className={cx('frame', 'ui', item.type)}>
        <div className='header'>
          <div className='name'>{definition.displayProperties?.name || definition.statName}</div>
          {definition.itemTypeDisplayName ? <div className='kind'>{definition.itemTypeDisplayName}</div> : <div />}
        </div>
        <div className='black'>
          {viewport.width <= 600 && definition.screenshot ? (
            <div className='screenshot'>
              <ObservedImage className='image' src={`https://www.bungie.net${definition.screenshot}`} />
            </div>
          ) : null}
          {woolworths[item.type] ? <Meat {...item} /> : <Default {...item} />}
        </div>
      </div>
    </>
  );
}

export default UI;
