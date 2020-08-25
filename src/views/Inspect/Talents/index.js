import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useParams, Link } from 'react-router-dom';
import cx from 'classnames';
import queryString from 'query-string';

import * as enums from '../../../utils/destinyEnums';
import manifest from '../../../utils/manifest';
import ObservedImage from '../../../components/ObservedImage';
import { Miscellaneous } from '../../../svg';

import './styles.css';

function talentGrid(itemHash, selectedNodes) {
  const definitionInventoryItem = manifest.DestinyInventoryItemDefinition[itemHash];
  const definitionTalentGrid = manifest.DestinyTalentGridDefinition[definitionInventoryItem?.talentGrid?.talentGridHash];

  if (!definitionTalentGrid) return {};

  const talentGridHash = definitionTalentGrid.hash;
//  const nodes = .filter((node, n) => definitionTalentGrid.independentNodeIndexes.includes(n));

  return {
    talentGridHash,
    nodeCategories: definitionTalentGrid.nodeCategories.map(({ nodeHashes, ...category }) => ({ ...category, nodeIndexes: nodeHashes })),
    nodes: definitionTalentGrid.nodes.map((node) => {
      const talentNodeGroup = definitionTalentGrid.nodes[node.nodeIndex];
      const step = talentNodeGroup.steps[0];

      return {
        hash: step.nodeStepHash,
        groupHash: talentNodeGroup.groupHash,
        layoutIdentifier: talentNodeGroup.layoutIdentifier,
        displayProperties: step.displayProperties,
        hidden: node.hidden && true,
        isActivated: selectedNodes.includes(step.nodeStepHash),
        column: talentNodeGroup.column + 20,
        row: talentNodeGroup.row + 12,
      };
    }),
  };
}

export default function Talents() {
  // const member = useSelector((state) => state.member);

  const location = useLocation();
  const params = useParams();
  const itemHash = params.itemHash && +params.itemHash;

  // const { itemInstanceId } = member.data.inventory?.find((item) => item.itemHash === itemHash) || {};

  const query = queryString.parse(location.search);
  const urlNodes = query.nodes?.split('/').map((node) => +node || false);

  const { talentGridHash, nodeCategories, nodes } = talentGrid(itemHash, urlNodes);

  console.log(talentGridHash, nodeCategories, nodes);

  const maxColumns = nodes
    .filter((node) => !node.hidden)
    .reduce((max, node) => {
      return Math.max(max, node.column);
    }, 0);

  // console.log(maxColumns)

  return (
    <div className='view' id='inspect'>
      <div className='talent-grid'>
        {nodeCategories.map((category, c) => {
          const isSubclassPath = SUBCLASS_PATHS.find((path) => category.nodeIndexes.find((nodeIndex) => nodes[nodeIndex].hash === path.nodeStepHash));
          const { columnAvg, rowAvg } = categoryAverage(category, nodes);

          return isSubclassPath ? (
            <div key={c} className='group'>
              <div className='border' style={{ left: `${columnAvg}%`, top: `${rowAvg}%` }} />
              {category.nodeIndexes.map((nodeIndex, n) => (
                <TalentGridNode key={n} node={nodes[nodeIndex]} />
              ))}
            </div>
          ) : (
            category.nodeIndexes.map((nodeIndex, n) => <TalentGridNode key={n} node={nodes[nodeIndex]} />)
          );
        })}
      </div>
    </div>
  );
}

function categoryAverage({ nodeIndexes }, nodes) {
  const group = nodes.filter((node, n) => nodeIndexes.includes(n));

  return {
    columnAvg: group.reduce((sum, node) => sum + node.column, 0) / group.length,
    rowAvg: group.reduce((sum, node) => sum + node.row, 0) / group.length,
  }
}

function TalentGridNode({ node, to }) {
  return (
    <div
      className={cx('node', {
        selected: node.isActivated,
        default: node.isActivated && !node.exclusiveInColumn && node.column < 1,
        super: node.layoutIdentifier === 'super',
      })}
      style={{ left: `${node.column}%`, top: `${node.row}%` }}
    >
      <div className='border' />
      {node.layoutIdentifier === 'super' && <div className='border-left' />}
      <div className='button'>
        <div className='shadow' />
        {to && <Link to={to} />}
      </div>
      <ObservedImage src={`https://www.bungie.net${node.displayProperties.icon}`} />
    </div>
  );
}

