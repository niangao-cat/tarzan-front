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
  fetchHistoryList,
  saveData,
} from '../../services/hhme/cosElectricFilterService';

export default {
  namespace: 'cosElectricFilter',
  state: {
    dataSource: [],
    pagination: {},
    historyList: [],
    historyPagination: {},
    cosTypeList: [],
  },
  effects: {
    *init(_, { call, put }) {
      const res = yield call(queryMapIdpValue, {
        cosTypeList: 'HME_COS_TYPE',
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
            dataSource: res.content,
            pagination: createPagination(res),
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

    *save({ payload }, { call }) {
      const res = getResponse(yield call(saveData, payload));
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
