import store from '../store';
import ls from './localStorage';
import { dedupePromise } from './promises';

export const BungieAuth = dedupePromise(async function BungieAuth() {
  // get saved auth tokes
  const tokens = ls.get('setting.auth');

  if (tokens?.access?.value) {
    // time now + 2 seconds, in ms
    const now = new Date().getTime() + 2 * 1000;
    // current token expiry, in ms
    const then = tokens.access.expires;

    // refresh tokens before making auth-full request
    if (now > then) {
      if (process.env.NODE_ENV === 'development') console.log('%cAuth tokens have expired...', 'font-style: italic');
      const refreshRequest = await GetOAuthAccessToken(`grant_type=refresh_token&refresh_token=${tokens.refresh.value}`);

      if (refreshRequest && refreshRequest.ErrorCode === 1) {
        if (process.env.NODE_ENV === 'development') console.log('%cAuth tokens have been replenished.', 'font-style: italic', refreshRequest);

        // use the token from the response for the original request
        return refreshRequest.Response.access.value;
      }
      // token refreshRequest returned with an error...
      // return that error to whoever asked for this
      else {
        if (process.env.NODE_ENV === 'development') console.log('%cAuth tokens could not be replenished!', 'font-style: italic');

        return await refreshRequest;
      }
    } else {
      if (process.env.NODE_ENV === 'development') console.log('%cAuth tokens are current.', 'font-style: italic');

      return tokens;
    }
  } else {
    return false;
  }
});

