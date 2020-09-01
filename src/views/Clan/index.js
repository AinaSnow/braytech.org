import React from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';

import { t, BraytechText } from '../../utils/i18n';
import { ProfileNavLink } from '../../components/ProfileLink';
import { Views } from '../../svg';

import './styles.css';

import About from './About';
import Roster from './Roster';
import RosterAdmin from './RosterAdmin';
import Stats from './Stats';

export function NavLinks() {
  return (
    <div className='module views'>
      <ul className='list'>
        <li className='linked'>
          <div className='icon'>
            <Views.Clan.About />
          </div>
          <ProfileNavLink to='/clan' exact />
        </li>
        <li className='linked'>
          <div className='icon'>
            <Views.Clan.Roster />
          </div>
          <ProfileNavLink to='/clan/roster' />
        </li>
        <li className='linked'>
          <div className='icon'>
            <Views.Clan.RosterAdmin />
          </div>
          <ProfileNavLink to='/clan/admin' />
        </li>
        <li className='linked'>
          <div className='icon'>
            <Views.Clan.Stats />
          </div>
          <ProfileNavLink to='/clan/stats' />
        </li>
      </ul>
    </div>
  );
}

function ViewportWidth() {
  return (
    <div className='module'>
      <div className='properties'>
        <div className='name'>{t('Administration')}</div>
        <BraytechText className='description' value={t('Clan.Administration.ViewportWidth')} />
      </div>
    </div>
  );
}

function NoClan() {
  return (
    <div className='module'>
      <div className='properties'>
        <div className='name'>{t('Clan.NoClan.Name')}</div>
        <BraytechText className='description' value={t('Clan.NoClan.Description')} />
      </div>
    </div>
  );
}

export default function Clan(props) {
  const viewport = useSelector((state) => state.viewport);
  const member = useSelector((state) => state.member);

  const views = {
    about: About,
    roster: Roster,
    admin: RosterAdmin,
    stats: Stats,
    'no-clan': NoClan,
    'viewport-width': ViewportWidth,
  };

  let view = props.match.params.view || 'about';

  if (!member.data.groups.clan) view = 'no-clan';
  if (view === 'admin' && viewport.width < 1500) view = 'viewport-width';
  if (!views[view]) view = 'about';

  const Component = views[view];

  return (
    <div className={cx('view', view, { center: view === 'roster' || view === 'admin', error: view === 'no-clan' || view === 'viewport-width' })} id='clan'>
      <div className='buff'>
        <NavLinks />
        <div className='content'>
          <Component {...props.match.params} />
        </div>
      </div>
    </div>
  );
}
