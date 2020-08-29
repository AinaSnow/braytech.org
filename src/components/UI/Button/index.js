import React from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import './styles.css';

const buttons = {
  1: {
    settings: [
      {
        char: '',
      },
    ],
    dismiss: [
      {
        color: '#f44336',
        char: '',
      },
      {
        char: '',
      },
    ],
    more: [
      {
        color: '#ffc107',
        char: '',
      },
      {
        char: '',
      },
    ],
    accept: [
      {
        color: '#598652',
        char: '',
      },
      {
        char: '',
      },
    ],
    modify: [
      {
        color: '#4769c7',
        char: '',
      },
      {
        char: '',
      },
    ],
  },
};

export function DestinyKey({ type, platform = 1 }) {
  return (
    <div className='destiny-key'>
      {buttons[platform][type].map((l, i) => {
        return (
          <span key={i} className={l.color && 'color'} style={{ color: l.color }}>
            {l.char}
          </span>
        );
      })}
    </div>
  );
}

export function Button({ inverted, lined, cta, disabled, ...props }) {
  if (props.anchor) {
    return (
      <Link className={cx('button', props.className, { inverted, lined, cta, disabled })} onClick={props.action || undefined} to={props.to}>
        {props.text ? <div className='text'>{props.text}</div> : props.children}
      </Link>
    );
  } else {
    return (
      <button className={cx('button', props.className, { inverted, lined, cta, disabled })} onClick={props.action || undefined} type={props.type || 'button'}>
        {props.text ? <div className='text'>{props.text}</div> : props.children}
      </button>
    );
  }
}

export default Button;
