/**
 * 现有量查询
 *@date：2020/4/19
 *@author：zzc <zhicen.zhang@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import { createPagination, getResponse } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import { queryList, fetchSiteList, fetchDefaultSite } from '@/services/hwms/onhandService';

export default {
  namespace: 'onhandQuery',
  state: {
    dataList: [], // 条码列表
    pagination: false, // 条码分页器
    siteList: [],
    defaultSite: {},
  },
  effects: {
    // 查询独立值集
    *init({ payload }, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          enableMap: 'Z_MTLOT_ENABLE_FLAG',
          urlMap: 'Z_WMS_ERP_MEINVENTORY',
          tenantId: payload.tenantId,
        })
      );
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            ...result,
          },
        });
      }
    },
    // 现有量列表查询
    *queryList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            dataList: result.content,
            pagination: createPagination(result),
            onhandQuantitySum: result.onhandQuantitySum,
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
