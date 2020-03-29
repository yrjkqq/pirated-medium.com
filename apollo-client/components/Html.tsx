import type { NormalizedCacheObject } from 'apollo-cache-inmemory';
import React from 'react';

export function Html({
  content,
  state,
  jsAssets = '',
  cssAssets = '',
}: {
  content: string;
  jsAssets?: string;
  cssAssets?: string;
  state: NormalizedCacheObject;
}): JSX.Element {
  return (
    <html lang="zh-CN">
      <head>
        {/* <!-- The first thing in any HTML file should be the charset --> */}
        <meta charSet="utf-8" />

        {/* <!-- Make the page mobile compatible --> */}
        <meta
          name="viewport"
          content="width=device-width,minimum-scale=1,initial-scale=1"
        />

        {/* <!-- Allow installing the app to the homescreen --> */}
        <meta name="mobile-web-app-capable" content="yes" />

        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="normalize.css" />
        <style dangerouslySetInnerHTML={{ __html: cssAssets }} />
      </head>
      <body>
        <div id="root" dangerouslySetInnerHTML={{ __html: content }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__APOLLO_STATE__=${JSON.stringify(state).replace(
              /</g,
              '\\u003c',
            )};
            `,
          }}
        />
        <div
          dangerouslySetInnerHTML={{
            __html: jsAssets,
          }}
        ></div>
      </body>
    </html>
  );
}
