import { getResponse, createPagination} from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  queryList,
} from '@/services/hhme/cosBarCodeExceptionService';

export default {
  namespace: 'cosBarCodeException',
  state: {
    List: [], // 头数据源
    Pagination: {}, // 头表格分页
    docTypeMap: [], // 单据类型
    version: [], // 版本
  },
  effects: {
    // 查询独立值集
    *init({ payload }, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          version: 'HCM.MATERIAL_VERSION',
          docTypeMap: 'HME_COS_TYPE',
          tenantId: payload.tenantId,
        })
      );
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            ...result,
          },
        });
      }
    },
    // 查询列表
    *queryList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            List: res.content,
            Pagination: createPagination(res),
          },
        });
      }
      return res;
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
