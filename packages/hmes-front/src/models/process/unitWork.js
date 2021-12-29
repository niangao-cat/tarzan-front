/**
 * @date 2019-12-11
 * @author lidong
 */

import { getResponse, createPagination } from 'utils/utils';
import { get as chainget } from 'lodash';
import { fetchTableList, saveList, deleteItem } from '@/services/process/unitWorkService';
import { ergodicData } from '@/utils/utils';

export default {
  namespace: 'unitWork',
  state: {
    tableList: [],
    tablePagination: {},
  },
  effects: {
    // 获取列表数据
    *fetchTableList({ payload }, { call, put }) {
      const res = yield call(fetchTableList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            tableList: chainget(list, 'rows.content', []),
            tablePagination: createPagination(list.rows),
          },
        });
      }
      return list;
    },

    // 保存
    *saveList({ payload }, { call }) {
      const result = yield call(saveList, ergodicData(payload));
      return getResponse(result);
    },

    // 删除
    *deleteItem({ payload }, { call }) {
      const result = yield call(deleteItem, payload);
      return getResponse(result);
    },
  },

  reducers: {
    updateState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
