import React from 'react';

import manifest from '../../../utils/manifest';
import { talentGrid, activatedNodes, activatedPath } from '../../../utils/destinyTalentGrids';

export default function Subclass({ itemHash, itemComponents }) {
  const definitionItem = manifest.DestinyInventoryItemDefinition[itemHash];

  const { nodeCategories, nodes } = talentGrid(itemHash, activatedNodes(itemComponents.talentGrids.talentGridHash, itemComponents.talentGrids));
  const { attunement, ability } = activatedPath(nodeCategories, nodes);

  const flair = definitionItem.displayProperties?.description !== '' && definitionItem.displayProperties.description;

  return (
    <div className='background-overflow'>
      {ability ? (
        <div className='super'>
          <div className='path'>
            <div className='line' />
            <div className='text'>{attunement?.name}</div>
            <div className='line' />
          </div>
          <div className='ability'>
            <div className='text'>
              <div className='name'>{ability.name}</div>
              <div className='description'>
                <p>{ability.description}</p>
              </div>
            </div>
            <div className='icon'>{ability.icon}</div>
          </div>
        </div>
      ) : null}
      <div className='line' />
      <div className='flair'>
        <p>{flair}</p>
      </div>
    </div>
  );
}
