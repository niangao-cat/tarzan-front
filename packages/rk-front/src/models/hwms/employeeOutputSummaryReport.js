/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 员工产量汇总报表
 */

import { getResponse, createPagination } from 'utils/utils';
import {
  queryDataList,
  fetchDefaultSite,
  fetchmakeNumList,
} from '@/services/hwms/employeeOutputSummaryReportService';

export default {
  namespace: 'employeeOutputSummaryReport',
  state: {
    headList: [],
    headPagination: {},
    siteId: "",
    makeNumList: [],
    makeNumPagination: {},
  },
  effects: {
    // 查询报表信息
    *queryDataList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryDataList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            headList: res.content,
            headPagination: createPagination(res),
          },
        });
      }
      return res;
    },

    *fetchmakeNumList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchmakeNumList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            makeNumList: result.content,
            makeNumPagination: createPagination(result),
          },
        });
      }
      return result;
    },

    *fetchDefaultSite(_, { call, put }) {
      const res = getResponse(yield call(fetchDefaultSite));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            siteId: res.siteId,
            headList: [],
            headPagination: {},
          },
        });
        return res;
      }
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
