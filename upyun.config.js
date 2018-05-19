/**
 * 此文件用于存储又拍云上传相关配置，这里的配置只是用于开发，实际部署时会拉取具体的配置覆盖
 */
module.exports = {
  builtFilesBucket: 'your_bucket',
  builtFilesPublicOrigin: 'https://your.bucket.domain',
  options: {
    remotePathPrefix: '/path/to/your/upyun_bucket/public/files',
  },
}
