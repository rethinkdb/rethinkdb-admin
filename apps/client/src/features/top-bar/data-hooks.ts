import { useEffect, useState } from 'react';
import { RDatum } from 'rethinkdb-ts';
import { r } from 'rethinkdb-ts/lib/query-builder/r';

import { admin, request, socket, system_db, useRequest } from '../rethinkdb';

const issuesQuery = admin.current_issues.count();
const serversCountQuery = admin.server_config.count();
const readyTablesQuery = r.do(
  r.db(system_db).table('table_config').count(),
  r
    .db(system_db)
    .table('table_status')('status')
    .filter((status: RDatum) => status('all_replicas_ready'))
    .count(),
  (tables: RDatum, tablesReady: RDatum) => ({
    tables,
    tablesReady,
  }),
);

export function useConnectedTo(): null | MeResponse {
  const [state, setState] = useState<MeResponse>(null);
  useEffect(() => {
    request<unknown, MeResponse>('me').then((data) => {
      setState(data);
    });
  }, []);
  return state;
}

export function useIssues(): null | unknown {
  const [state] = useRequest(issuesQuery);
  return state;
}

export function useServersNumber(): null | number {
  const [state] = useRequest<number>(serversCountQuery);
  return state;
}

const cList = [
  r.db(system_db).table('table_config').changes(),
  r.db(system_db).table('table_status').changes(),
];

export type TablesNumberType = { tablesReady: number; tables: number };

export function useTablesNumber(): null | TablesNumberType {
  const [state] = useRequest<TablesNumberType>(readyTablesQuery, cList);
  return state;
}

export type MeResponse = {
  id: string;
  name: string;
  proxy: boolean;
};

export function requestUpdates(): Promise<MeResponse> {
  return new Promise((resolve) => {
    socket.emit('checkUpdates', (data: MeResponse) => {
      resolve(data);
    });
  });
}

export function useUpdates(): any | null {
  const [responses, setResponses] = useState(null);

  useEffect(() => {
    requestUpdates()
      .then((data) => {
        setResponses(data);
      })
      .catch((error) => {
        setResponses(() => error.message);
      });
  }, []);
  return responses;
}
