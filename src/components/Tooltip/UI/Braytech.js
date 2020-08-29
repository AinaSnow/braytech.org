import React from 'react';

import { t, BungieText } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';

export default function Braytech({ hash, relatedHash, ...props }) {
  const definition = manifest.BraytechDefinition[hash];

  // description
  const description = definition.displayProperties.description;

  return (
    <>
      {description ? <BungieText className='description' value={description} /> : null}
      {hash === 'commonality' && relatedHash && (manifest.statistics.triumphs[relatedHash] > 1 || manifest.statistics.collections[relatedHash] > 1) ? <div className='line' /> : null}
      {hash === 'commonality' && relatedHash && (manifest.statistics.triumphs[relatedHash] > 1 || manifest.statistics.collections[relatedHash] > 1) ? (
        <div className='description'>
          <p>{manifest.statistics.triumphs[relatedHash] ? t('{{players}} players have redeemed this.', { players: manifest.statistics.triumphs[relatedHash].toLocaleString() || 0 }) : t('{{players}} players have collected this.', { players: manifest.statistics.collections[relatedHash].toLocaleString() || 0 })}</p>
        </div>
      ) : null}
      {hash === 'commonality' ? <div className='line' /> : null}
      {hash === 'commonality' ? (
        <div className='description'>
          <p>{t('At current, {{players}} players are indexed by VOLUSPA.', { players: manifest.statistics.scrapes?.last?.members?.toLocaleString() })}</p>
        </div>
      ) : null}
    </>
  );
}
