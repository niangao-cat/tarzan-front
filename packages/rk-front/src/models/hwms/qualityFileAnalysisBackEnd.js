/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 质量文件解析
 */

import { getResponse, createPagination } from 'utils/utils';
import { queryHeadList, queryLineList } from '@/services/hwms/qualityFileAnalysisBackEndService';

export default {
  namespace: 'qualityFileAnalysisBackEnd',
  state: {
    headList: [],
    headPagination: {},
    lineList: [],
    linePagination: {},
  },
  effects: {
    // 查询报表头信息
    *queryHeadList({ payload }, { call, put }) {
        // 数据查询
        const res = yield call(queryHeadList, payload);
        const list = getResponse(res);
        // 成功时，更改状态
        if (list) {
          yield put({
            type: 'updateState',
            payload: {
              headList: list.content,
              headPagination: createPagination(list),
              lineList: [],
              linePagination: {},
            },
          });
        }
    },

    // 查询报表行信息
    *queryLineList({ payload }, { call, put }) {
      // 数据查询
      const res = yield call(queryLineList, payload);
      const list = getResponse(res);
      // 成功时，更改状态
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            lineList: list.content,
            linePagination: createPagination(list),
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
