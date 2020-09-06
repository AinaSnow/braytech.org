export default {
  settings: {
    set: function (payload) {
      return {
        type: 'SETTINGS_SET',
        payload,
      };
    },
    sync: function (payload) {
      return {
        type: 'SETTINGS_SYNC',
        payload,
      };
    }
  },
  sync: {
    set: function (payload) {
      return {
        type: 'SYNC_SET',
        payload,
      };
    },
  },
  auth: {
    set: function (payload) {
      return {
        type: 'AUTH_SET',
        payload,
      };
    },
    reset: function () {
      return {
        type: 'AUTH_RESET',
      };
    },
  },
  member: {
    load: function (payload) {
      return {
        type: 'MEMBER_LOAD_MEMBERSHIP',
        payload,
      };
    },
    setCharacterID: function (payload) {
      return {
        type: 'MEMBER_SET_CHARACTERID',
        payload,
      };
    },
    pushHistory: function (payload) {
      return {
        type: 'SETTINGS_MEMBERS_HISTORY_PUSH',
        payload,
      };
    },
    resetHistory: function (payload) {
      return {
        type: 'SETTINGS_MEMBERS_HISTORY_RESET',
      };
    }
  },
  theme: {
    scrollbars: function (payload) {
      return {
        type: 'THEME_SET_SCROLLBARS',
        payload,
      };
    },
    set: function (payload) {
      return {
        type: 'THEME_SET',
        payload,
      };
    },
  },
  notifications: {
    push: function (payload) {
      return {
        type: 'NOTIFICATIONS_PUSH',
        payload,
      };
    },
    pop: function (payload) {
      return {
        type: 'NOTIFICATIONS_POP',
        payload,
      };
    },
    reset: function () {
      return {
        type: 'NOTIFICATIONS_RESET',
      };
    },
  },
  tooltips: {
    rebind: function () {
      return {
        type: 'TOOLTIPS_REBIND',
      };
    },
  },
  tips: {
    reset: function () {
      return {
        type: 'TIPS_RESET',
      };
    },
  },
  triumphs: {
    toggle: function (payload) {
      return {
        type: 'SETTINGS_TRIUMPHS_TRACKED_TOGGLE',
        payload,
      };
    },
    reset: function () {
      return {
        type: 'SETTINGS_TRIUMPHS_TRACKED_RESET',
      };
    },
  },
  layouts: {
    reset: function (payload) {
      return {
        type: 'LAYOUTS_RESET',
        payload,
      };
    },
  },
  lists: {
    toggle: function (payload) {
      return {
        type: 'LISTS_TOGGLE',
        payload,
      };
    },
  },
};
