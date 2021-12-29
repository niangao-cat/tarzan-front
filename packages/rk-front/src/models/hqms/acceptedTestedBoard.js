/*
 * @Description: 已收待验看板
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-21 10:39:31
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-05-06 16:10:14
 * @Copyright: Copyright (c) 2019 Hand
 */

import { getResponse } from 'utils/utils';
import {
  fetchCardData,
  fetchGetMaterial,
  fetchTrend,
} from '@/services/hqms/acceptedTestedBoardService';

export default {
  namespace: 'acceptedTestedBoard',
  state: {
    boarCardList: [],
    materialList: [],
    trendList: {},
    number: 0,
    totalPages: 0,
    totalElements: 0,
    numberOfElements: 0,
  },
  effects: {
    *fetchCardData({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchCardData, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            boarCardList: result.content,
            number: result.number || 0,
            totalPages: result.totalPages,
            totalElements: result.totalElements,
            numberOfElements: result.numberOfElements,
          },
        });
      }
      return result;
    },
    // 30天收货物料量
    *fetchGetMaterial({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchGetMaterial, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            materialList: result,
          },
        });
      }
      return result;
    },
    // 趋势图数据查询
    *fetchTrend({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchTrend, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            trendList: result,
          },
        });
      }
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
