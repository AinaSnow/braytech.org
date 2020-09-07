import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useParams, Link, NavLink } from 'react-router-dom';
import cx from 'classnames';

import { t, BungieText, BraytechText } from '../../utils/i18n';
import manifest from '../../utils/manifest';
import { classTypeToString } from '../../utils/destinyConverters';

import Items from '../../components/Items';
import Records from '../../components/Records';
import { Button, DestinyKey } from '../../components/UI/Button';
import ProgressBar from '../../components/UI/ProgressBar';
import Upsell from '../../components/UI/Upsell';

import { Views, Events } from '../../svg';

import './styles.css';

const RENEWED_HUNTER = 2574248771;
const RENEWED_TITAN = 2963102071;
const RENEWED_WARLOCK = 1482613376;

const MAJESTIC_HUNTER = 2574248768;
const MAJESTIC_TITAN = 2963102068;
const MAJESTIC_WARLOCK = 1482613379;

const MAGNIFICENT_HUNTER = 2574248769;
const MAGNIFICENT_TITAN = 2963102069;
const MAGNIFICENT_WARLOCK = 1482613378;

const RENEWED = [RENEWED_WARLOCK, RENEWED_TITAN, RENEWED_HUNTER];
const MAJESTIC = [MAJESTIC_WARLOCK, MAJESTIC_TITAN, MAJESTIC_HUNTER];
const MAGNIFICENT = [MAGNIFICENT_WARLOCK, MAGNIFICENT_TITAN, MAGNIFICENT_HUNTER];

const CLASS_MAP = {
  [RENEWED_TITAN]: 0,
  [RENEWED_HUNTER]: 1,
  [RENEWED_WARLOCK]: 2,
  [MAJESTIC_TITAN]: 0,
  [MAJESTIC_HUNTER]: 1,
  [MAJESTIC_WARLOCK]: 2,
  [MAGNIFICENT_TITAN]: 0,
  [MAGNIFICENT_HUNTER]: 1,
  [MAGNIFICENT_WARLOCK]: 2,
};

const ALL_SETS = [RENEWED, MAJESTIC, MAGNIFICENT];

function Objectives({ itemHash, falsify }) {
  const definitionItem = manifest.DestinyInventoryItemDefinition[itemHash];

  const member = useSelector((state) => state.member);

  const item = member.data?.inventory?.find((item) => item.itemHash === itemHash);

  return (
    <div className='objectives'>
      {definitionItem.objectives?.objectiveHashes.map((hash, h) => {
        const definitionObjective = manifest.DestinyObjectiveDefinition[hash];

        const itemComponents = member.data?.profile?.itemComponents.objectives.data[item?.itemInstanceId]?.objectives.find((objective) => objective.objectiveHash === hash) || {};

        const playerProgress = {
          complete: false,
          progress: 0,
          completionValue: definitionObjective.completionValue,
          objectiveHash: definitionObjective.hash,
          ...itemComponents,
        };

        if (falsify) {
          playerProgress.progress = playerProgress.completionValue;
        }

        return <ProgressBar key={h} objectiveHash={definitionObjective.hash} {...playerProgress} />;
      })}
    </div>
  );
}

function getNextPresentationNodeHash(presentationNodeHash) {
  if (RENEWED.includes(presentationNodeHash)) {
    return MAJESTIC.find((hash) => CLASS_MAP[hash] === CLASS_MAP[presentationNodeHash]);
  } else if (MAJESTIC.includes(presentationNodeHash)) {
    return MAGNIFICENT.find((hash) => CLASS_MAP[hash] === CLASS_MAP[presentationNodeHash]);
  } else {
    return null;
  }
}

function SetProgress(inventory, presentationNodeHash) {
  if (!MAGNIFICENT.includes(presentationNodeHash)) {
    const hasNextSet =
      // get next
      manifest.DestinyPresentationNodeDefinition[getNextPresentationNodeHash(presentationNodeHash)].children.collectibles.filter((collectible, c) => inventory.find((item) => item.itemHash === manifest.DestinyCollectibleDefinition[collectible.collectibleHash].itemHash)).length ||
      // get next next, but only if it's the majestic
      (!MAGNIFICENT.includes(getNextPresentationNodeHash(presentationNodeHash)) && manifest.DestinyPresentationNodeDefinition[getNextPresentationNodeHash(getNextPresentationNodeHash(presentationNodeHash))].children.collectibles.filter((collectible, c) => inventory.find((item) => item.itemHash === manifest.DestinyCollectibleDefinition[collectible.collectibleHash].itemHash)).length);

    if (hasNextSet) {
      return true;
    }
  }

  return false;
}

