import { createStore, compose, applyMiddleware, Dispatch, Reducer } from 'redux';
import thunk from 'redux-thunk';
import TRootAction from './root-action';
import IRootState from './root-state';
import rootReducer from './root-reducer';

let composeEnhancers = compose;

if (process.env.NODE_ENV === 'development') {
  composeEnhancers = global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

export { IRootState };
export type TRootDispatch = Dispatch<TRootAction>;
export type TRootReducer = Reducer<IRootState>;

export function configureStore(initialState?: any) {
  return createStore<IRootState>(rootReducer, composeEnhancers(
    applyMiddleware(thunk),
  ));
}

export default configureStore();
