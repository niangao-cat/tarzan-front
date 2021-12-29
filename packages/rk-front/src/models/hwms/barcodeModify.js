/**
 * 条码修改
 *@date：2020/3/17
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2020,Hand
 */
import { createPagination, getResponse } from 'utils/utils';
import {
  queryBarcodeList,
  updateBarcodeData,
} from '@/services/hwms/barcodeModifyService';

export default {
  namespace: 'barcodeModify',
  state: {
    dataList: [], // 条码列表
    pagination: false, // 条码分页器
  },
  effects: {
    // 条码列表查询
    *queryBarcodeList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryBarcodeList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            dataList: result.content,
            pagination: createPagination(result),
          },
        });
      }
      return result;
    },
    // 修改条码
    *updateBarcodeData({ payload }, { call }) {
      const result = yield call(updateBarcodeData, payload);
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
