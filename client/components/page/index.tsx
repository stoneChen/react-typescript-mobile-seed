import * as React from 'react';
import axios from 'axios';
import event from 'client/utils/events';

/**
 * 页面级组件的基类，虽然官方不推荐，但我们目前觉得还是挺合适的，等遇到不合适的场景再说
 */
export default class Page<P, S> extends React.Component<P, S> {
  axios = axios;
  pagination = {
    pageSize: 10,
  };

  updateTitle(title: string, changeDocTitle?: boolean) {
    // 修改浏览器的标题
    if (changeDocTitle) {
      document.title = title;
    }
    event.emit('update-title', title);
  }

}
