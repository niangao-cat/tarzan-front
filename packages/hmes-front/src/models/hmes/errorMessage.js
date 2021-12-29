/**
 * @date 2019-7-29
 * @author HDY <deying.huang@hand-china.com>
 */

import { getResponse, createPagination } from 'utils/utils';
import { ergodicData } from '@/utils/utils';
import {
  fetchMessageList,
  saveMessage,
  deleteMessage,
} from '../../services/hmes/errorMessageService';

export default {
  namespace: 'errorMessage',
  state: {
    messageList: [], // 消息表格数据源
    messagePagination: {}, // 消息表格分页
  },
  effects: {
    // 获取数据源列表数据
    *fetchMessageList({ payload }, { call, put }) {
      const res = yield call(fetchMessageList, payload);
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
    *saveMessage({ payload }, { call }) {
      const result = yield call(saveMessage, ergodicData(payload));
      return getResponse(result);
    },

    // 删除消息
    *deleteMessage({ payload }, { call }) {
      const result = yield call(deleteMessage, ergodicData(payload));
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
