const path = require('path')
const webpack = require('webpack')
const config = require('./webpack.base.conf.js')()
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const upyunConfig = require(path.join(process.cwd(), 'upyun.config.js'))

config.output.publicPath = `${upyunConfig.builtFilesPublicOrigin}${upyunConfig.options.remotePathPrefix}/`

config.output.filename = '[name].[chunkhash:7].js'
config.output.chunkFilename = '[id].[chunkhash:7].js'

config.devtool = false

config.module.rules.push(
  {
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
      use: ['css-loader', 'postcss-loader'],
      fallback: 'style-loader',
    }),
  },
  {
    test: /\.styl$/,
    use: ExtractTextPlugin.extract({
      use: ['css-loader', 'postcss-loader', 'stylus-loader?resolve url'],
      fallback: 'style-loader',
    }),
  }
)

const serverEnv = process.env.NODE_ENV || 'test'

config.plugins = (config.plugins || []).concat([
  // http://vuejs.github.io/vue/workflow/production.html
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"production"',
    },
  }),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
    },
  }),
  new ExtractTextPlugin('[name].[contenthash:8].css'),
])

module.exports = config
