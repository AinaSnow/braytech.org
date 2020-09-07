import ls from '../../utils/localStorage';

const user = ls.get('setting.theme') || false;

const initial = {
  system: getSystemPreference() ? 'dark' : 'light',
  user,
  active: !user ? (getSystemPreference() ? 'dark' : 'light') : user,
};

function getSystemPreference() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function updateScrollbars(theme) {
  if (theme === 'dark') {
    document.documentElement.style.setProperty('--scrollbar-track', '#202020');
    document.documentElement.style.setProperty('--scrollbar-draggy', '#414141');
    document.documentElement.style.setProperty('--body-background', '#111111');
  } else {
    document.documentElement.style.setProperty('--scrollbar-track', '#afafaf');
    document.documentElement.style.setProperty('--scrollbar-draggy', '#cacaca');
    document.documentElement.style.setProperty('--body-background', '#9e9e9e');
  }
}

export default function reducer(state = initial, action) {
  if (action.type === 'THEME_SET') {
    const user = action.payload === 'system' ? false : action.payload;
    const active = !user ? (getSystemPreference() ? 'dark' : 'light') : user;

    ls.set('setting.theme', user);

    updateScrollbars(active);

    return {
      system: getSystemPreference() ? 'dark' : 'light',
      user,
      active,
    };
  } else if (action.type === 'THEME_SET_SCROLLBARS') {
    updateScrollbars(action.payload || state.user || state.system);

    return state;
  } else {
    // set initial
    if (!document.documentElement.style.getPropertyValue('--scrollbar-track')) updateScrollbars(state.active);

    return state;
  }
}
