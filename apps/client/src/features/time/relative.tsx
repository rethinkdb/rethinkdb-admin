import React, { FunctionComponent, memo, useEffect, useState } from 'react';
import { formatDistance } from 'date-fns';

export const compareToNow = (start: Date, end = new Date(), suffix = true) => {
  return formatDistance(start, end, { addSuffix: suffix });
};

export const ComparableTime: FunctionComponent<{
  date: Date;
  suffix?: boolean;
}> = memo(({ date, suffix }) => {
  const [end, setEnd] = useState<Date>(new Date());
  useEffect(() => {
    const timeout = setTimeout(() => {
      setEnd(new Date());
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  });
  return <>{compareToNow(date, end, suffix)}</>;
});
