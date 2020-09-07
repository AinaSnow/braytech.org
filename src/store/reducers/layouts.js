import ls from '../../utils/localStorage';

const lsState = ls.get('setting.layouts') || {};
export const defaultState = {
  now: {
    groups: [
      {
        id: 'head',
        type: 'head',
        cols: [
          {
            id: 'head-col-0',
            mods: [
              {
                id: 'Flashpoint-0',
                component: 'Flashpoint'
              }
            ]
          },
          {
            id: 'head-col-1',
            mods: [
              {
                id: 'DailyVanguardModifiers-0',
                component: 'DailyVanguardModifiers'
              }
            ]
          },
          {
            id: 'head-col-2',
            mods: [
              {
                id: 'DailyHeroicStoryMissions-0',
                component: 'DailyHeroicStoryMissions'
              }
            ]
          },
          {
            id: 'head-col-3',
            mods: [
              {
                id: 'BlackArmoryForges-0',
                component: 'BlackArmoryForges'
              }
            ]
          }
        ]
      },
      {
        id: 'body-0',
        type: 'body',
        cols: [
          {
            id: 'body-0-col-0',
            mods: [
              {
                id: 'Challenges-1',
                component: 'Challenges'
              }
            ]
          },
          {
            id: 'body-0-col-1',
            mods: []
          },
          {
            id: 'body-0-col-2',
            mods: [
              {
                id: 'Transitory-1',
                component: 'Transitory'
              },
              {
                id: 'Clan-1',
                component: 'Clan'
              }
            ]
          },
          {
            id: 'body-0-col-3',
            mods: [
              {
                id: 'SeasonCountdown-1',
                component: 'SeasonCountdown'
              },
              {
                id: 'Ranks-1',
                component: 'Ranks',
                settings: [
                  {
                    id: 'progressionHash',
                    value: 2000925172
                  }
                ]
              },
              {
                id: 'Ranks-2',
                component: 'Ranks',
                settings: [
                  {
                    id: 'progressionHash',
                    value: 2626549951
                  }
                ]
              },
              {
                id: 'Ranks-3',
                component: 'Ranks',
                settings: [
                  {
                    id: 'progressionHash',
                    value: 2772425241
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'body-1',
        type: 'body',
        cols: [
          {
            id: 'body-1-col-0',
            mods: [
              {
                id: 'SeasonPass-0',
                component: 'SeasonPass'
              }
            ]
          },
          {
            id: 'body-1-col-1',
            mods: []
          },
          {
            id: 'body-1-col-2',
            mods: []
          },
          {
            id: 'body-1-col-3',
            mods: []
          }
        ]
      }
    ]
  },
  'this-week': {
    groups: [
      {
        id: 'head',
        type: 'head',
        cols: [
          {
            id: 'head-col-0',
            mods: []
          },
          {
            id: 'head-col-1',
            mods: []
          },
          {
            id: 'head-col-2',
            mods: []
          },
          {
            id: 'head-col-3',
            mods: []
          }
        ]
      },
      {
        id: 'body-0',
        type: 'body',
        cols: [
          {
            id: 'body-0-col-0',
            mods: [
              {
                id: 'Nightfalls-1',
                component: 'Nightfalls'
              }
            ]
          },
          {
            id: 'body-0-col-1',
            mods: []
          },
          {
            id: 'body-0-col-2',
            mods: []
          },
          {
            id: 'body-0-col-3',
            mods: []
          }
        ]
      },
      {
        id: 'body-1',
        type: 'body',
        cols: [
          {
            id: 'body-1-col-0',
            mods: [
              {
                id: 'Raid-1',
                component: 'Raid',
                settings: [
                  {
                    id: 'raidKey',
                    value: 'gos'
                  }
                ]
              }
            ]
          },
          {
            id: 'body-1-col-1',
            mods: [
              {
                id: 'Raid-2',
                component: 'Raid',
                settings: [
                  {
                    id: 'raidKey',
                    value: 'sotp'
                  }
                ]
              }
            ]
          },
          {
            id: 'body-1-col-2',
            mods: [
              {
                id: 'Raid-3',
                component: 'Raid',
                settings: [
                  {
                    id: 'raidKey',
                    value: 'lw'
                  }
                ]
              }
            ]
          },
          {
            id: 'body-1-col-3',
            mods: [
              {
                id: 'Raid-4',
                component: 'Raid',
                settings: [
                  {
                    id: 'raidKey',
                    value: 'levi'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'body-2',
        type: 'body',
        cols: [
          {
            id: 'body-2-col-0',
            mods: [
              {
                id: 'DreamingCityAscendantChallenge-1',
                component: 'DreamingCityAscendantChallenge'
              }
            ]
          },
          {
            id: 'body-2-col-1',
            mods: [
              {
                id: 'DreamingCityCurse-1',
                component: 'DreamingCityCurse'
              }
            ]
          },
          {
            id: 'body-2-col-2',
            mods: [
              {
                id: 'DreamingCityShatteredThrone-1',
                component: 'DreamingCityShatteredThrone'
              }
            ]
          },
          {
            id: 'body-2-col-3',
            mods: []
          }
        ]
      },
      {
        id: 'body-3',
        type: 'body',
        cols: [
          {
            id: 'body-3-col-0',
            mods: [
              {
                id: 'Menagerie-1',
                component: 'Menagerie'
              }
            ]
          },
          {
            id: 'body-3-col-1',
            mods: [
              {
                id: 'Reckoning-1',
                component: 'Reckoning'
              }
            ]
          },
          {
            id: 'body-3-col-2',
            mods: [
              {
                id: 'EscalationProtocol-1',
                component: 'EscalationProtocol'
              }
            ]
          },
          {
            id: 'body-3-col-3',
            mods: []
          }
        ]
      }
    ]
  }
};

export default function reducer(state = { ...defaultState, ...lsState }, action) {
  switch (action.type) {
    case 'LAYOUTS_SET':
      state = {
        ...state,
        [action.payload.target]: action.payload.value
      };

      ls.set('setting.layouts', state);
      return state;
    case 'LAYOUTS_RESET':
      if (action.payload.target) {
        state = {
          ...state,
          [action.payload.target]: defaultState[action.payload.target]
        };
      } else {
        state = {
          ...defaultState
        };
      }

      ls.set('setting.layouts', state);
      return state;
    default:
      return state;
  }
}
