import { ApolloProvider } from '@apollo/react-common';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Layout from '../routes/Layout';

const client = new ApolloClient({
  ssrMode: true,
  // Remember that this is the interface the SSR server will use to connect to the
  // API server, so we need to ensure it isn't firewalled, etc
  link: createHttpLink({
    uri: `http://localhost:3009/graphql`,
    credentials: 'same-origin',
  }),
  cache: new InMemoryCache(),
});

const MOUNT_NODE = document.getElementById('root') as HTMLElement;

const render = () => {
  ReactDOM.hydrate(
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </ApolloProvider>,
    MOUNT_NODE,
  );
};

render();

// @ts-ignore
if (module.hot) {
  // Hot reloadable React components and translation json files
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  // @ts-ignore
  module.hot.accept(['../routes/Layout'], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    render();
  });
}
