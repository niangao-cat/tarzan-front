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
  saveCurrentData,
  fetchDetailList,
  fetchObjectList,
  saveObjectList,
  passObjectList,
  fetchProcessList,
  saveProcessList,
  passProcessList,
  fetchSnList,
  saveSnList,
} from '../../services/hhme/pumpInterceptService';

export default {
  namespace: 'pumpIntercept',
  state: {
    list: [],
    pagination: {},
    lineList: [],
    historyList: [],
    historyPagination: {},
    dimensionList: [],
    statusList: [],
    detailList: [],
    detailPagination: {},
    detailInfo: {},
    processList: [],
    processPagination: {},
    objectList: [],
    objectPagination: {},
    snList: [],
    snPagination: {},
  },
  effects: {
    *init(_, { call, put }) {
      const res = yield call(queryMapIdpValue, {
        dimensionList: 'HME.INTERCEPT_DIMENSION',
        statusList: 'HME.INTERCEPT_STATUS',
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
            list: res.content,
            pagination: createPagination(res),
          },
        });
      }
    },

    *saveCurrentData({ payload }, { call }) {
      const res = getResponse(yield call(saveCurrentData, payload));
      return res;
    },

    *fetchDetailList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchDetailList, payload));
      if (res) {
        const { hmePopupWindowVOList, ...detailInfo } = res;
        yield put({
          type: 'updateState',
          payload: {
            detailInfo,
            detailList: hmePopupWindowVOList.content,
            detailPagination: createPagination(hmePopupWindowVOList),
          },
        });
      }
    },

    *fetchObjectList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchObjectList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            objectList: res.content,
            objectPagination: createPagination(res),
          },
        });
      }
    },

    *saveObjectList({ payload }, { call }) {
      const res = getResponse(yield call(saveObjectList, payload));
      return res;
    },

    *passObjectList({ payload }, { call }) {
      const res = getResponse(yield call(passObjectList, payload));
      return res;
    },

    *fetchProcessList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchProcessList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            processList: res.content,
            processPagination: createPagination(res),
          },
        });
      }
    },

    *saveProcessList({ payload }, { call }) {
      const res = getResponse(yield call(saveProcessList, payload));
      return res;
    },

    *passProcessList({ payload }, { call }) {
      const res = getResponse(yield call(passProcessList, payload));
      return res;
    },

    *fetchSnList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchSnList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            snList: res.content,
            snPagination: createPagination(res),
          },
        });
      }
    },

    *saveSnList({ payload }, { call }) {
      const res = getResponse(yield call(saveSnList, payload));
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
