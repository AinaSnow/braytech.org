import React from 'react';
import { debounce } from 'lodash';

import { t } from '../../utils/i18n';
import ls from '../../utils/localStorage';
import { GetMembershipFromHardLinkedCredential, GetMembershipDataById, SearchDestinyPlayer, GetProfile } from '../../utils/bungie';
import Spinner from '../../components/UI/Spinner';

import './styles.css';

class ProfileSearch extends React.Component {
  state = {
    results: false,
    search: '',
    searching: false,
  };

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handler_onSearchChange = (e) => {
    if (this.mounted) {
      this.setState({ search: e.target.value });

      this.searchForPlayers();
    }
  };

  handler_onSearchKeyPress = (e) => {
    // If they pressed enter, ignore the debounce and search right meow. MEOW, SON.
    if (e.key === 'Enter') this.searchForPlayers.flush();
  };

  // Debounced so that we don't make an API request for every single
  // keypress - only when they stop typing.
  searchForPlayers = debounce(async () => {
    const { search } = this.state;

    if (!search) return;

    this.setState({ searching: true });

    try {
      const isSteamID64 = search.match(/\b\d{17}\b/);
      const isMembershipId = search.match(/\b\d{19}\b/);
      const response = isSteamID64
        ? // is SteamID64
          await GetMembershipFromHardLinkedCredential({ params: { crType: 'SteamId', credential: search } })
        : isMembershipId
        ? // is MembershipId
          await GetMembershipDataById({ params: { membershipId: search, membershipType: '-1' } })
        : // is display name
          await SearchDestinyPlayer('-1', search);
      // 4611686018430042660

      const results =
        isSteamID64 && response.ErrorCode === 1
          ? // is SteamID64
            [
              await GetProfile({
                  params: {
                    membershipType: response.Response.membershipType,
                    membershipId: response.Response.membershipId,
                    components: '100',
                  },
                  errors: {
                    hide: false,
                  },
                })
                .then((response) => {
                  return {
                    displayName: response.Response.profile.data.userInfo.displayName,
                    membershipId: response.Response.profile.data.userInfo.membershipId,
                    membershipType: response.Response.profile.data.userInfo.membershipType,
                  };
                }),
            ]
          : isMembershipId && response.ErrorCode === 1
          ? // is MembershipId
            response.Response.destinyMemberships || false
          : // is display name
            response.Response;

      if (this.mounted) {
        if (results) {
          this.setState({ results, searching: false });
        } else {
          throw Error();
        }
      }
    } catch (e) {
      // If we get an error here it's usually because somebody is being cheeky
      // (eg entering invalid search data), so log it only.
      console.warn(`Error while searching for ${search}: ${e}`);

      if (this.mounted) this.setState({ results: false, searching: false });
    }
  }, 500);

  resultsElement() {
    const { results, searching } = this.state;

    if (searching) {
      return null;
    }

    if (results && results.length > 0) {
      return this.props.resultsListItems(results);
    } else if (results) {
      return <li className='no-profiles'>{t('No profiles found')}</li>;
    }

    return null;
  }

  render() {
    const { search, searching } = this.state;

    const history = ls.get('history.profiles') || [];

    return (
      <div className='profile-search'>
        <div className='sub-header'>
          <div>{t('Search for player')}</div>
        </div>
        <div className='form'>
          <div className='field'>
            <input onChange={this.handler_onSearchChange} type='text' placeholder={t('insert gamertag or SteamId64')} spellCheck='false' value={search} onKeyPress={this.handler_onSearchKeyPress} />
          </div>
        </div>

        <div className='results'>{searching ? <Spinner mini /> : <ul className='list'>{this.resultsElement()}</ul>}</div>

        {history.length > 0 && (
          <>
            <div className='sub-header'>
              <div>{t('Previous searches')}</div>
            </div>
            <div className='results'>
              <ul className='list'>{this.props.resultsListItems(history)}</ul>
            </div>
          </>
        )}
      </div>
    );
  }
}

export default ProfileSearch;
