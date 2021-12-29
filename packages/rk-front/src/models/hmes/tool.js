/*
 * @Description: 工装维护
 * @version: 0.1.0
 * @Author: li.zhang13@hand-china.com
 * @Date: 2021-01-07 17:53:35
 */

import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  handleSearch,
  handhistory,
  saveData,
} from '@/services/hmes/toolService';

export default {
  namespace: 'tool',
  state: {
    dataList: [], // 数据列表
    historydateList: [], // 修改记录数据
    pagination: {},
    historypagination: {},
    applyTypeMap: [],
  },
  effects: {
    // 查询工装维护数据
    *handleSearch({ payload }, { call, put }) {
      const res = getResponse(yield call(handleSearch, payload));
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
    // 批量查询独立值集
    *batchLovData(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          applyTypeMap: 'HME.APPLY_TYPE',
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
    // 保存数据
    *saveData({ payload }, { call }) {
      const res = getResponse(yield call(saveData, payload));
      return res;
    },
    // 查询修改记录数据
    *handhistory({ payload }, { call, put }) {
      const res = getResponse(yield call(handhistory, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            historydateList: res.content,
            historypagination: createPagination(res),
          },
        });
      }
      return res;
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
