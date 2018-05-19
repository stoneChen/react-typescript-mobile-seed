const envPlugins = {
  'development': [
    require.resolve('babel-plugin-transform-react-jsx-source'),
  ],
  'production': [
    require.resolve('babel-plugin-transform-react-remove-prop-types')
  ]
}

const plugins = envPlugins[process.env.NODE_ENV] || envPlugins['development']

module.exports = (context, opts = {}) => {
  return {
    presets: [
      [require.resolve('babel-preset-env'), {
        modules: false,
      }],
      require.resolve('babel-preset-react'),
    ],
    plugins: [
      require.resolve('babel-plugin-react-require'),
      require.resolve('babel-plugin-syntax-dynamic-import'),
      require.resolve('babel-plugin-transform-runtime'),
      [require.resolve('styled-jsx/babel'), {
        plugins: [
          'styled-jsx-plugin-stylus',
          'styled-jsx-plugin-postcss',
        ]
      }],
      ...plugins,
    ],
  }
}