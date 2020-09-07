import ls from '../../utils/localStorage';

const defaults = {
  enabled: false,
  bnetMembershipId: undefined,
  updated: '2020-01-01T00:00:00Z',
};

const saved = ls.get('settings.sync');

export default function reducer(state = saved || defaults, action) {
  if (action.type === 'SYNC_SET') {
    const sync = {
      ...state,
      ...action.payload,
    };

    ls.set('settings.sync', sync);

    return sync;
  } else if (action.type === 'SYNC_RESET') {
    ls.del('settings.sync');

    return defaults;
  } else {
    return state;
  }
}
