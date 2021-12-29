/**
 * labCodeInput - model
 * *
 * @date: 2021/10/27 14:47:55
 * @author: zhaohuiLiu <zhaohui.liu@hand-china.com>
 * @copyright: Copyright (c) 2018, Hand
 */

import { createPagination, getResponse } from 'utils/utils';
import {
  queryBarcodeList,
  updateBarcodeData,
} from '@/services/hwms/labCodeInputService';

export default {
  namespace: 'labCodeInput',
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
