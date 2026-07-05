module.exports = {
  extends: [require.resolve('./base.cjs')],
  env: { browser: true, es2020: true },
  plugins: ['react-hooks'],
  extends: [
    require.resolve('./base.cjs'),
    'plugin:react-hooks/recommended',
  ],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },
};
