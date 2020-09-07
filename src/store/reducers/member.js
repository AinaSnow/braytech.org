import store from '../';
import getMember from '../../utils/getMember';
import getMemberDataShape from '../../utils/getMemberDataShape';
import { PostMember } from '../../utils/voluspa';
import bannedMembers from '../../data/banned-members';

const defaultState = {
  membershipType: false,
  membershipId: false,
  characterId: false,
  data: false,
  prevData: false,
  loading: false,
  stale: false,
  error: false,
};

function getCharacterId(state, data) {
  return (
    // use specified characterId
    state.characterId ||
    // get a fallback characterId
    data.profile.characters.data?.[0]?.characterId ||
    // got nothin'
    false
  );
}

// Wrapper function for loadMember that lets it run asynchronously, but
// means we don't have to add `async` to our reducer (which is bad)
function loadMemberAndReset(membershipType, membershipId, characterId) {
  if (bannedMembers.includes(membershipId)) {
    return {
      membershipId,
      membershipType,
      characterId: false,
      data: false,
      prevData: false,
      loading: false,
      stale: false,
      error: {
        ErrorCode: 'member_banned',
      },
    };
  }

  loadMember(membershipType, membershipId, characterId);

  return {
    membershipId,
    membershipType,
    characterId: characterId || false,
    data: false,
    prevData: false,
    loading: true,
    stale: false,
    error: false,
  };
}

async function loadMember(membershipType, membershipId, characterId) {
  // Note: while calling store.dispatch from within a reducer is an anti-pattern,
  // calling one asynchronously (eg as a result of a fetch) is just fine.

  try {
    const data = await getMember(membershipType, membershipId);

    // console.log('member reducer', data);

    // profile API error
    if (!data.profile.ErrorCode || data.profile.ErrorCode !== 1) {
      store.dispatch({ type: 'MEMBER_LOAD_ERROR', payload: { membershipId, membershipType, error: { ...data.profile } } });

      if (data.profile.ErrorCode) {
        throw {
          ...data.profile,
        };
      } else {
        throw Error('BUNGIE');
      }
    }

    // Required data is private/unavailable -> return error
    if (data.profile && data.profile.ErrorCode === 1 && !data.profile.Response.profileProgression.data) {
      store.dispatch({
        type: 'MEMBER_LOAD_ERROR',
        payload: {
          membershipId,
          membershipType,
          error: {
            ErrorCode: 'private',
          },
        },
      });

      return;
    }

    // Requested characterId was not found -> maybe it's been deleted
    if (data.profile && characterId && !data.profile.Response.characters.data.filter((c) => c.characterId === characterId).length) {
      store.dispatch({
        type: 'MEMBER_LOAD_ERROR',
        payload: {
          membershipId,
          membershipType,
          characterId: data.profile.Response.characters.data.length && data.profile.Response.characters.data[0].characterId ? data.profile.Response.characters.data[0].characterId : false,
          data: getMemberDataShape(data),
          error: {
            ErrorCode: 'character_unavailable',
            recoverable: true,
          },
        },
      });

      return;
    }

    store.dispatch({
      type: 'MEMBER_LOADED',
      payload: {
        membershipId,
        membershipType,
        characterId,
        data: getMemberDataShape(data),
      },
    });

    PostMember({ membershipId, membershipType });
  } catch (error) {
    store.dispatch({
      type: 'MEMBER_LOAD_ERROR',
      payload: {
        membershipId,
        membershipType,
        error,
      },
    });

    return;
  }
}

export default function memberReducer(state = defaultState, action) {
  const timeNowMs = new Date().getTime();

  // if (process.env.NODE_ENV === 'development') console.log(action);

  if (!action.payload) return state;

  const { membershipId, characterId, data, error } = action.payload;

  // Sometimes a number - let's just make it a string all the time
  const membershipType = action.payload.membershipType && action.payload.membershipType.toString();

  if (action.type === 'MEMBER_SET_BY_PROFILE_ROUTE' || action.type === 'MEMBER_SET_CHARACTERID') {
    const membershipLoadNeeded =
      // no data and not yet loading anything
      (!state.data && !state.loading) ||
      // membership mismatch
      state.membershipId !== membershipId ||
      state.membershipType !== membershipType;

    // If our data doesn't exist and isn't currently loading, or if our
    // new membership ID / type doesn't match what we already have stored,
    // reset everything and trigger a reload.
    if (membershipLoadNeeded) return loadMemberAndReset(membershipType, membershipId, characterId);

    // Otherwise, make sure the character ID is in sync with what we're being
    // told by the profile route. In most cases this will be a no-op.
    // if (state.characterId !== characterId) console.log('Updating characterId');
    return { ...state, characterId, error: false };
  }

  if (action.type === 'MEMBER_LOAD_MEMBERSHIP') {
    return loadMemberAndReset(membershipType, membershipId, characterId);
  }

  // We send the membership type & membership ID along with all member
  // dispatches to make sure that multiple async actions on different members
  // don't stomp on each other - eg a user searches for one member, clicks it, then
  // searches for another and clicks it before the first is finished loading.
  const membershipMatches = membershipType === state.membershipType && membershipId === state.membershipId;
  if (!membershipMatches) {
    // console.warn(action.payload);
    return state;
  }

  // console.log(data);

  switch (action.type) {
    case 'MEMBER_CHARACTER_SELECT':
      return {
        ...state,
        characterId,
        error: false,
      };
    case 'MEMBER_LOAD_ERROR':
      return {
        characterId,
        data,
        ...state,
        loading: false,
        error,
      };
    case 'MEMBER_LOADED':
      return {
        ...state,
        characterId: getCharacterId(state, data),
        data: { ...state.data, ...data },
        prevData: state.data,
        loading: false,
        stale: false,
        updated: timeNowMs,
      };
    case 'MEMBER_LOADING':
      return {
        ...state,
        loading: true,
      };
    case 'MEMBER_IS_STALE':
      return {
        ...state,
        stale: true,
      };
    default:
      return state;
  }
}
