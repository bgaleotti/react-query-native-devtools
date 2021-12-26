module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['simple-import-sort', '@typescript-eslint'],
  rules: {
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/no-empty-function': ['error', { allow: ['arrowFunctions'] }],
    '@typescript-eslint/no-use-before-define': 'warn',
    curly: 'warn',
    camelcase: 'off',
    'linebreak-style': ['error', 'unix'],
    'newline-before-return': 'error',
    // FIXME: revert
    'no-console': 'warn',
    'react/prop-types': 'off',
    'simple-import-sort/sort': 'error',
    'sort-imports': 'off',
    strict: ['error', 'global'],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      node: {
        extensions: ['.ts', '.tsx'],
      },
    },
    react: {
      version: 'detect',
    },
  },
};
