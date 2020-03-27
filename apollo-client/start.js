require('dotenv').config();

// Transpile all code following this line with babel and use '@babel/preset-env' (aka ES6) preset.
require('@babel/register')({
  extensions: ['.jsx', '.js', '.ts', '.tsx'],
  presets: [
    '@babel/preset-typescript',
    '@babel/preset-env',
    '@babel/preset-react',
  ],
});

// Import the rest of our application.
module.exports = require('./index');
