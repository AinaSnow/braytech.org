import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { orderBy } from 'lodash';
import queryString from 'query-string';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import { classTypeToString } from '../../../utils/destinyConverters';
import Search from '../../../components/Search';

import { NavLinks } from '../';

import './styles.css';

function getResultName(table, hash) {
  if (table === 'lol') {
    return manifest[table][hash].displayProperties?.name;
  }
  
  return manifest[table][hash].displayProperties?.name;
}

function getClassName(table, hash) {
  if (manifest[table][hash].classType) {
    return classTypeToString(manifest[table][hash].classType)
  }

  return '';
}

function resultsRenderFunction(results) {
  return (
    <ul className='list result-items'>
      {results.map(({ table, hash }, i) => (
        <li key={i}>
          <ul>
            <li className='col hash'>{hash}</li>
            <li className='col table'>{table}</li>
            <li className='col name'>{getResultName(table, hash)}</li>
            <li className='col classType'>{getClassName(table, hash)}</li>
          </ul>
        </li>
      ))}
    </ul>
  );
}

class Manifest extends React.Component {
  state = {};

  componentDidMount() {
    this.mounted = true;

    window.scrollTo(0, 0);
    this.props.rebindTooltips();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { t, viewport, member, location, match } = this.props;
    const object = match.params?.object;
    const query = queryString.parse(location.search);

    return (
      <div className='view manifest' id='archives'>
        <div className='module head'>
          <div className='page-header'>
            <div className='sub-name'>{t('Archives')}</div>
            <div className='name'>{t('Manifest')}</div>
          </div>
        </div>
        <div className='buff'>
          <NavLinks />
          <div className='content'>
            <Search initialValue='mida' database resultsRenderFunction={resultsRenderFunction} />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    viewport: state.viewport
  };
}

function mapDispatchToProps(dispatch) {
  return {
    rebindTooltips: value => {
      dispatch({ type: 'TOOLTIPS_REBIND', payload: new Date().getTime() });
    }
  };
}

export default compose(connect(mapStateToProps, mapDispatchToProps), withTranslation(), withRouter)(Manifest);
