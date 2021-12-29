/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 表增量报表
 */

import { getResponse, createPagination } from 'utils/utils';
import { queryDataList, saveData, checkData } from '@/services/hwms/cosScrapWithdrawalService';

export default {
  namespace: 'cosScrapWithdrawal',
  state: {
    headList: [],
    headPagination: {},
  },
  effects: {
    // 查询报表信息
    *queryDataList({ payload }, { call, put }) {
        // 数据查询
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

    // 校验信息
    *checkData({ payload }, { call }) {
      const result = yield call(checkData, payload);
      return getResponse(result);
    },

    // 保存信息
    *saveData({ payload }, { call }) {
      const result = yield call(saveData, payload);
      return getResponse(result);
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
