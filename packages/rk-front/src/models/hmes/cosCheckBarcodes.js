/*
 * @Description:描述
 * @Version: 0.0.1
 * @Autor: li.zhang13@hand-china.com
 * @Date: 2020-01-05 10:26:22
 * @LastEditTime: 2020-01-05 20:31:18
 */

import { getResponse, createPagination, parseParameters } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
    fetchCosCheckBarcodes,
} from '@/services/hmes/cosCheckBarcodesService';

export default {
  namespace: 'cosCheckBarcode',
  state: {
    reportData: [],
    reportDataPagination: {},
    cosCheckBarcode: [],
    defaultDate: [],
    cosTypeMap: [], // cos类型
    orderTypeList: [], // 工序状态
  },
  effects: {
     // 查询独立值集
    *init({ payload }, { call, put }) {
        const result = getResponse(
          yield call(queryMapIdpValue, {
            cosTypeMap: 'HME_COS_TYPE',
            tenantId: payload.tenantId,
            orderTypeList: 'HME.SEQUENCE_STATUS',
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
    // cos工位加工汇总表查询
    *fetchCosCheckBarcodes({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchCosCheckBarcodes, parseParameters(payload)));
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
