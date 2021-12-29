/*
 * @Description:描述
 * @Version: 0.0.1
 * @Autor: li.zhang13@hand-china.com
 * @Date: 2021-01-27 10:25:46
 */

import { getResponse, createPagination, parseParameters } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  fetchCosProduction,
  handleExport,
  getNcFlagData,
} from '@/services/hmes/cosProductionService';

export default {
  namespace: 'cosProduction',
  state: {
    reportData: [],
    reportDataPagination: {},
    cosProduction: [],
    cosProductionPagination: {},
    defaultDate: [],
    cosTypeMap: [], // cos类型
    workOrderTypeList: [],
    ncFlagDataPagination: {},
  },
  effects: {
     // 查询独立值集
    *init({ payload }, { call, put }) {
        const result = getResponse(
          yield call(queryMapIdpValue, {
            cosTypeMap: 'HME_COS_TYPE',
            workOrderTypeList: 'MT.WO_TYPE',
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
    // cos在制报表查询
    *fetchCosProduction({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchCosProduction, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            reportData: result.content,
            reportDataPagination: createPagination(result),
          },
        });
      }
      return result;
    },
    *handleExport({ payload }, { call }) {
      const res = getResponse(yield call(handleExport, payload));
      return res;
    },
    // 获取历史记录
    *getNcFlagData({ payload }, { call, put }) {
      const res = getResponse(yield call(getNcFlagData, parseParameters(payload)));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            ncFlagData: res.content,
            ncFlagDataPagination: createPagination(res),
          },
        });
      }
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
