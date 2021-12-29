/*
 * @Description: 抽样方案定义
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-05-07 09:17:19
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-07-06 17:01:29
 * @Copyright: Copyright (c) 2019 Hand
 */

import { getResponse, createPagination, parseParameters } from 'utils/utils';
import { handleSearch, savePlanDef } from '@/services/hqms/samplingPlanDefinitionService';
import { queryMapIdpValue } from 'services/api';

export default {
  namespace: 'samplingPlanDefinition',
  state: {
    detail: {},
    planDefList: [], // 抽样方案定义数据
    lovData: {}, // 值集数据
    pagination: {}, // 分页数据
  },
  effects: {
    // 获取值集
    *getTypeLov({ payload }, { call, put }) {
      const result = getResponse(yield call(queryMapIdpValue, { ...payload }));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            lovData: result,
          },
        });
      }
      return result;
    },
    // 抽样方案定义查询
    *handleSearch({ payload }, { call, put }) {
      const result = getResponse(yield call(handleSearch, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            planDefList: result.content,
            pagination: createPagination(result),
          },
        });
      }
      return result;
    },
    // 抽样方案定义创建
    *savePlanDef({ payload }, { call }) {
      const result = getResponse(yield call(savePlanDef, payload));
      return result;
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
