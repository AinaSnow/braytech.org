import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import { ProfileLink } from '../../components/ProfileLink';
import { Button, DestinyKey } from '../../components/UI/Button';

import './styles.css';

import Root from './Root/';
import Node from './Node/';
import BadgeNode from './BadgeNode/';

class Collections extends React.Component {
  handler_toggleCompleted = (e) => {
    this.props.set({
      itemVisibility: {
        hideCompletedCollectibles: !this.props.settings.itemVisibility.hideCompletedCollectibles,
      },
    });
  };

  componentDidMount() {
    if (!this.props.match.params.quaternary) {
      window.scrollTo(0, 0);
    }

    this.props.rebindTooltips();
  }

  componentDidUpdate(prevProps) {
    if (!this.props.match.params.quaternary && prevProps.location.pathname !== this.props.location.pathname && !(prevProps.match.params.primary === this.props.match.params.primary && this.props.match.params.primary === 'badge')) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    const { t } = this.props;
    let primaryHash = this.props.match.params.primary ? this.props.match.params.primary : false;

    let backLinkPath = this.props.location.state && this.props.location.state.from ? this.props.location.state.from : '/collections';

    const toggleCompletedLink = (
      <Button action={this.handler_toggleCompleted}>
        {this.props.settings.itemVisibility.hideCompletedCollectibles ? (
          <>
            <i className='segoe-mdl-square-checked' />
            {t('Show all')}
          </>
        ) : (
          <>
            <i className='segoe-mdl-square' />
            {t('Hide acquired')}
          </>
        )}
      </Button>
    );

    if (!primaryHash) {
      return (
        <div className='view presentation-node root' id='collections'>
          <Root />
        </div>
      );
    } else if (primaryHash === 'badge') {
      return (
        <>
          <div className='view presentation-node' id='collections'>
            <BadgeNode />
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
    } else {
      return (
        <>
          <div className='view presentation-node' id='collections'>
            <Node primaryHash={primaryHash} />
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

export default compose(connect(mapStateToProps, mapDispatchToProps), withTranslation())(Collections);
