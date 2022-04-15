import { r } from 'rethinkdb-ts/lib/query-builder/r';
import { system_db } from '../requests';
import { useEffect, useRef, useState } from 'react';
import { MeResponse, request, requestChanges, requestMe } from '../socket';
import { RDatum } from 'rethinkdb-ts';
import { RQuery } from 'rethinkdb-ts/lib/query-builder/query';

const issuesQuery = r.db(system_db).table('current_issues').count();
const serversCountQuery = r.db(system_db).table('server_config').count();
const getTablesAndReadyTablesQuery = r.do(
  r.db(system_db).table('table_config').count(),
  r
    .db(system_db)
    .table('table_status')('status')
    .filter((status: RDatum) => status('all_replicas_ready'))
    .count(),
  (tables, tablesReady) => ({
    tables,
    tablesReady,
  }),
);

function useConnectedTo(): null | MeResponse {
  const [state, setState] = useState<MeResponse>(null);
  useEffect(() => {
    requestMe().then((data) => {
      setState(data);
    });
  }, []);
  return state;
}

function useIssues(): null | unknown {
  const [state, setState] = useState(null);
  useEffect(() => {
    request(issuesQuery).then(setState);
  }, []);
  return state;
}

function useServersNumber(): null | number {
  const [state, setState] = useState(null);
  useEffect(() => {
    request<number>(serversCountQuery).then((data) => {
      setState(data);
    });
  }, []);
  return state;
}

function useTablesNumber(): null | { tablesReady: number; tables: number } {
  const [state, setState] = useState(null);
  useEffect(() => {
    request(getTablesAndReadyTablesQuery).then((data) => {
      setState(data);
    });
  }, []);
  return state;
}

function useChangesRequest<T = unknown>(query?: RQuery) {
  const [responses, setResponses] = useState<T[]>([]);
  const refref = useRef<() => void>();
  useEffect(() => {
    setResponses(() => []);
    if (!query) {
      return () => {
        if (refref.current) {
          refref.current();
          refref.current = null;
        }
      };
    }
    requestChanges<T>(query, (data) => {
      setResponses((l: T[]) => [...l, data]);
    })
      .then((unsub) => {
        refref.current = unsub;
      })
      .catch((error) => {
        setResponses(() => error.message);
      });
    return () => {
      if (refref.current) {
        refref.current();
        refref.current = null;
      }
    };
  }, [query]);
  return responses;
}

export {
  useConnectedTo,
  useIssues,
  useServersNumber,
  useChangesRequest,
  useTablesNumber,
};
