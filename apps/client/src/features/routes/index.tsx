import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { DataExplorerPage } from '../data-explorer/data-explorer-page';
import { LogsPage } from '../logs';
import { DashboardPage } from '../dashboard/dashboard-page';
import { ServersPage } from '../servers/servers-page';
import { ServerPage } from '../servers/server-page';
import { TablesPage } from '../tables/tables-page';
import { TablePage } from '../tables/table-page';

function Routes() {
  return (
    <Switch>
      <Route path="/" exact>
        <DashboardPage />
      </Route>
      <Route path="/tables" exact>
        <TablesPage />
      </Route>
      <Route path="/tables/:id" exact>
        <TablePage />
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
        <DataExplorerPage />
      </Route>
    </Switch>
  );
}

export { Routes };
