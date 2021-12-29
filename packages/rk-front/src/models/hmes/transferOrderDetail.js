/*
 * @Description: 调拨单汇总报表
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-12-23 20:34:53
 * @LastEditTime: 2020-12-23 21:13:53
 */
import { getResponse, createPagination, parseParameters } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  handleSearch,
  fetchDefaultSite,
} from '@/services/hmes/transferOrderDetailService';

export default {
  namespace: 'transferOrderDetail',
  state: {
    list: [],
    pagination: {},
    defaultSite: {},
    instructionDocTypeList: [],
    docStatus: [],
  },
  effects: {
    // 批量查询独立值集
    *batchLovData(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          docStatus: 'WMS.STOCK_ALLOCATION_DOC.STATUS',
          instructionDocTypeList: 'WMS.STOCK_ALLOCATION_DOC.TYPE',
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
    *fetchList({ payload }, { call, put }) {
      const result = getResponse(yield call(handleSearch, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            list: result.content,
            pagination: createPagination(result),
          },
        });
      }
      return result;
    },
    *fetchDefaultSite(_, { call, put }) {
      const res = getResponse(yield call(fetchDefaultSite));
      if(res) {
        yield put({
          type: 'updateState',
          payload: {
            defaultSite: res,
          },
        });
      }
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
