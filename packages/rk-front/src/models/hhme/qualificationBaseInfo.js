/*
 * @Description: 资质基础信息维护
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-06-15 17:21:50
 */

import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  fetchQualificationList,
  saveData,
} from '@/services/hhme/qualificationBaseInfoService';

export default {
  namespace: 'qualificationBaseInfo',
  state: {
    qualificationList: [], // 资质列表
    pagination: {}, // 分页
  },
  effects: {
    // 批量查询独立值集
    *batchLovData(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          qualityType: 'HME.QUALITY_TYPE', // 资质类型
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
    // 获取资质列表
    *fetchQualificationList({ payload }, { put, call }) {
      const res = yield call(fetchQualificationList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            qualificationList: res.content,
            pagination: createPagination(res),
          },
        });
      }
      return list;
    },
    *saveData({ payload }, { call }) {
      const res = getResponse(yield call(saveData, payload));
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
