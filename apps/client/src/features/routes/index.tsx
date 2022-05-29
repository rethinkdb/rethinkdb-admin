import * as React from 'react';
import { Route, Routes } from 'react-router-dom';

import { DataExplorerPage } from '../data-explorer/data-explorer-page';
import { LogsPage } from '../logs';
import { DashboardPage } from '../dashboard/dashboard-page';
import { ServersPage } from '../servers/servers-page';
import { ServerPage } from '../servers/server-page';
import { TablesPage } from '../tables/tables-page';
import { TablePage } from '../tables/table-page';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<DashboardPage />} />
    <Route path="/tables" element={<TablesPage />} />
    <Route path="/tables/:id" element={<TablePage />} />
    <Route path="/servers" element={<ServersPage />} />
    <Route path="/servers/:id" element={<ServerPage />} />
    <Route path="/logs" element={<LogsPage />} />
    <Route path="/dataexplorer" element={<DataExplorerPage />} />
  </Routes>
);

export { AppRoutes };
