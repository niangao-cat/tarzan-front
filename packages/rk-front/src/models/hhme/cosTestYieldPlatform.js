/**
 * purchaseAcceptancePosting - 过账平台models
 * @date: 2020/02/27 19:53:47
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import { isArray } from 'lodash';
import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  fetchList,
  fetchLineList,
  fetchHistoryList,
  addLineList,
  waferPass,
  passLine,
} from '../../services/hhme/cosTestYieldPlatformService';

export default {
  namespace: 'cosTestYieldPlatform',
  state: {
    headList: [],
    headPagination: {},
    lineList: [],
    historyList: [],
    historyPagination: {},
    typeList: [],
    priorityList: [],
  },
  effects: {
    *init(_, { call, put }) {
      const res = yield call(queryMapIdpValue, {
        typeList: 'HME.COS_DOC_STATUS',
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

    *fetchHistoryList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchHistoryList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            historyList: isArray(res.content) ? res.content : [],
            historyPagination: createPagination(res),
          },
        });
      }
    },

    *addLineList({ payload }, { call }) {
      const res = yield call(addLineList, payload);
      return res;
    },

    *waferPass({ payload }, { call }) {
      const res = getResponse(yield call(waferPass, payload));
      return res;
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
    *passLine({ payload }, { call }) {
      const res = getResponse(yield call(passLine, payload));
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
