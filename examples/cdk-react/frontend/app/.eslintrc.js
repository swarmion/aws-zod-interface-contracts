module.exports = {
  env: { browser: true },
  extends: ['plugin:jsx-a11y/recommended', 'plugin:react/recommended'],
  plugins: ['react-hooks', 'jsx-a11y', 'risxss'],
  rules: {
    'react/prop-types': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'react/react-in-jsx-scope': 'off',
    'react/self-closing-comp': 'error',
    'jsx-a11y/anchor-is-valid': 'error',
    'jsx-a11y/accessible-emoji': 'off',
    'risxss/catch-potential-xss-react': 'error',
    'react/jsx-curly-brace-presence': 'error',
  },
  settings: {
    react: { version: 'detect' },
    'import/resolver': {
      typescript: {
        project: __dirname,
      },
    },
  },
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
};
