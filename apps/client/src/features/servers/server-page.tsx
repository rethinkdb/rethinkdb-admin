import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RSingleSelection, RValue } from 'rethinkdb-ts';
import { r } from 'rethinkdb-ts/lib/query-builder/r';
import { formatDuration, intervalToDuration } from 'date-fns';

import { Card, CardContent, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
// import CardActions from '@material-ui/core/CardActions';
// import Button from '@material-ui/core/Button';

import { system_db } from '../../requests';
import { request } from '../../socket';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
    marginTop: theme.spacing(1),
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
}));

const tableConfig = r.db(system_db).table('table_config');
const tableStatus = r.db(system_db).table('table_status');

function serverRespQuery(server_name: RValue) {
  return {
    tables: tableConfig
      .filter((i) =>
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
                  configured_primary:
                    sconfig('primary_replica').eq(server_name),
                  nonvoting:
                    sconfig('nonvoting_replicas').contains(server_name),
                };
              },
            )
            .filter({ inshard: true })
            .without('inshard')
            .coerceTo('array'),
        };
      })
      .coerceTo('array'),
  };
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
        resp: serverRespQuery(server_config('name')),
      };
    },
  );
}

export function useServer(id: string): ExpandedServer {
  const [state, setState] = useState(null);

  const query = fetchServer(id);
  console.log(query.toString());
  useEffect(() => {
    request(fetchServer(id)).then(setState);
  }, [id]);
  return state;
}

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
  resp: {
    tables: {
      db: string;
      id: string;
      name: string;
      shards: {
        configured_primary: boolean;
        currently_primary: boolean;
        nonvoting: boolean;
        shard_id: number;
        total_shards: number;
      }[];
    }[];
  };
};

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
export const ServerPage = () => {
  const params = useParams<{ id: string }>();
  const query = useServer(params.id);
  const classes = useStyles();

  if (!query) {
    return <div>loading</div>;
  }

  const duration = intervalToDuration({
    start: new Date(query.profile.time_started),
    end: new Date(),
  });

  const nonzero = Object.entries(duration)
    .filter(([_, value]) => value || 0 > 0)
    .map(([unit, _]) => unit);

  return (
    <div className={classes.root}>
      <Card>
        <CardContent>
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
          >
            {query.profile.version.split(' ')[1]} version
          </Typography>
          <Typography variant="h5" component="h2">
            {query.profile.hostname} hostname
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            {query.profile.tags} tags
          </Typography>
          <Typography variant="body2" component="p">
            {formatDuration(duration, {
              format: units.filter((i) => new Set(nonzero).has(i)).slice(0, 3),
              delimiter: ', ',
            })}
            uptime
            <br />
            {Number(query.profile.cache_size / 1024 / 1024 / 1024).toFixed(2)}Gb
            cache size
          </Typography>
        </CardContent>
        {/*<CardActions>*/}
        {/*  <Button size="small">Learn More</Button>*/}
        {/*</CardActions>*/}
      </Card>
      <pre>The server is {JSON.stringify(query, null, 2)}</pre>
    </div>
  );
};
