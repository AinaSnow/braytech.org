import React from 'react';

import { BungieText } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';

export default function Default({ hash, type }) {
  const definition = type === 'braytech' ? manifest.BraytechDefinition[hash] : type === 'stat' ? manifest.DestinyStatDefinition[hash] || manifest.DestinyHistoricalStatsDefinition[hash] : type === 'modifier' ? manifest.DestinyActivityModifierDefinition[hash] : false;

  // description
  const description = definition && (definition.statDescription || (definition.displayProperties?.description !== '' && definition.displayProperties?.description));

  return description ? <BungieText className='description' value={description} /> : null;
}
