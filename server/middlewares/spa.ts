import axios from 'axios';
import * as log from 'fary-log';
import * as fs from 'fs';
import * as Koa from 'koa';
import * as path from 'path';
import serverConfig = require('../../server.config');
import { isDev } from '../utils/env';

const cwd = process.cwd();
const logger = log('spa');
const defaultOptions = {
  exclude: /^\/(api)/,
};

// 用于过滤静态资源请求
const REG_STATIC_PATH = /\.(js|css|ico|gif|jpg|jpeg|png|bmp|svg|woff|woff2|eot|ttf)$/;

/**
 * 读取构建过的文件，public目录下
 * @param {String} filename 文件名
 * @return {String} 文件内容
 */
function readBuiltFile(filename: string) {
  return fs.readFileSync(path.join(cwd, 'public', filename), 'utf-8');
}

let indexHTML: string;

if (!isDev) { // 生产模式, 直接读取
  indexHTML = readBuiltFile('index.html');
}

export interface IOptions {
  exclude: RegExp;
}
/**
 * 单页应用中间件
 * @param {Object} options 配置项
 * @return {function} 中间件
 */
export default function(options = defaultOptions) {
  options = {
    ...defaultOptions,
    ...options,
  };

  // eslint-disable-next-line consistent-return
  return async function spa(ctx: Koa.Context, next: () => void) {

    if (options.exclude.test(ctx.path)) {
      logger.log(
        'Skipping for',
        ctx.method,
        ctx.url,
        `, because the path is excluded by '${options.exclude}'`,
      );
      return next();
    }
    /**
     * 如果请求头中accept字段包含application/json也不重写.
     * 一方面是用于本地环境，通过域名代理到真实环境,
     * 解决【前端请求经过两个node服务器，导致代理不正常】的问题;
     * 一方面这个判断，也是合理的，即使是非api开头的特殊请求，application/json也不应该重写
     */
    if (ctx.header.accept && ctx.header.accept.indexOf('application/json') !== -1) {
      logger.log(
        'Skipping for',
        ctx.method,
        ctx.url,
        ', because the request expects to accept json',
      );
      return next();
    }

    if (REG_STATIC_PATH.test(ctx.url)) {
      logger.log(
        'Skipping for',
        ctx.method,
        ctx.url,
        ', because the path expects to accept a static file.',
      );
      return next();
    }

    ctx.set('Content-Type', 'text/html; charset=utf-8');
    if (!isDev) {
      ctx.body = indexHTML;
      return Promise.resolve();
    }
    logger.info('Request html from webpack dev server...');
    // 从webpack-dev-server拉取index.html
    return axios.get(`http://localhost:${serverConfig.port + 100}/public/index.html`)
      .then((response) => {
        ctx.body = response.data;
      })
      .catch((error) => {
        ctx.body =
          'Can not find the page.<br/>' +
          'Maybe your app has not been compliled successfully. <br/>' +
          'Please check your codebase, fix the error(s) and refresh the page. </br>' +
          '<hr/>' +
          'Error Details: </br>' +
          error.stack.replace(/\n/g, '</br>');
      });
  };
}
