/**
 * @date 2019-8-8
 * @author HDY <deying.huang@hand-china.com>
 */

import { getResponse, createPagination } from 'utils/utils';
import { ergodicData } from '@/utils/utils';

import { fetchEnterpriseList, saveEnterprise } from '../../services/org/enterpriseService';

export default {
  namespace: 'enterprise',
  state: {
    enterpriseList: [], // 显示企业表格数据
    enterprisePagination: {}, // 企业表格分页
  },
  effects: {
    // 获取企业维护列表数据
    *fetchEnterpriseList({ payload }, { call, put }) {
      const res = yield call(fetchEnterpriseList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            enterpriseList: list.rows.content,
            enterprisePagination: createPagination(list.rows),
          },
        });
      }
    },

    // 保存企业信息
    *saveEnterprise({ payload }, { call }) {
      const result = yield call(saveEnterprise, ergodicData(payload));
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
