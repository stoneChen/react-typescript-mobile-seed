import * as React from 'react';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { IS_DEV } from 'client/utils/env';

axios.interceptors.request.use(
  (config) => {
    // 显示loading
    // loading.show();
    config.headers['x-access-origin'] = 'WAP';
    config.url = `/ps${config.url}`;
    return config;
  },
  (error: Error) => Promise.reject(error),
);

axios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

/* 挂在React.Component下的方法/属性 ==========================================================*/
/* ===========================================================================*/
declare module 'react' {
  // tslint:disable-next-line:interface-name
  interface Component {
    log: (...args: any[]) => void;
  }
  // ReactPortal需要继承ReactEelement，否则无法在无状态组件中使用
  // 截止2018年04月03日13:57:03，@types/react还未修复此问题
  // tslint:disable-next-line:interface-name
  interface ReactPortal extends ReactElement<any> {
    key: Key | null;
    children: ReactNode;
  }
}

React.Component.prototype.log = function(...args: any[]) {
  // 写成三目的`React.Component.prototype.log = !IS_DEV ? () => {} : function() {...}`
  // 居然会报`this has an implicit any blah blah...`, 不用三目就是好的 WTF???!!!
  if (!IS_DEV) {
    return;
  }
  const prefixes = `%c[${this.constructor.name}]:`;
  args.unshift(prefixes, 'color: lightseagreen');
  // tslint:disable-next-line:no-console
  console.log(...args);
};
