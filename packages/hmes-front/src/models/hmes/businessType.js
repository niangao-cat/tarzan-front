/*
 *
 * date: 2020-01-03
 * author : 黄文钊 <wenzhao.huang@hand-china.com>
 * version : 0.0.1
 * copyright Copyright (c) 2020, Hand
 */
import { getResponse, createPagination } from 'utils/utils';
import { ergodicData } from '@/utils/utils';

import { fetchBusinessTypeList, saveBusinessType } from '../../services/hmes/businessTypeService';

export default {
  namespace: 'businessType',
  state: {
    businessTypeList: [], // 显示企业表格数据
    businessTypePagination: {}, // 企业表格分页
  },
  effects: {
    // 获取企业维护列表数据
    *fetchBusinessTypeList({ payload }, { call, put }) {
      const res = yield call(fetchBusinessTypeList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            businessTypeList: list.rows.content,
            businessTypePagination: createPagination(list.rows),
          },
        });
      }
    },

    // 保存企业信息
    *saveBusinessType({ payload }, { call }) {
      const result = yield call(saveBusinessType, ergodicData(payload));
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
