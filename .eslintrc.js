module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', '@vue/airbnb', '@vue/prettier'],
  rules: {
    'import/extensions': 0,
    'no-console': 0,
    'no-plusplus': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // May want to fix later when time is available
    'prefer-destructuring': 0,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
