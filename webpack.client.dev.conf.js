const ip = require('ip')
const webpack = require('webpack')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const CircularDependencyPlugin = require('circular-dependency-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const config = require('./webpack.base.conf.js')()
const serverConfig = require('./server.config')

const currentIP = ip.address()
// cheap-module-eval-source-map is faster for development
// config.devtool = '#cheap-module-eval-source-map'
// transformed code
config.devtool = '#cheap-eval-source-map'

const PUBLIC_PATH = `http://${currentIP}:${serverConfig.port + 100}`

// necessary for the html plugin to work properly
// when serving the html from in-memory
config.output.publicPath = `${PUBLIC_PATH}/public/`

config.module.rules.push(
  {
    test: /\.css$/,
    use: ['style-loader', 'css-loader', 'postcss-loader'],
  },
  {
    test: /\.styl$/,
    use: ['style-loader', 'css-loader', 'postcss-loader', 'stylus-loader?resolve url'],
  }
)
config.plugins = (config.plugins || []).concat([
  // 由于mac不区分大小写，linux区分大小写，可能导致mac上正常，在部署时出错，所以强制区分大小写
  new CaseSensitivePathsPlugin(),
  // 循环依赖预警
  new CircularDependencyPlugin({
    // exclude detection of files based on a RegExp
    exclude: /node_modules/,
    // add errors to webpack instead of warnings
    failOnError: true,
  }),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"development"',
    },
  }),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
  new FriendlyErrorsPlugin(),
  // 查看依赖图，反注释即可开启
  // new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin),
])

module.exports = config
