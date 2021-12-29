/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 在制查询报表
 */

import { getResponse, createPagination } from 'utils/utils';
import { queryDataList, fetchDetailList, fetchAelivery, fetchFinish, getSiteList, handleExport } from '@/services/hwms/planAchievementRateReportService';

export default {
  namespace: 'planAchievementRateReport',
  state: {
    headList: [],
    headPagination: {},
    colData: [],
    detailList: [],
    detailPagination: {},
    defaultSite: {},
    aeliveryFinishList: [],
    aeliveryFinishListPagination: {},
  },
  effects: {
    // 获取默认工厂
    *getSiteList({ payload }, { call, put }) {
      const result = getResponse(yield call(getSiteList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            defaultSite: result,
          },
        });
      }
      return result;
    },
    // 查询报表信息
    *queryDataList({ payload }, { call, put }) {
      // 先清空数据
      yield put({
        type: 'updateState',
        payload: {
          headList: [],
          colData: [],
          headPagination: {},
        },
      });
      const res = getResponse(yield call(queryDataList, payload));
      const colData = res
        ? res.length > 0
          ? res.filter(item => item.workcells.length > 0).length > 0
            ? res.filter(item => item.workcells.length > 0)[0].workcells
            : []
          : []
        : [];
      if (res) {
        for (let i = 0; i < res.length; i++) {
          if (res[i].workcells.length > 0) {
            for (let j = 0; j < res[i].workcells.length; j++) {
              res[i][
                `${res[i].workcells[j].description}`
              ] = `${res[i].workcells[j].plannedProduction}-${res[i].workcells[j].actualProduction}-
                    ${res[i].workcells[j].actualProductionRatio}-${res[i].workcells[j].plannedDelivery}-
                    ${res[i].workcells[j].actualAelivery}-${res[i].workcells[j].actualAeliveryRatio}-
                    ${res[i].workcells[j].quantityUnderProduction}-${res[i].workcells[j].inProcessStandards}-
                    ${res[i].workcells[j].percentageInProduction}`;
            }
          }
        }
        yield put({
          type: 'updateState',
          payload: {
            headList: res,
            colData,
            headPagination: createPagination(res),
          },
        });
      }
      return res;
    },

    // 查询行信息
    *fetchDetailList({ payload }, { call, put }) {
      const res = yield call(fetchDetailList, payload);
      const list = getResponse(res);
      // 成功时，更改状态
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            detailList: list.content,
            detailPagination: createPagination(list),
          },
        });
      }
    },
    *fetchAelivery({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchAelivery, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            aeliveryFinishList: result.content,
            aeliveryFinishListPagination: createPagination(result),
          },
        });
      }
      return result;
    },
    *fetchFinish({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchFinish, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            aeliveryFinishList: result.content,
            aeliveryFinishListPagination: createPagination(result),
          },
        });
      }
      return result;
    },

    *handleExport({ payload }, { call }) {
      const res = getResponse(yield call(handleExport, payload));
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
