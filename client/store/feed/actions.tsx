import { Action, ActionCreator, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import axios from 'axios';
import { IFeed } from 'client/types/modules/feed';
import * as constants from './constants';
import IRootState from '../root-state';

export interface IFetchFeedDetail {
  type: typeof constants.SET_FEED_DETAIL;
  payload: IFeed;
}
export interface IAddFeedList {
  type: typeof constants.ADD_FEED_LIST;
  payload: {
    list: IFeed[];
    currentPage: number;
    totalPages: number;
  };
}

// 用于状态筛选，需要替换掉已有列表数据
export interface IReplaceFeedList {
  type: typeof constants.REPLACE_FEED_LIST;
  payload: {
    list: IFeed[];
    currentPage: number;
    totalPages: number;
  };
}

export interface ISetFeedListScrollTop {
  type: typeof constants.SET_FEED_LIST_SCROLL_TOP;
  payload: number;
}

export type TActions = IFetchFeedDetail | IAddFeedList | IReplaceFeedList | ISetFeedListScrollTop; // 联合当前业务域下所有action

export type TActionFunction = ActionCreator<ThunkAction<Promise<any>, IRootState, void>>;

export const fetchFeedDetail: TActionFunction = (id: string) => {
  return (dispatch: Dispatch<TActions>) => {
    return axios.get(`/api/feeds/${id}`)
      .then((res: any) => {
        dispatch({
          type: constants.SET_FEED_DETAIL,
          payload: res.result,
        });
      });
  };
};

export const fetchFeedList: TActionFunction = (queryParams: object, isReplace: boolean = false) => {
  return (dispatch: Dispatch<TActions>) => {
    return axios.get(`/api/feeds`, {
      params: queryParams,
    })
      .then((res: any) => {
        const {
          currentPage,
          totalPages,
          list,
        } = res.result;
        dispatch({
          type: isReplace ? constants.REPLACE_FEED_LIST : constants.ADD_FEED_LIST,
          payload: {
            currentPage,
            totalPages,
            list,
          },
        });
      });
  };
};

export const setScrollTop: ActionCreator<ThunkAction<void, IRootState, void>> = (scrollTop: number) => {
  return (dispatch: Dispatch<TActions>) => {
    dispatch({
      type: constants.SET_FEED_LIST_SCROLL_TOP,
      payload: scrollTop,
    });
  };
};
