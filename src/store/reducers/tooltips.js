export default function reducer(
  state = {
    bindTime: new Date().getTime(),
  },
  action
) {
  if (action.type === 'TOOLTIPS_REBIND') {
    return {
      ...state,
      bindTime: new Date().getTime(),
    };
  } else {
    return state;
  }
}
