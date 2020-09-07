import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, Link, useLocation } from 'react-router-dom';
import cx from 'classnames';
import Markdown from 'react-markdown';
import queryString from 'query-string';

import actions from '../../store/actions';
import { t, formatTime } from '../../utils/i18n';
import { useIsMounted } from '../../utils/hooks';
import * as bungie from '../../utils/bungie';
import * as voluspa from '../../utils/voluspa';
import * as enums from '../../utils/destinyEnums';
import * as paths from '../../utils/paths';
import Button from '../UI/Button';
import Spinner from '../UI/Spinner';
import ObservedImage from '../ObservedImage';
import { Common } from '../../svg';

import './styles.css';

const RegExpEmail = new RegExp(/^\S+@\S+\.\S+$/);
const authUrl = `https://www.bungie.net/en/OAuth/Authorize?client_id=${process.env.REACT_APP_BUNGIE_CLIENT_ID}&response_type=code`;

export function PatreonAssociation({ destinyMemberships, primaryMembershipId, ...props }) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();

  const [state, setState] = useState({
    loading: false,
    error: false,
  });

  const [input, setInput] = useState({
    value: '',
    isValid: false,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function handler_onSearchChange(event) {
    if (isMounted.current) {
      setInput({
        value: event.target.value.trim(),
        isValid: RegExpEmail.test(event.target.value.trim()),
      });
    }
  }

  function handler_onSubmit(event) {
    event.preventDefault();

    if (input.isValid) {
      setAssociation();
    }
  }

  async function setAssociation() {
    const membershipIds = destinyMemberships.map((m) => m.membershipId);

    if (!membershipIds.length || input.value === '') return;

    if (isMounted.current) {
      setState({
        loading: true,
        error: false,
      });
    }

    try {
      const response = await voluspa.PostPatreon({ membershipIds, primaryMembershipId, email: input.value });

      if (isMounted.current) {
        setState({
          loading: false,
          error: false,
        });

        setInput({
          value: response.ErrorCode === 1 ? '' : input.value,
          isValid: response.ErrorCode === 1 ? false : true,
        });

        if (response.ErrorCode === 1) {
          dispatch(
            actions.notifications.push({
              date: new Date().toISOString(),
              expiry: 86400000,
              displayProperties: {
                name: 'Braytech',
                description: t('Thanks! Your email is now associated with your profiles'),
                timeout: 10,
              },
            })
          );

          props.handler();
        } else if (response.ErrorCode !== 1) {
          dispatch(
            actions.notifications.push({
              error: true,
              date: new Date().toISOString(),
              expiry: 86400000,
              displayProperties: {
                name: 'VOLUSPA',
                description: `${response.ErrorCode} ${response.ErrorStatus}`,
                timeout: 30,
              },
            })
          );
        }
      }
    } catch (error) {
      if (isMounted.current) {
        setState({
          loading: false,
          error: true,
        });

        dispatch(
          actions.notifications.push({
            error: true,
            date: new Date().toISOString(),
            expiry: 86400000,
            displayProperties: {
              name: `HTTP error`,
              description: `A network error occured. ${error.message}.`,
              timeout: 4,
            },
          })
        );
      }
    }
  }

  return (
    <div className='bungie-auth'>
      <h4>{t('Patreon association')}</h4>
      <div className='patreon'>
        <Markdown className='text' source={`Some Patreon tiers include rewards in the form of _flair_ which is displayed at the side of your player name.\nEnable display of relevant flair by entering the email associated with your Patreon account.`} />
        <form onSubmit={handler_onSubmit}>
          <div className='form'>
            <div className='field'>
              <input onChange={handler_onSearchChange} type='email' required placeholder={t('chonky_zuzuvala69@hotmail.reef')} pattern='^\S+@\S+\.\S+$' spellCheck='false' value={input.value} />
            </div>
          </div>
          <div className='actions'>
            <div>
              <Button text={t('Cancel')} action={props.handler} />
              <Button text={t('Set')} action={handler_onSubmit} type='submit' disabled={!input.isValid || state.loading} />
            </div>
            <div>{state.loading ? <Spinner mini /> : null}</div>
          </div>
        </form>
      </div>
    </div>
  );
}

export function BungieAuth() {
  const auth = useSelector((state) => state.auth);
  const member = useSelector((state) => state.member);
  const dispatch = useDispatch();
  const isMounted = useIsMounted();

  const location = useLocation();
  const authorization_code = queryString.parse(location.search)?.code;

  const [state, setState] = useState({
    loading: true,
    error: false,
    memberships: undefined,
    patreon: false,
  });

  function handleErrors(response) {
    if (response.error && response.error === 'invalid_grant') {
      dispatch(actions.auth.reset());
    }
  }

  function handler_forget() {
    dispatch(actions.auth.reset());
    dispatch(actions.sync.reset());

    setState({
      loading: false,
      error: false,
      memberships: undefined,
      patreon: false,
    });
  }

  function handler_patreon() {
    setState((state) => ({
      ...state,
      patreon: !state.patreon,
    }));
  }

  const handler_loadMembership = (membership) => (event) => {
    window.scrollTo(0, 0);

    dispatch(actions.member.load(membership));
  };

  useEffect(() => {
    if (authorization_code) {
      getAccessTokens(authorization_code);
    } else if (auth) {
      getMemberships();
    } else {
      if (isMounted.current) {
        setState({
          loading: false,
          error: false,
          memberships: undefined,
        });
      }
    }

    async function getAccessTokens(code) {
      await bungie.GetOAuthAccessToken(`client_id=${process.env.REACT_APP_BUNGIE_CLIENT_ID}&grant_type=authorization_code&code=${code}`);

      if (isMounted.current) {
        getMemberships();
      }
    }

    async function getMemberships() {
      const response = await bungie.GetMembershipDataForCurrentUser();

      if (isMounted.current) {
        if (response?.ErrorCode === 1) {
          setState({
            loading: false,
            error: false,
            memberships: response.Response,
          });

          const crossSaveOverride = response.Response.destinyMemberships.find((m) => m.crossSaveOverride > 0);

          // load a default membership
          if (crossSaveOverride && !member.membershipId) {
            dispatch(actions.member.load({ membershipType: crossSaveOverride.membershipType, membershipId: crossSaveOverride.membershipId }));
          }
        } else if (response?.ErrorCode !== 1 || response?.error) {
          // in case of 'invalid_grant'
          handleErrors(response);

          setState({
            loading: false,
            error: {
              ErrorCode: response.ErrorCode || response.error,
              ErrorStatus: response.ErrorStatus || response.error_description,
            },
            memberships: undefined,
          });
        } else {
          setState({
            loading: false,
            error: true,
            memberships: undefined,
          });
        }
      }
    }
  }, []);

  if (authorization_code) {
    return <Redirect to='/settings' />;
  }

  if (state.patreon) {
    return <PatreonAssociation {...state.memberships} handler={handler_patreon} />;
  }

  if (state.loading) {
    return (
      <div className='bungie-auth loading'>
        <Spinner />
      </div>
    );
  } else {
    if (state.memberships && !state.error) {
      return (
        <div className='bungie-auth'>
          <div className='member'>
            <ObservedImage className='image background' src={`https://www.bungie.net/img/UserThemes/${state.memberships.bungieNetUser.profileThemeName}/header.jpg`} />
            <div className='details'>
              <div className={cx('icon', { shadow: !/.gif/.test(state.memberships.bungieNetUser.profilePicturePath) })}>
                <ObservedImage className='image' src={`https://www.bungie.net${state.memberships.bungieNetUser.profilePicturePath}`} />
              </div>
              <div className='text'>
                <div className='displayName'>{state.memberships.bungieNetUser.displayName}</div>
                <div className='firstAccess'>
                  <time title={state.memberships.bungieNetUser.firstAccess}>{formatTime(state.memberships.bungieNetUser.firstAccess, 'DD/MM/YYYY')}</time>
                </div>
              </div>
            </div>
          </div>
          <div className='memberships'>
            <h4>{t('Associated memberships')}</h4>
            <ul className='list'>
              {state.memberships.destinyMemberships.map((m) => {
                return (
                  <li key={m.membershipId} className='linked'>
                    <div className={cx('icon', `braytech-platform_${enums.PLATFORM_STRINGS[m.membershipType]}`)} />
                    <div className='displayName'>{state.memberships.bungieNetUser.blizzardDisplayName && m.membershipType === 4 ? state.memberships.bungieNetUser.blizzardDisplayName : m.displayName}</div>
                    {m.crossSaveOverride === m.membershipType ? (
                      <div className='cross-save'>
                        <Common.CrossSave />
                      </div>
                    ) : null}
                    <Link to='/character-select' onClick={handler_loadMembership({ membershipType: m.membershipType, membershipId: m.membershipId })} />
                  </li>
                );
              })}
            </ul>
            <div className='info'>
              <p>{t('These are the memberships that are currently associated with your Bungie.net profile.')}</p>
            </div>
          </div>
          <h4>{t('Authentication data')}</h4>
          <Button text={t('Forget me')} action={handler_forget} />
          <div className='info'>
            <p>{t('Delete the authentication data stored on your device. While unnecessary, this function is provided for your peace of mind.')}</p>
          </div>
          <Button text={t('Patreon association')} action={handler_patreon} />
          <div className='info'>
            <p>{t('Associate this Bungie.net profile with a Patreon account')}</p>
          </div>
        </div>
      );
    } else {
      if (state.error) {
        return (
          <div className='bungie-auth'>
            <div className='text'>
              {state.error.ErrorCode ? (
                <>
                  <p>
                    {state.error.ErrorCode} {state.error.ErrorStatus}
                  </p>
                  <p>{state.error.Message}</p>
                </>
              ) : (
                t('Unknown error')
              )}
            </div>
            <Button cta action={handler_goToBungie}>
              <div className='text'>{t('Authenticate')}</div>
              <i className='segoe-mdl-arrow-right' />
            </Button>
          </div>
        );
      } else {
        return (
          <div className='bungie-auth'>
            <Button cta action={handler_goToBungie}>
              <div className='text'>{t('Authenticate')}</div>
              <i className='segoe-mdl-arrow-right' />
            </Button>
          </div>
        );
      }
    }
  }
}

export function BungieAuthMini() {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const isMounted = useIsMounted();

  const [state, setState] = useState({
    loading: true,
    error: false,
    memberships: undefined,
  });

  function handleErrors(response) {
    if (response.error && response.error === 'invalid_grant') {
      dispatch(actions.auth.reset());
    }
  }

  const handler_loadMembership = (membership) => (event) => {
    window.scrollTo(0, 0);

    dispatch(actions.member.load(membership));
  };

  useEffect(() => {
    if (auth) {
      getMemberships();
    } else {
      if (isMounted.current) {
        setState({
          loading: false,
          error: false,
          memberships: undefined,
        });
      }
    }

    async function getMemberships() {
      const response = await bungie.GetMembershipDataForCurrentUser();

      if (isMounted.current) {
        if (response && response.ErrorCode === 1) {
          setState({
            loading: false,
            error: false,
            memberships: response.Response,
          });
        } else if ((response && response.ErrorCode && response.ErrorCode !== 1) || (response && response.error)) {
          // in case of 'invalid_grant' - not sure if i need this anymore
          handleErrors(response);

          setState({
            loading: false,
            error: {
              ErrorCode: response.ErrorCode || response.error,
              ErrorStatus: response.ErrorStatus || response.error_description,
            },
            memberships: undefined,
          });
        } else {
          setState({
            loading: false,
            error: true,
            memberships: undefined,
          });
        }
      }
    }
  }, []);

  if (state.loading) {
    return <Spinner mini />;
  } else {
    if (state.memberships && !state.error) {
      return (
        <div className='bungie-auth'>
          <div className='memberships'>
            <ul className='list'>
              {state.memberships.destinyMemberships.map((m) => {
                return (
                  <li key={m.membershipId} className='linked'>
                    <div className={cx('icon', `braytech-platform_${enums.PLATFORM_STRINGS[m.membershipType]}`)} />
                    <div className='displayName'>{state.memberships.bungieNetUser.blizzardDisplayName && m.membershipType === 4 ? state.memberships.bungieNetUser.blizzardDisplayName : m.displayName}</div>
                    {m.crossSaveOverride === m.membershipType ? (
                      <div className='cross-save'>
                        <Common.CrossSave />
                      </div>
                    ) : null}
                    <Link to='/character-select' onClick={handler_loadMembership({ membershipType: m.membershipType, membershipId: m.membershipId })} />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      );
    } else {
      if (state.error) {
        return (
          <div className='bungie-auth'>
            <div className='text'>
              {state.error.ErrorCode ? (
                <>
                  <p>
                    {state.error.ErrorCode} {state.error.ErrorStatus}
                  </p>
                  <p>{state.error.Message}</p>
                </>
              ) : (
                t('Unknown error')
              )}
            </div>
            <Button cta action={handler_goToBungie}>
              <div className='text'>{t('Authenticate')}</div>
              <i className='segoe-mdl-arrow-right' />
            </Button>
          </div>
        );
      } else {
        return (
          <div className='bungie-auth'>
            <Button cta action={handler_goToBungie}>
              <div className='text'>{t('Authenticate')}</div>
              <i className='segoe-mdl-arrow-right' />
            </Button>
          </div>
        );
      }
    }
  }
}

export function BungieAuthButton() {
  return (
    <div className='bungie-auth'>
      <Button cta action={handler_goToBungie}>
        <div className='text'>{t('Login with Bungie.net')}</div>
        <i className='segoe-mdl-arrow-right' />
      </Button>
    </div>
  );
}

function handler_goToBungie() {
  window.location = authUrl;
}

export function NoAuth({ inline }) {
  return (
    <div className={cx('bungie-auth', 'no-auth', { inline })}>
      <div className='module'>
        <div className='properties'>
          <div className='name'>{t('Authentication required')}</div>
          <div className='description'>
            <p>{t('Auth.Error.Reason')}</p>
            <p>{t('Auth.Error.Resolution')}</p>
          </div>
          <Button cta action={handler_goToBungie}>
            <div className='text'>{t('Authenticate')}</div>
            <i className='segoe-mdl-arrow-right' />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function DiffProfile({ inline }) {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const isMounted = useIsMounted();

  const location = useLocation();
  const pathname = paths.removeMemberIds(location.pathname);

  const [state, setState] = useState({
    loading: true,
    error: false,
    memberships: undefined,
  });

  const handler_loadMembership = (membership) => (event) => {
    window.scrollTo(0, 0);

    dispatch(actions.member.load(membership));
  };

  useEffect(() => {
    if (auth) {
      getMemberships();
    }

    async function getMemberships() {
      const response = await bungie.GetMembershipDataForCurrentUser();

      if (isMounted.current) {
        if (response && response.ErrorCode === 1) {
          setState({
            loading: false,
            error: false,
            memberships: response.Response,
          });
        } else if (response && response.ErrorCode !== 1) {
          setState({
            loading: false,
            error: response,
            memberships: undefined,
          });
        } else {
          setState({
            loading: false,
            error: true,
            memberships: undefined,
          });
        }
      }
    }
  }, []);

  let properties;
  if (pathname === '/clan/admin') {
    properties = (
      <>
        <div className='name'>{t("OI, ge'outofit")}</div>
        <div className='description'>
          <p>{t("This doesn't appear to be your clan and so you may not will any actions upon it. You may use these helpful links to jump to your own or you may find more information regarding your current authorization in the Settings view.")}</p>
        </div>
      </>
    );
  } else {
    properties = (
      <>
        <div className='name'>{t('Oh, honey')}</div>
        <div className='description'>
          <p>{t("You are not authorised to access a different user's profile data, but you may use these helpful links to return to your own.")}</p>
          <p>{t('You can find more information regarding your authentication in the Settings view.')}</p>
        </div>
      </>
    );
  }

  if (state.error) {
    return (
      <div className='bungie-auth'>
        <div className='text'>
          {state.error.ErrorCode ? (
            <>
              <p>
                {state.error.ErrorCode} {state.error.ErrorStatus}
              </p>
              <p>{state.error.Message}</p>
            </>
          ) : (
            t('Unknown error')
          )}
        </div>
        <Button cta action={handler_goToBungie}>
          <div className='text'>{t('Authenticate')}</div>
          <i className='segoe-mdl-arrow-right' />
        </Button>
      </div>
    );
  } else {
    return (
      <div className={cx('bungie-auth', 'no-auth', { inline })}>
        <div className='module'>
          <div className='properties'>
            {properties}
            {state.loading ? (
              <Spinner mini />
            ) : (
              <div className='memberships'>
                <ul className='list'>
                  {state.memberships.destinyMemberships.map((m) => {
                    return (
                      <li key={m.membershipId} className='linked'>
                        <div className={cx('icon', `braytech-platform_${enums.PLATFORM_STRINGS[m.membershipType]}`)} />
                        <div className='displayName'>{state.memberships.bungieNetUser.blizzardDisplayName && m.membershipType === 4 ? state.memberships.bungieNetUser.blizzardDisplayName : m.displayName}</div>
                        {m.crossSaveOverride === m.membershipType ? (
                          <div className='cross-save'>
                            <Common.CrossSave />
                          </div>
                        ) : null}
                        <Link to='/character-select' onClick={handler_loadMembership({ membershipType: m.membershipType, membershipId: m.membershipId })} />
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
