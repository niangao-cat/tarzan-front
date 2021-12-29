/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 生产执行全过程监控报表
 */
import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';

import {
  fetchDefaultSite,
  fetchList,
  fetchDepartmentList,
} from '@/services/hwms/processMonitoringReportService';

export default {
  namespace: 'processMonitoringReport',
  state: {
    list: [],
    pagination: {},
    typeMap: [],
    statusMap: [],
    siteInfo: {},
    departmentList: [],
  },
  effects: {
    *init(_, { call, put }) {
      const res = yield call(queryMapIdpValue, {
        typeMap: 'MT.WO_TYPE',
        statusMap: 'MT.WO_STATUS',
      });
      yield put({
        type: 'updateState',
        payload: {
          ...res,
        },
      });
    },

    *fetchDefaultSite(_, { call, put }) {
      const res = getResponse(yield call(fetchDefaultSite));
      if(res) {
        yield put({
          type: 'updateState',
          payload: {
            siteInfo: res,
          },
        });
      }
      return res;
    },

    *fetchList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchList, payload));
      if(res) {
        yield put({
          type: 'updateState',
          payload: {
            list: res.content,
            pagination: createPagination(res),
          },
        });
      }
    },

    *fetchDepartmentList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchDepartmentList, payload));
      if(res) {
        yield put({
          type: 'updateState',
          payload: {
            departmentList: res,
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
