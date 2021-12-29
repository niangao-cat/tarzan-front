/**
 * @Author:lly
 * @email: liyuan.liu@hand-china.com
 * @description： COS筛选剩余芯片统计报表
 */

import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import { queryDataList } from '@/services/hwms/cosFilterRemainingChipsStatisticsService';

export default {
  namespace: 'cosFilterRemainingChipsStatistics',
  state: {
    headList: [],
    headPagination: {},
    cosTypeMap: [],
    statusMap: [],
    column: [],
  },
  effects: {
    // 查询报表信息
    *queryDataList({ payload }, { call, put }) {
      // 数据查询
      const res = getResponse(yield call(queryDataList, payload));
      if(res) {
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

    // 批量查询独立值集
    *batchLovData(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          cosTypeMap: 'HME_COS_TYPE',
          statusMap: 'HME.SELECT_STATUS',
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
