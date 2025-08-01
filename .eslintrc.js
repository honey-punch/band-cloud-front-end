module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended', // prettier와 충돌 방지
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react', '@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'react/react-in-jsx-scope': 'off', // React 17+에선 필요 없음
    'react/prop-types': 'off', // TypeScript 사용 시 불필요
    '@typescript-eslint/no-explicit-any': 'off', // 필요 시 켜도 됨
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