function Set({ presentationNodeHash }) {
  const definitionSet = manifest.DestinyPresentationNodeDefinition[presentationNodeHash];

  const member = useSelector((state) => state.member);

  const isCompleted = member.data?.inventory && SetProgress(member.data.inventory, presentationNodeHash);

  return (
    <ul>
      {definitionSet.children.collectibles.map((collectible, c) => {
        const definitionCollectible = manifest.DestinyCollectibleDefinition[collectible.collectibleHash];

        return (
          <li key={c}>
            <ul className='list inventory-items'>
              <Items items={[{ itemHash: definitionCollectible.itemHash }]} />
            </ul>
            <div className='text'>
              <div className='name'>{definitionCollectible.displayProperties.name}</div>
              <BungieText className='description' value={definitionCollectible.displayProperties.description} />
              <Objectives itemHash={definitionCollectible.itemHash} falsify={isCompleted} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function NavLinks() {
  return (
    <div className='module views'>
      <ul className='list'>
        <li className='linked'>
          <div className='icon'>
            <Views.Index.Collections />
          </div>
          <NavLink to='/solstice-of-heroes' exact />
        </li>
        <li className='linked'>
          <div className='icon'>
            <Views.Index.Triumphs />
          </div>
          <NavLink to='/solstice-of-heroes/records' exact />
        </li>
      </ul>
    </div>
  );
}

export default function SolsticeOfHeroes() {
  const member = useSelector((state) => state.member);
  const character = member.data.profile?.characters.data.find((character) => character.characterId === member.characterId);

  const auth = useSelector((state) => state.auth);
  const authed = auth.destinyMemberships?.find((authMember) => authMember.membershipId === member.membershipId);

  const location = useLocation();
  const backLinkPath = location.state?.from || '/this-week';

  const [classType, setClassType] = useState(-1);

  function handler_toggleClassType() {
    setClassType(classType > 1 ? -1 : classType + 1);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const SET_TIER_NAME = {
    0: t('Event.SolsticeOfHeroes.ArmorTier.Renewed'),
    1: t('Event.SolsticeOfHeroes.ArmorTier.Majestic'),
    2: t('Event.SolsticeOfHeroes.ArmorTier.Magnificent'),
  };

  const params = useParams();
  const view = params?.type === 'records' ? 'records' : 'gear-sets';

  return (
    <>
      <div className='view' id='solstice-of-heroes'>
        <div className='module head'>
          <div className='icon'>
            <Events.SolsticeOfHeroes />
          </div>
          <div className='page-header'>
            <div className='sub-name'>{t('Event')}</div>
            <div className='name'>{t('Event.SolsticeOfHeroes.Name')}</div>
          </div>
          <div className='text'>
            <BraytechText className='description' value={t('Event.SolsticeOfHeroes.Description')} />
          </div>
        </div>
        {!authed ? (
          <Upsell auth />
        ) : null}
        <div className='buff'>
          <NavLinks />
          <div className={cx('content', { 'class-specific': classType > -1 && view !== 'records' })}>
            {view === 'records' ? (
              <div className='module'>
                <ul className='list record-items'>
                  <Records hashes={[857016983, 1008946187, 2357163007, 518035568, 3882301596, 52390681]} selfLinkFrom={`/solstice-of-heroes/records`} showInvisible />
                </ul>
              </div>
            ) : (
              ALL_SETS.map((tiers, t) => (
                <div key={t} className='module'>
                  <h3>{SET_TIER_NAME[t]}</h3>
                  <div className='sets'>
                    {tiers
                      .filter((presentationNodeHash) => (classType > -1 ? CLASS_MAP[presentationNodeHash] === classType : true))
                      .map((presentationNodeHash, s) => (
                        <div key={s} className='set'>
                          <h4>{classTypeToString(CLASS_MAP[presentationNodeHash])}</h4>
                          <Set presentationNodeHash={presentationNodeHash} />
                        </div>
                      ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <div className='sticky-nav'>
        <div className='wrapper'>
          <div />
          <ul>
            <li>
              <Button action={handler_toggleClassType}>
                {classType < 0 ? (
                  <>
                    <i className='segoe-mdl-filter' />
                    {t('All classes')}
                  </>
                ) : (
                  <>
                    <i className='segoe-mdl-filter' />
                    {classTypeToString(classType)}
                  </>
                )}
              </Button>
            </li>
            <li>
              <Link className='button' to={backLinkPath}>
                <DestinyKey type='dismiss' />
                {t('Back')}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
