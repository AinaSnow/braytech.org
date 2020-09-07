import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Button from './Button';

function DismissTip(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const SetTipState = useCallback(
    value => e => {
      if (!value) return;

      dispatch({ type: 'TIPS_DISMISS', payload: value });
    },
    [dispatch]
  );

  return <Button text={t('Dismiss')} action={SetTipState(props.value)} />;
}

export default DismissTip;