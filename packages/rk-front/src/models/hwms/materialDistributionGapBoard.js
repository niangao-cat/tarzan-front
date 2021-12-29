/*
 * @Description: 物料配送缺口看板
 * @version: 0.1.0
 * @Author: yang.shuo@hand-china.com
 * @Date: 2021-05-19 09:01:34
 * @LastEditorts: yang.shuo@hand-china.com
 * @Copyright: Copyright (c) 2019 Hand
 */
import { getResponse, createPagination } from 'utils/utils';

import { fetchList, fetchProdLineList, fetchSiteCode } from '@/services/hwms/materialDistributionGapBoardService.js';

export default {
  namespace: 'materialDistributionGapBoard',
  state: {
    tableList: [],
    number: 0,
    totalPages: 0,
    totalElements: 0,
    numberOfElements: 0,
    siteInfo: {},
  },
  effects: {
    // 任务区域数据查询
    *fetchList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            tableList: result.content,
            number: result.number,
            totalPages: result.totalPages,
            totalElements: result.totalElements,
            numberOfElements: result.numberOfElements,
          },
        });
      }
      return result;
    },

    *fetchProdLineList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchProdLineList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            prodLineList: result.content,
            pagination: createPagination(result),
          },
        });
      }
    },

    *fetchSiteCode({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchSiteCode, payload));
      if (result) {
        const { siteInfo } = result;
        yield put({
          type: 'updateState',
          payload: {
            siteInfo,
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
