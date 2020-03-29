# plan

- apollo-server  🔗 golang backend api
  - encapsulate ajax
  - upload file with form and ajax: FormData
  - upload file to golang backend directly
  - fix cors with golang backend
  - golang backend storage file in mysql
  - query file with apollo-server and show
  - send request with apollo-server
- add styled-components
- achieve medium.com homepage

# reference

1. [@apollo/react-ssr](https://www.apollographql.com/docs/react/performance/server-side-rendering/#server-side-rendering)
2. [log4js](https://github.com/log4js-node/log4js-node)
3. prettier [Integrating with Linters](https://prettier.io/docs/en/integrating-with-linters.html)
4. webpack node interface [Node Interface](https://webpack.js.org/api/node/#installation)
5. [ts-node with VSCode](https://github.com/TypeStrong/ts-node#visual-studio-code)
6. [VSCode debug with nodejs](https://code.visualstudio.com/docs/nodejs/nodejs-debugging#_restarting-debug-sessions-automatically-when-source-is-edited)
7. [fork-ts-checker-webpack-plugin](https://github.com/TypeStrong/fork-ts-checker-webpack-plugin)
8. [scalar-types](https://graphql.org/learn/schema/#scalar-types)
9. [gql queries](https://graphql.org/learn/queries/)


# wiki

1. ts-node-dev 和 ts-loader 为加快构建速度将 transpileOnly 设为 true, 但是会失去静态检查功能, 而 ts-node 启动有静态检查;
webpack-dev-middleware 监听 client/index.tsx 文件, 该文件不会被 ts-node-dev 或 ts-node 监听, 所以不会被静态检查, 需要借助 fork-ts-checker-webpack-plugin 进行静态检查, 而且会检查所有文件
2. 使用 ts-node-dev 当文件修改时, 会自动重启, 此时浏览器的 HMR 会和 webpack-hot-middleware 断开连接, hot-reload 会失效, 解决办法
   - 添加 .node-dev.json 忽略 ./client 文件夹, 此时修改该目录下的文件, 只会 webpack 重新构建, 而 ts-node-dev 不会重启, hot-reload 生效
   - 或者是使用 ts-node 加载 webpack middleware

# dev

```bash
yarn dev
```

# debugger
P
F5 -> select: ts-node-dev

# debug

1. 当使用的 StaticRouter 与当前仓库的 react-router 版本不一样时, 会报错, 使用以下方式复现
   1. 当前仓库上一级目录新建 react-router-v4 版本
      1. package.json
       ```json
       {
         "name": "react-router-v4",
         "version": "1.0.0",
         "main": "index.js",
         "license": "MIT",
         "dependencies": {
           "react-router": "4"
         },
         "devDependencies": {
           "@types/react-router": "4"
         }
       }
       ```
      2. index.js
       ```javascript
       const Router = require("react-router");
       module.exports = Router.StaticRouter;
       ```
   2. 添加本地安装的 RRv4 包, 并导入到当前仓库
      ```bash
      yarn add file:../react-router-v4
      ```
      1. 导入后
      ```json
      {
        "dependencies": {
        "react-router-v4": "file:../react-router-v4"
      }
      ```
   3. 导入到 index.js
      ```js
      import StaticRouter from "react-router-v4";
      ```
   4. 启动报错
      ```js
      (node:8912) UnhandledPromiseRejectionWarning: Error: Invariant failed: You should not use <Link> outside a <Router>
          at invariant (C:\code\pirated-medium.com\apollo-client\node_modules\tiny-invariant\dist\tiny-invariant.cjs.js:13:11)
          at Object.children (C:\code\pirated-medium.com\apollo-client\node_modules\react-router-dom\modules\Link.js:84:11)
          at ReactDOMServerRenderer.render (C:\code\pirated-medium.com\apollo-client\node_modules\react-dom\cjs\react-dom-server.node.development.js:3635:55)
          at ReactDOMServerRenderer.read (C:\code\pirated-medium.com\apollo-client\node_modules\react-dom\cjs\react-dom-server.node.development.js:3373:29)
          at renderToStaticMarkup (C:\code\pirated-medium.com\apollo-client\node_modules\react-dom\cjs\react-dom-server.node.development.js:4004:27)
          at process (C:\code\pirated-medium.com\apollo-client\node_modules\@apollo\react-ssr\lib\react-ssr.cjs.js:38:16)
          at process._tickCallback (internal/process/next_tick.js:68:7)
      (node:8912) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 1)
      (node:8912) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with 
      a non-zero exit code.
      ```
   5. 第一次修复
      1. react-router-v4 包升级到 RRv5 
          ```bash
          yarn version
          yarn upgrade @types/react-router@^latest react-router@^latest
          ```
      2. 当前仓库
          ```bash
          yarn add file:../react-router-v4
          ```
      3. 仍然报错
         ```js
         failed:  Error: Invariant failed: You should not use <Link> outside a <Router>
         at invariant (C:\code\pirated-medium.com\apollo-client\node_modules\tiny-invariant\dist\tiny-invariant.cjs.js:13:11)
         at Object.children (C:\code\pirated-medium.com\apollo-client\node_modules\react-router-dom\modules\Link.js:84:11)
         at ReactDOMServerRenderer.render (C:\code\pirated-medium.com\apollo-client\node_modules\react-dom\cjs\react-dom-server.node.development.js:3635:55)
         at ReactDOMServerRenderer.read (C:\code\pirated-medium.com\apollo-client\node_modules\react-dom\cjs\react-dom-server.node.development.js:3373:29)
         at renderToStaticMarkup (C:\code\pirated-medium.com\apollo-client\node_modules\react-dom\cjs\react-dom-server.node.development.js:4004:27)
         at process (C:\code\pirated-medium.com\apollo-client\node_modules\@apollo\react-ssr\lib\react-ssr.cjs.js:38:16)
         at process._tickCallback (internal/process/next_tick.js:68:7)
         ```
      4. 研究源码发现, react-router-dom 的 Link 组件会使用到 ```<RouterContext.Consumer>``` 提供提供 context, 如果 context 为 null 则会报错, 而 RouterContext 导自本仓库的 react-router 包, 这个包创建的 context 和 react-router-v4 创建的 context 不是同一个, 所以 Link 组件读取不到
   6. 尝试同时也从 react-router-v4 导入 react-router-dom 的 ```<Link>``` 来尝试修复这个问题
      1. 可以修复
      ```jsx
      // react-router-v4 .index.js
      "use strict";

      const { StaticRouter } = require("react-router");

      const { Link } = require("react-router-dom");

      exports.StaticRouter = StaticRouter;
      exports.Link = Link;

      // 当前项目 Layout.js
      // ./routes/Layout.js
      import { Route, Switch } from "react-router";
      import { Link } from "react-router-v4";
      import React from "react";

      // A Routes file is a good shared entry-point between client and server
      import routes from "./index";

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
            </ul>
         </nav>

         {/* New <Switch> behavior introduced in React Router v4
            https://reacttraining.com/react-router/web/api/Switch */}
         <Switch>
            {routes.map(route => (
            <Route key={route.name} {...route} />
            ))}
         </Switch>
      </div>
      );

      export default Layout;

      ```

      2. 当前项目重新导入 react-router-v4 后, 不会再报同样的错
      ```js
      failed:  Error: Invariant failed: You should not use <Switch> outside a <Router>
      at invariant (C:\code\pirated-medium.com\apollo-client\node_modules\tiny-invariant\dist\tiny-invariant.cjs.js:13:11)
      at Object.children (C:\code\pirated-medium.com\apollo-client\node_modules\react-router\modules\Switch.js:17:11)
      at ReactDOMServerRenderer.render (C:\code\pirated-medium.com\apollo-client\node_modules\react-dom\cjs\react-dom-server.node.development.js:3635:55)
      at ReactDOMServerRenderer.read (C:\code\pirated-medium.com\apollo-client\node_modules\react-dom\cjs\react-dom-server.node.development.js:3373:29)
      at renderToStaticMarkup (C:\code\pirated-medium.com\apollo-client\node_modules\react-dom\cjs\react-dom-server.node.development.js:4004:27)
      at process (C:\code\pirated-medium.com\apollo-client\node_modules\@apollo\react-ssr\lib\react-ssr.cjs.js:38:16)
      at process._tickCallback (internal/process/next_tick.js:68:7)
      ```
   7. 第三次修复: 从 react-router-v4 导入所有 Link Route 等组件不方便, 可以只导入 __RouterContext 然后透传 context 给本仓库的 react-router 的 RouterContext.Provider 也能解决问题
      1. 可以修复
      ```jsx
      // react-router-v4 .index.js
      "use strict";

      const { StaticRouter, __RouterContext } = require("react-router");

      const { Link } = require("react-router-dom");

      exports.StaticRouter = StaticRouter;
      exports.__RouterContext = __RouterContext;
      exports.Link = Link;

      // 当前项目 index.js 其他不变
      import {
      StaticRouter,
      __RouterContext as OnefxRouterContext
      } from "react-router-v4";
      import { __RouterContext as WebOnefxRouterContext } from "react-router";

      // ...
      const App = (
         <ApolloProvider client={client}>
            <StaticRouter location={req.url} context={context}>
            <OnefxRouterContext.Consumer>
               {context => (
                  <WebOnefxRouterContext.Provider value={context}>
                  <Layout />
                  </WebOnefxRouterContext.Provider>
               )}
            </OnefxRouterContext.Consumer>
            </StaticRouter>
         </ApolloProvider>
      );
      ```
   8. 第四次修复: 将 react-router-v4 对 react-router 的依赖改为 [peerDependencies](https://stackoverflow.com/a/34645112), 这样当前项目使用的就是本地直接安装的 react-router 而不是 react-router-v4 的 rr; 只能修改 react-router-v4 为 peerDependencies 而不是当前项目
      ```json
      {
         "name": "react-router-v4",
         "version": "1.0.5",
         "main": "index.js",
         "license": "MIT",
         "peerDependencies": {
            "react-router": "^5.1.2",
            "react-router-dom": "^5.1.2"
         },
         "devDependencies": {
            "@types/react-router": "^5.1.4",
            "@types/react-router-dom": "^5.1.3"
         }
      }

      ```
      ```jsx
      // 当前项目 index.js 其他不变
      import { StaticRouter } from "react-router-v4";

      // ...
      const App = (
         <ApolloProvider client={client}>
            <StaticRouter location={req.url} context={context}>
            <Layout />
            </StaticRouter>
         </ApolloProvider>
      );
      ```
