/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： COS条码加工汇总表
 */

import { getResponse, createPagination } from 'utils/utils';
import { queryDataList } from '@/services/hwms/wmsSummaryOfCosBarcodeProcessingService';
import { queryMapIdpValue } from 'services/api';

export default {
  namespace: 'wmsSummaryOfCosBarcodeProcessing',
  state: {
    headList: [],
    headPagination: {},
    cosTypeMap: [],
  },
  effects: {
    // 初始化 状态下拉框
    *init(_, { call, put }) {
      const res = yield call(queryMapIdpValue, {
        cosTypeMap: 'HME_COS_TYPE',
      });
      // 成功时，更改状态
      yield put({
        type: 'updateState',
        payload: {
          ...res,
        },
      });
    },
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
