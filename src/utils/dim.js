import ls from './localStorage';
import { BungieAccessToken } from './bungie';

export async function GetCommonSettings() {
  try {
    const request = await fetch('https://api.destinyitemmanager.com/platform_info', {
      headers: {
        'X-API-Key': process.env.REACT_APP_DIM_API_KEY
      },
    });

    if (request.ok) {
      const response = await request.json();

      return response;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}

export async function PostAccessToken({ params }) {
  try {

    const request = await fetch('https://api.destinyitemmanager.com/auth/token', {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.REACT_APP_DIM_API_KEY
      },
      method: 'POST',
      body: JSON.stringify({ bungieAccessToken: params.bungieAccessToken, membershipId: params.membershipId }),
    });

    if (request.ok) {
      const response = await request.json();

      return response;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}

async function AccessToken() {
  const stored = ls.get('setting.auth.dim');

  if (stored?.access?.value) {
    // time now + 2 seconds, in ms
    const now = new Date().getTime() + 2 * 1000;
    // current token expiry, in ms
    const then = stored.access.expires;

    if (now < then) {
      return stored.access.value;
    }
  }

  const bungieTokens = await BungieAccessToken();
  if (!bungieTokens) throw new Error('Could not get Bungie tokens.');

  const tokens = await PostAccessToken({
    params: {
      bungieAccessToken: bungieTokens.access.value,
      membershipId: bungieTokens.bnetMembershipId,
    }
  });

  if (tokens?.accessToken) {
    ls.set('setting.auth.dim', {
      access: {
        value: tokens.accessToken,
        expires: new Date().getTime() + tokens.expiresInSeconds
      },
      bnetMembershipId: bungieTokens.bnetMembershipId
    });

    return tokens.accessToken;
  }

  throw new Error('Could not get DIM tokens.');
}

export async function PostProfile(payload) {
  try {
    const request = await fetch('https://api.destinyitemmanager.com/profile', {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.REACT_APP_DIM_API_KEY
      },
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (request.ok) {
      const response = await request.json();

      return response;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}

export async function GetProfile({ params }) {
  try {
    const request = await fetch(`https://api.destinyitemmanager.com/profile?platformMembershipId=${params.membershipId}&destinyVersion=2&components=triumphs`, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.REACT_APP_DIM_API_KEY,
        Authorization: `Bearer ${await AccessToken()}`
      },
    });

    if (request.ok) {
      const response = await request.json();

      return response;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}

//{"platformMembershipId":"4611686018449662397","destinyVersion":2,"updates":[{"action":"track_triumph","payload":{"recordHash":745021037,"tracked":true}}]}
