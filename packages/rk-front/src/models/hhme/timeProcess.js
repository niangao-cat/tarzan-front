/**
 * 时效工艺时长维护 - model
 * @date: 2020/05/09 10:12:38
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  fetchHeadList,
  fetchItemList,
  fetchObjectList,
  saveHeadList,
  saveItemList,
  saveObjectList,
  fetchProcessHistoryList,
  fetchItemHistoryList,
  fetchObjectHistoryList,
  fetchDefaultSite,
} from '../../services/hhme/timeProcessService';

export default {
  namespace: 'timeProcess',
  state: {
    headList: [],
    pagination: {},
    itemList: [],
    itemPagination: {},
    objectList: [],
    objectPagination: {},
    processHistoryList: [],
    processHistoryPagination: {},
    itemHistoryList: [],
    itemHistoryPagination: {},
    objectHistoryList: [],
    objectHistoryPagination: {},
    objectTypeList: [],
    siteInfo: {},
  },
  effects: {
    *init(_, { call, put }) {
      const res = yield call(queryMapIdpValue, {
        objectTypeList: 'HME.TIME_OBJECT_TYPE',
      });
      const siteInfo = yield call(fetchDefaultSite);
      yield put({
        type: 'updateState',
        payload: {
          ...res,
          siteInfo,
        },
      });
    },

    *fetchHeadList({ payload }, { put, call }) {
      const res = getResponse(yield call(fetchHeadList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            headList: res.content,
            pagination: createPagination(res),
          },
        });
      }
    },

    *fetchItemList({ payload }, { put, call }) {
      const res = getResponse(yield call(fetchItemList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            itemList: res.content,
            itemPagination: createPagination(res),
          },
        });
      }
    },

    *fetchObjectList({ payload }, { put, call }) {
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

    *saveHeadList({ payload }, { call }) {
      const res = getResponse(yield call(saveHeadList, payload));
      return res;
    },

    *saveItemList({ payload }, { call }) {
      const res = getResponse(yield call(saveItemList, payload));
      return res;
    },

    *saveObjectList({ payload }, { call }) {
      const res = getResponse(yield call(saveObjectList, payload));
      return res;
    },

    *fetchProcessHistoryList({ payload }, { put, call }) {
      const res = getResponse(yield call(fetchProcessHistoryList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            processHistoryList: res.content,
            processHistoryPagination: createPagination(res),
          },
        });
      }
    },

    *fetchItemHistoryList({ payload }, { put, call }) {
      const res = getResponse(yield call(fetchItemHistoryList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            itemHistoryList: res.content,
            itemHistoryPagination: createPagination(res),
          },
        });
      }
    },

    *fetchObjectHistoryList({ payload }, { put, call }) {
      const res = getResponse(yield call(fetchObjectHistoryList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            objectHistoryList: res.content,
            objectHistoryPagination: createPagination(res),
          },
        });
      }
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
