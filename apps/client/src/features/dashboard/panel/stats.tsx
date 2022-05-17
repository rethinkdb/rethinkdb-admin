import { useEffect, useState } from 'react';
import { RDatum } from 'rethinkdb-ts';
import { r } from 'rethinkdb-ts/lib/query-builder/r';
import { Stack, Typography } from '@mui/material';

import { admin, request } from '../../rethinkdb';
import { useChangesRequest } from '../../top-bar/data-hooks';
import { formatBytes } from '../../utils';

const { table_status: tableStatus, stats } = admin;

const tsChanges = tableStatus.changes();

const statsQuery = r.do({
  cache_used: stats
    .filter((stat: RDatum) => stat('id').contains('table_server'))(
      'storage_engine',
    )('cache')('in_use_bytes')
    .sum(),
  cache_total: tableStatus('process')('cache_size_mb')
    .map((row) => row.mul(1024 * 1024))
    .sum(),
  disk_used: stats
    .filter((row: RDatum) => row('id').contains('table_server'))(
      'storage_engine',
    )('disk')('space_usage')
    .map((data) =>
      data('data_bytes')
        .add(data('garbage_bytes'))
        .add(data('metadata_bytes'))
        .add(data('preallocated_bytes')),
    )
    .sum(),
});

export type StatsQueryResult = {
  cache_used: number;
  cache_total: number;
  disk_used: number;
};

export function useStatsQuery(): null | StatsQueryResult {
  const [state, setState] = useState(null);
  const tccList = useChangesRequest(tsChanges);

  useEffect(() => {
    request(statsQuery).then(setState);
  }, [tccList.length]);
  return state;
}

export const Stats = () => {
  const statsResult = useStatsQuery();
  if (!statsResult) {
    return <>loading</>;
  }

  const cachePercent = Math.ceil(
    (statsResult.cache_used / statsResult.cache_total) * 100,
  );
  const diskUsed = formatBytes(statsResult.disk_used);
  return (
    <Stack sx={{ minWidth: '160px' }}>
      <Typography>Resources</Typography>
      <Typography>{cachePercent}% cache used</Typography>
      <Typography>{diskUsed} disk used</Typography>
    </Stack>
  );
};
