module.exports = () => ({
  // 阻止postcss sourcemap警告
  from: undefined,
  plugins: [
    require('postcss-pxtorem')({
      rootValue: 100,
      propWhiteList: [],
      replace: true,
    }),
    require('autoprefixer')({
      browsers: '> 0.1%',
    }),
  ]
})