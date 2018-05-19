import { combineReducers } from 'redux';
import IRootState from './root-state';
import TRootAction from './root-action';
import { feed } from './feed/reducers';

const rootReducer = combineReducers<IRootState>({
  feed,
});

export default rootReducer;
