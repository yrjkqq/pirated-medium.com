import { ApolloProvider } from '@apollo/react-common';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Layout from '../routes/Layout';

const client = new ApolloClient({
  // 只在 ../index.tsx 中设置为 true, 用于首屏渲染, 而 hydrate 之后则由客户端接管; 如果在组件的 useQuery 设置 ssr: false, 则 ssr 不会调用, 而在客户端程度渲染完成后执行 gql 查询, 即下载下来的首屏 html 中组件状态为 loading, 然后浏览器发出 gql 请求, 再渲染数据
  ssrMode: false,
  // Remember that this is the interface the SSR server will use to connect to the
  // API server, so we need to ensure it isn't firewalled, etc
  link: createHttpLink({
    uri: `http://localhost:${process.env.PORT}/graphql`,
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
        <div>client</div>
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
  module.hot.accept();
}
