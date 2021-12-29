/*
 * @Description: 已收待上架
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-23 15:50:35
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-04-28 20:36:15
 * @Copyright: Copyright (c) 2019 Hand
 */

import { getResponse } from 'utils/utils';
import { fetchBoarCard, fetchMaterial, fetchTrend } from '@/services/hwms/acceptedPutedService';

export default {
  namespace: 'acceptedPutedNew',
  state: {
    boarCardList: [],
    materialList: [],
    trendList: [],
    number: 0,
    totalPages: 0,
    totalElements: 0,
    numberOfElements: 0,
  },
  effects: {
    // 任务区域数据查询
    *fetchBoarCard({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchBoarCard, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            boarCardList: result.content,
            number: result.number,
            totalPages: result.totalPages,
            totalElements: result.totalElements,
            numberOfElements: result.numberOfElements,
          },
        });
      }
      return result;
    },
    // 30天物料上架图
    *fetchMaterial({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchMaterial, payload));
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
