import 'babel-polyfill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import 'normalize.css';
import './utils/responsive';
import store from './store';
import './config';
import App from './pages/app';

require('client/assets/stylus/app.styl');

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App></App>
    </Router>
  </Provider>,
  document.getElementById('app') as HTMLElement,
);
