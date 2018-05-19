// 指定模块绝对路径的辅助模块, __dirname的值是当前模块的绝对路径
const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const exec = require('child_process').execSync

const appRoot = process.cwd()

/**
 * resolve业务工程路径
 * @param {string} dir - 业务工程目录
 * @return {string} 绝对路径
 */
function resolveFromApp(dir) {
  return path.join(appRoot, dir)
}

// 实际就是git SHA-1散列值
// 为了确认打包出来的版本,特地加了对应git的commitId
let appVersion = ''

try {
  appVersion = exec('git rev-parse --short HEAD').toString().replace(/\n/, '')
} catch (e) {
  /* eslint-disable no-console */
  console.warn('Getting revision FAILED. Maybe this is not a git project.')
}

// 网站图标
let favicon = resolveFromApp('favicon.ico')

if (!fs.existsSync(favicon)) {
  favicon = undefined
}

/**
 * 如果导出一个对象，同时启动两个webpack，两个webpack配置又同时依赖了这个模块，
 * 并且往rules里添加了新loader，就会互相影响
 * 因此把导出值改成一个函数，每次都返回一个新对象，就不会互相影响了
 * @param {string} env 环境名，可能的值 dev|prod
 * @return {Object} webpack基础配置
 */
module.exports = function (env) {
  const config = {
    entry: {
      app: resolveFromApp('client/index.tsx')
    },
    output: {
      path: path.resolve(process.cwd(), 'public'),
      filename: '[name].js',
      chunkFilename: '[id].js',
    },
    resolve: {
      extensions: ['.js', '.ts', '.tsx'],
      alias: {
        // 需要和tsconfig  baseUrl配合使用
        client: resolveFromApp('client'),
      },
    },
    // 模块配置
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'awesome-typescript-loader',
              options: {
                // 不缓存，有时会有问题
                useCache: false,
                forceIsolatedModules: true,
                // 必须，否则server下的ts也会被编译
                configFileName: resolveFromApp('client/tsconfig.json'),
                reportFiles: [
                  "client/**/*.{ts,tsx}"
                ],
                useBabel: true,
                babelOptions: {
                  babelrc: false,
                  presets: [
                    require.resolve('./babel-presets'),
                  ]
                },
              },
            },
          ],
        },
        {
          test: /\.(gif|jpg|jpeg|png|bmp|svg|woff|woff2|eot|ttf)(\?.*)?$/,
          use: [{
            loader: 'url-loader',
            options: {
              limit: 8192,
              // 生成的文件名,[name]为原始文件名,[hash:8]为根据文件内容生成8位md5值,[ext]为原始文件扩展名
              name: 'resources/[path][name].[hash:8].[ext]',
            },
          }],
        },
      ],
    },
    plugins: [
      // 由于mac不区分大小写，linux区分大小写，可能导致mac上正常，在部署时出错，所以强制区分大小写
      new CaseSensitivePathsPlugin(),
      new HtmlWebpackPlugin({
        appVersion,
        favicon,
        filename: 'index.html',
        template: path.join(process.cwd(), 'index.template.ejs'),
        inject: true,
      }),
    ],
  }
  return config
}
