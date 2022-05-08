import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { DataExplorer } from './data-explorer';
import { LogsPage } from './features/logs';
import { DashboardPage } from './features/dashboard/dashboard-page';
import { ServersPage } from './features/servers';
import { ServerPage } from './features/servers/server-page';

function Routes() {
  return (
    <Switch>
      <Route path="/" exact>
        <DashboardPage />
      </Route>
      <Route path="/tables" exact>
        Tables
      </Route>
      <Route path="/servers" exact>
        <ServersPage />
      </Route>
      <Route path="/servers/:id" exact>
        <ServerPage />
      </Route>
      <Route path="/logs" exact>
        <LogsPage />
      </Route>
      <Route path="/dataexplorer" exact>
        <DataExplorer />
      </Route>
    </Switch>
  );
}

export { Routes };
