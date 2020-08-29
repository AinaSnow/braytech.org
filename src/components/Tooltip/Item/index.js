import React from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';

import { t, duration, timestampToDifference, BraytechText } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import { itemRarityToString } from '../../../utils/destinyConverters';
import { DestinyItemType, trialsPassages, enumerateItemState, enumerateVendorItemStatus } from '../../../utils/destinyEnums';
import { isContentVaulted } from '../../../utils/destinyUtils';
import ObservedImage from '../../ObservedImage';
import { Common } from '../../../svg';

import itemComponents from '../../../utils/destinyItems/itemComponents';
import sockets from '../../../utils/destinyItems/sockets';
import stats from '../../../utils/destinyItems/stats';
import masterwork from '../../../utils/destinyItems/masterwork';
import { getOrnamentSocket } from '../../../utils/destinyItems/utils';

import './styles.css';

import Default from './Default';
import Equipment from './Equipment';
import Emblem from './Emblem';
import Mod from './Mod';
import Subclass from './Subclass';
import TrialsPassage from './TrialsPassage';

const woolworths = {
  equipment: Equipment,
  emblem: Emblem,
  mod: Mod,
  'sub-class': Subclass,
  'trials-passage': TrialsPassage,
};

const hideScreenshotBuckets = [
  3284755031, // subclass
  1506418338, // artifact
];

const forcedScreenshotTraits = ['ornament'];

