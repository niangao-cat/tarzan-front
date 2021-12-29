/*
 * @Description: 抽样类型管理
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-05-07 11:50:30
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-07-06 17:01:39
 * @Copyright: Copyright (c) 2019 Hand
 */

import { getResponse, createPagination } from 'utils/utils';
import { fetchTypeManData, saveData } from '@/services/hqms/samplingTypeManagementService';
import { queryMapIdpValue } from 'services/api';

export default {
  namespace: 'samplingTypeManagement',
  state: {
    lovData: {}, // 值集数据
    typeManList: [], // 抽样类型管理数据
    pagination: {}, // 分页
    detail: {},
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
    // 获取抽样类型管理数据
    *fetchTypeManData({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchTypeManData, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            typeManList: result.content,
            pagination: createPagination(result),
          },
        });
      }
      return result;
    },
    // 保存数据
    *saveData({ payload }, { call }) {
      const result = getResponse(yield call(saveData, payload));
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
