/**
 * 货柜检查表维护
 *@date：2019/11/29
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */

import { getResponse, createPagination } from 'utils/utils';
import {
  queryList,
  saveData,
  deleteData,
} from '@/services/hwms/inspectionMaintainService';

export default {
  namespace: 'inspectionMaintain',
  state: {
    dataList: [], // 列表
    pagination: {}, // 分页器
  },
  effects: {
    *queryList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            dataList: result.rows.content,
            pagination: createPagination(result.rows),
          },
        });
      }
    },
    // 保存
    *saveData({ payload }, { call }) {
      const result = yield call(saveData, payload);
      return getResponse(result);
    },
    // 删除
    *deleteData({ payload }, { call }) {
      const result = yield call(deleteData, payload);
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
