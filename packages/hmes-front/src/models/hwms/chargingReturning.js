/**
 * 盘装料退料
 *@date：2019/11/29
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */

import { getResponse } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  queryList,
  calculateData,
  submitData,
} from '@/services/hwms/chargingReturningService';

export default {
  namespace: 'chargingReturning',
  state: {
    parentInfo: {},
    typeMap: [], // 退料类型
  },
  effects: {
    // 查询独立值集
    *init({ payload }, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          typeMap: 'INSTRUCTION_FORM',
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
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {
            parentInfo: res.rows,
          },
        });
      }
      return res;
    },
    // 数据汇总
    *calculateData({ payload }, { call, put }) {
      const res = getResponse(yield call(calculateData, payload));
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {
            parentInfo: res.rows,
          },
        });
      }
      return res;
    },
    // 提交
    *submitData({ payload }, { call, put }) {
      const res = getResponse(yield call(submitData, payload));
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {
            parentInfo: {},
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
