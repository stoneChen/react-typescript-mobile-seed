
import * as React from 'react';
import { Redirect } from 'react-router-dom';
import feed from './feed/routes';

export default [
  ...feed,
  <Redirect key="redirect" to="/home" />,
];
