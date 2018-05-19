/**
 * 用于开发，首先启动webpack-dev-server, 然后通过spawn启动nodemon
 * 最终实现client和server代码一改动浏览器都会自动刷新(server代码改动后node服务自动重启)
 */
const { spawn } = require('child_process')

// 必须用异步spawn，否则等nodemon起来后，webpack-dev-server的代码就不能执行了
const runSpawn = (cmd, cmdArgs) => {
  spawn(cmd, cmdArgs, {
    stdio: 'inherit',
    shell: true,
  })
}

const { start: startWDS } = require('./webpack.dev.server');

startWDS()
  .then(() => {
    runSpawn('./node_modules/.bin/nodemon', ['server/index.js']);    
  })