module.exports = {
  extends: [
    "prettier",
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
  },
  plugins: [
    'prettier',
    '@typescript-eslint',
    'react',
  ],
  env: {
    browser: true,
    es2020: true,
    node: true,
    jest: true,
  },
};
