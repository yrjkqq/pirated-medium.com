const fs = require('fs');
const path = require('path');

const prettierOptions = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '.prettierrc'), 'utf8'),
);

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    // https://www.npmjs.com/package/eslint-config-airbnb-typescript#i-use-eslint-config-airbnb-with-react-support
    'airbnb-typescript',
    'prettier',
    'prettier/@typescript-eslint',
    'prettier/react',
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'prettier/prettier': ['warn', prettierOptions],
    'implicit-arrow-linebreak': 0,
    'function-paren-newline': 0,
    'arrow-parens': 0,
    'operator-linebreak': 0,
    'object-curly-newline': 0,
    'react/jsx-props-no-spreading': 1,
    'import/no-cycle': 1,
    'import/prefer-default-export': 1,
    'react/prop-types': 0,
  },
  settings: {
    'import/resolver': {
      // webpack: {
      //   config: require.resolve('./internals/webpack/webpack.prod.babel.js'),
      // },
      node: {
        // https://github.com/benmosher/eslint-plugin-import#resolvers
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'],
        moduleDirectory: ['node_modules', 'app/', 'app/node_modules'],
      },
    },
  },
};
