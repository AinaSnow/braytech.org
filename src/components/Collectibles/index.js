import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import cx from 'classnames';

import { t } from '../../utils/i18n';
import manifest from '../../utils/manifest';
import { commonality, isContentVaulted } from '../../utils/destinyUtils';
import { ProfileLink } from '../../components/ProfileLink';
import ObservedImage from '../../components/ObservedImage';
import { enumerateCollectibleState } from '../../utils/destinyEnums';
import { energyTypeToAsset } from '../../utils/destinyConverters';
import { Common } from '../../svg';

import './styles.css';

function selfLinkCollectible(hash) {
  const link = ['/collections'];
  const root = manifest.DestinyPresentationNodeDefinition[manifest.settings.destiny2CoreSettings.collectionRootNode];

  root.children.presentationNodes.forEach((primary) => {
    const definitionPrimaryNode = manifest.DestinyPresentationNodeDefinition[primary.presentationNodeHash];

    definitionPrimaryNode.children.presentationNodes.forEach((secondary) => {
      const definitionSecondaryNode = manifest.DestinyPresentationNodeDefinition[secondary.presentationNodeHash];

      definitionSecondaryNode.children.presentationNodes.forEach((tertiary) => {
        const definitionTertiaryNode = manifest.DestinyPresentationNodeDefinition[tertiary.presentationNodeHash];

        if (definitionTertiaryNode.children.collectibles.length) {
          const collectible = definitionTertiaryNode.children.collectibles.find((collectible) => collectible.collectibleHash === hash);

          if (collectible) {
            link.push(definitionPrimaryNode.hash, definitionSecondaryNode.hash, definitionTertiaryNode.hash, collectible.collectibleHash);
          }
        } else if (definitionTertiaryNode.children.presentationNodes.length) {
          definitionTertiaryNode.children.presentationNodes.forEach((quaternary) => {
            const definitionQuaternaryNode = manifest.DestinyPresentationNodeDefinition[quaternary.presentationNodeHash];

            if (definitionQuaternaryNode.children.collectibles.length) {
              const collectible = definitionQuaternaryNode.children.collectibles.find((collectible) => collectible.collectibleHash === hash);

              if (collectible) {
                link.push(definitionPrimaryNode.hash, definitionSecondaryNode.hash, definitionTertiaryNode.hash, definitionQuaternaryNode.hash, collectible.collectibleHash);
              }
            } else if (definitionQuaternaryNode.children.presentationNodes.length) {
              definitionQuaternaryNode.children.presentationNodes.forEach((quaternary) => {
                const definitionQuinaryNode = manifest.DestinyPresentationNodeDefinition[quaternary.presentationNodeHash];

                if (definitionQuinaryNode.children.collectibles.length) {
                  const collectible = definitionQuinaryNode.children.collectibles.find((collectible) => collectible.collectibleHash === hash);

                  if (collectible) {
                    link.push(definitionPrimaryNode.hash, definitionSecondaryNode.hash, definitionTertiaryNode.hash, definitionQuaternaryNode.hash, definitionQuinaryNode.hash, collectible.collectibleHash);
                  }
                }
              });
            }
          });
        }
      });
    });
  });

  return link.join('/');
}

class Collectibles extends React.Component {
  ref_scrollTo = React.createRef();

  componentDidMount() {
    const highlight = this.props.match?.params.quinary ? +this.props.match.params.quinary : +this.props.highlight || false;

    if (highlight && this.ref_scrollTo.current !== null) {
      window.scrollTo({
        top: this.ref_scrollTo.current.offsetTop + this.ref_scrollTo.current.offsetHeight / 2 - window.innerHeight / 2,
      });
    }
  }

  componentDidUpdate(p) {
    if (p.settings.itemVisibility !== this.props.settings.itemVisibility) {
      this.props.rebindTooltips();
    }
  }

