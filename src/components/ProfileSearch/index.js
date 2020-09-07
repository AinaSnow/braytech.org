import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { useIsMounted, useDebounce } from '../../utils/hooks';
import { t } from '../../utils/i18n';
import { GetMembershipFromHardLinkedCredential, GetMembershipDataById, SearchDestinyPlayer, GetProfile } from '../../utils/bungie';

import Spinner from '../../components/UI/Spinner';

import './styles.css';

export default function ProfileSearch({ ...props }) {
  const isMounted = useIsMounted();
  const history = useSelector((state) => state.settings.members.history);

  const [state, setState] = useState({
    results: false,
    searching: false,
  });

  const [input, setInput] = useState('');

  const debouncedInput = useDebounce(input, 500);

  useEffect(() => {
    searchForPlayers();
  }, [debouncedInput]);

  function handler_onChange(event) {
    if (isMounted.current) {
      setInput(event.target.value.trim());
    }
  }

  function handler_onKeyPress(event) {
    // If they pressed enter, ignore the debounce and search right meow. MEOW, SON.
    if (event.key === 'Enter') searchForPlayers();
  }

  async function searchForPlayers() {
    if (!input) return;

    try {
      setState((state) => ({ ...state, searching: true }));

      const isSteamID64 = input.match(/\b\d{17}\b/);
      const isMembershipId = input.match(/\b\d{19}\b/);
      const response = isSteamID64
        ? // is SteamID64
          await GetMembershipFromHardLinkedCredential({ params: { crType: 'SteamId', credential: input } })
        : isMembershipId
        ? // is MembershipId
          await GetMembershipDataById({ params: { membershipId: input, membershipType: '-1' } })
        : // is display name
          await SearchDestinyPlayer('-1', input);

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
              }).then((response) => {
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

      if (isMounted.current) {
        if (results) {
          setState({ results, searching: false });
        } else {
          throw Error();
        }
      }
    } catch (error) {
      // If we get an error here it's usually because somebody is being cheeky
      // (eg entering invalid search data), so log it only.
      console.warn(`Error while searching for ${input}: ${error}`);

      if (isMounted.current) {
        setState({ results: false, searching: false });
      }
    }
  }

  function resultsElement() {
    if (state.searching) {
      return null;
    }

    if (state.results.length > 0) {
      return props.resultsListItems(state.results);
    } else if (state.results) {
      return <li className='no-profiles'>{t('No profiles found')}</li>;
    }

    return null;
  }

  return (
    <div className='profile-search'>
      <div className='sub-header'>
        <div>{t('Search for player')}</div>
      </div>
      <div className='form'>
        <div className='field'>
          <input onChange={handler_onChange} onKeyPress={handler_onKeyPress} type='text' placeholder={t('insert gamertag or SteamId64')} spellCheck='false' value={input.value} />
        </div>
      </div>
      <div className='results'>{state.searching ? <Spinner mini /> : <ul className='list'>{resultsElement()}</ul>}</div>
      {history.length > 0 && (
        <>
          <div className='sub-header'>
            <div>{t('Previous searches')}</div>
          </div>
          <div className='results'>
            <ul className='list'>{props.resultsListItems(history)}</ul>
          </div>
        </>
      )}
    </div>
  );
}
