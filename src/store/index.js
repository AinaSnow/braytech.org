import { createStore, combineReducers } from 'redux';

import settings from './reducers/settings.js';
import sync from './reducers/sync.js';
import auth from './reducers/auth.js';
import member from './reducers/member.js';
import theme from './reducers/theme.js';
import viewport from './reducers/viewport.js';
import notifications from './reducers/notifications.js';
import tooltips from './reducers/tooltips.js';
import refresh from './reducers/refresh.js';
import groupMembers from './reducers/groupMembers.js';
import reports from './reducers/reports.js';
import tips from './reducers/tips.js';
import triumphs from './reducers/triumphs.js';
import layouts from './reducers/layouts.js';
import lists from './reducers/lists.js';
import dim from './reducers/dim.js';

const rootReducer = combineReducers({
  settings,
  sync,
  auth,
  member,
  theme,
  viewport,
  notifications,
  tooltips,
  refresh,
  groupMembers,
  reports,
  tips,
  triumphs,
  layouts,
  lists,
  dim,
});

const store = createStore(
  rootReducer
  // window.__REDUX_DEVTOOLS_EXTENSION__ &&
  //   window.__REDUX_DEVTOOLS_EXTENSION__({
  //     //actionsBlacklist: ['PGCR_LOADED', 'PGCR_LOADING'],
  //     trace: true
  //   })
);

export default store;
