/**
 * 现有量查询
 *@date：2020/4/19
*@author：zzc <zhicen.zhang@hand-china.com>
*@version：0.0.1
*@copyright Copyright (c) 2019,Hand
*/
import { createPagination, getResponse } from 'utils/utils';
import { fetchList, fetchSiteList, fetchDefaultSite } from '@/services/hqms/repairOrderReportService';

export default {
  namespace: 'repairOrderReport',
  state: {
    list: [], // 条码列表
    pagination: false, // 条码分页器
    siteList: [],
    defaultSite: {},
  },
  effects: {
    // 现有量列表查询
    *fetchList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            list: result.content,
            pagination: createPagination(result),
          },
        });
      }
      return result;
    },
    *fetchSiteList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchSiteList, payload));
      if(res) {
        yield put({
          type: 'updateState',
          payload: {
            siteList: res,
          },
        });
      }
    },
    // 获取默认工厂
    *fetchDefaultSite({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchDefaultSite, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            defaultSite: result,
          },
        });
      }
      return result;
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
