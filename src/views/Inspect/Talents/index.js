import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import cx from 'classnames';

import * as enums from '../../../utils/destinyEnums';
import manifest from '../../../utils/manifest';

import './styles.css';

function talentGrid(itemHash, itemComponents, itemInstanceId) {
  const definitionInventoryItem = manifest.DestinyInventoryItemDefinition[itemHash];
  const definitionTalentGrid = manifest.DestinyTalentGridDefinition[definitionInventoryItem?.talentGrid?.talentGridHash];
  const itemInstance = itemComponents?.talentGrids.data[itemInstanceId];

  if (!definitionTalentGrid) return {};

  const talentGridHash = itemInstance?.talentGridHash || definitionTalentGrid.hash;
  const nodes = itemInstance?.nodes.filter((node) => !node.hidden) || definitionTalentGrid.nodes.filter((node, n) => definitionTalentGrid.independentNodeIndexes.includes(n));

  return {
    talentGridHash,
    nodes: nodes.map((node) => {
      const talentNodeGroup = definitionTalentGrid.nodes[node.nodeIndex];
      const step = talentNodeGroup.steps[0];

      if (!step) {
        return undefined;
      }

      // Filter out some weird bogus nodes
      if (!step.displayProperties.name || talentNodeGroup.column < 0) {
        return undefined;
      }

      // Only one node in this column can be selected (scopes, etc)
      const exclusiveInColumn = Boolean(talentNodeGroup.exclusiveWithNodeHashes && talentNodeGroup.exclusiveWithNodeHashes.length > 0);

      const activatedAtGridLevel = step.activationRequirement.gridLevel;

      // There's a lot more here, but we're taking just what we need
      return {
        hash: step.nodeStepHash,
        groupHash: talentNodeGroup.groupHash,
        displayProperties: step.displayProperties,
        // Position in the grid
        column: talentNodeGroup.column / 8,
        row: talentNodeGroup.row / 8,
        // Is the node selected (lit up in the grid)
        isActivated: node.isActivated,
        // The item level at which this node can be unlocked
        activatedAtGridLevel,
        // Only one node in this column can be selected (scopes, etc)
        exclusiveInColumn,
        // Some nodes don't show up in the grid, like purchased ascend nodes
        hidden: node.hidden,
      };
    }),
  };
}

export default function Talents() {
  const member = useSelector((state) => state.member);

  const params = useParams();
  const itemHash = params.itemHash && +params.itemHash;

  const { itemInstanceId } = member.data.inventory?.find((item) => item.itemHash === itemHash) || {};

  const { talentGridHash, nodes } = talentGrid(itemHash, member.data.profile?.itemComponents, itemInstanceId);

  console.log(talentGridHash, nodes);

  const nodeSize = 40;
  const nodePadding = 4;
  const totalNodeSize = nodeSize + nodePadding;

  const numColumns = nodes
    .filter((node) => !node.hidden)
    .reduce((max, node) => {
      return Math.max(max, node.column + 1);
    }, 0);
  const numRows = nodes
    .filter((node) => !node.hidden)
    .reduce((max, node) => {
      return Math.max(max, node.row + 1);
    }, 0);

  const groups = nodes.reduce((groups, node) => {
    const group = groups.find((group) => group.groupHash === node.groupHash);

    if (group) {
      return [
        ...groups.filter((g) => g.groupHash !== group.groupHash),
        {
          groupHash: group.groupHash,
          nodes: [...group.nodes, node],
        },
      ];
    } else {
      return [
        ...groups,
        {
          groupHash: node.groupHash,
          nodes: [node],
        },
      ];
    }
  }, []);

  return (
    <div className='view' id='inspect'>
      <svg preserveAspectRatio='xMaxYMin meet' viewBox={`0 0 ${numColumns * totalNodeSize - nodePadding} ${numRows * totalNodeSize - nodePadding + 1}`} className='talent-grid'>
        {groups.map((group, g) =>
          group.nodes.length > 1 ? (
            <g key={g} className='group'>
              {group.nodes.map((node, n) => (
                <TalentGridNode key={n} node={node} totalNodeSize={totalNodeSize} isGrouped />
              ))}
            </g>
          ) : (
            group.nodes.map((node, n) => <TalentGridNode key={n} node={node} totalNodeSize={totalNodeSize} />)
          )
        )}
      </svg>
    </div>
  );
}

function TalentGridNode({ node, totalNodeSize, isGrouped }) {
  return (
    <g
      transform={`translate(${node.column * totalNodeSize},${node.row * totalNodeSize})`}
      className={cx('talent-node', {
        'talent-node-activated': node.isActivated,
        'talent-node-default': node.isActivated && !node.exclusiveInColumn && node.column < 1,
      })}
    >
      {isGrouped ? <rect x='-16' y='8' width='32' height='32' transform='rotate(-45)' className='talent-node-xp' /> : <rect x='-18' y='6' width='36' height='36' transform='rotate(-45)' className='talent-node-xp' />}
      <image className='talent-node-img' href={`https://www.bungie.net${node.displayProperties.icon}`} x='20' y='20' height='96' width='96' transform='scale(0.25)' />
      <title>{node.displayProperties.name}</title>
    </g>
  );
}
