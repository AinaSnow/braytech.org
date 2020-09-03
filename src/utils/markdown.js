import React from 'react';
import { Link } from 'react-router-dom';

import i18n, { basic, energyAffinity } from './i18n';

function goToTop() {
  window.scrollTo(0, 0);
}

export function markdownHelper_link(props) {
  const url = new URL(props.href.includes('https://') ? props.href : `${window.location.origin}${props.href}`);

  if (url.hostname === window.location.hostname) {
    return (
      <Link className='hyperlink' to={`${url.pathname}${url.search}`} onClick={goToTop}>
        {props.children}
      </Link>
    );
  } else {
    return (
      <a className='hyperlink' href={props.href} target='_blank' rel='noopener noreferrer'>
        {props.children}
      </a>
    );
  }
}

export function markdownHelper_listItem(props) {
  const EXPRESSION_CLASSNAME = /@CLASSNAME=([a-z0-9].+)@/gm;
  const className = EXPRESSION_CLASSNAME.exec(props.children?.map((child) => child.props?.value).join(''))?.[1];
  
  // console.log(props.children?.map((child) => child.props?.value).join(''));
  // console.log(EXPRESSION_CLASSNAME.exec(props.children?.map((child) => child.props?.value).join('')));
  // console.log(className);
  // console.log(props.children);

  return (
    <li className={className}>
      {props.children.map((child) => ({
        ...child,
        props: {
          ...child.props,
          children: typeof child.props.children === 'string' ? child.props.children.replace(EXPRESSION_CLASSNAME, '') : child.props.children,
        },
      }))}
    </li>
  );
}

export function wrapEnergy(props) {
  const fragments = props.children.split(/(\s)/);

  return fragments.map((fragment, f) => {
    // if (props.children === 'Derrota objetivos con súper de vacío. Derrotar guardianes acelera el progreso.') console.log(fragments, fragment, energyAffinity(fragment), basic(fragment))
    const affinity = energyAffinity(basic(fragment));

    const arco = ['it', 'es', 'es-mx', 'pt-br'];
    const damage = ['daño', 'dano', 'danno'];
    const weapon = ['arma'];
    const supers = ['súper'];
    const grenade = ['granada', 'granadas'];
    const melee = ['cuerpo'];
    const damageCheck =
      affinity === 'arc' && arco.indexOf(i18n.language) > -1
        ? damage.indexOf(fragments[f - 4]) > -1 || // daño de arco
          weapon.indexOf(fragments[f - 1]) > -1 || // arma arco
          supers.indexOf(fragments[f - 4]) > -1 || // súper de arco
          grenade.indexOf(fragments[f - 4]) > -1 || // granada de arco
          melee.indexOf(fragments[f - 4]) > -1 // cuerpo de arco
        : true;

    if (affinity && damageCheck) {
      return (
        <React.Fragment key={f}>
          <span className={`highlight energy-${affinity}`}>{fragment}</span>
        </React.Fragment>
      );
    }

    return <React.Fragment key={f}>{fragment}</React.Fragment>;
  });
}

export const noParagraphs = ['paragraph'];
