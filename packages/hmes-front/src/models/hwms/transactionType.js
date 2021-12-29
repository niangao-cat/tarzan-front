/**
 * 事务类型维护
 *@date：2019/10/18
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import { getResponse, createPagination } from 'utils/utils';
import { queryList, saveData } from '../../services/hwms/transactionTypeService';

export default {
  namespace: 'transactionType',
  state: {
    dataList: [],
    pagination: {},
    detail: {}, // 明细
  },
  effects: {
    // 查询列表
    *queryList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            dataList: res.content,
            pagination: createPagination(res),
          },
        });
      }
      return res;
    },
    // 保存数据
    *saveData({ payload }, { call }) {
      return getResponse(yield call(saveData, payload));
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
