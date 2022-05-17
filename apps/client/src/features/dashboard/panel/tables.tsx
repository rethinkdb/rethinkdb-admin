import { RDatum } from 'rethinkdb-ts';
import { r } from 'rethinkdb-ts/lib/query-builder/r';
import { Stack, Typography } from '@mui/material';

import { admin, useRequest } from '../../rethinkdb';
import { pluralizeNoun } from '../../utils';

const { table_status: tableStatus } = admin;

const cList = [tableStatus.changes()];

const tablesQuery = r.do({
  tables_ready: tableStatus.count((row: RDatum) =>
    row('status')('all_replicas_ready'),
  ),
  tables_unready: tableStatus.count((row: RDatum) =>
    row('status')('all_replicas_ready').not(),
  ),
});

export type TableQueryResult = {
  tables_ready: number;
  tables_unready: number;
};

// TODO move later on a single changes query
// const query = r
//   .db(system_db)
//   .table('table_status')
//   .map((i) => ({
//     tables_ready: i('status')('all_replicas_ready'),
//     id: i('id'),
//   }))
//   .changes({ includeInitial: true, includeStates: true });

export const Tables = () => {
  const [serverResult] = useRequest<TableQueryResult>(tablesQuery, cList);

  if (!serverResult) {
    return <>loading</>;
  }
  return (
    <Stack minWidth="160px">
      <Typography>Tables</Typography>
      <Typography>
        {serverResult.tables_ready}{' '}
        {pluralizeNoun('table', serverResult.tables_ready)} ready
      </Typography>
      <Typography>
        {serverResult.tables_unready}{' '}
        {pluralizeNoun('table', serverResult.tables_unready)} with issues
      </Typography>
    </Stack>
  );
};