const SUBCLASS_PATH_IDENTIFIERS = { First: 'FirstPath', Second: 'SecondPath', Third: 'ThirdPath' };

const SUBCLASS_PATHS = [
  {
    classType: enums.DestinyClass.Titan,
    damageType: enums.DestinyDamageType.Arc,
    identifier: SUBCLASS_PATH_IDENTIFIERS.First,
    nodeStepHash: 4099943028,
    icon: '',
    art: '01A3-0000112B',
  },
  {
    classType: enums.DestinyClass.Titan,
    damageType: enums.DestinyDamageType.Arc,
    identifier: SUBCLASS_PATH_IDENTIFIERS.Second,
    nodeStepHash: 4293830764,
    icon: '',
    art: '01A3-0000112B',
  },
  {
    classType: enums.DestinyClass.Titan,
    damageType: enums.DestinyDamageType.Arc,
    identifier: SUBCLASS_PATH_IDENTIFIERS.Third,
    nodeStepHash: 2795355746,
    icon: '',
    art: '01E3-00001598',
  },
  {
    classType: enums.DestinyClass.Titan,
    damageType: enums.DestinyDamageType.Solar,
    identifier: SUBCLASS_PATH_IDENTIFIERS.First,
    nodeStepHash: 3928207649,
    icon: '',
    art: '01A3-0000116E',
  },
  {
    classType: enums.DestinyClass.Titan,
    damageType: enums.DestinyDamageType.Solar,
    identifier: SUBCLASS_PATH_IDENTIFIERS.Second,
    nodeStepHash: 1236431642,
    icon: '',
    art: '01A3-0000116E',
  },
  {
    classType: enums.DestinyClass.Titan,
    damageType: enums.DestinyDamageType.Solar,
    identifier: SUBCLASS_PATH_IDENTIFIERS.Third,
    nodeStepHash: 1323416107,
    icon: '',
    art: '01E3-0000159D',
  },
  {
    classType: enums.DestinyClass.Titan,
    damageType: enums.DestinyDamageType.Void,
    identifier: SUBCLASS_PATH_IDENTIFIERS.First,
    nodeStepHash: 3806272138,
    icon: '',
    art: '01A3-00001179',
  },
  {
    classType: enums.DestinyClass.Titan,
    damageType: enums.DestinyDamageType.Void,
    identifier: SUBCLASS_PATH_IDENTIFIERS.Second,
    nodeStepHash: 1347995538,
    icon: '',
    art: '01A3-00001179',
  },
  {
    classType: enums.DestinyClass.Titan,
    damageType: enums.DestinyDamageType.Void,
    identifier: SUBCLASS_PATH_IDENTIFIERS.Third,
    nodeStepHash: 3504292102,
    icon: '',
    art: '01E3-0000159F',
  },
  {
    classType: enums.DestinyClass.Hunter,
    damageType: enums.DestinyDamageType.Arc,
    identifier: SUBCLASS_PATH_IDENTIFIERS.First,
    nodeStepHash: 1690891826,
    icon: '',
    art: '01A3-000010B4',
  },
  {
    classType: enums.DestinyClass.Hunter,
    damageType: enums.DestinyDamageType.Arc,
    identifier: SUBCLASS_PATH_IDENTIFIERS.Second,
    nodeStepHash: 313617030,
    icon: '',
    art: '01A3-000010B4',
  },
  {
    classType: enums.DestinyClass.Hunter,
    damageType: enums.DestinyDamageType.Arc,
    identifier: SUBCLASS_PATH_IDENTIFIERS.Third,
    nodeStepHash: 3006627468,
    icon: '',
    art: '01E3-00001593',
  },
  {
    classType: enums.DestinyClass.Hunter,
    damageType: enums.DestinyDamageType.Solar,
    identifier: SUBCLASS_PATH_IDENTIFIERS.First,
    nodeStepHash: 2242504056,
    icon: '',
    art: '01A3-000010F8',
  },
  {
    classType: enums.DestinyClass.Hunter,
    damageType: enums.DestinyDamageType.Solar,
    identifier: SUBCLASS_PATH_IDENTIFIERS.Second,
    nodeStepHash: 2805396803,
    icon: '',
    art: '01A3-000010F8',
  },
  {
    classType: enums.DestinyClass.Hunter,
    damageType: enums.DestinyDamageType.Solar,
    identifier: SUBCLASS_PATH_IDENTIFIERS.Third,
    nodeStepHash: 1590824323,
    icon: '',
    art: '01E3-00001595',
  },
  {
    classType: enums.DestinyClass.Hunter,
    damageType: enums.DestinyDamageType.Void,
    identifier: SUBCLASS_PATH_IDENTIFIERS.First,
    nodeStepHash: 277476372,
    icon: '',
    art: '01A3-00001107',
  },
  {
    classType: enums.DestinyClass.Hunter,
    damageType: enums.DestinyDamageType.Void,
    identifier: SUBCLASS_PATH_IDENTIFIERS.Second,
    nodeStepHash: 4025960910,
    icon: '',
    art: '01A3-00001107',
  },
  {
    classType: enums.DestinyClass.Hunter,
    damageType: enums.DestinyDamageType.Void,
    identifier: SUBCLASS_PATH_IDENTIFIERS.Third,
    nodeStepHash: 499823166,
    icon: '',
    art: '01E3-00001596',
  },
  {
    classType: enums.DestinyClass.Warlock,
    damageType: enums.DestinyDamageType.Arc,
    identifier: SUBCLASS_PATH_IDENTIFIERS.First,
    nodeStepHash: 487158888,
    icon: '',
    art: '01A3-000011A1',
  },
  {
    classType: enums.DestinyClass.Warlock,
    damageType: enums.DestinyDamageType.Arc,
    identifier: SUBCLASS_PATH_IDENTIFIERS.Second,
    nodeStepHash: 3297679786,
    icon: '',
    art: '01A3-000011A1',
  },
  {
    classType: enums.DestinyClass.Warlock,
    damageType: enums.DestinyDamageType.Arc,
    identifier: SUBCLASS_PATH_IDENTIFIERS.Third,
    nodeStepHash: 3882393894,
    icon: '',
    art: '01E3-000015A1',
  },
  {
    classType: enums.DestinyClass.Warlock,
    damageType: enums.DestinyDamageType.Solar,
    identifier: SUBCLASS_PATH_IDENTIFIERS.First,
    nodeStepHash: 1893159641,
    icon: '',
    art: '01A3-000011F1',
  },
  {
    classType: enums.DestinyClass.Warlock,
    damageType: enums.DestinyDamageType.Solar,
    identifier: SUBCLASS_PATH_IDENTIFIERS.Second,
    nodeStepHash: 966868917,
    icon: '',
    art: '01A3-000011F1',
  },
  {
    classType: enums.DestinyClass.Warlock,
    damageType: enums.DestinyDamageType.Solar,
    identifier: SUBCLASS_PATH_IDENTIFIERS.Third,
    nodeStepHash: 935376049,
    icon: '',
    art: '01E3-000015A2',
  },
  {
    classType: enums.DestinyClass.Warlock,
    damageType: enums.DestinyDamageType.Void,
    identifier: SUBCLASS_PATH_IDENTIFIERS.First,
    nodeStepHash: 2718724912,
    icon: '',
    art: '01A3-0000120D',
  },
  {
    classType: enums.DestinyClass.Warlock,
    damageType: enums.DestinyDamageType.Void,
    identifier: SUBCLASS_PATH_IDENTIFIERS.Second,
    nodeStepHash: 1389184794,
    icon: '',
    art: '01A3-0000120D',
  },
  {
    classType: enums.DestinyClass.Warlock,
    damageType: enums.DestinyDamageType.Void,
    identifier: SUBCLASS_PATH_IDENTIFIERS.Third,
    nodeStepHash: 194702279,
    icon: '',
    art: '01E3-000015A5',
  },
];
