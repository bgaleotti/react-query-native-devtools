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
  plugins: ['simple-import-sort', '@typescript-eslint', 'react-hooks'],
  rules: {
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/no-empty-function': ['error', { allow: ['arrowFunctions'] }],
    '@typescript-eslint/no-use-before-define': 'warn',
    curly: 'warn',
    camelcase: 'off',
    'linebreak-style': ['error', 'unix'],
    'newline-before-return': 'error',
    'no-console': 'error',
    'react/prop-types': 'off',
    'simple-import-sort/imports': 'error',
    'sort-imports': 'off',
    strict: ['error', 'global'],
    '@typescript-eslint/no-unused-vars': 'off',
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
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
