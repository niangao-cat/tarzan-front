/**
 * @date 2019-12-19
 * @author lidong
 */

import { getResponse, createPagination } from 'utils/utils';
import { get as chainget } from 'lodash';
import {
  fetchTableList,
  saveList,
  deleteItem,
  fetchStatusOption,
} from '@/services/process/flowService';
import { ergodicData } from '@/utils/utils';

export default {
  namespace: 'flow',
  state: {
    tableList: [],
    tablePaginationFlow: {},
    statusList: [],
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
            tablePaginationFlow: createPagination(list.rows),
          },
        });
      }
      return list;
    },

    // 获取状态下拉
    *fetchStatusOption({ payload }, { call, put }) {
      const res = yield call(fetchStatusOption, payload);
      yield put({
        type: 'updateState',
        payload: {
          statusList: chainget(res, 'rows', []),
        },
      });
      return res;
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
