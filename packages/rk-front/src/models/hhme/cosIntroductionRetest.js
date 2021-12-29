/*
 * @Description: 复测导入
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-01-25 18:05:59
 * @LastEditTime: 2021-01-26 09:38:00
 */

import { getResponse, createPagination } from 'utils/utils';
import {
  fetchHeadList,
  fetchLineList,
  printingBarcode,
} from '@/services/hhme/cosIntroductionRetestService';

export default {
  namespace: 'cosIntroductionRetest',
  state: {
    headData: [],
    headDataPagination: [],
    lineData: [],
    lineDataPagination: [],
  },
  effects: {
    // 获取头
    *fetchHeadList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchHeadList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            headData: result.content,
            headDataPagination: createPagination(result),
          },
        });
      }
      return result;
    },
    // 获取行
    *fetchLineList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchLineList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            lineData: result.content,
            lineDataPagination: createPagination(result),
          },
        });
      }
      return result;
    },
    *printingBarcode({ payload }, { call }) {
      const result = getResponse(yield call(printingBarcode, payload));
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
