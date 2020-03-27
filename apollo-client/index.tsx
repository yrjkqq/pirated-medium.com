// This example uses React Router v4, although it should work
// equally well with other routers that support SSR

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
import Layout from './routes/Layout';
import logger from './utils/logger';

const basePort = process.env.PORT;

function Html({ content, state }): JSX.Element {
  return (
    <html>
      <body>
        <div id="root" dangerouslySetInnerHTML={{ __html: content }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__APOLLO_STATE__=${JSON.stringify(state).replace(
              /</g,
              '\\u003c',
            )};`,
          }}
        />
      </body>
    </html>
  );
}

// Note you don't have to use any particular http server, but
// we're using Express in this example
const app = express();
app.use((req, res) => {
  const client = new ApolloClient({
    ssrMode: true,
    // Remember that this is the interface the SSR server will use to connect to the
    // API server, so we need to ensure it isn't firewalled, etc
    link: createHttpLink({
      uri: 'http://localhost:3010',
      credentials: 'same-origin',
      headers: {
        cookie: req.header('Cookie'),
      },
      // @ts-ignore
      fetch: fetch,
    }),
    cache: new InMemoryCache(),
  });

  const context = {};

  const App = (
    <ApolloProvider client={client}>
      <StaticRouter location={req.url} context={context}>
        <Layout />
      </StaticRouter>
    </ApolloProvider>
  );

  // rendering code (see below)

  // / during request (see above)
  getDataFromTree(App)
    .then(() => {
      // We are ready to render for real
      const content = ReactDOMServer.renderToString(App);
      const initialState = client.extract();

      const html = <Html content={content} state={initialState} />;

      res.status(200);
      res.send(`<!doctype html>\n${ReactDOMServer.renderToStaticMarkup(html)}`);
      res.end();
    })
    .catch((error) => {
      logger.error('failed: ', error);
    });
});

app.listen(basePort, () =>
  logger.info(`app Server is now running on http://localhost:${basePort}`),
);
