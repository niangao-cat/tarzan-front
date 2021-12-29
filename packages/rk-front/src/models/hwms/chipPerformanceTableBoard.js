/**
 * @date 2019-7-29
 * @author HDY <deying.huang@hand-china.com>
 */

import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';

import {
  queryHeadData,
  handleExport,
  fetchSiteList,
  getDefaultSite,
  queryGpHeadData,
} from '../../services/hwms/chipPerformanceTableBoardService';

export default {
  namespace: 'chipPerformanceTableBoard',
  state: {
    headList: [], // 消息表格数据源
    headPagination: {},
    cosTypeList: [],
    siteList: [],
    preStatusList: [],
    currentList: [],
    siteInfo: {},
  },
  effects: {
    // 查询独立值集
    *init(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          cosTypeList: 'HME_COS_TYPE',
          preStatusList: 'HME.SELECT_STATUS',
          currentList: 'HME.CURRENT',
        })
      );
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            ...result,
          },
        });
      }
    },
    // 头信息查询
    *queryHeadData({ payload }, { call, put }) {
      const result = getResponse(yield call(queryHeadData, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            headList: result.content,
            headPagination: createPagination(result),
            lineList: [],
            linePagination: {},
          },
        });
      }
      return result;
    },
    // 导出
    *handleExport({ payload }, { call }) {
      const result = getResponse(yield call(handleExport, payload));
      return result;
    },

    *fetchSiteList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchSiteList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            siteList: res,
          },
        });
      }
    },
    *getDefaultSite({ payload }, { call, put }) {
      const res = getResponse(yield call(getDefaultSite, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            siteInfo: res,
          },
        });
      }
    },
    *queryGpHeadData({ payload }, { call, put }) {
      const result = getResponse(yield call(queryGpHeadData, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            headList: result.content,
            headPagination: createPagination(result),
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
