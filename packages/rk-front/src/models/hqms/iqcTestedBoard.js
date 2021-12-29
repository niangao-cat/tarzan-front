/*
 * @Description: 已收待上架
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-23 15:50:35
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-05-08 09:31:04
 * @Copyright: Copyright (c) 2019 Hand
 */
import { getResponse } from 'utils/utils';
import { fetchBoarCard, fetchMaterial, fetchTrend, fetchLocator, fetchbadInspect, fetchDayInspect } from '@/services/hqms/iqcTestedBoardService';

export default {
  namespace: 'iqcTestedBoard',
  state: {
    boarCardList: [],
    materialList: [],
    trendList: [],
    inspectList: [],
    badinspectList: [],
    deliveryScheduleNissanLineData: [],
    number: 0,
    totalPages: 0,
    totalElements: 0,
    numberOfElements: 0,
    currentPage: 0, // IQC检验看板当前页数
    dayInspectCurrentPage: 0, // 日检验不良信息当前页数
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
            currentPage: result.number + 1 >= result.totalPages ? 0 : payload.page + 1,
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

    // 到货仓库数据查询
    *fetchLocator({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchLocator, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            inspectList: result,
          },
        });
      }
      return result;
    },


    // 不良检验数据查询
    *fetchbadInspect({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchbadInspect, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            badinspectList: result,
          },
        });
      }
      return result;
    },



    // 日检验查询查询
    *fetchDayInspect({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchDayInspect, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            deliveryScheduleNissanLineData: result.content,
            dayInspectCurrentPage: result.number + 1 >= result.totalPages ? 0 : payload.page + 1,
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
