import ls from '../../utils/localStorage';

const history = ls.get('history.tips') || [];

export default function reducer(state = history, action) {
  switch (action.type) {
    case 'TIPS_DISMISS':

      const adjusted = state.concat(action.payload);
      
      ls.set('history.tips', adjusted);

      return adjusted;
    case 'TIPS_RESET':      
      ls.set('history.tips', []);

      return [];
    default:
      return state;
  }
}
