import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import manifest from '../../utils/manifest';
import store from '../../store';
import * as bungie from '../../utils/bungie';
import * as enums from '../../utils/destinyEnums';
import { NoAuth, DiffProfile } from '../../components/BungieAuth';
import Items from '../../components/Items';
import Spinner from '../../components/UI/Spinner';

import './styles.css';
import actions from '../../store/actions';

const equipItem = (member) => (item) => async (e) => {
  // console.log(item, member);

  try {
    await bungie.EquipItem({
      itemId: item.itemInstanceId,
      characterId: member.characterId,
      membershipType: member.membershipType,
    });

    store.dispatch({ type: 'MEMBER_IS_STALE', payload: member });
    store.dispatch({
      type: 'PUSH_NOTIFICATION',
      payload: {
        date: new Date().toISOString(),
        expiry: 86400000,
        displayProperties: {
          name: 'ty',
          timeout: 4,
        }
      },
    });
  } catch (e) {
    store.dispatch({
      type: 'PUSH_NOTIFICATION',
      payload: {
        error: true,
        date: new Date().toISOString(),
        expiry: 86400000,
        displayProperties: {
          name: e.errorStatus,
          description: e.message,
          timeout: 10,
        },
        javascript: e,
      },
    });
  }
};

function itemsInBucket(inventory, bucketHash, equipped) {
  return inventory.filter((item) => item.bucketHash === bucketHash && (equipped ? enums.enumerateTransferStatus(item.transferStatus).ItemIsEquipped : !enums.enumerateTransferStatus(item.transferStatus).ItemIsEquipped));
}

const bucketsWeapons = [enums.DestinyInventoryBucket.Subclass, enums.DestinyInventoryBucket.KineticWeapons, enums.DestinyInventoryBucket.EnergyWeapons, enums.DestinyInventoryBucket.PowerWeapons];
const bucketsArmor = [enums.DestinyInventoryBucket.Helmet, enums.DestinyInventoryBucket.Gauntlets, enums.DestinyInventoryBucket.ChestArmor, enums.DestinyInventoryBucket.LegArmor, enums.DestinyInventoryBucket.ClassArmor];
const bucketsAuxiliary = [enums.DestinyInventoryBucket.Ghost, enums.DestinyInventoryBucket.Vehicle, enums.DestinyInventoryBucket.Ships, enums.DestinyInventoryBucket.Emblems];

const slotsValue = 9;

export default function Inventory(props) {
  const member = useSelector(state => state.member);
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.tooltips.rebind());
  });

  if (!member.data.profile.profileInventory?.data && !auth) {
    return <NoAuth />;
  }

  if (!member.data.profile.profileInventory?.data && auth && !auth.destinyMemberships.find((m) => m.membershipId === props.member.membershipId)) {
    return <DiffProfile />;
  }

  if (!member.data.profile.profileInventory?.data && auth && auth.destinyMemberships.find((m) => m.membershipId === member.membershipId)) {
    return (
      <div className='view' id='inventory'>
        <Spinner />
      </div>
    );
  }

  const membership = { membershipType: member.membershipType, membershipId: member.membershipId, characterId: member.characterId };

  const inventory = member.data.inventory.filter(item => item.characterId ? item.characterId === member.characterId : true);




  return (
    <div className='view' id='inventory'>
      <div className='equipment'>
        <div className='buckets weapons'>
          {bucketsWeapons.map((bucketHash, b) => (
            <div key={b} className='bucket'>
              <ul className='list inventory-items equipped'>
                <Items items={itemsInBucket(inventory, bucketHash, true)} />
              </ul>
              <ul className='list inventory-items'>
                <Items items={itemsInBucket(inventory, bucketHash)} placeholders={slotsValue} handler={equipItem(membership)} />
              </ul>
            </div>
          ))}
        </div>
        <div className='buckets armor'>
          {bucketsArmor.map((bucketHash, b) => (
            <div key={b} className='bucket'>
              <ul className='list inventory-items equipped'>
                <Items items={itemsInBucket(inventory, bucketHash, true)} />
              </ul>
              <ul className='list inventory-items'>
                <Items items={itemsInBucket(inventory, bucketHash)} placeholders={slotsValue} handler={equipItem(membership)} />
              </ul>
            </div>
          ))}
        </div>
        <div className='buckets auxiliary'>
          {bucketsAuxiliary.map((bucketHash, b) => (
            <div key={b} className='bucket'>
              <ul className='list inventory-items equipped'>
                <Items items={itemsInBucket(inventory, bucketHash, true)} />
              </ul>
              <ul className='list inventory-items'>
                <Items items={itemsInBucket(inventory, bucketHash)} placeholders={slotsValue} handler={equipItem(membership)} />
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}