// ./routes/Layout.js
import React from 'react';
import { Route, Switch } from 'react-router';
import { Link } from 'react-router-dom';
// A Routes file is a good shared entry-point between client and server
import { redirectRoutes, routes } from './index';
import RedirectWithStatus from './RedirectWithStatus';
import type { RedirectProps } from './RedirectWithStatus';

const Layout = () => (
  <div>
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/another">Another page</Link>
        </li>
        <li>
          <Link to="/upload-dog-pic">Upload dog pic</Link>
        </li>
      </ul>
    </nav>

    <Switch>
      {redirectRoutes.map((props: RedirectProps) => (
        <RedirectWithStatus key={props.from} {...props} />
      ))}
      {routes.map(({ name, exact, ...rest }) => (
        <Route key={name} exact={exact} {...rest} />
      ))}
    </Switch>
  </div>
);

export default Layout;
