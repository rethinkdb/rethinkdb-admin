import { useEffect, useRef, useState } from 'react';
import { RDatum } from 'rethinkdb-ts';
import { r } from 'rethinkdb-ts/lib/query-builder/r';
import { RQuery } from 'rethinkdb-ts/lib/query-builder/query';
import { system_db } from '../rethinkdb';
import {
  MeResponse,
  request,
  requestChanges,
  requestMe,
  requestUpdates,
} from '../rethinkdb/socket';

const issuesQuery = r.db(system_db).table('current_issues').count();
const serversCountQuery = r.db(system_db).table('server_config').count();
const getTablesAndReadyTablesQuery = r.do(
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

export function useRequest<T = unknown>(query?: RQuery): T | null {
  const [responses, setResponses] = useState<T>(null);

  useEffect(() => {
    setResponses(() => null);
    if (query) {
      request<T>(query)
        .then((data) => {
          setResponses(data);
        })
        .catch((error) => {
          setResponses(() => error.message);
        });
    }
  }, [query]);
  return responses;
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

function useChangesRequest<T = unknown>(query?: RQuery) {
  const [responses, setResponses] = useState<T[]>([]);
  const unsubRef = useRef<() => void>();
  useEffect(() => {
    setResponses(() => []);
    if (!query) {
      return () => {
        if (unsubRef.current) {
          unsubRef.current();
          unsubRef.current = null;
        }
      };
    }
    requestChanges<T>(query, (data) => {
      setResponses((l: T[]) => [...l, data]);
    })
      .then((unsub) => {
        unsubRef.current = unsub;
      })
      .catch((error) => {
        setResponses(() => error.message);
      });
    return () => {
      if (unsubRef.current) {
        unsubRef.current();
        unsubRef.current = null;
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
