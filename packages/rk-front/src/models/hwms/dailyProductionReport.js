/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 产量日明细报表
 */

import { getResponse, createPagination } from 'utils/utils';
import {
  queryDataList,
  queryDetailDataList,
  queryDetailDataAllList,
} from '@/services/hwms/dailyProductionReportService';

export default {
  namespace: 'dailyProductionReport',
  state: {
    headList: [],
    headPagination: {},
    detailList: [],
    detailPagination: {},
    detailListData: [],
    detailPaginationData: {},
  },
  effects: {
    // 查询报表信息
    *queryDataList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryDataList, payload));
      if (res) {
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
    // 查询报表明细信息
    *queryDetailDataList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryDetailDataList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            detailList: res.content,
            detailPagination: createPagination(res),
          },
        });
      }
      return res;
    },
     // 查询报表明细信息
     *queryDetailDataAllList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryDetailDataAllList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            detailListData: res.content,
            detailPaginationData: createPagination(res),
          },
        });
      }
      return res;
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
