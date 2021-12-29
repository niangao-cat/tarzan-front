/**
 * @Author:lly
 * @email: liyuan.liu@hand-china.com
 * @description： COS员工产量汇总报表
 */

import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import { queryDataList } from '@/services/hwms/cosEmployeeOutputSummaryReportService';

export default {
  namespace: 'cosEmployeeOutputSummaryReport',
  state: {
    headList: [],
    headPagination: {},
    cosTypeMap: [],
    column: [],
  },
  effects: {
    // 查询报表信息
    *queryDataList({ payload }, { call, put }) {
      // 数据查询
      const res = yield call(queryDataList, payload);
      const list = getResponse(res);
      yield put({
        type: 'updateState',
        payload: {
          headList: list.content ? list.content : [],
          headPagination: createPagination(list),
        },
      });
      return res;
    },

    // 批量查询独立值集
    *batchLovData(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          cosTypeMap: 'HME_COS_TYPE',
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
