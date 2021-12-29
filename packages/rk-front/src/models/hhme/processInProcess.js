/*
 * @Description: 工序在制
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-03-23 11:45:56
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-07-08 20:30:38
 * @Copyright: Copyright (c) 2019 Hand
 */
import { getResponse } from 'utils/utils';
import {
  fetchProcessInProcess,
  fetchProductionLine,
  fetchWorkShop,
  getSiteList,
} from '@/services/hhme/processInProcessService';

export default {
  namespace: 'processInProcess',
  state: {
    processDataList: [], // 工序数据
    productionLineList: [], // 生产线
    workShopList: [], // 车间
    defaultSite: {},
  },
  effects: {
    *fetchProcessInProcess({ payload }, { put, call }) {
      const res = yield call(fetchProcessInProcess, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            processDataList: list,
          },
        });
      }
      return list;
    },
    *fetchProductionLine({ payload }, { put, call }) {
      const res = yield call(fetchProductionLine, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            productionLineList: list,
          },
        });
      }
      return list;
    },
    *fetchWorkShop({ payload }, { put, call }) {
      const res = yield call(fetchWorkShop, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            workShopList: list,
          },
        });
      }
      return list;
    },
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
