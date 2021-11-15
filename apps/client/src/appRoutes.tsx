import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import { DataExplorer } from './data-explorer';
import { Logs } from './features/logs/log-list';
import { DashboardPage } from './features/dashboard/dashboard-page';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />}></Route>
      <Route path="/tables" element={<>Tables</>}></Route>
      <Route path="/servers" element={<>Servers</>}></Route>
      <Route path="/logs" element={<Logs />} />
      <Route path="/dataexplorer" element={<DataExplorer />} />
    </Routes>
  );
}

export { AppRoutes };
