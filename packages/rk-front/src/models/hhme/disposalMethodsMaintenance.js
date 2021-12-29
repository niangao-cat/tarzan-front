/*
 * @Description: 处置方法维护
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com wenjie.yang01@hand-china.com
 * @Date: 2020-11-25 22:08:32
 * @LastEditTime: 2020-11-25 22:11:52
 */

import { getResponse, createPagination } from 'utils/utils';
// import { queryMapIdpValue } from 'services/api';
import {
  fetchFunctionType,
  fetchList,
  saveRecord,
  deleteRecord,
  getSiteList,
} from '@/services/hhme/disposalMethodsMaintenanceService';

export default {
  namespace: 'disposalMethodsMaintenance',
  state: {
    list: [], // 主数据
    pagination: {}, // 分页
    functionType: [], // 下拉框
    defaultSite: {},
  },
  effects: {

    *getSiteList({ payload }, { call, put }) {
      const result = getResponse(yield call(getSiteList, payload));
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

    // 查询处置方法类型
    *fetchFunctionType({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchFunctionType, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            functionType: res.rows,
          },
        });
      }
      return res;
    },

    // 查询主数据
    *fetchList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            list: res.rows.content,
            pagination: createPagination(res.rows),
          },
        });
      }
      return res;
    },

    // 保存单条数据
    *saveRecord({ payload }, { call }) {
      const res = getResponse(yield call(saveRecord, payload));
      return res;
    },

    // 删除单条数据
    *deleteRecord({ payload }, { call }) {
      const res = getResponse(yield call(deleteRecord, payload));
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
