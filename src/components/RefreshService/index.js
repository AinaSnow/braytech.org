import React from 'react';
import { connect } from 'react-redux';

import { t } from '../../utils/i18n';
import getMember from '../../utils/getMember';
import getMemberDataShape from '../../utils/getMemberDataShape';

const AUTO_REFRESH_INTERVAL = 30 * 1000;
const TIMEOUT = 60 * 60 * 1000;

class RefreshService extends React.Component {
  componentDidMount() {
    // ensure refresh state is accurate in case member data is updated by some other means
    if (new Date().getTime() - this.props.member.updated <= TIMEOUT) {
      this.props.setState({ loading: false, stale: false });
    }

    // start the countdown
    this.init();
  }

  componentDidUpdate(p) {
    if (p.member.updated !== this.props.member.updated || this.props.member.stale) {
      // member data is stale
      if (this.props.member.stale) {
        this.track();
        this.service();
      } // restart the countdown
      else {
        this.clearInterval();
        this.startInterval();
      }
    }
  }

  componentWillUnmount() {
    this.quit();
  }

  render() {
    return null;
  }

  init() {
    if (this.props.member.membershipId) {
      this.track();

      document.addEventListener('click', this.handler_click);
      document.addEventListener('visibilitychange', this.handler_visibility);

      this.startInterval();
    }
  }

  quit() {
    document.removeEventListener('click', this.handler_click);
    document.removeEventListener('visibilitychange', this.handler_visibility);

    this.clearInterval();
  }

  track() {
    this.lastActivityTimestamp = new Date().getTime();
  }

  activeWithinTimespan(timespan) {
    return new Date().getTime() - this.lastActivityTimestamp <= timespan;
  }

  inactive() {
    this.clearInterval();

    this.props.pushNotification({
      hash: 'refresh-service-inactive',
      date: new Date().toISOString(),
      expiry: 86400000,
      displayProperties: {
        name: 'Braytech',
        description: t('RefreshService.Inactive.Description'),
      },
    });
  }

  startInterval() {
    this.refreshAccountDataInterval = window.setInterval(this.service, AUTO_REFRESH_INTERVAL);
  }

  clearInterval() {
    window.clearInterval(this.refreshAccountDataInterval);
  }

  handler_click = (e) => {
    const wasInactive = !this.activeWithinTimespan(TIMEOUT);

    this.track();

    // if was inactive, fire service immediately
    // instead of waiting for interval timer
    if (wasInactive) {
      this.startInterval();
      this.service();

      this.props.popNotification('refresh-service-inactive');
    }
  };

  handler_visibility = (event) => {
    const wasInactive = !this.activeWithinTimespan(TIMEOUT);

    if (document.hidden === false) {
      this.track();
      this.service();

      this.props.popNotification('refresh-service-inactive');
    }
  };

  service = async () => {
    // service is already asking for fresh data OR the member reducer is handling something else
    if (this.props.refresh.loading || this.props.member.loading) {
      return;
    }

    // user has been inactive for TIMEOUT
    // so we'll stop pinging the API
    if (!this.activeWithinTimespan(TIMEOUT)) {
      this.props.setState({ stale: true });

      this.inactive();

      return;
    }

    const { membershipType, membershipId, characterId, data: previousMemberLoad } = this.props.member;

    this.props.setState({ loading: true });

    try {
      const data = await getMember(membershipType, membershipId, true);

      if (data.profile.ErrorCode !== 1) {
        throw new Error(data.profile.ErrorCode);
      }

      if (data) {
        this.props.setMember({
          membershipType,
          membershipId,
          characterId,
          data: getMemberDataShape(data),
        });
      }

      this.props.setState({ loading: false, stale: false });
    } catch (e) {
      console.warn(`Error while refreshing profile - ignoring`, e);

      this.props.setState({ loading: false, stale: true });
    }
  };
}

function mapStateToProps(state) {
  return {
    member: state.member,
    refresh: state.refresh,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setMember: (payload) => {
      dispatch({ type: 'MEMBER_LOADED', payload });
    },
    setState: (payload) => {
      dispatch({ type: 'REFRESH_STATE', payload });
    },
    pushNotification: (payload) => {
      dispatch({ type: 'NOTIFICATIONS_PUSH', payload });
    },
    popNotification: (payload) => {
      dispatch({ type: 'NOTIFICATIONS_POP', payload });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RefreshService);