  render() {
    const { settings, lists, member, selfLinkFrom, inspect, showCompleted, showInvisible, mouseTooltips } = this.props;
    const highlight = +this.props.match?.params.quinary || +this.props.highlight || false;
    const suppressVaultWarning = this.props.suppressVaultWarning || settings.itemVisibility.suppressVaultWarnings;
    const collectiblesRequested = this.props.hashes?.filter((h) => h);
    const characterId = member.characterId;
    const characterCollectibles = member.data.profile?.characterCollectibles.data;
    const profileCollectibles = member.data.profile?.profileCollectibles.data;

    let collectiblesOutput = [];

    if (this.props.node) {
      const tertiaryDefinition = manifest.DestinyPresentationNodeDefinition[this.props.node];

      // Collection Nodes with Nodes for Sets
      if (tertiaryDefinition.children.presentationNodes.length > 0) {
        tertiaryDefinition.children.presentationNodes.forEach((node, n) => {
          const definitionNode = manifest.DestinyPresentationNodeDefinition[node.presentationNodeHash];

          const set = [];

          definitionNode.children.collectibles.forEach((collectible, c) => {
            const definitionCollectible = manifest.DestinyCollectibleDefinition[collectible.collectibleHash];

            const data = definitionCollectible.scope === 1 ? characterCollectibles?.[characterId].collectibles[definitionCollectible.hash] : profileCollectibles?.collectibles[definitionCollectible.hash];
            const state = data?.state || 0;

            if (
              (settings.itemVisibility.hideInvisibleCollectibles && enumerateCollectibleState(state).Invisible && !showInvisible) || // hide invisibles
              (settings.itemVisibility.hideCompletedCollectibles && !enumerateCollectibleState(state).NotAcquired && !showCompleted) // hide completed
            ) {
              set.push({
                hash: definitionCollectible.hash,
                state,
              });

              return;
            }

            if (definitionCollectible.redacted || definitionCollectible.itemHash === 0) {
              set.push({
                hash: definitionCollectible.hash,
                state,
                element: (
                  <li
                    key={definitionCollectible.hash}
                    className={cx('linked', 'redacted', {
                      highlight: highlight === definitionCollectible.hash,
                    })}
                    data-tooltip
                    data-hash='343'
                  >
                    <div className='icon'>
                      <ObservedImage className='image icon' src={`https://www.bungie.net${manifest.settings.destiny2CoreSettings.undiscoveredCollectibleImage}`} />
                    </div>
                    <div className='text'>
                      <div className='name'>{t('Classified')}</div>
                      {manifest.statistics.collections ? <div className='commonality'>{commonality(manifest.statistics.collections[definitionCollectible.hash]).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</div> : null}
                    </div>
                  </li>
                ),
              });
            } else {
              const isVaultedCollectible = !suppressVaultWarning && isContentVaulted(definitionCollectible.hash);

              set.push({
                hash: definitionCollectible.hash,
                state,
                element: (
                  <li
                    key={c}
                    className={cx('linked', 'item', {
                      completed: !enumerateCollectibleState(state).NotAcquired && !enumerateCollectibleState(state).Invisible,
                      highlight: highlight === definitionCollectible.hash,
                      selected: settings.developer.lists && lists.collectibles.includes(definitionCollectible.hash),
                      expired: !suppressVaultWarning && isVaultedCollectible,
                    })}
                    data-tooltip={mouseTooltips ? 'mouse' : true}
                    data-hash={definitionCollectible.itemHash}
                    onClick={settings.developer.lists ? this.props.addToList({ type: 'collectibles', value: definitionCollectible.hash }) : undefined}
                  >
                    <div className='icon'>
                      <ObservedImage className='image icon' src={`https://www.bungie.net${definitionCollectible.displayProperties.icon || manifest.settings.destiny2CoreSettings.undiscoveredCollectibleImage}`} />
                      {!suppressVaultWarning && isVaultedCollectible && (
                        <div className='expired'>
                          <Common.Expired />
                        </div>
                      )}
                    </div>
                    <div className='text'>
                      <div className='name'>{definitionCollectible.displayProperties.name}</div>
                      {manifest.statistics.collections ? <div className='commonality'>{commonality(manifest.statistics.collections[definitionCollectible.hash]).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</div> : null}
                    </div>
                    {!settings.developer.lists && inspect && definitionCollectible.itemHash ? <Link to={{ pathname: `/inspect/item/${definitionCollectible.itemHash}`, state: { from: selfLinkFrom } }} /> : null}
                  </li>
                ),
              });
            }
          });

          const ref = definitionNode.children.collectibles.find((c) => c.collectibleHash === highlight) ? this.ref_scrollTo : null;

          if (settings.itemVisibility.hideInvisibleCollectibles && set.filter((collectible) => enumerateCollectibleState(collectible.state).Invisible).length === set.length) {
            return;
          }

          collectiblesOutput.push(
            <li
              key={n}
              ref={ref}
              className={cx('is-set', {
                completed: set.filter((collectible) => !enumerateCollectibleState(collectible.state).NotAcquired).length === set.length,
                selected: settings.developer.lists && lists.nodes.includes(definitionNode.hash),
              })}
            >
              <div className='text' onClick={settings.developer.lists ? this.props.addToList({ type: 'nodes', value: definitionNode.hash }) : undefined}>
                <div className='name'>{definitionNode.displayProperties.name}</div>
              </div>
              <div className='set'>
                {set.filter((collectible) => collectible.element).length ? ( // collectibles avaiable to display
                  <ul className='list collection-items'>{set.map((collectible) => collectible.element)}</ul>
                ) : settings.itemVisibility.hideCompletedCollectibles && set.filter((collectible) => !enumerateCollectibleState(collectible.state).NotAcquired).length === set.length ? ( // no collectibles to display, but hide completed collectibles is true
                  <div className='info'>{t('All acquired')}</div>
                ) : (
                  <div className='info'>{t('Some acquired, {{invisible}} invisible', { invisible: set.filter((collectible) => enumerateCollectibleState(collectible.state).Invisible).length })}</div>
                )}
              </div>
            </li>
          );
        });
      }
      // Collection Nodes with Collectibles
      else {
        tertiaryDefinition.children.collectibles.forEach((collectible, c) => {
          const definitionCollectible = manifest.DestinyCollectibleDefinition[collectible.collectibleHash];

          const data = definitionCollectible.scope === 1 ? characterCollectibles?.[characterId].collectibles[definitionCollectible.hash] : profileCollectibles?.collectibles[definitionCollectible.hash];
          const state = data?.state || 0;

          if (
            (settings.itemVisibility.hideInvisibleCollectibles && enumerateCollectibleState(state).Invisible && !showInvisible) || // hide invisibles
            (settings.itemVisibility.hideCompletedCollectibles && !enumerateCollectibleState(state).NotAcquired && !showCompleted) // hide completed
          ) {
            return;
          }

          const ref = highlight === definitionCollectible.hash ? this.ref_scrollTo : null;

          if (definitionCollectible.redacted || definitionCollectible.itemHash === 0) {
            collectiblesOutput.push({
              hash: definitionCollectible.hash,
              element: (
                <li
                  key={c}
                  ref={ref}
                  className={cx('linked', 'redacted', {
                    highlight: highlight === definitionCollectible.hash,
                  })}
                  data-tooltip
                  data-hash='343'
                >
                  <div className='icon'>
                    <ObservedImage className='image icon' src={`https://www.bungie.net${manifest.settings.destiny2CoreSettings.undiscoveredCollectibleImage}`} />
                  </div>
                  <div className='text'>
                    <div className='name'>{t('Classified')}</div>
                    {manifest.statistics.collections ? <div className='commonality'>{commonality(manifest.statistics.collections[definitionCollectible.hash]).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</div> : null}
                  </div>
                </li>
              ),
            });
          } else {
            const definitionItem = manifest.DestinyInventoryItemDefinition[definitionCollectible.itemHash];
            const energyAsset = definitionItem?.plug?.energyCost?.energyTypeHash && energyTypeToAsset(definitionItem.plug.energyCost.energyTypeHash);

            const isVaultedCollectible = !suppressVaultWarning && isContentVaulted(definitionCollectible.hash);

            collectiblesOutput.push({
              hash: definitionCollectible.hash,
              element: (
                <li
                  key={c}
                  ref={ref}
                  className={cx('linked', energyAsset?.string !== 'any' && energyAsset?.string, {
                    completed: !enumerateCollectibleState(state).NotAcquired,
                    highlight: highlight === definitionCollectible.hash,
                    selected: settings.developer.lists && lists.collectibles.includes(definitionCollectible.hash),
                    expired: !suppressVaultWarning && isVaultedCollectible,
                  })}
                  data-tooltip={mouseTooltips ? 'mouse' : true}
                  data-hash={definitionCollectible.itemHash}
                  onClick={settings.developer.lists ? this.props.addToList({ type: 'collectibles', value: definitionCollectible.hash }) : undefined}
                >
                  <div className='icon'>
                    <ObservedImage className='image icon' src={`https://www.bungie.net${definitionCollectible.displayProperties.icon || manifest.settings.destiny2CoreSettings.undiscoveredCollectibleImage}`} />
                    {!suppressVaultWarning && isVaultedCollectible && (
                      <div className='expired'>
                        <Common.Expired />
                      </div>
                    )}
                  </div>
                  <div className='text'>
                    <div className='name'>{definitionCollectible.displayProperties.name}</div>
                    {manifest.statistics.collections ? <div className='commonality'>{commonality(manifest.statistics.collections[definitionCollectible.hash]).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</div> : null}
                  </div>
                  {!settings.developer.lists && inspect && definitionCollectible.itemHash ? <Link to={{ pathname: `/inspect/item/${definitionCollectible.itemHash}`, state: { from: selfLinkFrom } }} /> : null}
                </li>
              ),
            });
          }
        });

        if (collectiblesOutput.filter((c) => c).length === 0 && settings.itemVisibility.hideCompletedCollectibles && !showCompleted) {
          collectiblesOutput.push({
            element: (
              <li key='all-completed' className='all-completed'>
                <div className='info'>{t('All acquired')}</div>
              </li>
            ),
          });
        }

        collectiblesOutput = collectiblesOutput.filter((c) => c).map((obj) => obj.element);
      }
    } else {
      collectiblesRequested.forEach((hash) => {
        const definitionCollectible = manifest.DestinyCollectibleDefinition[hash];

        if (!definitionCollectible) return null;

        const data = definitionCollectible.scope === 1 ? characterCollectibles?.[characterId].collectibles[definitionCollectible.hash] : profileCollectibles?.collectibles[definitionCollectible.hash];
        const state = data?.state || 0;

        if (
          (settings.itemVisibility.hideInvisibleCollectibles && enumerateCollectibleState(state).Invisible && !showInvisible) || // hide invisibles
          (settings.itemVisibility.hideCompletedCollectibles && !enumerateCollectibleState(state).NotAcquired && !showCompleted) // hide completed
        ) {
          return;
        }

        const definitionItem = manifest.DestinyInventoryItemDefinition[definitionCollectible.itemHash];
        const energyAsset = definitionItem?.plug?.energyCost?.energyTypeHash && energyTypeToAsset(definitionItem.plug.energyCost.energyTypeHash);

        const link = selfLinkCollectible(definitionCollectible.hash);

        const isVaultedCollectible = !suppressVaultWarning && isContentVaulted(definitionCollectible.hash);

        collectiblesOutput.push({
          hash: definitionCollectible.hash,
          element: (
            <li
              key={definitionCollectible.hash}
              className={cx('linked', energyAsset?.string !== 'any' && energyAsset?.string, {
                linked: link && selfLinkFrom,
                completed: !enumerateCollectibleState(state).NotAcquired,
                selected: settings.developer.lists && lists.collectibles.includes(definitionCollectible.hash),
                expired: !suppressVaultWarning && isVaultedCollectible,
              })}
              data-tooltip={mouseTooltips ? 'mouse' : true}
              data-hash={definitionCollectible.itemHash}
              onClick={settings.developer.lists ? this.props.addToList({ type: 'collectibles', value: definitionCollectible.hash }) : undefined}
            >
              <div className='icon'>
                <ObservedImage className='image icon' src={`https://www.bungie.net${definitionCollectible.displayProperties.icon}`} />
                {!suppressVaultWarning && isVaultedCollectible && (
                  <div className='expired'>
                    <Common.Expired />
                  </div>
                )}
              </div>
              <div className='text'>
                <div className='name'>{definitionCollectible.displayProperties.name}</div>
                {manifest.statistics.collections ? <div className='commonality'>{commonality(manifest.statistics.collections[definitionCollectible.hash]).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</div> : null}
              </div>
              {!settings.developer.lists && link && selfLinkFrom && !inspect ? <ProfileLink to={{ pathname: link, state: { from: selfLinkFrom } }} /> : null}
              {!settings.developer.lists && inspect && definitionCollectible.itemHash ? <Link to={{ pathname: `/inspect/item/${definitionCollectible.itemHash}`, state: { from: selfLinkFrom } }} /> : null}
            </li>
          ),
        });
      });

      if (collectiblesRequested?.length > 0 && collectiblesOutput.length === 0 && settings.itemVisibility.hideCompletedCollectibles && !showCompleted) {
        collectiblesOutput.push({
          element: (
            <li key='all-completed' className='all-completed'>
              <div className='info'>{t('All acquired')}</div>
            </li>
          ),
        });
      }

      collectiblesOutput = collectiblesOutput.filter((c) => c).map((obj) => obj.element);
    }

    return collectiblesOutput;
  }
}

function mapStateToProps(state) {
  return {
    settings: state.settings,
    member: state.member,
    lists: state.lists,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    rebindTooltips: () => {
      dispatch({ type: 'REBIND_TOOLTIPS' });
    },
    addToList: (payload) => (e) => {
      dispatch({ type: 'ADD_TO_LIST', payload });
    },
  };
}

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(Collectibles);
