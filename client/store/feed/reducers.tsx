import { IFeed } from 'client/types/modules/feed';
import { TActions } from './actions';
import * as constants from './constants';
import IRootState from '../root-state';

type TState = IFeed | null;

export interface IFeedState {
  detail: IFeed | null;
  list: IFeed[];
  listScrollTop: number;
  currentPage: number;
  totalPages: number;
}

const initialState: IFeedState = {
  list: [],
  listScrollTop: 0,
  currentPage: 0,
  totalPages: Number.MAX_SAFE_INTEGER,
  detail: null,
};

export function feed(state = initialState, action: TActions): IFeedState {
  switch (action.type) {
    case constants.SET_FEED_DETAIL:
      return {
        ...state,
        detail: action.payload,
      };
    case constants.ADD_FEED_LIST:
      return {
        ...state,
        list: state.list.concat(action.payload.list),
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages,
      };
    case constants.REPLACE_FEED_LIST:
      return {
        ...state,
        list: action.payload.list,
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages,
      };
    case constants.SET_FEED_LIST_SCROLL_TOP:
      return {
        ...state,
        listScrollTop: action.payload,
      };
    default:
      return state;
  }
}
