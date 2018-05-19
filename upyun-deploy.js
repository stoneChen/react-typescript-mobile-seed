const http = require('http')
const fs = require('fs')
const UpYun = require('upyun')
const path = require('path')
const _ = require('lodash')


const defaultOptions = {
  localPath: 'public',
  remotePathPrefix: '/',
  ignores: ['.DS_Store'],
}

let config = require(path.join(process.cwd(), 'upyun.config.js'))
if (!config) {
  throw new Error('Upyun config DOES NOT exist!')
}
let { builtFilesBucket: bucket, operator, password, options } = config

let finalOptions = Object.assign({}, defaultOptions, options)

operator = operator || 'frontend'
password = password || 'frontend'

console.log(`
Upyun config info:
  bucket: '${bucket}'
  operator: '${operator}'
  remotePathPrefix: '${finalOptions.remotePathPrefix}'
`)
// 实例化upyun对象
let upyun = new UpYun(
  bucket,
  operator,
  password,
  'v0.api.upyun.com',
  {
    apiVersion: 'v2'
  }
)

function travel(dir, callback) {
  fs.readdirSync(dir).forEach((file) => {
    let pathname = path.join(dir, file)
    if (~finalOptions.ignores.indexOf(file)) {
      console.warn(`Path: "${pathname}" ignored.`)
      return
    }
    if (fs.statSync(pathname).isDirectory()) {
      travel(pathname, callback)
    } else {
      callback(dir, file, pathname)
    }
  })
}
let _uploadIndex = 1
function deploy() {
  travel(finalOptions.localPath, (dir, file, pathname) => {
    // 去掉第一级目录的路径
    let subPaths = pathname.split('/').slice(1)
    subPaths.unshift(finalOptions.remotePathPrefix)
    let targetPath = path.join(...subPaths)

    _uploadIndex++
    // 受又拍云限制，每秒最多120个上传请求,控制为为每秒最多1000/12.5个请求，即每秒最多80个请求
    setTimeout(() => {
      //上传
      upyun.putFile(targetPath, pathname, null, false, null, (err, result) => {
        if (err) {
          console.log(err)
          return
        }
        if (result.data) {
          throw Error(`Upyun uploding Failed, reason: "${result.data.msg}"`)
        } else {
          console.log(' ✓', pathname, '==>', targetPath)
        }
      })
    }, _uploadIndex * 12.5)
  })
}


deploy()
