require('dotenv').config();

import { ApolloProvider } from '@apollo/react-common';
import { getDataFromTree } from '@apollo/react-ssr';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import express from 'express';
import fetch from 'node-fetch';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router';
import type * as RR from 'react-router';
import { Html } from './components/Html';
import { applyApolloServer } from './middlewares/apply-apollo-server';
import {
  applyWebpackHot,
  generateAssets,
} from './middlewares/apply-webpack-hot';
import Layout from './routes/Layout';
import logger from './utils/logger';

const basePort = process.env.PORT as string;
const apiUrl = process.env.API_URL as string;

// Note you don't have to use any particular http server, but
// we're using Express in this example
const app = express();

app.use(express.static('public'));

const graphqlPath = applyApolloServer({ app });

applyWebpackHot({ app }, basePort, apiUrl);

app.use((req, res) => {
  const client = new ApolloClient({
    ssrMode: true,
    // Remember that this is the interface the SSR server will use to connect to the
    // API server, so we need to ensure it isn't firewalled, etc
    link: createHttpLink({
      uri: `http://localhost:${basePort}/graphql`,
      credentials: 'same-origin',
      headers: {
        cookie: req.header('Cookie'),
      },
      // @ts-ignore
      fetch: fetch,
    }),
    cache: new InMemoryCache(),
  });

  const context: RR.StaticRouterContext = {};

  const App = (
    <ApolloProvider client={client}>
      <StaticRouter location={req.url} context={context}>
        <Layout />
      </StaticRouter>
    </ApolloProvider>
  );

  if (context.url) {
    return res.redirect(context.statusCode as number, context.url);
  }

  // rendering code (see below)

  // / during request (see above)
  getDataFromTree(App)
    .then(() => {
      // We are ready to render for real
      const content = ReactDOMServer.renderToString(App);
      const initialState = client.extract();
      const { jsAssets, cssAssets } = generateAssets({ res });
      const html = (
        <Html
          content={content}
          state={initialState}
          jsAssets={jsAssets}
          cssAssets={cssAssets}
        />
      );
      res.status(200);
      res.send(`<!doctype html>\n${ReactDOMServer.renderToString(html)}`);
      res.end();
    })
    .catch((error) => {
      logger.error('failed: ', error);
      res.status(500);
      res.send(`something went wrong!`);
      res.end();
    });
});

app.listen(basePort, () =>
  logger.info(
    `app-server is now running on http://localhost:${basePort}, apollo-server read at ${graphqlPath}`,
  ),
);
