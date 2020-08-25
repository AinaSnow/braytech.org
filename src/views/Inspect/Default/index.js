import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useParams, Link } from 'react-router-dom';
import cx from 'classnames';
import queryString from 'query-string';

import { t, BungieText, stringBeautifier } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import actions from '../../../store/actions';
import { DestinyTierType, DestinyItemType, DestinySocketCategoryStyle, enumerateCollectibleState } from '../../../utils/destinyEnums';
import { getCollectibleState, commonality } from '../../../utils/destinyUtils';
import { damageTypeToAsset, energyTypeToAsset, breakerTypeToIcon, itemRarityToString, ammoTypeToAsset } from '../../../utils/destinyConverters';
import { DestinyKey } from '../../../components/UI/Button';
import ObservedImage from '../../../components/ObservedImage';

import { sockets } from '../../../utils/destinyItems/sockets';
import { stats, statsMs } from '../../../utils/destinyItems/stats';
import { masterwork } from '../../../utils/destinyItems/masterwork';
import { getSocketsWithStyle, getModdedStatValue, getSumOfArmorStats, getOrnamentSocket } from '../../../utils/destinyItems/utils';

// import Scene from '../../components/Three/inspect/item/Scene';

import './styles.css';

export default function Inspect() {
  const member = useSelector((state) => state.member);
  const location = useLocation();
  const params = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handler_pointerOver = (socketIndex, plugHash) => (e) => {
    console.log(socketIndex, plugHash);

    // this.setState({
    //   sockets: [
    //     {
    //       socketIndex,
    //       plugHash
    //     }
    //   ]
    // });
  };
  // console.log(item);

  const handler_pointerOut = (e) => {
    // this.setState({
    //   sockets: []
    // });
  };

  const query = queryString.parse(location.search);
  const urlSockets = selectedSockets(query.sockets?.split('/'));

  const item = createItem(params.itemHash, urlSockets);

  console.log(item);

  const definitionItem = manifest.DestinyInventoryItemDefinition[item.itemHash];

  const preparedSockets = item.sockets?.socketCategories?.reduce((sockets, socketCategory) => {
    // console.log(sockets, socketCategory)

    // if it's a mod and we've already processed a mod socket before
    const modCategoryIndex = sockets.findIndex((category) => category.category.categoryStyle === 2);

    if (modCategoryIndex > -1) {
      sockets[modCategoryIndex].sockets.push(...socketCategory.sockets);

      return sockets;
    } else {
      return [...sockets, socketCategory];
    }
  }, []);

  const armor2MasterworkSockets = item.sockets && item.sockets.socketCategories && getSocketsWithStyle(item.sockets, DestinySocketCategoryStyle.EnergyMeter);

  const masterworked = (definitionItem.itemType === DestinyItemType.Armor ? item.masterwork?.stats?.filter((stat) => stat.value > 9).length : item.masterwork?.socketIndex && item.sockets?.sockets?.[item.masterwork.socketIndex]?.plug?.definition?.investmentStats?.filter((stat) => stat.value > 9).length) || item.masterwork?.probably;

  const powerCap = definitionItem.inventory.tierType === DestinyTierType.Superior && manifest.DestinyPowerCapDefinition[definitionItem.quality?.versions?.[0]?.powerCapHash]?.powerCap;

  const definitionLore = manifest.DestinyLoreDefinition[definitionItem.loreHash];

  const displayTaxonomy = powerCap || definitionItem.equippingBlock?.ammoType || definitionItem.breakerType > 0 || definitionItem.defaultDamageTypeHash;
  const displayCommonality = definitionItem.collectibleHash && manifest.statistics.collections?.[definitionItem.collectibleHash];
  const displaySource = manifest.DestinyCollectibleDefinition[definitionItem.collectibleHash]?.sourceString && stringBeautifier('source', manifest.DestinyCollectibleDefinition[definitionItem.collectibleHash].sourceString);
  const displayStats = (item.stats?.length && !item.stats.find((stat) => stat.statHash === -1000)) || (item.stats?.length && item.stats.find((s) => s.statHash === -1000));
  const displayIntrinsic = item.sockets && item.sockets.socketCategories && item.sockets.sockets.filter((socket) => socket.isIntrinsic && socket.plug).length;
  const displaySockets = item.sockets && item.sockets.socketCategories && item.sockets.sockets.filter((socket) => (socket.isPerk || socket.isIntrinsic || socket.isMod || socket.isOrnament || socket.isSpawnFX) && !socket.isTracker && !socket.isShader && socket.plug).length;

  return (
    <div className='view' id='inspect'>
      <div className={cx('item-rarity', itemRarityToString(definitionItem.inventory.tierType), { masterworked })}>
        <div className='lattice' />
      </div>
      <div className='wrap'>
        <div className='module header'>
          <div className={cx('icon', { masterworked, exotic: definitionItem.inventory.tierType === DestinyTierType.Exotic })}>{definitionItem.displayProperties.icon ? <ObservedImage src={`https://www.bungie.net${definitionItem.displayProperties.icon}`} /> : null}</div>
          <div className='text'>
            <div className='name'>{definitionItem.displayProperties.name}</div>
            <div className='type'>{definitionItem.itemTypeDisplayName}</div>
          </div>
          <BungieText className='flair' value={definitionItem.displayProperties.description} />
        </div>
        {displayTaxonomy || displayCommonality || displaySource ? (
          <div className='module'>
            {displayTaxonomy ? (
              <div className='module taxonomy'>
                <div className='module-name'>{t('Basic characteristics')}</div>
                {powerCap ? (
                  <div className='term power-cap'>
                    <div className='icon' />
                    <div className='text'>
                      <div className='name'>{powerCap}</div>
                      <div className='type'>{t('Power limit')}</div>
                    </div>
                  </div>
                ) : null}
                {definitionItem.equippingBlock?.ammoType ? (
                  <div className='term ammo-type'>
                    <div className='icon'>{ammoTypeToAsset(definitionItem.equippingBlock.ammoType).icon}</div>
                    <div className='text'>
                      <div className='name'>{ammoTypeToAsset(definitionItem.equippingBlock.ammoType).string}</div>
                      <div className='type'>{t('Ammo type')}</div>
                    </div>
                  </div>
                ) : null}
                {definitionItem.breakerType > 0 ? (
                  <div className='term breaker-type'>
                    <div className='icon'>{breakerTypeToIcon(definitionItem.breakerTypeHash)}</div>
                    <div className='text'>
                      <div className='name'>{manifest.DestinyBreakerTypeDefinition[definitionItem.breakerTypeHash].displayProperties.name}</div>
                      <div className='type'>{t('Breaker type')}</div>
                    </div>
                  </div>
                ) : null}
                {definitionItem.defaultDamageTypeHash ? (
                  <div className='term damage-type'>
                    <div className={cx('icon', damageTypeToAsset(definitionItem.defaultDamageTypeHash).string)}>{damageTypeToAsset(definitionItem.defaultDamageTypeHash).char}</div>
                    <div className='text'>
                      <div className='name'>{manifest.DestinyDamageTypeDefinition[definitionItem.defaultDamageTypeHash].displayProperties.name}</div>
                      <div className='type'>{t('Energy affinity')}</div>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
            {definitionItem.collectibleHash && manifest.statistics.collections?.[definitionItem.collectibleHash] ? (
              <div className='module commonality'>
                <div className='module-name'>{t('Commonality')}</div>
                <div>
                  <div className='value tooltip' data-hash='commonality' data-type='braytech' data-related={definitionItem.collectibleHash}>
                    {commonality(manifest.statistics.collections[definitionItem.collectibleHash]).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
                  </div>
                </div>
                <div className='info'>{t("The collectible's rarity represented as a percentage of players who are indexed by VOLUSPA who've collected it.")}</div>
              </div>
            ) : null}
            {displaySource ? (
              <div className='module source'>
                <div className='module-name'>{t('Source')}</div>
                <div className='value'>{displaySource}</div>
              </div>
            ) : null}
          </div>
        ) : null}
        {displayStats || displayIntrinsic ? (
          <div className={cx('module')}>
            {displayStats ? (
              <div className='module stats'>
                <div className='module-name'>{definitionItem.itemType === DestinyItemType.Armor ? t('Armor stats') : t('Weapon stats')}</div>
                {item.stats.map((stat) => {
                  // map through stats

                  const armor2MasterworkValue = armor2MasterworkSockets && getSumOfArmorStats(armor2MasterworkSockets, [stat.statHash]);

                  const moddedValue = item.sockets && item.sockets.sockets && getModdedStatValue(item.sockets, stat);
                  const masterworkValue = (item.masterwork && item.masterwork.stats?.find((m) => m.hash === stat.statHash) && item.masterwork.stats?.find((m) => m.hash === stat.statHash).value) || armor2MasterworkValue || 0;

                  let baseBar = stat.value;

                  if (moddedValue) {
                    baseBar -= moddedValue;
                  }

                  if (masterworkValue) {
                    baseBar -= masterworkValue;
                  }

                  const segments = [[baseBar]];

                  if (moddedValue) {
                    segments.push([moddedValue, 'modded']);
                  }

                  if (masterworkValue) {
                    segments.push([masterworkValue, 'masterwork']);
                  }

                  if (stat.statHash === 2715839340) {
                    return (
                      <div key={stat.statHash} className='stat'>
                        <div className='name'>{stat.displayProperties.name}</div>
                        <div className='value'>
                          <div className={cx('text', { masterwork: masterworkValue !== 0, modded: moddedValue !== 0 })}>{stat.value}</div>
                          <RecoilStat value={stat.value} />
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={stat.statHash} className='stat'>
                      <div className='name'>{stat.statHash === -1000 ? t('Total') : stat.displayProperties.name}</div>
                      <div className={cx('value', { bar: stat.bar })}>
                        {stat.bar ? (
                          <>
                            {segments.map(([value, className], i) => (
                              <div key={i} className={cx('bar', className)} data-value={value} style={{ width: `${Math.min(100, Math.floor(100 * (value / stat.maximumValue)))}%` }} />
                            ))}
                            <div className='int'>{stat.value}</div>
                          </>
                        ) : (
                          <div className={cx('text', { masterwork: masterworkValue !== 0, modded: moddedValue !== 0 })}>
                            {stat.value} {statsMs.includes(stat.statHash) && 'ms'}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
            {displayIntrinsic ? (
              <div className='module sockets'>
                {preparedSockets
                  .filter((socketCategory) => socketCategory.sockets.filter((socket) => socket.isIntrinsic && socket.plug).length)
                  .reduce((array, socketCategory) => [...array, { ...socketCategory, sockets: socketCategory.sockets.filter((socket) => socket.isIntrinsic) }], [])
                  .map((socketCategory, c) => (
                    <Sockets key={c} itemHash={item.itemHash} itemSockets={item.sockets.sockets} {...socketCategory} selected={urlSockets} />
                  ))}
              </div>
            ) : null}
          </div>
        ) : null}
        {displaySockets ? (
          <div className={cx('module', 'sockets', 'perks', { double: !(displayTaxonomy || displayCommonality) })}>
            {preparedSockets
              .filter((socketCategory) => socketCategory.category.categoryStyle !== DestinySocketCategoryStyle.LargePerk)
              .map((socketCategory, c) => (
                <Sockets key={c} itemHash={item.itemHash} itemSockets={item.sockets.sockets} {...socketCategory} selected={urlSockets} masterwork={item.masterwork} handler_pointerOver={handler_pointerOver} handler_pointerOut={handler_pointerOut} />
              ))}
          </div>
        ) : null}
        {definitionLore ? (
          <div className='module lore'>
            <div className='module-name'>{t('Lore')}</div>
            <BungieText className='text' value={definitionLore.displayProperties.description} />
          </div>
        ) : null}
        {item.screenshot ? (
          <div className={cx('module', 'screenshot', { double: !definitionLore })}>
            <div className='module-name'>{t('Screenshot')}</div>
            <div className='frame'>
              <ObservedImage src={`https://www.bungie.net${item.screenshot}`} />
            </div>
          </div>
        ) : null}
        {definitionItem.itemType === DestinyItemType.Emblem ? (
          <div className='module'>
            <Emblem itemHash={definitionItem.hash} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function socketsUrl(itemHash, sockets, selectedSockets, socketIndex, plugHash) {
  const socketsString = sockets.map((socket, s) => {
    // replace with plugHash at appropriate socket index
    if (socket.socketIndex === socketIndex) return plugHash;

    // return current or null
    return selectedSockets?.[s] || '';
  });

  // create string
  return `/inspect/item/${itemHash}?sockets=${socketsString.join('/')}`;
}

function selectedSockets(query = [], hover = []) {
  if (query.length && hover.length) {
    return query.map((value, v) => {
      const hoverPerk = hover.find((h) => h.socketIndex === v);

      if (hoverPerk) {
        return hoverPerk.plugHash;
      }

      return Number(value) || '';
    });
  }

  return query.map((value) => Number(value) || '');
}

function createItem(itemHash, selectedSockets = []) {
  const item = {
    itemHash,
    itemInstanceId: false,
    itemComponents: false,
    showHiddenStats: true,
    showDefaultSockets: true,
  };

  const definitionItem = manifest.DestinyInventoryItemDefinition[item.itemHash];

  item.screenshot = definitionItem.screenshot && definitionItem.screenshot !== '' && definitionItem.screenshot;

  // process sockets
  item.sockets = sockets(item);

  // adjust sockets according to user selection
  if (item.sockets.sockets) {
    item.sockets.sockets = item.sockets.sockets.map((socket, s) => {
      const selectedPlugHash = selectedSockets[s] || 0;

      // if user has selected a plug
      if (selectedPlugHash > 0) {
        // set active plug as primary plug
        socket.plug = (selectedPlugHash && socket.plugOptions.find((plugOption) => selectedPlugHash === plugOption.definition.hash)) || socket.plug;

        return socket;
      }

      return socket;
    });

    const ornamentSocket = getOrnamentSocket(item.sockets);
    if (ornamentSocket?.plug?.definition?.screenshot) {
      item.screenshot = ornamentSocket.plug.definition.screenshot && ornamentSocket.plug.definition.screenshot !== '' && ornamentSocket.plug.definition.screenshot;
    }
  }

  // stats and masterwork as per usual
  item.stats = stats(item);
  item.masterwork = masterwork(item);

  return item;
}

function RecoilStat({ value }) {
  // A value from 100 to -100 where positive is right and negative is left
  // See https://imgur.com/LKwWUNV
  const direction = Math.sin((value + 5) * ((2 * Math.PI) / 20)) * (100 - value) * (Math.PI / 180);

  const x = Math.sin(direction);
  const y = Math.cos(direction);

  const spread = 0.75;
  const xSpreadMore = Math.sin(direction + direction * spread);
  const ySpreadMore = Math.cos(direction + direction * spread);
  const xSpreadLess = Math.sin(direction - direction * spread);
  const ySpreadLess = Math.cos(direction - direction * spread);

  return (
    <svg height='12' viewBox='0 0 2 1'>
      {/* <circle r={1} cx={1} cy={1} fill="rgba(255, 255, 255, 0.2)" /> */}
      <rect width='2' height='1' fill='rgba(255, 255, 255, 0.2)' />
      {Math.abs(direction) > 0.1 ? <path d={`M1,1 L${1 + xSpreadMore},${1 - ySpreadMore} A1,1 0 0,${direction < 0 ? '1' : '0'} ${1 + xSpreadLess},${1 - ySpreadLess} Z`} fill='#FFF' /> : <line x1={1 - x} y1={1 + y} x2={1 + x} y2={1 - y} stroke='white' strokeWidth='0.1' />}
    </svg>
  );
}

function Sockets({ itemHash, itemSockets, category, sockets, selected, masterwork, ...props }) {
  const member = useSelector((state) => state.member);
  const dispatch = useDispatch();
  const [socketState, setSocketState] = useState([]);

  useEffect(() => {
    // runs on init for each socket. unsure how to fix cleanly
    dispatch(actions.tooltips.rebind());
  }, [dispatch, socketState]);

  const toggleSocket = (socketIndex) => (e) => {
    if (socketState.indexOf(socketIndex) > -1) {
      setSocketState([...socketState.filter((i) => i !== socketIndex)]);
    } else {
      setSocketState([
        //...socketState,
        socketIndex,
      ]);
    }
  };

  const socketsToMap = sockets.filter((socket) => socket.socketDefinition.defaultVisible).filter((socket) => !socket.isTracker);
  const expandedSocket = socketsToMap.find((socket) => socketState.indexOf(socket.socketIndex) > -1);

  const isIntrinsic = sockets.length === 1 && sockets[0].isIntrinsic && sockets[0].plugOptions.length === 1;
  const isEnergyMeter = category.categoryStyle === DestinySocketCategoryStyle.EnergyMeter;
  const isPerks = category.categoryStyle !== DestinySocketCategoryStyle.Consumable;
  const isMods = category.categoryStyle === DestinySocketCategoryStyle.Consumable;

  return (
    <div className={cx('module', 'category', { mods: isMods, intrinsic: isIntrinsic, perks: isPerks && !isEnergyMeter, 'energy-meter': isEnergyMeter })}>
      <div className='module-name'>{category.displayProperties.name}</div>
      <div className='category-sockets'>
        {socketsToMap.map((socket, s) => {
          // intrinsics
          if (isIntrinsic) {
            return (
              <div key={s} className='socket intrinsic'>
                {socket.plugOptions.map((plug, p) => {
                  return (
                    <div key={p} className='plug active'>
                      <div className='icon'>
                        <ObservedImage src={plug.definition.displayProperties.localIcon ? `${plug.definition.displayProperties.icon}` : `https://www.bungie.net${plug.definition.displayProperties.icon}`} />
                      </div>
                      <div className='text'>
                        <div className='name'>{plug.definition.displayProperties.name}</div>
                        <BungieText className='description' value={plug.definition.displayProperties.description} />
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          } // armor tier
          else if (isEnergyMeter) {
            const { energyTypeHash, capacityValue, usedValue } = masterwork?.energy || {};
            const energyAsset = energyTypeToAsset(energyTypeHash);
            const masterworkTiers = Array(10)
              .fill('disabled')
              .fill('unused', 0, capacityValue || 0)
              .fill('used', 0, usedValue || 0);

            // console.log(socket.plug.definition.plug);

            return (
              <div key={s} className={cx('energy-meter', energyAsset.string, 'socket', { expanded: socketState.indexOf(socket.socketIndex) > -1 })}>
                <div key={s} className='socket affinity'>
                  <div className={cx('plug', 'active', energyAsset?.string !== 'any' && energyAsset?.string)} data-tooltip='mouse' data-hash={socket.plug.definition.hash} onClick={toggleSocket(socket.socketIndex)}>
                    {energyAsset.char}
                  </div>
                </div>
                <div className='masterwork'>
                  <div className='upgrade'>
                    <div className='capacity'>
                      <div className='value'>{capacityValue || 0}</div>
                      <div className='text'>{t('Energy')}</div>
                    </div>
                    {capacityValue ? (
                      <div className={cx('unused', { debt: capacityValue - usedValue < 0 })}>
                        <div className='text'>{t('Unused')}</div>
                        <div className='value'>{capacityValue - usedValue}</div>
                      </div>
                    ) : null}
                  </div>
                  <div className='upgrade-icon'></div>
                  <div className='masterwork tiers'>
                    {masterworkTiers.map((state, tier) => (
                      <div key={tier} className={cx('tier', state, { debt: state === 'used' && tier >= capacityValue })} />
                    ))}
                  </div>
                </div>
              </div>
            );
          } // perks
          else if (isPerks) {
            return (
              <div key={s} className={cx('socket', { intrinsic: socket.isIntrinsic, columned: category.categoryStyle !== 2 && socket.plugOptions.length > 7 })} style={{ '--socket-columns': Math.ceil(socket.plugOptions.length / 6) }}>
                {socket.plugOptions.map((plug, p) => {
                  const active = plug.definition.hash === socket.plug.definition?.hash;

                  return (
                    <div key={p} onPointerOver={props.handler_pointerOver(socket.socketIndex, plug.definition.hash)} onPointerOut={props.handler_pointerOut} className={cx('plug', { active })} data-tooltip={active || 'mouse'} data-hash={plug.definition.hash} data-basehash={itemHash} data-style='ui'>
                      <div className='icon'>
                        <ObservedImage src={plug.definition.displayProperties.localIcon ? `${plug.definition.displayProperties.icon}` : `https://www.bungie.net${plug.definition.displayProperties.icon}`} />
                      </div>
                      <Link to={socketsUrl(itemHash, itemSockets, selected, socket.socketIndex, plug.definition.hash)} />
                    </div>
                  );
                })}
              </div>
            );
          } // mods
          else {
            const energyAsset = socket.plug.definition.plug?.energyCost?.energyTypeHash && energyTypeToAsset(socket.plug.definition.plug.energyCost.energyTypeHash);

            return (
              <div key={s} className={cx('socket', { expanded: socketState.indexOf(socket.socketIndex) > -1 })}>
                <div className={cx('plug', 'active', energyAsset?.string !== 'any' && energyAsset?.string)} data-tooltip='mouse' data-hash={socket.plug.definition.hash} data-basehash={itemHash} onClick={toggleSocket(socket.socketIndex)}>
                  <div className='icon'>
                    <ObservedImage src={socket.plug.definition.displayProperties.localIcon ? `${socket.plug.definition.displayProperties.icon}` : `https://www.bungie.net${socket.plug.definition.displayProperties.icon}`} />
                    {socket.plug.definition.plug?.energyCost?.energyCost ? <div className='energy-cost'>{socket.plug.definition.plug.energyCost.energyCost}</div> : null}
                  </div>
                </div>
              </div>
            );
          }
        })}
        {expandedSocket ? (
          <div className='socket options'>
            {expandedSocket.plugOptions.map((plug, p) => {
              // relevant energy asset
              const energyAsset = plug.definition.plug?.energyCost?.energyTypeHash && energyTypeToAsset(plug.definition.plug.energyCost.energyTypeHash);
              // got a collectible hash? let's see if you own it
              const collectibleState = getCollectibleState(member, plug.definition.collectibleHash);
              // if weapon, checks if the masterwork plug options have matching investment stats
              const mismatchedMasterwork = manifest.DestinyInventoryItemDefinition[itemHash].itemType === DestinyItemType.Weapon && expandedSocket.isMasterwork && plug.definition.investmentStats && plug.definition.investmentStats.filter((stat) => manifest.DestinyInventoryItemDefinition[itemHash].investmentStats?.filter((s) => s.statTypeHash === stat.statTypeHash).length && stat.value > 0).length !== plug.definition.investmentStats.length;

              const unavailable = mismatchedMasterwork;

              return (
                <div
                  key={p}
                  className={cx('plug', energyAsset?.string !== 'any' && energyAsset?.string, {
                    // masterworked: plug.stats && Object.keys(plug.stats).filter((key) => plug.stats[key] > 9).length,
                    obtained: collectibleState && member.data ? !enumerateCollectibleState(collectibleState).NotAcquired : true,
                    unavailable,
                    active: plug.definition.hash === expandedSocket.plug.definition?.hash,
                  })}
                  data-tooltip='mouse'
                  data-hash={plug.definition.hash}
                  data-basehash={itemHash}
                >
                  <div className='icon'>
                    <ObservedImage src={plug.definition.displayProperties.localIcon ? `${plug.definition.displayProperties.icon}` : `https://www.bungie.net${plug.definition.displayProperties.icon}`} />
                    {plug.definition.plug?.energyCost?.energyCost ? <div className='energy-cost'>{plug.definition.plug.energyCost.energyCost}</div> : null}
                  </div>
                  <Link to={socketsUrl(itemHash, itemSockets, selected, expandedSocket.socketIndex, plug.definition.hash)} onClick={toggleSocket(expandedSocket.socketIndex)} />
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Emblem({ itemHash, ...props }) {
  const definitionEmblem = manifest.DestinyInventoryItemDefinition[itemHash];

  const displayName = useSelector((state) => state.member.data.profile?.profile.data.userInfo.displayName) || 'justrealmilk';
  const light = useSelector((state) => state.member.data.profile?.characters.data[0].light) || '100';

  return (
    <div className='emblem'>
      <div className='wrapper'>
        <ObservedImage className={cx('image', 'secondary-icon', { missing: !definitionEmblem.secondaryIcon })} src={`https://www.bungie.net${definitionEmblem.secondaryIcon ? definitionEmblem.secondaryIcon : `/img/misc/missing_icon_d2.png`}`} />
        <div className='display-name'>{displayName}</div>
        <div className='light'>{light}</div>
      </div>
    </div>
  );
}
