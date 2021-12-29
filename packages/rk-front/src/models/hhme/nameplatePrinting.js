/**
 * purchaseAcceptancePosting - 过账平台models
 * @date: 2020/02/27 19:53:47
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';

import {
  fetchList,
  fetchLineList,
  fetchHistoryList,
  saveHeaderList,
  saveLineList,
} from '../../services/hhme/nameplatePrintingService';

export default {
  namespace: 'nameplatePrinting',
  state: {
    headList: [],
    headPagination: {},
    lineList: [],
    linePagination: {},
    historyList: [],
    historyPagination: {},
    typeList: [],
    priorityList: [],
  },
  effects: {
    *init(_, { call, put }) {
      const res = yield call(queryMapIdpValue, {
        typeList: 'HME.IDENTIFYING_CODE_TYPE',
        priorityList: 'HME_PRIORITY_TYPE',
      });
      yield put({
        type: 'updateState',
        payload: {
          ...res,
        },
      });
    },

    *fetchList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            headList: res.content,
            headPagination: createPagination(res),
          },
        });
      }
    },

    *fetchLineList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchLineList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            lineList: res.content,
            linePagination: createPagination(res),
          },
        });
      }
    },

    *fetchHistoryList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchHistoryList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            historyList: res.content,
            historyPagination: createPagination(res),
          },
        });
      }
    },

    *saveHeaderList({ payload }, { call }) {
      const res = getResponse(yield call(saveHeaderList, payload));
      return res;
    },

    *saveLineList({ payload }, { call }) {
      const res = getResponse(yield call(saveLineList, payload));
      return res;
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
