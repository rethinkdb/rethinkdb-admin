import { r } from 'rethinkdb-ts/lib/query-builder/r';
import { RDatum } from 'rethinkdb-ts';
import { Stack, Typography } from '@mui/material';

import { admin, useRequest } from '../../rethinkdb';

const { table_config: tableConfig, jobs, table_status: tableStatus } = admin;

const cList = [tableStatus.changes()];

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

export const Indexes = () => {
  const [indexesResult] = useRequest<IndexQueryResult>(indexesQuery, cList);

  if (!indexesResult) {
    return <>loading</>;
  }
  return (
    <Stack minWidth="160px">
      <Typography>Indexes</Typography>
      <Typography>{indexesResult.num_sindexes} secondary indexes</Typography>
      <Typography>
        {indexesResult.sindexes_constructing} indexes building
      </Typography>
    </Stack>
  );
};
