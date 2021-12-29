/**
 * @date 2019-7-29
 * @author HDY <deying.huang@hand-china.com>
 */

import { getResponse, createPagination } from 'utils/utils';
import { ergodicData } from '@/utils/utils';
import { fetchAPIList, saveAPI, deleteAPI } from '@/services/acquisition/transformationService';

export default {
  namespace: 'transformation',
  state: {
    messageList: [], // 消息表格数据源
    messagePagination: {}, // 消息表格分页
  },
  effects: {
    // 获取数据源列表数据
    *fetchAPIList({ payload }, { call, put }) {
      const res = yield call(fetchAPIList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            messageList: list.rows.content,
            messagePagination: createPagination(list.rows),
          },
        });
      }
      return list;
    },

    // 保存消息
    *saveAPI({ payload }, { call }) {
      const result = yield call(saveAPI, ergodicData(payload));
      return getResponse(result);
    },

    // 删除消息
    *deleteAPI({ payload }, { call }) {
      const result = yield call(deleteAPI, ergodicData(payload));
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
