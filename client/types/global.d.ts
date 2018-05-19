/**
 * 全局定义
 * ts会在启动webpack时，自动扫描types目录下的所有文件内部的关键字：declare；
 */

/* tslint:disable: interface-name */
declare interface Window {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
}

declare var global: Window;
