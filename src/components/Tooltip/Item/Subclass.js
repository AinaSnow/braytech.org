import React from 'react';
import cx from 'classnames';

import { BungieText } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import { talentGrid, activatedNodes, activatedPath } from '../../../utils/destinyTalentGrids';
import ObservedImage from '../../ObservedImage';

export default function Subclass({ itemHash, itemComponents }) {
  const definitionItem = manifest.DestinyInventoryItemDefinition[itemHash];

  const { nodeCategories, nodes } = talentGrid(itemHash, activatedNodes(itemComponents?.talentGrids.talentGridHash || definitionItem.talentGrid?.talentGridHash, itemComponents?.talentGrids));
  const path = activatedPath(nodeCategories, nodes);

  console.log(nodeCategories, nodes);
  console.log(path);

  const flair = definitionItem.displayProperties?.description !== '' && definitionItem.displayProperties.description;

  const perkHashes = path.perkHashes.filter((perkHash) => manifest.DestinySandboxPerkDefinition[perkHash].isDisplayable);

  const blocks = [];

  if (flair) {
    blocks.push(<BungieText className='flair' value={flair} />);
  }

  if (flair) {
    blocks.push(<div className='line' />);
  }

  if (path.attunement.name) {
    blocks.push(
      <div className='attunement'>
        <ObservedImage className='image icon' src={`https://www.bungie.net${path.attunement.icon || `/img/misc/missing_icon_d2.png`}`} />
        <BungieText className='description' value={path.attunement.name} />
      </div>
    );
  }

  if (path.attunement.name && perkHashes.length) {
    blocks.push(<div className='line' />);
  }

  if (perkHashes.length) {
    blocks.push(
      <div className='sockets perks'>
        {perkHashes.map((perkHash, p) => {
          const definitionPerk = manifest.DestinySandboxPerkDefinition[perkHash];

          return (
            <div key={p} className='socket'>
              <div className={cx('plug', { enabled: true })}>
                <ObservedImage className='image icon' src={`https://www.bungie.net${definitionPerk.displayProperties?.icon || `/img/misc/missing_icon_d2.png`}`} />
                <div className='text'>
                  <BungieText className='description' value={definitionPerk.displayProperties?.description} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return blocks.map((b, i) => <React.Fragment key={i}>{b}</React.Fragment>);
}
