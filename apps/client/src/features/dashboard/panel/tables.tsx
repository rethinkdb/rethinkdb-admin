import { FunctionComponent, useEffect, useState } from 'react';
import { r } from 'rethinkdb-ts/lib/query-builder/r';
import { Stack, Typography } from '@mui/material';

import { request } from '../../rethinkdb/socket';
import { useChangesRequest } from '../../top-bar/data-hooks';
import { admin } from '../../rethinkdb/app-driver';
import { pluralizeNoun } from '../../utils';
import { RDatum } from 'rethinkdb-ts';

const { table_status: tableStatus } = admin;

const tsChanges = tableStatus.changes();

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

export function useTableQuery(): null | TableQueryResult {
  const [state, setState] = useState(null);
  const tccList = useChangesRequest(tsChanges);

  useEffect(() => {
    request(tablesQuery).then(setState);
  }, [tccList.length]);
  return state;
}

export const Tables: FunctionComponent = () => {
  const serverResult = useTableQuery();
  if (!serverResult) {
    return <>loading</>;
  }
  return (
    <Stack sx={{ minWidth: '160px' }}>
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
