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
  fetchDefaultSite,
} from '../../services/hhme/cosYieldReportService';

export default {
  namespace: 'cosYieldReport',
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
      const result = getResponse(
        yield call(queryMapIdpValue, {
          cosTypeList: 'HME_COS_TYPE',
        })
      );
      const siteInfo = getResponse(yield call(fetchDefaultSite));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            ...result,
            siteInfo,
          },
        });
      }
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
