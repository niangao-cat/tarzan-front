/*
 * @Description: 不良处理平台
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-06-07 18:10:19
 */
import { getResponse, createPagination, parseParameters } from 'utils/utils';
import {
  handleSearch,
  exportExcel,
} from '@/services/hmes/woDistributionComprehensiveReportService';
import { queryMapIdpValue } from 'services/api';

export default {
  namespace: 'woDistributionComprehensiveReport',
  state: {
    list: [],
    pagination: {},
  },
  effects: {// 批量查询独立值集
    *batchLovData(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          docStatus: 'WMS.DISTRIBUTION_DOC_STATUS',
          rowStatus: 'WMS.DISTRIBUTION_LINE_STATUS',
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

    // 主查询
    *handleSearch({ payload }, { call, put }) {
      const result = getResponse(yield call(handleSearch, parseParameters(payload)));
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
    // 导出
    *exportExcel({ payload }, { call }) {
      const result = getResponse(yield call(exportExcel, payload));
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
