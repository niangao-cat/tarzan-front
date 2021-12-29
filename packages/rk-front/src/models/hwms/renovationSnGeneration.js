/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 翻新SN生成
 */

import { getResponse } from 'utils/utils';
import { queryDataList, submitCode, print } from '@/services/hwms/renovationSnGenerationService';

export default {
  namespace: 'renovationSnGeneration',
  state: {
    headList: [],
    showDto: {},
  },
  effects: {
    // 查询报表信息
    *queryDataList({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          headList: [],
          showDto: {},
        },
      });

      // 数据查询
      const res = yield call(queryDataList, payload);
      const data = getResponse(res);
      // 成功时，更改状态
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            headList: [data],
            showDto: data,
          },
        });
      }
      return data;
    },

    // 提交数据信息
    *submitCode({ payload }, { call }) {
      // 数据查询
      const res = yield call(submitCode, payload);
      const list = getResponse(res);
      return list;
    },

    // 打印
    *print({ payload }, { call }) {
      const res = getResponse(yield call(print, payload));
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
