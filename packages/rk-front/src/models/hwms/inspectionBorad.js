/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 巡检报表
 */

import { getResponse, createPagination } from 'utils/utils';
import { queryDataList, queryLineList, queryDetailList } from '@/services/hwms/inspectionBoradService';

export default {
  namespace: 'inspectionBorad',
  state: {
    headList: [],
    headPagination: {},
    detailList: [],
    detailPaginatin: {},
    dataSource: {},
  },
  effects: {
    // 查询报表信息
    *queryDataList({ payload }, { call, put }) {
        const res = yield call(queryDataList, payload);
        const list = getResponse(res);
        // 成功时，更改状态
        if (list) {
          yield put({
            type: 'updateState',
            payload: {
              headList: list.content,
              headPagination: createPagination(list),
            },
          });
        }
      },

      // 折线数据
      *queryLineList({ payload }, { call, put }) {
        const res = yield call(queryLineList, payload);
        const list = getResponse(res);
        // 成功时，更改状态
        if (list) {
          yield put({
            type: 'updateState',
            payload: {
              dataSource: list,
            },
          });
        }
      },

      // 查询报表明细信息
    *queryDetailList({ payload }, { call, put }) {
        const res = yield call(queryDetailList, payload);
        const list = getResponse(res);
        // 成功时，更改状态
        if (list) {
          yield put({
            type: 'updateState',
            payload: {
              detailList: list.content,
              detailPaginatin: createPagination(list),
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
