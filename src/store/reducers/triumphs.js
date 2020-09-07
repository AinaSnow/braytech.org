import ls from '../../utils/localStorage';

const defaultState = ls.get('setting.triumphs') || {
  tracked: [],
};

export default function reducer(state = defaultState, action) {
  if (action.type === 'TRIUMPHS_TOGGLE_TRACK') {
    const tracked = state.tracked.includes(action.payload) ? [...state.tracked].filter((hash) => action.payload !== hash) : [...state.tracked, action.payload];

    ls.set('setting.triumphs', {
      ...state,
      tracked,
    });

    return {
      ...state,
      tracked,
    };
  } else if (action.type === 'TRIUMPHS_RESET_TRACKED') {
    const tracked = [];

    ls.set('setting.triumphs', {
      ...state,
      tracked,
    });

    return {
      ...state,
      tracked,
    };
  } else {
    return state;
  }
}
