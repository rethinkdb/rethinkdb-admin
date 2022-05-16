import { FunctionComponent, useEffect, useState } from 'react';
import { r } from 'rethinkdb-ts/lib/query-builder/r';
import { RDatum } from 'rethinkdb-ts';
import { Stack, Typography } from '@mui/material';

import { admin } from '../../rethinkdb/app-driver';
import { request } from '../../rethinkdb/socket';
import { useChangesRequest } from '../../top-bar/data-hooks';

const { table_config: tableConfig, jobs, table_status: tableStatus } = admin;

const tsChanges = tableStatus.changes();

const indexesQuery = r.do({
  num_sindexes: tableConfig.sum((row: RDatum) => row('indexes').count()),
  sindexes_constructing: jobs
    .filter({ type: 'index_construction' })('info')
    .count(),
});

export type IndexQueryResult = {
  num_sindexes: number;
  sindexes_constructing: number;
};

export function useIndexesQuery(): null | IndexQueryResult {
  const [state, setState] = useState(null);
  const tccList = useChangesRequest(tsChanges);

  useEffect(() => {
    request(indexesQuery).then(setState);
  }, [tccList.length]);
  return state;
}

export const Indexes: FunctionComponent = () => {
  const indexesResult = useIndexesQuery();
  if (!indexesResult) {
    return <>loading</>;
  }
  return (
    <Stack sx={{ minWidth: '160px' }}>
      <Typography>Indexes</Typography>
      <Typography>{indexesResult.num_sindexes} secondary indexes</Typography>
      <Typography>
        {indexesResult.sindexes_constructing} indexes building
      </Typography>
    </Stack>
  );
};
