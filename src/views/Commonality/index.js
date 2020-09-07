import React from 'react';
import { connect } from 'react-redux';

import { t } from '../../utils/i18n';
import manifest from '../../utils/manifest';
import { commonality } from '../../utils/destinyUtils';
import { sealImages, badgeImages } from '../../utils/destinyEnums';
import Records from '../../components/Records';
import Collectibles from '../../components/Collectibles';
import ObservedImage from '../../components/ObservedImage';

import './styles.css';

class Commonality extends React.Component {
  records = Object.entries(manifest.statistics.triumphs).sort(([hash_a, a], [hash_b, b]) => a - b);
  collectibles = Object.entries(manifest.statistics.collections).sort(([hash_a, a], [hash_b, b]) => a - b);
  seals = manifest.DestinyPresentationNodeDefinition[manifest.settings.destiny2CoreSettings.medalsRootNode].children.presentationNodes
    .map(child => ({
      recordHash: manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash].completionRecordHash,
      nodeHash: child.presentationNodeHash
    }))
    .sort((a, b) => manifest.statistics.triumphs[a.recordHash] - manifest.statistics.triumphs[b.recordHash]);
  badges = manifest.DestinyPresentationNodeDefinition[manifest.settings.destiny2CoreSettings.badgesRootNode].children.presentationNodes
    .map(child => ({
      recordHash: manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash].completionRecordHash,
      nodeHash: child.presentationNodeHash
    }))
    .sort((a, b) => manifest.statistics.triumphs[a.recordHash] - manifest.statistics.triumphs[b.recordHash]);

  componentDidMount() {
    this.props.rebindTooltips();
  }

  render() {
    return (
      <div className='view' id='commonality'>
        <div className='module head'>
          <div className='page-header'>
            <div className='name'>{t('Commonality')}</div>
          </div>
        </div>
        <div className='buff'>
          <div className='content'>
            <div className='row'>
              <div className='module'>
                <div className='sub-header'>
                  <div>{t('Seals')}</div>
                </div>
                <ul className='nodes seals'>
                  {this.seals.map(({ recordHash, nodeHash }) => {
                    const definitionSeal = manifest.DestinyPresentationNodeDefinition[nodeHash];
                    const definitionRecord = definitionSeal && manifest.DestinyRecordDefinition[definitionSeal.completionRecordHash]

                    return (
                      <li key={definitionSeal.hash}>
                        <div className='icon'>
                          <div className='corners t' />
                          <ObservedImage src={sealImages[definitionSeal.hash] ? `/static/images/extracts/badges/${sealImages[definitionSeal.hash]}` : `https://www.bungie.net${definitionSeal.displayProperties.originalIcon}`} />
                          <div className='corners b' />
                        </div>
                        <div className='text'>
                          <div className='commonality'>{commonality(manifest.statistics.triumphs?.[definitionSeal.completionRecordHash]).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</div>
                          <div className='name'>{definitionRecord?.titleInfo?.titlesByGender?.Male || definitionSeal.displayProperties.name}</div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className='module'>
                <div className='sub-header'>
                  <div>{t('Badges')}</div>
                </div>
                <ul className='nodes badges'>
                  {this.badges.map(({ recordHash, nodeHash }) => {
                    const definitionBadge = manifest.DestinyPresentationNodeDefinition[nodeHash];

                    return (
                      <li key={definitionBadge.hash}>
                        <div className='icon'>
                          <ObservedImage src={badgeImages[definitionBadge.hash] ? `/static/images/extracts/badges/${badgeImages[definitionBadge.hash]}` : `https://www.bungie.net${definitionBadge.displayProperties.icon}`} />
                        </div>
                        <div className='text'>
                          <div className='commonality'>{commonality(manifest.statistics.triumphs?.[definitionBadge.completionRecordHash]).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</div>
                          <div className='name'>{definitionBadge.displayProperties.name}</div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            <div className='row'>
              <div className='module'>
                <div className='sub-header'>
                  <div>{t('Records')}</div>
                </div>
                <ul className='list record-items'>
                  <Records hashes={this.records.slice(0, 30).map(([hash, rarity]) => hash)} showCompleted showInvisible />
                </ul>
              </div>
              <div className='module'>
                <div className='sub-header'>
                  <div>{t('Collectibles')}</div>
                </div>
                <ul className='list collection-items'>
                  <Collectibles hashes={this.collectibles.slice(0, 135).map(([hash, rarity]) => hash)} showCompleted showInvisible />
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    viewport: state.viewport
  };
}

function mapDispatchToProps(dispatch) {
  return {
    rebindTooltips: value => {
      dispatch({ type: 'TOOLTIPS_REBIND', payload: new Date().getTime() });
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Commonality);
