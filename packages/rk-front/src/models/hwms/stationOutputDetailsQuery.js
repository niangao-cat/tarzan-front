/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 工位产量明细查询
 */

import { getResponse, createPagination } from 'utils/utils';
import {
  queryDataList,
} from '@/services/hwms/stationOutputDetailsQueryService';

export default {
  namespace: 'stationOutputDetailsQuery',
  state: {
    headList: [],
    headPagination: {},
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
