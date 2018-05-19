# react-typescript-mobile-seed

本工程基于实际项目简化而来，已去除相关业务代码与公司内部服务相关的配置或改写，如：
1. 源项目的dll是使用公司内网的webpack dll云打包服务，由于改造成本过高，故去除
2. 又拍云配置以及上传静态资源的代码从私有源迁移至项目中
3. 省略配置文件的拉取过程, `server.config.js`以及`upyun.config.js`会与环境不同而不同，这里仅做演示，实际项目应由配置中心管理，早项目部署时或运行时根据适当的策略去拉取。


 推荐使用vscode进行开发，理由:
 1. scopde CSS方案使用的是 [styled-jsx](https://github.com/zeit/styled-jsx), vscode上有相应的插件支持 vscode-styled-jsx.
 2. vscode对tslint支持较友好（webstorm也还不错）

## 安装依赖
```
npm install
```

## 开发
```
npm start
```

## 命名
* 所有文件名统一小写，间隔符使用`-`
* 所有react组件类名大写开头

## 路径别名
别名的目的是减少书写繁琐度。

本工程支持以`client`开头的别名，这一个已足够使用，比如`components`:
```tsx
import Component from 'client/components/Component'
```
其他如`assets`, `pages`, `utils`等`client`下的目录都可同理引入。

## 路由配置
在`pages`目录下新建一个目录，代表一个顶级页面，新建`routes.tsx`, 用于配置当前路由的所有子路由。
页面级组件命名为`container.tsx`，如果还有子路由，与`container.tsx`同级再新建一个目录。

本工程已支持异步路由，比如`index`的路由：
```tsx
import * as React from 'react';
import { Route } from 'react-router-dom';
import asyncComponent from 'client/utils/async-component';

export default [
  <Route
    key="index" exact path="/index"
    component={asyncComponent(import('./container') as any)} />,
];
```

## CSS方案
对于外部样式，stylus或css均支持。

为避免ts的编译错误，使用`require`方式引入：
```tsx
require('client/assets/app.styl')
require('client/assets/app.css')
```

对于scoped样式，使用如下方式：
```tsx
render() {
  return (
    <div>
      <header key="header" className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h3 className="App-title">Welcome to React!</h3>
        <Sub></Sub>
      </header>
      <style jsx>{`
        .App-header {
          h3 {
            color: red;
            &:hover {
              color: green;
            }
            transition: all .4s;
            height: 20px;
          }
        }
      `}</style>
    </div>
  )
}
```
详细文档请参考[styled-jsx](https://github.com/zeit/styled-jsx), 已引入`styled-jsx-plugin-stylus` 与 `styled-jsx-plugin-postcss`。

外部与scoped样式均已支持`autoprefixer`, `pxtorem`, `cssnano`三个postcss插件。

## 网络请求
```tsx
import axios from 'axios'

axios.get('/xxx')
  .then((data) => {
    // data即为后端返回的数据
  })
```

## 模块热替换
目前仅支持css的热替换，ts更新后会自动刷新浏览器。官方也是推荐这样做，也许未来对ts/js的热替换会有更好的支持。
