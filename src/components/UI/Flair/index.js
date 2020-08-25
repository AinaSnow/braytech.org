import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

import * as enums from '../../../utils/destinyEnums';
import * as flair from '../../../utils/flair';

import { Flair as FlairSVG } from '../../../svg';

import './styles.css';

const icons = {
  braytech: <FlairSVG.ClovisBray />,
  veteran: <FlairSVG.Warmind />,
  superintendent: <FlairSVG.Superintendent />
};

function FlairPrimary({ id }) {
  const primary = flair.primaryFlair(id);

  if (!primary) {
    return null;
  }

  return (
    <div className={cx('flair', 'primary', primary.classNames)}>
      {icons[primary.icon]}
    </div>
  );
}

class Flair extends React.Component {
  componentDidMount() {
    this.props.rebindTooltips();
  }

  render() {
    const { type, id } = this.props;

    return (
      <div className='stamps'>
        <div className='tooltip' data-hash={`platform_${enums.PLATFORM_STRINGS[type]}`} data-type='braytech'>
          <div className={cx('icon', `braytech-platform_${enums.PLATFORM_STRINGS[type]}`)} />
        </div>
        {flair.stamps.map((stamp, s) => {
          if (stamp.condition(id)) {
            return (
              <div key={s} className='tooltip' data-hash={stamp.hash} data-type='braytech'>
                <div className={cx('icon', 'flair', stamp.classNames)}>{icons[stamp.icon]}</div>
              </div>
            );
          } else {
            return null;
          }
        })}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

function mapDispatchToProps(dispatch) {
  return {
    rebindTooltips: value => {
      dispatch({ type: 'REBIND_TOOLTIPS', payload: new Date().getTime() });
    }
  };
}

Flair = connect(mapStateToProps, mapDispatchToProps)(Flair);

export { Flair, FlairPrimary };

export default Flair;
