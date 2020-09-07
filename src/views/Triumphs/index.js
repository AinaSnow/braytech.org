import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import { ProfileLink } from '../../components/ProfileLink';
import { Button, DestinyKey } from '../../components/UI/Button';

import './styles.css';

import Root from './Root/';
import Node from './Node/';
import SealNode from './SealNode/';
import AlmostComplete from './AlmostComplete/';
import Tracked from './Tracked/';
import Unredeemed from './Unredeemed/';

import duds from '../../data/records/duds';
import unobtainables from '../../data/records/unobtainable';
import Records from '../../components/Records';

class Triumphs extends React.Component {
  state = {
    almostCompleteSort: 0,
  };

  handler_toggleCompleted = (e) => {
    this.props.set({
      itemVisibility: {
        hideCompletedRecords: !this.props.settings.itemVisibility.hideCompletedRecords,
      },
    });
  };

  toggleAlmostCompleteSort = () => {
    this.setState((state) => {
      state.almostCompleteSort = state.almostCompleteSort < 2 ? state.almostCompleteSort + 1 : 0;

      return state;
    });
  };

  componentDidMount() {
    if (!this.props.match.params.quaternary && !this.props.match.params.primary !== 'seal' && !this.props.match.params.tertiary) {
      window.scrollTo(0, 0);
    }

    this.props.rebindTooltips();
  }

  componentDidUpdate(p) {
    if (((!this.props.match.params.quaternary && p.location.pathname !== this.props.location.pathname) || (!p.match.params.quaternary && this.props.location.pathname === '/triumphs/almost-complete' && p.location.pathname !== this.props.location.pathname)) && !this.props.match.params.primary !== 'seal' && !this.props.match.params.tertiary) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    const { t } = this.props;
    const primaryHash = this.props.match.params.primary ? this.props.match.params.primary : false;

    const toggleCompletedLink = (
      <Button action={this.handler_toggleCompleted}>
        {this.props.settings.itemVisibility.hideCompletedRecords ? (
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

    let almostCompleteSortText;
    if (this.state.almostCompleteSort === 1) {
      almostCompleteSortText = (
        <>
          <i className='segoe-mdl-filter' />
          {t('Sorted by score')}
        </>
      );
    } else if (this.state.almostCompleteSort === 2) {
      almostCompleteSortText = (
        <>
          <i className='segoe-mdl-filter' />
          {t('Sorted by rarity')}
        </>
      );
    } else {
      almostCompleteSortText = (
        <>
          <i className='segoe-mdl-filter' />
          {t('Sorted by completion')}
        </>
      );
    }

    const toggleAlmostCompleteSortLink = <Button action={this.toggleAlmostCompleteSort}>{almostCompleteSortText}</Button>;

    const backLinkPath = this.props.location.state && this.props.location.state.from ? this.props.location.state.from : '/triumphs';

    if (!primaryHash) {
      return (
        <div className='view presentation-node root' id='triumphs'>
          <Root />
        </div>
      );
    } else if (primaryHash === 'seal') {
      return (
        <>
          <div className='view presentation-node' id='triumphs'>
            <SealNode />
          </div>
          <div className='sticky-nav'>
            <div className='wrapper'>
              <div />
              <ul>
                <li>{toggleCompletedLink}</li>
                <li>
                  <ProfileLink className='button' to={backLinkPath}>
                    <DestinyKey type='dismiss' />
                    {t('Back')}
                  </ProfileLink>
                </li>
              </ul>
            </div>
          </div>
        </>
      );
    } else if (primaryHash === 'almost-complete') {
      return (
        <>
          <div className={cx('view')} id='triumphs'>
            <AlmostComplete sort={this.state.almostCompleteSort} />
          </div>
          <div className='sticky-nav'>
            <div className='wrapper'>
              <div />
              <ul>
                <li>{toggleAlmostCompleteSortLink}</li>
                <li>
                  <ProfileLink className='button' to={backLinkPath}>
                    <DestinyKey type='dismiss' />
                    {t('Back')}
                  </ProfileLink>
                </li>
              </ul>
            </div>
          </div>
        </>
      );
    } else if (primaryHash === 'tracked') {
      return (
        <>
          <div className='view' id='triumphs'>
            <Tracked />
          </div>
          <div className='sticky-nav'>
            <div className='wrapper'>
              <div />
              <ul>
                <li>
                  <ProfileLink className='button' to={backLinkPath}>
                    <DestinyKey type='dismiss' />
                    {t('Back')}
                  </ProfileLink>
                </li>
              </ul>
            </div>
          </div>
        </>
      );
    } else if (primaryHash === 'unobtainable-debug') {
      return (
        <>
          <div className='view' id='triumphs'>
            <div className='dud-debug'>
              <ul className='list record-items'>
                <Records hashes={unobtainables} showCompleted showInvisible />
              </ul>
            </div>
          </div>
          <div className='sticky-nav'>
            <div className='wrapper'>
              <div />
              <ul>
                <li>
                  <ProfileLink className='button' to={backLinkPath}>
                    <DestinyKey type='dismiss' />
                    {t('Back')}
                  </ProfileLink>
                </li>
              </ul>
            </div>
          </div>
        </>
      );
    } else if (primaryHash === 'dud-debug') {
      return (
        <>
          <div className='view' id='triumphs'>
            <div className='dud-debug'>
              <ul className='list record-items'>
                <Records hashes={duds} showCompleted showInvisible />
              </ul>
            </div>
          </div>
          <div className='sticky-nav'>
            <div className='wrapper'>
              <div />
              <ul>
                <li>
                  <ProfileLink className='button' to={backLinkPath}>
                    <DestinyKey type='dismiss' />
                    {t('Back')}
                  </ProfileLink>
                </li>
              </ul>
            </div>
          </div>
        </>
      );
    } else if (primaryHash === 'unredeemed') {
      return (
        <>
          <div className='view' id='triumphs'>
            <Unredeemed />
          </div>
          <div className='sticky-nav'>
            <div className='wrapper'>
              <div />
              <ul>
                <li>
                  <ProfileLink className='button' to={backLinkPath}>
                    <DestinyKey type='dismiss' />
                    {t('Back')}
                  </ProfileLink>
                </li>
              </ul>
            </div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className='view presentation-node parent' id='triumphs'>
            <Node />
          </div>
          <div className='sticky-nav'>
            <div className='wrapper'>
              <div />
              <ul>
                <li>{toggleCompletedLink}</li>
                <li>
                  <ProfileLink className='button' to={backLinkPath}>
                    <DestinyKey type='dismiss' />
                    {t('Back')}
                  </ProfileLink>
                </li>
              </ul>
            </div>
          </div>
        </>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    settings: state.settings,
    member: state.member,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    set: (payload) => {
      dispatch({ type: 'SETTINGS_SET', payload });
    },
    rebindTooltips: () => {
      dispatch({ type: 'TOOLTIPS_REBIND', payload: new Date().getTime() });
    },
  };
}

export default compose(connect(mapStateToProps, mapDispatchToProps), withTranslation())(Triumphs);
