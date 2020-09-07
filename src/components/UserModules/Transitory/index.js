import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import * as bungie from '../../../utils/bungie';
import Spinner from '../../UI/Spinner';
import MemberLink from '../../MemberLink';

import './styles.css';

class Transitory extends React.Component {
  state = {};

  componentDidMount() {
    this.mounted = true;

    this.getTransitoryResponse();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate(p, s) {
    if (s.loading !== this.state.loading) {
      this.props.rebindTooltips();
    }

    if (this.props.member.updated !== p.member?.updated) {
      this.getTransitoryResponse();
    }
  }

  getTransitoryResponse = async () => {
    const { member } = this.props;

    if (!this.mounted) {
      return;
    } else {
      this.setState({
        loading: true
      });
    }    

    const response = await bungie
      .GetProfile({
        params: {
          membershipType: member.membershipType,
          membershipId: member.membershipId,
          components: '200,204,1000'
        }
      })
      .then(response => {
        if (response && response.ErrorCode === 1 && response.Response?.profileTransitoryData?.data && response.Response.characterActivities?.data) {
          response.Response.characterActivities.data = Object.keys(response.Response.characterActivities.data)
            .map(key => ({ ...response.Response.characterActivities.data[key], characterId: key }))
            .sort(function(a, b) {
              return new Date(b.dateActivityStarted).getTime() - new Date(a.dateActivityStarted).getTime();
            });
        }

        return response;
      });

    if (response && response.ErrorCode === 1) {
      if (this.mounted) {
        this.setState({
          loading: false,
          error: false,
          data: response.Response
        });
      }
    } else {
      if (this.mounted) {
        this.setState(p => ({
          ...p,
          loading: false,
          error: true
        }));
      }
    }
  };

  render() {
    const { t } = this.props;
    const { loading, data } = this.state;
    const partyMembers = data?.profileTransitoryData.data?.partyMembers || [];

    return (
      <div className='user-module fireteam'>
        <div className='sub-header'>
          <div>{t('Fireteam')}</div>
          <div>{data && loading ? <Spinner mini /> : null}</div>
        </div>
        {data && partyMembers.length ? (
          <>
            <h4>{t('Members')}</h4>
            <ul className='list fireteam-members'>
              {partyMembers.map((member, m) => {
                return (
                  <li key={m}>
                    <MemberLink id={member.membershipId} displayName={member.displayName} />
                  </li>
                );
              })}
            </ul>
          </>
        ) : data && partyMembers.length < 1 ? (
          <div className='info'>{t('Offline')}</div>
        ) : (
          <Spinner />
        )}
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
      dispatch({ type: 'TOOLTIPS_REBIND', payload: new Date().getTime() });
    }
  };
}

export default compose(connect(mapStateToProps, mapDispatchToProps), withTranslation())(Transitory);
