const defaults = {
  dimApiEnabled: false,
  dimProfileMinimumRefreshInterval: 300,
};

export default function reducer(state = defaults, action) {
  if (action.type === 'DIM_SETINGS_SET') {
    return {
      ...state,
      ...action.payload,
    };
  } else {
    return state;
  }
}
