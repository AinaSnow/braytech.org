import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useParams, Link } from 'react-router-dom';
import cx from 'classnames';
import queryString from 'query-string';

import * as enums from '../../../utils/destinyEnums';
import manifest from '../../../utils/manifest';
import { talentGrid, activatedPath } from '../../../utils/destinyTalentGrids';
import ObservedImage from '../../../components/ObservedImage';
import { Miscellaneous } from '../../../svg';

import './styles.css';
import actions from '../../../store/actions';

export default function Talents() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.tooltips.rebind());
  }, []);

  const location = useLocation();
  const params = useParams();
  const itemHash = params.itemHash && +params.itemHash;

  const definitionInventoryItem = manifest.DestinyInventoryItemDefinition[itemHash];

  if (!definitionInventoryItem) return null;

  const query = queryString.parse(location.search);
  const urlNodes = query.nodes?.split('/').map((node) => +node || false) || [];

  const { talentGridHash, nodeCategories, nodes } = talentGrid(itemHash, urlNodes);

  const { art, damageType, attunement } = activatedPath(nodeCategories, nodes);

  return (
    <div className='view talents' id='inspect'>
      <div className='bg'>
        <div className={cx('grad', enums.DAMAGE_STRINGS[damageType])} />
      </div>
      <div className='wrapper'>
        <div className='art'>
          {art && <ObservedImage src={`/static/images/extracts/subclass-art/${art}`} />}
          <div className='text'>
            <div className='border' />
            {attunement?.name}
            <div className='border' />
          </div>
        </div>
        <div className={cx('talent-grid', enums.DAMAGE_STRINGS[damageType])}>
          {nodeCategories.map((category, c) => {
            const { columnAvg, rowAvg } = categoryAverage(category, nodes);

            return category.isSubclassPath ? (
              <div key={c} className={cx('group', { selected: category.nodeIndexes.filter((nodeIndex) => nodes[nodeIndex].isActivated).length })}>
                <div className='path' style={{ left: `${columnAvg}%`, top: `${rowAvg}%` }}>
                  <Miscellaneous.SubclassSelected />
                </div>
                <div className='border' style={{ left: `${columnAvg}%`, top: `${rowAvg}%` }} />
                {category.nodeIndexes.map((nodeIndex, n) => {
                  const to = talentGridUrl(itemHash, nodeCategories, nodes, nodeIndex);

                  return <TalentGridNode key={n} talentGridHash={talentGridHash} node={nodes[nodeIndex]} to={to} />;
                })}
              </div>
            ) : (
              category.nodeIndexes.map((nodeIndex, n) => {
                const to = talentGridUrl(itemHash, nodeCategories, nodes, nodeIndex);

                return <TalentGridNode key={n} talentGridHash={talentGridHash} node={nodes[nodeIndex]} to={to} />;
              })
            );
          })}
        </div>
        <div className='header'>
          <div className='icon'>
            <ObservedImage src={`https://www.bungie.net${definitionInventoryItem.displayProperties.icon}`} />
          </div>
          <div className='text'>
            <div className='name'>{definitionInventoryItem.displayProperties.name}</div>
            <div className='type'>{definitionInventoryItem.itemTypeDisplayName}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function talentGridUrl(itemHash, nodeCategories, nodes, nodeIndex) {
  const target = nodeCategories.find(({ nodeIndexes }) => nodeIndexes.includes(nodeIndex));

  const configuration = nodeCategories.map(({ nodeIndexes, isSubclassPath }) => {
    const includesTargetIndex = nodeIndexes.includes(nodeIndex);

    return nodeIndexes.map((n) => {
      if (isSubclassPath) {
        // this will catch super nodes themselves
        if (includesTargetIndex) {
          return nodes[n].hash;
        }
        // else leave whatever is activated, activated, unless the target is a node group
        else if (nodes[n].isActivated && !target.isSubclassPath) {
          return nodes[n].hash;
        } else {
          return false;
        }
      }

      if (includesTargetIndex) {
        return n === nodeIndex ? nodes[n].hash : false;
      }

      return nodes[n].isActivated ? nodes[n].hash : false;
    });
  });

  return `/inspect/talents/${itemHash}?nodes=${configuration
    .flat()
    .map((hash) => hash || '')
    .join('/')}`;
}

function categoryAverage({ nodeIndexes }, nodes) {
  const group = nodes.filter((node, n) => nodeIndexes.includes(n));

  return {
    columnAvg: group.reduce((sum, node) => sum + node.column, 0) / group.length,
    rowAvg: group.reduce((sum, node) => sum + node.row, 0) / group.length,
  };
}

function TalentGridNode({ talentGridHash, node, to }) {
  return (
    <div
      className={cx('node', {
        selected: node.isActivated,
        default: node.isActivated && !node.exclusiveInColumn && node.column < 1,
        super: node.layoutIdentifier === 'super',
      })}
      data-tooltip={node.isActivated || 'mouse'}
      data-type='talent'
      data-hash={node.hash}
      data-talentgridhash={talentGridHash}
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
