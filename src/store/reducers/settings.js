import { merge } from 'lodash';

import ls from '../../utils/localStorage';

const initial = {
  visual: {
    passiveAnimations: true,
    three: false,
    threeDebug: false,
    threeShadows: false,
    gay: false,
  },
  developer: {
    lists: false,
  },
  itemVisibility: {
    hideCompletedRecords: false,
    hideCompletedChecklistItems: false,
    hideCompletedCollectibles: false,
    hideInvisibleRecords: true,
    hideInvisibleCollectibles: true,
    hideDudRecords: true,
    hideUnobtainableRecords: true,
    suppressVaultWarnings: false,
  },
  triumphs: {
    tracked: [],
  },
  members: {
    history: [],
  },
  maps: {
    debug: false,
    noScreenshotHighlight: false,
    logDetails: false,
    checklists: {
      1697465175: true, // Region Chests
      3142056444: true, // Lost Sectors
      4178338182: true, // Adventures
      2360931290: true, // Ghost Scans
      365218222: true, // Sleeper Nodes
      2955980198: true, // Latent Memory Fragments
      2609997025: true, // Corrupted Eggs
      1297424116: true, // Ahamkara Bones
      2726513366: true, // Cat Statues
      1912364094: true, // Jade Rabbits
      1420597821: true, // Lore: Ghost Stories
      3305936921: true, // Lore: The Awoken of the Reef
      655926402: true, // Lore: The Forsaken Prince
      4285512244: true, // Lore: Luna's Lost
      2474271317: true, // Lore: Inquisition of the Damned
      2137293116: true, // Savathûn's Eyes
      530600409: true, // Calcified fragments
    },
  },
};

const defaults = merge({ ...initial }, ls.get('settings'));

export default function reducer(state = defaults, action) {
  // just for syncing, accepts shapes
  if (action.type === 'SETTINGS_SYNC') {
    const settings = merge(
      {
        ...state,
      },
      action.payload
    );

    return settings;
  }
  // accepts shapes
  else if (action.type === 'SETTINGS_SET') {
    const settings = merge(
      {
        ...state,
      },
      action.payload,
      {
        updated: new Date().toISOString(),
      }
    );

    return settings;
  }
  // triumphs: track toggle
  else if (action.type === 'SETTINGS_TRIUMPHS_TRACKED_TOGGLE') {
    const settings = {
      ...state,
      updated: new Date().toISOString(),
      triumphs: {
        ...state.triumphs,
        tracked: state.triumphs.tracked.includes(action.payload)
          ? // untrack triumph
            [...state.triumphs.tracked].filter((hash) => action.payload !== hash)
          : // track triumph
            [...state.triumphs.tracked, action.payload],
      },
    };

    return settings;
  }
  // triumphs: reset
  else if (action.type === 'SETTINGS_TRIUMPHS_TRACKED_RESET') {
    const settings = {
      ...state,
      updated: new Date().toISOString(),
      triumphs: {
        ...state.triumphs,
        tracked: [],
      },
    };

    return settings;
  }
  // member history: push
  else if (action.type === 'SETTINGS_MEMBERS_HISTORY_PUSH') {
    const settings = {
      ...state,
      updated: new Date().toISOString(),
      members: {
        ...state.members,
        history: [],
      },
    };

    return settings;
  }
  // member history: reset
  else if (action.type === 'SETTINGS_MEMBERS_HISTORY_RESET') {
    const settings = {
      ...state,
      updated: new Date().toISOString(),
      members: {
        ...state.members,
        history: [],
      },
    };

    return settings;
  } else {
    return state;
  }
}
