import ls from '../../utils/localStorage';

const defaultState = ls.get('setting.auth') || false;

export default function reducer(state = defaultState, action) {
  if (action.type === 'AUTH_SET') {
    state = action.payload;

    ls.set('setting.auth', state);
    return state;
  } else if (action.type === 'AUTH_RESET') {
    state = false;

    ls.del('setting.auth');

    return state;
  } else {
    return state;
  }
}
