/**
 * @file 配置服务端口，以及代理，此文件仅作为本工程的例子，实际项目不应提交至仓库
 */

const constants = require('./dev-constants')

const env = 'test'

module.exports = {
  port: 9007,
  proxy: {
    '/api': constants.proxyTargets[env],
  },
}
