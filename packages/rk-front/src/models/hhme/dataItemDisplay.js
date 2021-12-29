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
  saveHeaderData,
  saveLineData,
  fetchAreaList,
} from '../../services/hhme/dataItemDisplayService';

export default {
  namespace: 'dataItemDisplay',
  state: {
    headList: [],
    headPagination: {},
    lineList: [],
    historyList: [],
    historyPagination: {},
    typeList: [],
    priorityList: [],
    areaList: [],
    departmentInfo: {},
  },
  effects: {
    *init(_, { call, put }) {
      const res = yield call(queryMapIdpValue, {
        typeList: 'HME.EXHIBITION_TYPE',
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

    *saveHeaderData({ payload }, { call }) {
      const res = getResponse(yield call(saveHeaderData, payload));
      return res;
    },

    *saveLineData({ payload }, { call }) {
      const res = getResponse(yield call(saveLineData, payload));
      return res;
    },

    *fetchAreaList(_, { call, put }) {
      const result = getResponse(yield call(fetchAreaList));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            areaList: result,
            departmentInfo: isArray(result) ? result.find(e => e.defaultOrganizationFlag === 'Y') : {},
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