async function apiRequest(path, options = {}) {
  const defaults = {
    headers: {},
    stats: false,
    withAuth: false,
    errors: {
      hide: false,
    },
  };

  options = {
    ...defaults,
    ...options,
    errors: {
      ...defaults.errors,
      ...options.errors,
    },
  };

  // API key
  options.headers['X-API-Key'] = process.env.REACT_APP_BUNGIE_API_KEY;

  // if POST, add content-type header
  if (typeof options.body === 'string') {
    options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
  } else {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  // get saved auth tokes
  const tokens = ls.get('setting.auth');

  // handle adding auth headers and refreshing tokens
  if (tokens && options.withAuth && !options.headers.Authorization) {
    // time now + 2 seconds, in ms
    const now = new Date().getTime() + 2 * 1000;
    // current token expiry, in ms
    const then = tokens.access.expires;

    // refresh tokens before making auth-full request
    if (now > then) {
      if (process.env.NODE_ENV === 'development') console.log('%cAuth tokens have expired...', 'font-style: italic');
      const refreshRequest = await GetOAuthAccessToken(`grant_type=refresh_token&refresh_token=${tokens.refresh.value}`);

      if (refreshRequest && refreshRequest.ErrorCode === 1) {
        if (process.env.NODE_ENV === 'development') console.log('%cAuth tokens have been replenished.', 'font-style: italic', refreshRequest);

        // use the token from the response for the original request
        options.headers.Authorization = `Bearer ${refreshRequest.Response.access.value}`;
      }
      // token refreshRequest returned with an error...
      // return that error to whoever asked for this
      else {
        if (process.env.NODE_ENV === 'development') console.log('%cAuth tokens could not be replenished!', 'font-style: italic');

        return await refreshRequest;
      }
    } else {
      if (process.env.NODE_ENV === 'development') console.log('%cAuth tokens are current.', 'font-style: italic');
      options.headers.Authorization = `Bearer ${tokens.access.value}`;
    }
  }

  // perform the request we're here for
  const request = await fetch(`https://${options.stats ? 'stats' : 'www'}.bungie.net${path}`, options)
    // catch here for network errors
    .catch((error) => {
      if (!options.errors.hide) {
        store.dispatch({
          type: 'NOTIFICATIONS_PUSH',
          payload: {
            error: true,
            date: new Date().toISOString(),
            expiry: 86400000,
            displayProperties: {
              name: `HTTP error`,
              description: `A network error occured. ${error.message}.`,
              timeout: 4,
            },
          },
        });
      }
    });

  const contentType = request && request.headers.get('content-type');
  const response = request && contentType.includes('json') && (await request.json());

  // received a response but it said there was an error
  if ((response && response.ErrorCode && response.ErrorCode !== 1) || (response && response.error)) {
    if (!options.errors.hide) {
      store.dispatch({
        type: 'NOTIFICATIONS_PUSH',
        payload: {
          error: true,
          date: new Date().toISOString(),
          expiry: 86400000,
          displayProperties: {
            name: 'Bungie',
            description: response.ErrorCode ? `${response.ErrorCode} ${response.ErrorStatus}\n\n${response.Message}` : `${response.error}\n\n${response.error_description}`,
            timeout: 4,
          },
        },
      });
    }

    // if it's auth related, abandon all hope and reset
    if (path === '/Platform/App/OAuth/Token/') {
      console.log(`%cThere was an OAuth token error so I'm going to go ahead and reset your tokens for you.`, 'font-style: italic');

      store.dispatch({
        type: 'AUTH_RESET',
      });
    }

    return response;
  }
  // looks like we're getting tokens
  else if (request && request.ok) {
    // tokens doesn't get caught by the prior if statement because it
    // follows a different response structure (no "ErrorCode" property)
    if (path === '/Platform/App/OAuth/Token/') {
      const now = new Date().getTime();

      // grab relevant memberships too
      const memberships = await GetMembershipDataForCurrentUser(response.access_token);

      if (memberships && memberships.ErrorCode === 1) {
        const tokens = {
          access: {
            value: response.access_token,
            expires: now + response.expires_in * 1000,
          },
          refresh: {
            value: response.refresh_token,
            expires: now + response.refresh_expires_in * 1000,
          },
          bnetMembershipId: response.membership_id,
          destinyMemberships: memberships.Response.destinyMemberships,
        };

        store.dispatch({
          type: 'AUTH_SET',
          payload: tokens,
        });

        return {
          ErrorCode: 1,
          Response: tokens,
        };
      } else {
        return false;
      }
    }
    // nothing to do with tokens, proceed
    else {
      return response;
    }
  }
  // request was not ok, probably a network error
  else if (request) {
    if (!options.errors.hide) {
      store.dispatch({
        type: 'NOTIFICATIONS_PUSH',
        payload: {
          error: true,
          date: new Date().toISOString(),
          expiry: 86400000,
          displayProperties: {
            name: `HTTP error`,
            description: `Code ${request.status} A network error occured.`,
            timeout: 4,
          },
        },
      });
    }

    return request;
  } else {
    return false;
  }
}

export const GetOAuthAccessToken = async (body) =>
  apiRequest('/Platform/App/OAuth/Token/', {
    method: 'post',
    headers: {
      Authorization: `Basic ${window.btoa(`${process.env.REACT_APP_BUNGIE_CLIENT_ID}:${process.env.REACT_APP_BUNGIE_CLIENT_SECRET}`)}`,
    },
    body,
  });

export const GetMembershipDataForCurrentUser = async (access = false) =>
  apiRequest('/Platform/User/GetMembershipsForCurrentUser/', {
    withAuth: true,
    headers: {
      Authorization: access && `Bearer ${access}`,
    },
  });

export const GetMembershipDataById = async (options) => apiRequest(`/Platform/User/GetMembershipsById/${options.params.membershipId}/${options.params.membershipType}/`, options);

export const GetProfile = async (options) => apiRequest(`/Platform/Destiny2/${options.params.membershipType}/Profile/${options.params.membershipId}/?components=${options.params.components}`, options);

export const EquipItem = async (body) =>
  apiRequest(`/Platform/Destiny2/Actions/Items/EquipItem/`, {
    withAuth: true,
    method: 'post',
    body,
  });

export const SetItemLockState = async (body) =>
  apiRequest(`/Platform/Destiny2/Actions/Items/SetLockState/`, {
    withAuth: true,
    method: 'post',
    body,
  });

export const SetQuestTrackedState = async (body) =>
  apiRequest(`/Platform/Destiny2/Actions/Items/SetTrackedState/`, {
    withAuth: true,
    method: 'post',
    body,
  });

export const ClaimSeasonPassReward = async (body) =>
  apiRequest(`/Platform/Destiny2/Actions/Seasons/ClaimReward/`, {
    withAuth: true,
    method: 'post',
    body,
  });

export const KickMember = async (groupId, membershipType, membershipId) =>
  apiRequest(`/Platform/GroupV2/${groupId}/Members/${membershipType}/${membershipId}/Kick/`, {
    withAuth: true,
    method: 'post',
  });

export const BanMember = async (groupId, membershipType, membershipId) =>
  apiRequest(`/Platform/GroupV2/${groupId}/Members/${membershipType}/${membershipId}/Ban/`, {
    withAuth: true,
    method: 'post',
  });

export const UnbanMember = async (groupId, membershipType, membershipId) =>
  apiRequest(`/Platform/GroupV2/${groupId}/Members/${membershipType}/${membershipId}/Unban/`, {
    withAuth: true,
    method: 'post',
  });

export const GetPendingMemberships = async (groupId) =>
  apiRequest(`/Platform/GroupV2/${groupId}/Members/Pending/`, {
    withAuth: true,
  });

export const ApprovePendingForList = async (groupId, body) =>
  apiRequest(`/Platform/GroupV2/${groupId}/Members/ApproveList/`, {
    withAuth: true,
    method: 'post',
    body,
  });

export const DenyPendingForList = async (groupId, body) =>
  apiRequest(`/Platform/GroupV2/${groupId}/Members/DenyList/`, {
    withAuth: true,
    method: 'post',
    body,
  });

export const EditGroupMembership = async (groupId, membershipType, membershipId, memberType) =>
  apiRequest(`/Platform/GroupV2/${groupId}/Members/${membershipType}/${membershipId}/SetMembershipType/${memberType}/`, {
    withAuth: true,
    method: 'post',
  });

export const GetVendor = async (options) =>
  apiRequest(`/Platform/Destiny2/${options.params.membershipType}/Profile/${options.params.membershipId}/Character/${options.params.characterId}/Vendors/${options.params.vendorHash}/?components=${options.params.components}`, {
    ...options,
    withAuth: true,
  });

export const ReportOffensivePostGameCarnageReportPlayer = async (options) =>
  apiRequest(`/Platform/Destiny2/Stats/PostGameCarnageReport/${options.params.activityId}/Report/`, {
    ...options,
    withAuth: true,
    method: 'post',
  });

export const DownloadJsonFile = async (path) => fetch(`https://www.bungie.net${path}?no-cache-4-u`).then((a) => a.json());

export const GetDestinyManifest = async (options) => apiRequest('/Platform/Destiny2/Manifest/', options);

export const GetHistoricalStatsDefinition = async (options) => apiRequest(`/Platform/Destiny2/Stats/Definition/?lc=${options.params.locale}`, options);

export const GetCommonSettings = async (options) => apiRequest(`/Platform/Settings/`, options);

export const GetPublicMilestones = async (options) => apiRequest('/Platform/Destiny2/Milestones/', options);

export const GetLinkedProfiles = async (options) => apiRequest(`/Platform/Destiny2/-1/Profile/${options.params.membershipId}/LinkedProfiles/`, options);

export const GetGroupsForMember = async (options) => apiRequest(`/Platform/GroupV2/User/${options.params.membershipType}/${options.params.membershipId}/0/1/`, options);

export const GetGroupByName = async (options) => apiRequest(`/Platform/GroupV2/Name/${encodeURIComponent(options.params.groupName)}/${options.params.groupType || 1}/`, options);

export const GetMembersOfGroup = async (groupId) => apiRequest(`/Platform/GroupV2/${groupId}/Members/`);

export const GetGroup = async (groupId) => apiRequest(`/Platform/GroupV2/${groupId}/`);

export const GetClanLeaderboards = async (groupId, modes, maxtop = 7, statIds) => apiRequest(`/Platform/Destiny2/Stats/Leaderboards/Clans/${groupId}/?modes=${modes.join(',')}&maxtop=${maxtop}` + (statIds ? `&statid=${statIds.join(',')}` : ''));

export const GetClanWeeklyRewardState = async (groupId) => apiRequest(`/Platform/Destiny2/Clan/${groupId}/WeeklyRewardState/`);

export const GetHistoricalStats = async (membershipType, membershipId, characterId = '0', groups, modes, periodType) => apiRequest(`/Platform/Destiny2/${membershipType}/Account/${membershipId}/Character/${characterId}/Stats/?groups=${groups}&modes=${modes}&periodType=${periodType}`);

export const SearchDestinyPlayer = async (membershipType, displayName) => apiRequest(`/Platform/Destiny2/SearchDestinyPlayer/${membershipType}/${encodeURIComponent(displayName)}/`);

export const GetActivityHistory = async (options) => apiRequest(`/Platform/Destiny2/${options.params.membershipType}/Account/${options.params.membershipId}/Character/${options.params.characterId}/Stats/Activities/?page=${options.params.page}${options.params.mode ? `&mode=${options.params.mode}` : ''}&count=${options.params.count}`, options);

export const PostGameCarnageReport = async (instanceId) => apiRequest(`/Platform/Destiny2/Stats/PostGameCarnageReport/${instanceId}/`, { stats: true });

export const GetTrendingCategories = async () => apiRequest(`/Platform/Trending/Categories/`);

export const GetTrendingEntryDetail = async (trendingEntryType, identifier) => apiRequest(`/Platform/Trending/Details/${trendingEntryType}/${identifier}/`);

export const GetMembershipFromHardLinkedCredential = async (options) => apiRequest(`/Platform/User/GetMembershipFromHardLinkedCredential/${options.params.crType}/${options.params.credential}/`);
