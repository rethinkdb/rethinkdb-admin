import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { DataExplorer } from './data-explorer';
import { Logs } from './features/logs/log-list';

function Routes() {
  return (
    <Switch>
      <Route path="/" exact>
        DashboardPage
      </Route>
      <Route path="/tables" exact>
        Tables
      </Route>
      <Route path="/servers" exact>
        Servers
      </Route>
      <Route path="/logs" exact>
        <Logs />
      </Route>
      <Route path="/dataexplorer" exact>
        <DataExplorer />
      </Route>
    </Switch>
  );
}

export { Routes };
