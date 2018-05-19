import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import asyncComponent from 'client/utils/async-component';

export default [
  <Route key="feed" path="/feeds">
    <Switch>
      <Route exact path="/feeds" component={asyncComponent(() => import('./list/container'))} />
      <Route exact path="/feeds/:id" component={asyncComponent(() => import('./detail/container'))} />
    </Switch>
  </Route>,
];
