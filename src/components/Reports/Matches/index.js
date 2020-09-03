import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { orderBy } from 'lodash';

import { t } from '../../../utils/i18n';
import { useInterval } from '../../../utils/hooks';
import { GetActivityHistory } from '../../../utils/bungie';
import { getReport } from '../../../utils/reports';

import Spinner from '../../UI/Spinner';
import Button from '../../UI/Button';
import TimeTilRefresh from '../../UI/TimeTilRefresh';

import PGCR from '../PGCR';

import './styles.css';

export default function Match({ mode, limit = 15, offset = 0, root }) {
  const cache = useSelector((state) => state.reports.cache);
  const member = useSelector((state) => state.member);
  const auth = useSelector((state) => state.auth);

  const ref_matches = useRef();
  const [loading, setLoading] = useState(false);
  const [instances, setInstances] = useState([]);

  // get history; on mount, on activity mode change, on offset change, on characterId change
  useEffect(() => {
    history();
  }, [mode, offset, member.characterId]);

  // check for new history every 20 seconds
  useInterval(() => {
    if (!loading) {
      history();
    }
  }, 20000);

  async function history() {
    setLoading(true);

    // get activity history
    const activities = await GetActivityHistory({
      params: {
        membershipType: member.membershipType,
        membershipId: member.membershipId,
        characterId: member.characterId,
        count: limit,
        mode,
        page: offset,
      },
      withAuth: auth?.destinyMemberships?.find((d) => d.membershipId === member.membershipId) && true,
    }).then((response) => {
      if (response?.ErrorCode === 1) {
        return response.Response.activities;
      } else {
        return false;
      }
    });

    if (activities) {
      // set instances state to control which reports are displayed
      setInstances(activities.map((activity) => activity.activityDetails.instanceId));

      // get reports
      await Promise.all(
        activities.map(async (activity) => {
          const cached = cache.find((report) => report.activityDetails.instanceId === activity.activityDetails.instanceId);

          if (cached) {
            return cached;
          } else {
            return await getReport(activity.activityDetails.instanceId);
          }
        })
      );
    }

    setLoading(false);
  }

  function handler_scrollToMatches(event) {
    if (ref_matches.current) {
      ref_matches.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const reports =
    // order reports by period (time ended)
    orderBy(
      // from redux
      cache
        // filters cache by matching requested mode
        .filter((report) => (mode ? report.activityDetails.modes.indexOf(mode) > -1 : true))
        // filters by matching instances as per activity history response
        .filter((report) => instances.includes(report.activityDetails.instanceId))
        // filters out unlikely duplicates
        .filter((report, index, reports) => reports.map((r) => r.activityDetails.instanceId).indexOf(report.activityDetails.instanceId) === index),
      [(report) => report.period],
      ['desc']
    );

  return reports.length ? (
    <div ref={ref_matches} className='matches'>
      <div className='state'>
        <TimeTilRefresh isLoading={loading} duration='20s' />
        {loading ? <Spinner /> : null}
      </div>
      <ul className='list reports'>
        {reports.map((r) => (
          <PGCR key={r.activityDetails.instanceId} report={r} />
        ))}
      </ul>
      <div className='pages'>
        <Button classNames='previous' text={t('Previous page')} disabled={loading ? true : offset > 0 ? false : true} anchor to={`/${member.membershipType}/${member.membershipId}/${member.characterId}${root}/${mode ? mode : '-1'}/${offset - 1}`} action={handler_scrollToMatches} />
        <Button classNames='next' text={t('Next page')} disabled={loading || reports.length < limit} anchor to={`/${member.membershipType}/${member.membershipId}/${member.characterId}${root}/${mode ? mode : '-1'}/${offset + 1}`} action={handler_scrollToMatches} />
      </div>
    </div>
  ) : loading ? (
    <div className='matches loading'>
      <Spinner />
    </div>
  ) : (
    <div className='matches info'>{t('No reports available')}</div>
  );
}
