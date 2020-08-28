import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import { t, fromNow, BraytechText } from '../../utils/i18n';
import manifest from '../../utils/manifest';
import { GetBlogPosts } from '../../utils/voluspa';
import MemberLink from '../../components/MemberLink';
import Button from '../../components/UI/Button';
import Spinner from '../../components/UI/Spinner';
import ObservedImage from '../../components/ObservedImage';
import { Common, Views } from '../../svg';

import captainsLog from '../../data/captainsLog';

import './styles.css';

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // while there remain elements to shuffle...
  while (0 !== currentIndex) {
    // pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // and swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export default function Index() {
  const viewport = useSelector((state) => state.viewport);

  const supporters = manifest.statistics?.patrons && shuffle([...manifest.statistics.patrons.alpha, ...manifest.statistics.patrons.beta.filter((m) => manifest.statistics.patrons.alpha.indexOf(m) < 0)]).slice(0, viewport.width < 1025 && viewport.width > 600 ? 10 : viewport.width > 600 ? 21 : 7);

  const [changeLogIndex, setChangeLogIndex] = useState(0);
  const logs = [...captainsLog].reverse();

  function handler_changeLog_onClickPrevious(event) {
    if (changeLogIndex + 1 === logs.length) {
      return;
    }

    setChangeLogIndex(changeLogIndex + 1);
  }

  function handler_changeLog_onClickNext(event) {
    if (changeLogIndex === 0) {
      return;
    }

    setChangeLogIndex(changeLogIndex - 1);
  }

  const [blog, setBlog] = useState({
    loading: true,
    error: false,
    posts: [],
  });
  const [blogPostsIndex, setBlogPostsIndex] = useState(0);

  function handler_blogPosts_onClickPrevious(event) {
    if (blogPostsIndex + 1 === logs.length) {
      return;
    }

    setBlogPostsIndex(blogPostsIndex + 1);
  }

  function handler_blogPosts_onClickNext(event) {
    if (blogPostsIndex === 0) {
      return;
    }

    setBlogPostsIndex(blogPostsIndex - 1);
  }

  useEffect(() => {
    window.scrollTo(0, 0);

    async function getBlogPosts() {
      const response = await GetBlogPosts();

      if (response?.ErrorCode === 1) {
        setBlog({
          loading: false,
          error: false,
          posts: response.Response,
        });
      } else {
        setBlog({
          loading: false,
          error: true,
          posts: [],
        });
      }
    }

    getBlogPosts();
  }, []);

  const highlights = [
    {
      name: t('Clan'),
      desc: t('About your clan, its roster, summative historical stats for all members, and admin mode'),
      slug: '/clan',
      icon: Views.Index.Clan,
    },
    {
      name: t('Collections'),
      desc: t('Items your Guardian has acquired over their lifetime'),
      slug: '/collections',
      icon: Views.Index.Collections,
    },
    {
      name: t('Triumphs'),
      desc: t('Records your Guardian has achieved through their trials'),
      slug: '/triumphs',
      icon: Views.Index.Triumphs,
    },
    {
      name: t('Checklists'),
      desc: t('Ghost scans and item checklists spanning the Sol system'),
      slug: '/checklists',
      icon: Views.Index.Checklists,
    },
    {
      name: t('Maps'),
      desc: t('Interactive maps charting checklists and other notable destinations'),
      slug: '/maps',
      icon: Views.Index.Maps,
    },
    {
      name: t('This Week'),
      desc: t('Noteworthy records and collectibles which are available at a weekly cadence'),
      slug: '/this-week',
      icon: Views.Index.ThisWeek,
    },
    {
      name: t('Quests'),
      desc: t('Track your pursuits, including quests and bounties'),
      slug: '/quests',
      icon: Views.Index.Quests,
    },
    {
      name: t('Reports'),
      desc: t('Explore and filter your Post Game Carnage Reports in detail'),
      slug: '/reports',
      icon: Views.Index.Reports,
    },
  ];

  return (
    <div className='view' id='index'>
      <div className='row header'>
        <div className='wrapper'>
          <div className='large-text'>
            <div className='name'>Braytech</div>
            <div className='description'>{t('Landing.Flair')}</div>
            <Link className='button cta' to='/now'>
              <div className='text'>{t('Select your character')}</div>
              <i className='segoe-mdl-arrow-right' />
            </Link>
          </div>
          <div className='views'>
            {highlights.map((highlight, h) => (
              <div key={h} className='v'>
                <div className='icon'>
                  <highlight.icon />
                </div>
                <div className='text'>
                  <div className='name'>{highlight.name}</div>
                  <div className='description'>{highlight.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='row patreon'>
        <div className='wrapper'>
          <div className='device'>
            <Common.Patreon />
          </div>
          <div className='module'>
            <h3>{t('Support Braytech')}</h3>
            <BraytechText className='description' value={t('Landing.Support')} />
            <a className='button cta' href='https://www.patreon.com/braytech' target='_blank' rel='noreferrer noopener'>
              <div className='text'>{t('Become a Patron')}</div>
              <i className='segoe-mdl-arrow-right' />
            </a>
          </div>
          <div className='module tags'>
            {supporters?.map((membershipId, m) => (
              <MemberLink key={m} id={membershipId} hideFlair />
            ))}
          </div>
        </div>
      </div>
      <div className='row development'>
        <div className='wrapper'>
          <div className='module changes'>
            <div className='header'>
              <div className='text'>
                <div className='time'>
                  <time title={logs[changeLogIndex].date}>{fromNow(logs[changeLogIndex].date, false, true)}</time>
                </div>
                <h3>{logs[changeLogIndex].version}</h3>
              </div>
              <div className='buttons'>
                <Button action={handler_changeLog_onClickPrevious} disabled={changeLogIndex + 1 === logs.length ? true : false}>
                  <i className='segoe-mdl-chevron-left' />
                </Button>
                <Button action={handler_changeLog_onClickNext} disabled={changeLogIndex === 0 ? true : false}>
                  <i className='segoe-mdl-chevron-right' />
                </Button>
              </div>
            </div>
            <BraytechText className='content' value={logs[changeLogIndex].content} />
          </div>
          <div className={cx('module', 'blog', { loading: blog.loading })}>
            {blog.loading ? (
              <Spinner />
            ) : blog.posts.length ? (
              <>
                <div className='header'>
                  <div className='text'>
                    <div className='time'>
                      <time title={blog.posts[blogPostsIndex].date}>{fromNow(blog.posts[blogPostsIndex].date, false, true)}</time>
                    </div>
                    <BraytechText className='summary' value={blog.posts[blogPostsIndex].summary} />
                    <h3>{blog.posts[blogPostsIndex].name}</h3>
                  </div>
                  <div className='buttons'>
                    <Button action={handler_blogPosts_onClickPrevious} disabled={blogPostsIndex + 1 === blog.posts.length ? true : false}>
                      <i className='segoe-mdl-chevron-left' />
                    </Button>
                    <Button action={handler_blogPosts_onClickNext} disabled={blogPostsIndex === 0 ? true : false}>
                      <i className='segoe-mdl-chevron-right' />
                    </Button>
                  </div>
                </div>
                <div className='post'>
                  {blog.posts[blogPostsIndex].content.map((block, b) =>
                    block.media ? (
                      <div key={b} className='block media'>
                        <ObservedImage padded ratio={block.media.height / block.media.width} src={block.media.storage === 'directus' && `https://directus.upliftnaturereserve.com/bt03/assets/${block.media.privateHash}`} />
                      </div>
                    ) : (
                      <BraytechText key={b} className='block markdown' value={block.markdown} />
                    )
                  )}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
      <div className='row about'>
        <div className='wrapper'>
          <div className='module'>
            <h3>{t('What is Braytech')}</h3>
            <BraytechText className='description' value={t('Landing.About.What')} />
          </div>
          <div className='module'>
            <h3>{t('Who builds it')}</h3>
            <BraytechText className='description' value={t('Landing.About.Who')} />
          </div>
          {manifest.statistics.scrapes?.last?.tracking ? (
            <div className='module stats'>
              <h3>{t('VOLUSPA statistics')}</h3>
              <BraytechText className='description' value={t('Landing.VOLUSPA')} />
              <ul>
                <li>
                  <div className='value'>{manifest.statistics.scrapes.last.tracking.toLocaleString()}</div>
                  <div className='name'>{t('Landing.VOLUSPA.TrackedPlayers.Name')}</div>
                  <div className='description'>
                    <p>{t('Landing.VOLUSPA.TrackedPlayers.Description')}</p>
                  </div>
                </li>
                <li>
                  <div className='value'>{manifest.statistics.scrapes.last.season.toLocaleString()}</div>
                  <div className='name'>{t('Landing.VOLUSPA.PlayedSeason.Name')}</div>
                  <div className='description'>
                    <p>{t('Landing.VOLUSPA.PlayedSeason.Description')}</p>
                  </div>
                </li>
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
