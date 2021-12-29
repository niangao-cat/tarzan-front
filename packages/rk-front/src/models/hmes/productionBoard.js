/*
 * @Description: 不良处理平台
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-06-07 18:10:19
 */
import { getResponse } from 'utils/utils';
import {
  getSiteList,
  querySiteName,
  queryProLine,
  fetchFileUrl,
} from '@/services/hmes/productionBoardService';

export default {
  namespace: 'productionBoard',
  state: {
    defaultSite: {},
    siteNameBoard: {},
    proLineList: [],
    fileList: [],
  },
  effects: {
    // 获取默认工厂
    *getSiteList({ payload }, { call, put }) {
      const result = getResponse(yield call(getSiteList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            defaultSite: result,
          },
        });
      }
      return result;
    },
    // 查询查询站点中英文名
    *querySiteName({ payload }, { call, put }) {
      const result = getResponse(yield call(querySiteName, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            siteNameBoard: result,
          },
        });
      }
      return result;
    },
    *queryProLine({ payload }, { call, put }) {
      const result = getResponse(yield call(queryProLine, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            proLineList: result.content,
          },
        });
      }
      return result;
    },
    *fetchFileUrl({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchFileUrl, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            fileList: result,
          },
        });
      }
      return result;
    },
  },

  reducers: {
    updateState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
