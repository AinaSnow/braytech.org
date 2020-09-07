import React from 'react';
import { useSelector } from 'react-redux';

import { Records, unredeemedRecords } from '../Records';

export default function RecordsUnredeemed({ limit, ...props }) {
  const member = useSelector((state) => state.member);

  const hashes = unredeemedRecords(member).map((record) => record.recordHash);

  return (
    <>
      <ul className='list record-items'>
        <Records hashes={hashes} ordered='rarity' limit={limit} selfLinkFrom={props.selfLinkFrom} />
      </ul>
    </>
  );
}
