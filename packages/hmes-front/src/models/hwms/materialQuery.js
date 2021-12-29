/**
 * 物料查询
 *@date：2019/9/17
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import { createPagination, getResponse } from 'utils/utils';
import { queryMaterialList, queryBINList } from '@/services/hwms/materialQueryService';

export default {
  namespace: 'materialQuery',
  state: {
    dataList: [], // 物料列表
    pagination: {}, // 物料分页器
    binList: [], // BIN列表
  },
  effects: {
    // 物料列表查询
    *queryMaterialList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryMaterialList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            dataList: result.rows.content,
            pagination: createPagination(result.rows),
          },
        });
      }
      return result;
    },
    // BIN列表查询
    *queryBINList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryBINList, payload));
      if (result.success) {
        yield put({
          type: 'updateState',
          payload: {
            binList: result.rows.content,
          },
        });
      }
      return result;
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
