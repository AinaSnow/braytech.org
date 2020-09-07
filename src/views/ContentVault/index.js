import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import cx from 'classnames';

import actions from '../../store/actions';
import { t, BraytechText } from '../../utils/i18n';
import manifest from '../../utils/manifest';
import { DestinyContentVault } from '../../utils/destinyEnums';

import Collectibles from '../../components/Collectibles';
import Records from '../../components/Records';
import Button from '../../components/UI/Button';
import Upsell from '../../components/UI/Upsell';

import { Common } from '../../svg';

import './styles.css';

export function NavLinks() {
  return (
    <div className='module views'>
      <ul className='list'>
        <li className='linked'>
          <div className='icon'>
            <Common.Seasons />
          </div>
          <NavLink to='/content-vault' exact />
        </li>
      </ul>
    </div>
  );
}

function ToggleCompletedLink() {
  const settings = useSelector((state) => state.settings);
  const dispatch = useDispatch();

  const visible = settings.itemVisibility.hideCompletedRecords || settings.itemVisibility.hideCompletedCollectibles;

  function handler() {
    const state = {
      itemVisibility: {
        hideCompletedRecords: !visible,
        hideCompletedCollectibles: !visible,
      },
    };

    dispatch(actions.settings.set(state));
  }

  return (
    <Button action={handler}>
      {visible ? (
        <>
          <i className='segoe-mdl-square-checked' />
          {t('Show all')}
        </>
      ) : (
        <>
          <i className='segoe-mdl-square' />
          {t('Hide redeemed')}
        </>
      )}
    </Button>
  );
}

export default function ContentVault(props) {
  const dispatch = useDispatch();
  const member = useSelector(state => state.member);
  const entries = useRef();

  const slug = props.match.params.slug;

  useEffect(() => {
    window.scrollTo(0, 0);

    dispatch(actions.tooltips.rebind());
  }, []);

  function scrollIntoView() {
    if (entries.current) {
      entries.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const data = DestinyContentVault[0];
  const selectedVault = (slug && data.vault.find((vault) => slug === vault.slug)) || data.vault[0];

  const collectibles =
    selectedVault &&
    [
      ...selectedVault.buckets.collectibles, // static collectibles
      ...selectedVault.buckets.nodes
        .reduce(
          (array, presentationNodeHash) => [
            // derived from presentation nodes
            ...array,
            manifest.DestinyPresentationNodeDefinition[presentationNodeHash].children.collectibles.map((collectible) => collectible.collectibleHash),
          ],
          []
        )
        .flat(),
    ].sort((a, b) => manifest.DestinyInventoryItemDefinition[manifest.DestinyCollectibleDefinition[a]?.itemHash]?.itemType - manifest.DestinyInventoryItemDefinition[manifest.DestinyCollectibleDefinition[b]?.itemHash]?.itemType);
  const records = selectedVault && [
    ...selectedVault.buckets.records, // static records
    ...selectedVault.buckets.nodes
      .reduce(
        (array, presentationNodeHash) => [
          // derived from presentation nodes
          ...array,
          manifest.DestinyPresentationNodeDefinition[presentationNodeHash].children.records.map((record) => record.recordHash),
        ],
        []
      )
      .flat(),
  ];

  return (
    <>
      <div className='view' id='content-vault'>
        <div className='module head'>
          <div className='page-header'>
            <div className='sub-name'>{t('Content Vault')}</div>
            <div className='name'>{t('Season {{season}}', { season: data.season })}</div>
          </div>
          <BraytechText className='text' value={t('ContentVault.Header.Text')} />
        </div>
        {!member.loading && !member.data ? (
          <Upsell />
        ) : null}
        <div className='buff'>
          <NavLinks />
          <div className='presentation-node'>
            <div className='node'>
              <div className='children'>
                <h4>{t('Areas')}</h4>
                <ul className='list secondary'>
                  {data.vault.map((vault, v) => {
                    const isActive = (match, location) => {
                      if (selectedVault.slug === vault.slug) {
                        return true;
                      } else if (match) {
                        return true;
                      } else {
                        return false;
                      }
                    };

                    return (
                      <li key={v} className={cx('linked', { active: isActive })}>
                        <div className='text'>
                          <div className='name'>{vault.name}</div>
                        </div>
                        <NavLink isActive={isActive} to={`/content-vault/${data.season}/${vault.slug}`} onClick={scrollIntoView} />
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div ref={entries} className='entries'>
                {collectibles.length ? (
                  <>
                    <h4>{t('Collectibles')}</h4>
                    <ul className='list collection-items'>
                      <Collectibles hashes={collectibles} suppressVaultWarning selfLinkFrom={`/content-vault/${data.season}/${selectedVault.slug}`} showInvisible />
                    </ul>
                  </>
                ) : null}
                {records.length ? (
                  <>
                    <h4>{t('Records')}</h4>
                    <ul className='list record-items'>
                      <Records hashes={records} suppressVaultWarning selfLinkFrom={`/content-vault/${data.season}/${selectedVault.slug}`} showInvisible />
                    </ul>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='sticky-nav'>
        <div className='wrapper'>
          <div />
          <ul>
            <li>
              <ToggleCompletedLink />
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
