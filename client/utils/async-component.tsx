import * as React from 'react';
import * as Loadable from 'react-loadable';

const Loading = () => null;

type TComponentLoader = () => Promise<React.ComponentType<any> | { default: React.ComponentType<any> }>;
export default (componentLoader: TComponentLoader) => {
  return Loadable({
    loader: componentLoader,
    loading: Loading,
  });
};
