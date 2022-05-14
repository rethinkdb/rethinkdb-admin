import React, { FunctionComponent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RDatum, RSingleSelection, RValue } from 'rethinkdb-ts';
import { r } from 'rethinkdb-ts/lib/query-builder/r';

import StorageIcon from '@mui/icons-material/Storage';
import { Card, CardContent, Divider, List, ListItem, ListItemText, Typography } from '@mui/material';

import { system_db } from '../rethinkdb';
import { request } from '../rethinkdb/socket';
import { ComparableTime } from '../time/relative';
import { LogList } from '../logs/log-list';

const tableConfig = r.db(system_db).table('table_config');
const tableStatus = r.db(system_db).table('table_status');

function serverRespQuery(server_name: RValue) {
  return tableConfig
    .filter((i: RDatum) =>
      i('shards')('replicas')
        .concatMap((x) => x)
        .contains(server_name),
    )
    .map(function (config) {
      return {
        db: config('db'),
        name: config('name'),
        id: config('id'),
        shards: config('shards')
          .map(
            tableStatus.get(config('id'))('shards'),
            r.range(config.count()),
            function (
              sconfig: RValue,
              sstatus: RValue,
              shardId: RValue,
            ): RValue {
              return {
                shard_id: shardId.add(1),
                total_shards: config('shards').count(),
                inshard: sconfig('replicas').contains(server_name),
                currently_primary:
                  sstatus('primary_replicas').contains(server_name),
                configured_primary: sconfig('primary_replica').eq(server_name),
                nonvoting: sconfig('nonvoting_replicas').contains(server_name),
              };
            },
          )
          .filter({ inshard: true })
          .without('inshard')
          .coerceTo('array'),
      };
    })
    .coerceTo('array');
}

function fetchServer(id: string) {
  return r.do(
    r.db(system_db).table('server_config').get(id),
    r.db(system_db).table('server_status').get(id),
    (
      server_config: RSingleSelection,
      server_status: RSingleSelection,
    ): RValue => {
      return {
        profile: {
          version: server_status('process')('version'),
          time_started: server_status('process')('time_started'),
          hostname: server_status('network')('hostname'),
          tags: server_config('tags'),
          cache_size: server_status('process')('cache_size_mb').mul(
            1024 * 1024,
          ),
        },
        main: {
          name: server_status('name'),
          id: server_status('id'),
        },
        tables: serverRespQuery(server_config('name')),
      };
    },
  );
}

export function useServer(id: string): ExpandedServer {
  const [state, setState] = useState(null);

  useEffect(() => {
    request(fetchServer(id)).then(setState);
  }, [id]);
  return state;
}

export type Shard = {
  configured_primary: boolean;
  currently_primary: boolean;
  nonvoting: boolean;
  shard_id: number;
  total_shards: number;
};

export type ShardedTable = {
  db: string;
  id: string;
  name: string;
  shards: Shard[];
};

export type ExpandedServer = {
  main: {
    id: string;
    name: string;
  };
  profile: {
    cache_size: number;
    hostname: string;
    tags: string[];
    time_started: string;
    version: string;
  };
  tables: ShardedTable[];
};

export type IShardedTableItem = {
  table: ShardedTable;
};

const replicaRolename = function ({
  configured_primary: configured,
  currently_primary: currently,
  nonvoting,
}: {
  configured_primary: boolean;
  currently_primary: boolean;
  nonvoting: boolean;
}) {
  if (configured && currently) {
    return 'Primary replica';
  } else if (configured && !currently) {
    return 'Goal primary replica';
  } else if (!configured && currently) {
    return 'Acting primary replica';
  } else if (nonvoting) {
    return 'Non-voting secondary replica';
  } else {
    return 'Secondary replica';
  }
};

export const TableShardItem: FunctionComponent<IShardedTableItem> = React.memo(
  ({ table }) => {
    const fullTableName = `${table.db}.${table.name}`;
    const secondary = (
      <React.Fragment>
        <Typography component="span" variant="body2" color="textPrimary">
          Shard {table.shards[0].shard_id}/{table.shards[0].total_shards} -{' '}
          <StorageIcon fontSize="inherit" />
          {replicaRolename(table.shards[0])}
        </Typography>
      </React.Fragment>
    );
    return (
      <ListItem dense button>
        <ListItemText
          id={table.id}
          primary={`Table ${fullTableName}`}
          secondary={secondary}
        />
      </ListItem>
    );
  },
);

export const TableShards: FunctionComponent<{ tables: ShardedTable[] }> = ({
  tables,
}) => (
  <Card sx={{ marginTop: 1 }}>
    <CardContent>
      <List>
        {tables.map((table, index) => (
          <React.Fragment key={table.id}>
            <TableShardItem table={table} />
            {tables.length > index + 1 && (
              <Divider variant="inset" component="li" />
            )}
          </React.Fragment>
        ))}
      </List>
    </CardContent>
    {/*<CardActions>*/}
    {/*  <Button size="small">Learn More</Button>*/}
    {/*</CardActions>*/}
  </Card>
);

export const ServerPage = () => {
  const params = useParams<{ id: string }>();
  const query = useServer(params.id);

  if (!query) {
    return <div>loading</div>;
  }

  return (
    <>
      <Typography variant="h6" noWrap marginTop={1}>
        Server overview for {query.main.name}
      </Typography>
      <Card sx={{ marginTop: 1 }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="textSecondary" gutterBottom>
            {query.profile.version.split(' ')[1]} version
          </Typography>
          <Typography variant="h5" component="h2">
            {query.profile.hostname} hostname
          </Typography>
          <Typography sx={{ m: 1 }} color="textSecondary">
            {query.profile.tags} tags
          </Typography>
          <Typography variant="body2" component="p">
            <ComparableTime date={new Date(query.profile.time_started)} />{' '}
            uptime
            <br />
            {Number(query.profile.cache_size / 1024 / 1024 / 1024).toFixed(2)}
            Gb cache size
          </Typography>
        </CardContent>
        {/*<CardActions>*/}
        {/*  <Button size="small">Learn More</Button>*/}
        {/*</CardActions>*/}
      </Card>
      <TableShards tables={query.tables} />
      <Card sx={{ marginTop: 1 }}>
        <LogList quantity={6} server={query.main.id} />
      </Card>
      <pre>The server is {JSON.stringify(query, null, 2)}</pre>
    </>
  );
};
