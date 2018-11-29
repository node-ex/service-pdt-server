module.exports = {
  root: true,
  env: {
    'browser': true,
    'node': true,
    'es6': true,
    'jest': true,
    'jest/globals': true
  },
  globals: {
    fixture: true
  },
  // parser: 'vue-eslint-parser',
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      // impliedStrict: true,
      jsx: true
    }
  },
  extends: [
    'eslint:recommended',
    'plugin:compat/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:jest/recommended',
    'plugin:node/recommended',
    'plugin:promise/recommended',
    'plugin:security/recommended',
    'plugin:unicorn/recommended',
    'prettier',
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'compat',
    'html',
    'import',
    'jest',
    'json',
    'node',
    'prettier',
    'promise',
    'pug',
    'security',
    'standard',
    'unicorn',
  ],
  // add your custom rules here
  rules: {
    'compat/compat': 'error',
    'import/no-named-as-default-member': 'off',
    'import/no-webpack-loader-syntax': 'off',
    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'max-len': ['warn', {
      code: 80,
      ignoreComments: false,
      ignoreTrailingComments: false
    }],
    'node/no-unpublished-require': 'off',
    'node/no-unsupported-features/es-syntax': 'off',
    'no-console': 0,
    'no-var': 2,
    'prefer-const': ['error', {
      destructuring: 'all',
      ignoreReadBeforeAssign: false
    }],
    'prettier/prettier': 'off',
    'quote-props': ['error', 'consistent-as-needed'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'never'],
    'space-before-function-paren': ['error', 'never'],
    'unicorn/filename-case': 'off',
    'unicorn/no-abusive-eslint-disable': 0
  },
  settings: {}
}
