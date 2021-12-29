/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 导出结果
 */

import { getResponse, createPagination } from 'utils/utils';
import { queryDataList } from '@/services/hwms/screeningResultService';

export default {
  namespace: 'screeningResult',
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
