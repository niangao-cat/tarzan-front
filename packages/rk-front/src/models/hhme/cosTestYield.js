/**
 * purchaseAcceptancePosting - 过账平台models
 * @date: 2020/02/27 19:53:47
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import { isArray } from 'lodash';
import { getResponse, createPagination } from 'utils/utils';
import {
  fetchList,
  fetchHistoryList,
  saveHeaderList,
} from '../../services/hhme/cosTestYieldService';

export default {
  namespace: 'cosTestYield',
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
            historyList: isArray(res) ? res : [],
          },
        });
      }
    },

    *saveHeaderList({ payload }, { call }) {
      const res = getResponse(yield call(saveHeaderList, payload));
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