export default function Item(props) {
  const viewport = useSelector((state) => state.viewport);
  const member = useSelector((state) => state.member);

  const definitionItem = manifest.DestinyInventoryItemDefinition[props.hash];

  const item = {
    itemHash: +props.hash,
    itemInstanceId: props.instanceid,
    itemComponents: null,
    itemState: +props.state || 0,
    quantity: +props.quantity || 1,
    baseHash: +props.basehash || undefined,
    vendorHash: props.vendorhash,
    vendorItemIndex: props.vendoritemindex && +props.vendoritemindex,
    vendorSaleStatus: props.vendorsalestatus && +props.vendorsalestatus,
    failureIndexes: props.failureindexes && JSON.parse(props.failureindexes),
    rarity: itemRarityToString(definitionItem?.inventory?.tierType),
    type: null,
    style: props.style,
  };

  if (item.itemHash !== 343 && !definitionItem) {
    return null;
  }

  if (item.itemHash === 343 || definitionItem.redacted) {
    return (
      <>
        <div className='acrylic' />
        <div className={cx('frame', 'common')}>
          <div className='header'>
            <div className='name'>{t('Classified')}</div>
            <div>
              <div className='kind'>{t('Insufficient clearance')}</div>
            </div>
          </div>
          <div className='black'>
            <div className='description'>
              <pre>{t('Keep it clean.')}</pre>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (definitionItem?.inventory) {
    if (definitionItem.itemType === DestinyItemType.Armor || definitionItem.itemType === DestinyItemType.Weapon || definitionItem.itemType === DestinyItemType.Ship || definitionItem.itemType === DestinyItemType.Vehicle || definitionItem.itemType === DestinyItemType.Ghost || definitionItem.itemType === DestinyItemType.SeasonArtifact) {
      item.type = 'equipment';
    } else if (definitionItem.itemType === DestinyItemType.Emblem) {
      item.type = 'emblem';
    } else if (definitionItem.itemType === DestinyItemType.Mod) {
      item.type = 'mod';
    } else if (definitionItem.itemType === DestinyItemType.Subclass) {
      item.type = 'sub-class';
    } else if (trialsPassages.indexOf(definitionItem.hash) > -1) {
      item.type = 'trials-passage';
    }
  }

  // item.itemState = itemState(item, member);
  item.itemComponents = itemComponents(item, member);
  item.sockets = sockets(item);
  item.stats = stats(item);
  item.masterwork = masterwork(item);
  item.screenshot = definitionItem.screenshot && definitionItem.screenshot !== '' && definitionItem.screenshot;

  item.primaryStat = (definitionItem.itemType === 2 || definitionItem.itemType === 3) &&
    definitionItem.stats &&
    !definitionItem.stats.disablePrimaryStatDisplay &&
    definitionItem.stats.primaryBaseStatHash && {
      hash: definitionItem.stats.primaryBaseStatHash,
      displayProperties: manifest.DestinyStatDefinition[definitionItem.stats.primaryBaseStatHash].displayProperties,
      value: 750,
    };

  if (item.primaryStat && item.itemComponents && item.itemComponents.instance?.primaryStat) {
    item.primaryStat.value = item.itemComponents.instance.primaryStat.value;
  } else if (item.primaryStat && member?.data) {
    const character = member.data.profile.characters.data.find((character) => character.characterId === member.characterId);

    // item.primaryStat.value = Math.floor((942 / 973) * character.light);
    item.primaryStat.value = character.light;
  }

  // console.log(item)

  const importantText = [];

  const isVaultedItem = isContentVaulted(definitionItem.collectibleHash);
  if (definitionItem.collectibleHash && isVaultedItem) {
    importantText.push(
      <BraytechText
        value={t('This collectible will be added to the _Content Vault_ in {{duration}}', {
          duration: duration(timestampToDifference(`${isVaultedItem.releaseDate}T${isVaultedItem.resetTime}`, 'days'), { unit: 'days' }),
        })}
      />
    );
  }

  if (item.failureIndexes?.length && item.vendorHash && !enumerateVendorItemStatus(item.vendorSaleStatus).Success) {
    item.failureIndexes.forEach((index) => {
      const failureString = manifest.DestinyVendorDefinition[item.vendorHash]?.failureStrings?.[index];

      if (failureString && failureString !== '') {
        importantText.push(<BraytechText value={failureString} />);
      }
    });
  } else if (item.failureIndexes?.length === 0 && !enumerateVendorItemStatus(item.vendorSaleStatus).Success) {
    if (enumerateVendorItemStatus(item.vendorSaleStatus).UniquenessViolation) {
      importantText.push(t('Vendor.FailureStrings.UniquenessViolation'));
    } else if (enumerateVendorItemStatus(item.vendorSaleStatus).NoFunds) {
      importantText.push(t('Vendor.FailureStrings.NoFunds'));
    } else if (enumerateVendorItemStatus(item.vendorSaleStatus).NoInventorySpace) {
      importantText.push(t('Vendor.FailureStrings.NoInventorySpace'));
    } else {
      Object.keys(enumerateVendorItemStatus(item.vendorSaleStatus))
        .filter((key) => enumerateVendorItemStatus(item.vendorSaleStatus)[key])
        .map((key) => key)
        .forEach((key) => {
          importantText.push(key);
        });
    }
  }

  if (!item.itemComponents && props.uninstanced) {
    importantText.push(<BraytechText value={t('Collections roll')} />);
  }

  const Meat = item.type && woolworths[item.type];

  if (item.sockets) {
    const ornamentSocket = getOrnamentSocket(item.sockets);

    if (ornamentSocket?.plug?.definition?.screenshot) {
      item.screenshot = ornamentSocket.plug.definition.screenshot;
    }
  }

  const masterworked = enumerateItemState(item.itemState).Masterworked || (!item.itemInstanceId && (definitionItem.itemType === DestinyItemType.Armor ? item.masterwork?.stats?.filter((stat) => stat.value > 9).length : item.masterwork?.socketIndex && item.sockets?.sockets?.[item.masterwork.socketIndex]?.plug?.definition?.investmentStats?.filter((stat) => stat.value > 9).length));
  const locked = enumerateItemState(item.itemState).Locked;

  const showScreenshot =
    // if viewport is less than 601, item has a screenshot, and hideScreenshotBuckets does not mind this item
    (viewport.width <= 600 && item.screenshot && !(definitionItem && definitionItem.inventory && hideScreenshotBuckets.includes(definitionItem.inventory.bucketTypeHash))) ||
    (item.screenshot &&
      // if item is one of these fellas, force show screenshot always
      (definitionItem.traitIds?.filter((id) => forcedScreenshotTraits.filter((trait) => id.includes(trait)).length).length || definitionItem.plug?.plugCategoryIdentifier?.includes('armor_skins')));

  return (
    <>
      <div className='wrapper'>
        <div className='acrylic' />
        <div className={cx('frame', 'item', item.style, item.type, item.rarity, { masterworked: masterworked })}>
          <div className='header'>
            <div className='lattice' />
            <div className='name'>{definitionItem.displayProperties && definitionItem.displayProperties.name}</div>
            <div>
              {definitionItem.itemTypeDisplayName && definitionItem.itemTypeDisplayName !== '' ? <div className='kind'>{definitionItem.itemTypeDisplayName}</div> : null}
              <div>
                {item.rarity && item.style !== 'ui' ? <div className='rarity'>{definitionItem.inventory.tierTypeName}</div> : null}
                {locked && item.style !== 'ui' ? (
                  <div className='item-state'>
                    <div className='locked'>
                      <Common.ItemStateLocked />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          {importantText.length ? (
            <div className='highlight major'>
              {importantText.map((text, t) => (
                <React.Fragment key={t}>{text}</React.Fragment>
              ))}
            </div>
          ) : null}
          <div className='black'>
            {showScreenshot ? (
              <div className='screenshot'>
                <ObservedImage className='image' src={`https://www.bungie.net${item.screenshot}`} />
              </div>
            ) : null}
            {woolworths[item.type] ? <Meat {...item} /> : <Default {...item} />}
          </div>
        </div>
      </div>
    </>
  );
}

export function VendorCosts({ costs, ...props }) {
  const member = useSelector((state) => state.member);

  // console.log(Object.values(member.data.currencies).map(c => ({ name: manifest.DestinyInventoryItemDefinition[c.itemHash].displayProperties.name, ...c })))

  return (
    <div className='vendor-costs'>
      <ul>
        {costs.map((cost, c) => {
          const icon = manifest.DestinyInventoryItemDefinition[cost.itemHash]?.displayProperties.icon;
          const memberHas = member.data ? member.data.currencies[cost.itemHash]?.quantity || 0 : undefined;

          return (
            <li key={c} className={cx({ 'not-enough-materials': memberHas < cost.quantity })}>
              <ul>
                <li>
                  {icon && <ObservedImage className='image icon' src={`https://www.bungie.net${icon}`} />}
                  <div className='text'>{manifest.DestinyInventoryItemDefinition[cost.itemHash]?.displayProperties.name}</div>
                </li>
                <li>
                  <div className='text'>
                    {memberHas !== undefined ? <span>{memberHas.toLocaleString()}</span> : null}
                    {cost.quantity.toLocaleString()}
                  </div>
                </li>
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
