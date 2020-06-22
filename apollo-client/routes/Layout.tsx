// ./routes/Layout.js
import React from 'react';
import { Route, Switch } from 'react-router';
import { Link } from 'react-router-dom';
// A Routes file is a good shared entry-point between client and server
import { redirectRoutes, routes } from './index';
import RedirectWithStatus from './RedirectWithStatus';
import type { RedirectProps } from './RedirectWithStatus';
import styled from '../styles/styled';

const Container = styled.main`
  background-color: #fff;
`;

const Nav = styled.nav`
  display: flex;
`;

const Layout = () => (
  <Container>
    <Nav>
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
    </Nav>

    <Switch>
      {redirectRoutes.map((props: RedirectProps) => (
        <RedirectWithStatus key={props.from} {...props} />
      ))}
      {routes.map(({ name, exact, ...rest }) => (
        <Route key={name} exact={exact} {...rest} />
      ))}
    </Switch>
  </Container>
);

export default Layout;
