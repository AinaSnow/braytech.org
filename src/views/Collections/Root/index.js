import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

import { t } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import { badgeImages, enumerateCollectibleState } from '../../../utils/destinyEnums';
import { isChildOfNodeVaulted } from '../../../utils/destinyUtils';
import ObservedImage from '../../../components/ObservedImage';
import Collectibles from '../../../components/Collectibles';
import Search from '../../../components/Search';
import { ProfileLink } from '../../../components/ProfileLink';

class Root extends React.Component {
  componentDidUpdate(p) {
    if (p.member.data.updated !== this.props.member.data.updated) {
      this.props.rebindTooltips();
    }
  }

  render() {
    const { settings, member } = this.props;

    const characterCollectibles = member.data.profile.characterCollectibles.data;
    const profileCollectibles = member.data.profile.profileCollectibles.data;

    const parent = manifest.DestinyPresentationNodeDefinition[manifest.settings.destiny2CoreSettings.collectionRootNode];
    const parentBadges = manifest.DestinyPresentationNodeDefinition[manifest.settings.destiny2CoreSettings.badgesRootNode];

    const nodes = [];
    const badges = [];
    const collectionsStates = [];
    const badgesStates = [];

    // items nodes
    parent.children.presentationNodes.forEach((child) => {
      const definitionNode = manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash];
      const states = [];

      definitionNode.children.presentationNodes.forEach((nodeChild) => {
        const definitionNodeChildNode = manifest.DestinyPresentationNodeDefinition[nodeChild.presentationNodeHash];

        definitionNodeChildNode.children.presentationNodes.forEach((nodeChildNodeChild) => {
          const definitionNodeChildNodeChildNode = manifest.DestinyPresentationNodeDefinition[nodeChildNodeChild.presentationNodeHash];

          if (definitionNodeChildNodeChildNode.children.presentationNodes.length > 0) {
            definitionNodeChildNodeChildNode.children.presentationNodes.forEach((nodeChildNodeChildNodeChild) => {
              const definitionNodeChildNodeChildNodeChildNode = manifest.DestinyPresentationNodeDefinition[nodeChildNodeChildNodeChild.presentationNodeHash];

              definitionNodeChildNodeChildNodeChildNode.children.collectibles.forEach((collectible) => {
                const scope = profileCollectibles.collectibles[collectible.collectibleHash] ? profileCollectibles.collectibles[collectible.collectibleHash] : characterCollectibles[member.characterId].collectibles[collectible.collectibleHash];

                if (scope) {
                  states.push(scope.state);
                  collectionsStates.push(scope.state);
                }
              });
            });
          } else {
            definitionNodeChildNodeChildNode.children.collectibles.forEach((collectible) => {
              const scope = profileCollectibles.collectibles[collectible.collectibleHash] ? profileCollectibles.collectibles[collectible.collectibleHash] : characterCollectibles[member.characterId].collectibles[collectible.collectibleHash];

              if (scope) {
                states.push(scope.state);
                collectionsStates.push(scope.state);
              }
            });
          }
        });
      });

      const nodeProgress = states.filter((collectible) => !enumerateCollectibleState(collectible).NotAcquired).length;
      const nodeTotal = states.filter((collectible) => !enumerateCollectibleState(collectible).Invisible).length;

      nodes.push(
        <div key={definitionNode.hash} className={cx('node', { completed: nodeTotal > 0 && nodeProgress === nodeTotal })}>
          <div className='images'>
            <ObservedImage className='image icon' src={`https://www.bungie.net${definitionNode.originalIcon}`} />
          </div>
          <div className='text'>
            <div>{definitionNode.displayProperties.name}</div>
            <div className='state'>
              <span>{nodeProgress}</span> / {nodeTotal}
            </div>
          </div>
          <ProfileLink to={`/collections/${definitionNode.hash}`} />
        </div>
      );
    });

    // badges
    parentBadges.children.presentationNodes.forEach((child) => {
      const definitionBadge = manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash];
      const classStates = [];

      let fullComplete = 0;
      let semiComplete = false;

      definitionBadge.children.presentationNodes.forEach((nodeChild) => {
        const definitionNodeChildNode = manifest.DestinyPresentationNodeDefinition[nodeChild.presentationNodeHash];

        const sweep = [];

        definitionNodeChildNode.children.collectibles.forEach((collectible) => {
          const scope = profileCollectibles.collectibles[collectible.collectibleHash] ? profileCollectibles.collectibles[collectible.collectibleHash] : characterCollectibles[member.characterId].collectibles[collectible.collectibleHash];

          if (scope) {
            sweep.push(scope.state);
          }
        });

        classStates.push({
          className: definitionNodeChildNode.displayProperties.name,
          states: sweep,
        });
      });

      const classTotal = classStates.reduce((a, obj) => {
        return Math.max(a, obj.states.filter((collectible) => !enumerateCollectibleState(collectible).Invisible).length);
      }, 0);

      classStates.forEach((obj) => {
        if (obj.states.filter((collectible) => !enumerateCollectibleState(collectible).NotAcquired).length === classTotal) {
          fullComplete += 1;
          semiComplete = true;
        }
      });

      if (semiComplete) {
        badgesStates.push(definitionBadge.displayProperties.name);
      }

      const hasVaultedChild = !settings.itemVisibility.suppressVaultWarnings && isChildOfNodeVaulted(definitionBadge.hash);

      badges.push(
        <li
          key={definitionBadge.hash}
          className={cx('badge', 'linked', {
            'badge-semi': semiComplete,
            'badge-complete': fullComplete === 3,
            expired: hasVaultedChild,
          })}
          data-tooltip='mouse'
          data-hash={definitionBadge.hash}
          data-type='collections-badge'
        >
          <ObservedImage className='image icon' src={badgeImages[definitionBadge.hash] ? `/static/images/extracts/badges/${badgeImages[definitionBadge.hash]}` : `https://www.bungie.net${definitionBadge.displayProperties.icon}`} />
          <ProfileLink to={`/collections/badge/${definitionBadge.hash}`} />
        </li>
      );
    });

    return (
      <>
        <div className='nodes'>
          <div className='sub-header'>
            <div>{t('Items')}</div>
            <div>
              {collectionsStates.filter((collectible) => !enumerateCollectibleState(collectible).NotAcquired).length}/{collectionsStates.filter((collectible) => !enumerateCollectibleState(collectible).Invisible).length}
            </div>
          </div>
          <div className='node'>
            <div className='parent'>{nodes}</div>
          </div>
        </div>
        <div className='sidebar'>
          <div className='sub-header'>
            <div>{t('Search')}</div>
          </div>
          <Search table='DestinyCollectibleDefinition' />
          {profileCollectibles.recentCollectibleHashes ? (
            <>
              <div className='sub-header'>
                <div>{t('Recently discovered')}</div>
              </div>
              <div className='recently-discovered'>
                <ul className='list collection-items'>
                  <Collectibles hashes={profileCollectibles.recentCollectibleHashes.slice().reverse()} selfLinkFrom='/collections' showCompleted mouseTooltips />
                </ul>
              </div>
            </>
          ) : null}
          <div className='sub-header'>
            <div>{t('Badges')}</div>
            <div>
              {badgesStates.length}/{parentBadges.children.presentationNodes.length}
            </div>
          </div>
          <div className='badges'>
            <ul className='list'>{badges}</ul>
          </div>
        </div>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    settings: state.settings,
    member: state.member,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    rebindTooltips: () => {
      dispatch({ type: 'TOOLTIPS_REBIND' });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Root);
