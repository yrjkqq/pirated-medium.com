import type { ServerRegistration } from 'apollo-server-express';
import type { Response } from 'express';
import isObject from 'is-object';
import webpack from 'webpack';
import devMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../webpack/webpack.config';

export function normalizeAssets(
  assets: { [s: string]: unknown } | ArrayLike<unknown>,
) {
  if (isObject(assets)) {
    return Object.values(assets);
  }
  return Array.isArray(assets) ? assets : [assets];
}

export function generateAssets({
  res,
}: {
  res: Response;
}): {
  jsAssets: string;
  cssAssets: string;
} {
  // https://github.com/webpack/webpack-dev-middleware#server-side-rendering
  const { devMiddleware } = res.locals.webpack;
  const outputFileSystem = devMiddleware.outputFileSystem;
  const jsonWebpackStats = devMiddleware.stats.toJson();
  const { assetsByChunkName, outputPath } = jsonWebpackStats;
  // Then use `assetsByChunkName` for server-side rendering
  // For example, if you have only one main chunk:
  return {
    cssAssets: normalizeAssets(assetsByChunkName.main)
      .filter((path) => path.endsWith('.css'))
      .map((path) => outputFileSystem.readFileSync(path.join(outputPath, path)))
      .join('\n'),
    jsAssets: normalizeAssets(assetsByChunkName.main)
      .filter((path) => path.endsWith('.js'))
      .map((path) => `<script src="${path}"></script>`)
      .join('\n'),
  };
}

export const applyWebpackHot = (
  { app }: ServerRegistration,
  port: string,
  apiUrl: string,
) => {
  const config = webpackConfig({ port, apiUrl });

  // @ts-ignore
  const compiler = webpack(config);

  const middleware = devMiddleware(compiler, {
    publicPath: config.output.publicPath,
    // writeToDisk: true,
    serverSideRender: true,
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
};
