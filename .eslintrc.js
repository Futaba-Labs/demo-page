module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['next/core-web-vitals', 'eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  plugins: ['@typescript-eslint', 'import', 'unused-imports'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    project: './tsconfig.json',
  },
  root: true,
  rules: {
    '@typescript-eslint/no-unused-vars': 'off', // or "no-unused-vars"
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'object', 'type', 'index'],
      },
    ],
  },
  'import/no-extraneous-dependencies': [
    'error',
    {
      packageDir: ['./', './node_modules/@nextui-org/react'],
    },
  ],
  ignorePatterns: ['tailwind.config.js', '.eslintrc.js', 'postcss.config.js', 'next.confog.js'],
}
