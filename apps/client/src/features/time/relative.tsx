import React, { FunctionComponent, memo, useEffect, useState } from 'react';
import { formatDuration, intervalToDuration } from 'date-fns';

// take the first three nonzero units
const units = [
  'years',
  'months',
  'weeks',
  'days',
  'hours',
  'minutes',
  'seconds',
];

export const compareToNow = (start: Date, end = new Date()) => {
  const duration = intervalToDuration({ start, end });

  const nonzero = Object.entries(duration)
    .filter(([_, value]) => value || 0 > 0)
    .map(([unit, _]) => unit);

  return formatDuration(duration, {
    format: units.filter((i) => new Set(nonzero).has(i)).slice(0, 3),
    delimiter: ', ',
  });
};

export const ComparableTime: FunctionComponent<{ date: Date }> = memo(
  ({ date }) => {
    const [end, setEnd] = useState<Date>(new Date());
    useEffect(() => {
      const timeout = setTimeout(() => {
        setEnd(new Date());
      }, 1000);
      return () => {
        clearTimeout(timeout);
      };
    });
    return <>{compareToNow(date, end)}</>;
  },
);
