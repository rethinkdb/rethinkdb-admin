import { Route, Switch, useRouteMatch } from 'react-router-dom';

function Routes() {
  const kek = useRouteMatch();
  console.log(kek);
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
        Logs
      </Route>
    </Switch>
  );
}

export { Routes };
