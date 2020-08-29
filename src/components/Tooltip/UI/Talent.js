import React from 'react';

import { BungieText } from '../../../utils/i18n';
import { talentGridNodeStepDefinition } from '../../../utils/destinyTalentGrids';

export default function Talent({ talentGridHash, hash }) {
  const { displayProperties } = talentGridNodeStepDefinition(talentGridHash, hash);
  
  return <BungieText className='description' value={displayProperties?.description} />;
}
