import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import manifest from '../../utils/manifest';
import store from '../../store';
import * as bungie from '../../utils/bungie';
import * as enums from '../../utils/destinyEnums';
import { NoAuth, DiffProfile } from '../../components/BungieAuth';
import Items from '../../components/Items';
import Spinner from '../../components/UI/Spinner';

import './styles.css';

const equipItem = (member) => (item) => async (e) => {
  // console.log(item, member);

  try {
    await bungie.EquipItem({
      itemId: item.itemInstanceId,
      characterId: member.characterId,
      membershipType: member.membershipType,
    });

    store.dispatch({ type: 'MEMBER_IS_STALE', payload: member });
  } catch (e) {
    store.dispatch({
      type: 'NOTIFICATIONS_PUSH',
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

const bucketsWeapons = [enums.DestinyInventoryBucket.KineticWeapons, enums.DestinyInventoryBucket.EnergyWeapons, enums.DestinyInventoryBucket.PowerWeapons];
const bucketsArmor = [enums.DestinyInventoryBucket.Helmet, enums.DestinyInventoryBucket.Gauntlets, enums.DestinyInventoryBucket.ChestArmor, enums.DestinyInventoryBucket.LegArmor, enums.DestinyInventoryBucket.ClassArmor];
const bucketsAuxiliary = [enums.DestinyInventoryBucket.Ghost, enums.DestinyInventoryBucket.Vehicle, enums.DestinyInventoryBucket.Ships, enums.DestinyInventoryBucket.Emblems];

const slotsValue = 9;

function Inventory(props) {
  useEffect(() => {
    props.rebindTooltips();
  });

  if (!props.member.data.profile.profileInventory?.data && !props.auth) {
    return <NoAuth />;
  }

  if (!props.member.data.profile.profileInventory?.data && props.auth && !props.auth.destinyMemberships.find((m) => m.membershipId === props.member.membershipId)) {
    return <DiffProfile />;
  }

  if (!props.member.data.profile.profileInventory?.data && props.auth && props.auth.destinyMemberships.find((m) => m.membershipId === props.member.membershipId)) {
    return (
      <div className='view' id='inventory'>
        <Spinner />
      </div>
    );
  }

  const member = { membershipType: props.member.membershipType, membershipId: props.member.membershipId, characterId: props.member.characterId };

  return (
    <div className='view' id='inventory'>
      <div className='equipment'>
        <div className='buckets weapons'>
          {bucketsWeapons.map((bucketHash, b) => (
            <div key={b} className='bucket'>
              <ul className='list inventory-items equipped'>
                <Items items={itemsInBucket(member.data.inventory, bucketHash, true)} />
              </ul>
              <ul className='list inventory-items'>
                <Items items={itemsInBucket(member.data.inventory, bucketHash)} placeholders={slotsValue} handler={equipItem(member)} />
              </ul>
            </div>
          ))}
        </div>
        <div className='buckets armor'>
          {bucketsArmor.map((bucketHash, b) => (
            <div key={b} className='bucket'>
              <ul className='list inventory-items equipped'>
                <Items items={itemsInBucket(member.data.inventory, bucketHash, true)} />
              </ul>
              <ul className='list inventory-items'>
                <Items items={itemsInBucket(member.data.inventory, bucketHash)} placeholders={slotsValue} handler={equipItem(member)} />
              </ul>
            </div>
          ))}
        </div>
        <div className='buckets auxiliary'>
          {bucketsAuxiliary.map((bucketHash, b) => (
            <div key={b} className='bucket'>
              <ul className='list inventory-items equipped'>
                <Items items={itemsInBucket(member.data.inventory, bucketHash, true)} />
              </ul>
              <ul className='list inventory-items'>
                <Items items={itemsInBucket(member.data.inventory, bucketHash)} placeholders={slotsValue} handler={equipItem(member)} />
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    member: state.member,
    auth: state.auth,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    rebindTooltips: (value) => {
      dispatch({ type: 'TOOLTIPS_REBIND', payload: new Date().getTime() });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Inventory);
