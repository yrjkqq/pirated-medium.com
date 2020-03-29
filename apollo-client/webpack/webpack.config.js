// webpack.config.js

var path = require('path');
var webpack = require('webpack');
var ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

// var babelLoader = {
//   loader: 'babel-loader',
//   options: {
//     cacheDirectory: true,
//     presets: ['@babel/preset-env', '@babel/preset-react'],
//   },
// };

var browserConfig = ({ port }) => {
  return {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: [
      'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true',
      path.resolve(process.cwd(), 'client/index.tsx'),
    ],
    output: {
      path: path.resolve(process.cwd(), 'public'),
      filename: 'bundle.js',
      publicPath: '/',
    },
    module: {
      rules: [
        // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },

        // {
        //   test: /\.js$/,
        //   exclude: /node_modules/,
        //   use: [babelLoader],
        // },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        __isBrowser__: 'true',
        'process.env.PORT': port,
      }),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new ForkTsCheckerWebpackPlugin(),
    ],
    optimization: {
      noEmitOnErrors: true,
    },
    resolve: {
      // Add `.ts` and `.tsx` as a resolvable extension.
      extensions: ['.ts', '.tsx', '.js'],
    },
    node: {
      fs: 'empty',
    },
  };
};

module.exports = browserConfig;
