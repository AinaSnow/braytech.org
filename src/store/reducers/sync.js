import ls from '../../utils/localStorage';

const defaults = ls.get('settings.sync') || {
  enabled: true,
  updated: '2020-01-01T00:00:00Z',
};

export default function reducer(state = defaults, action) {
  if (action.type === 'SYNC_SET') {
    const sync = {
      ...state,
      ...action.payload,
    };

    ls.set('settings.sync', sync);

    return sync;
  } else {
    return state;
  }
}
