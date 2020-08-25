import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import cx from 'classnames';

import { t } from '../../utils/i18n';
import * as enums from '../../utils/destinyEnums';
import ProfileSearch from '../../components/ProfileSearch';
import Button from '../../components/UI/Button';

class AddPlayer extends React.Component {
  state = {
    showSearch: false
  };

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handler_showSearch = e => {
    if (this.mounted) {
      this.setState({
        showSearch: true
      });
    }
  }

  handler_hideSearch = e => {
    if (this.mounted) {
      this.setState({
        showSearch: false
      });
    }
  }

  handler_profileClick = (membershipType, membershipId, displayName) => e => {
    if (this.mounted) {
      this.props.action(membershipType, membershipId, displayName);
      this.setState({
        showSearch: false
      });
    }
  }

  resultsListItems = profiles => profiles.map((p, i) => {
    const { query, match } = this.props;
    const object = match.params?.object;
    const queryString = [...query.filter(m => m.membershipId !== p.membershipId), { membershipType: p.membershipType, membershipId: p.membershipId }].map(m => `${m.membershipType}:${m.membershipId}`).join('|');
    
    return (
      <li key={i} className='linked'>
        <div className={cx('icon', `braytech-platform_${enums.PLATFORM_STRINGS[p.membershipType]}`)} />
        <div className='displayName'>{p.displayName}</div>
        <Link to={queryString ? `/compare/${object}?members=${queryString}` : `/compare/${object}`} />
      </li>
    );
  });

  render() {
    const { showSearch } = this.state;

    if (showSearch) {
      return (
        <div className='column add-player'>
          <ul className='list member'>
            <li />
            <li>
              <Button className='remove' action={this.handler_hideSearch}>
                <i className='segoe-mdl-cancel' />
              </Button>
            </li>
          </ul>
          <ProfileSearch resultsListItems={this.resultsListItems} />
        </div>
      );
    } else {
      return (
        <div className='column add-player'>
          <Button text={t('Add player')} action={this.handler_showSearch} />
        </div>
      );
    }

  }
}

export default withRouter(AddPlayer);
