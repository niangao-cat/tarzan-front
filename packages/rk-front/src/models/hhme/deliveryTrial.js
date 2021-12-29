/*
 * @Description: 交期试算
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-28 09:13:38
 * @LastEditTime: 2020-09-10 11:45:02
 */

import { getResponse } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  getSiteList,
  fetchWo,
  changeDate,
} from '@/services/hhme/deliveryTrialService';

export default {
  namespace: 'deliveryTrial',
  state: {
    defaultSite: {},
    dynamicColumns: [],
    footerColumns: [],
    dynamicDataSource: [],
    foterDataSource: [],
  },
  effects: {
    // 批量查询独立值集
    *batchLovData(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          woType: 'MT.WO_TYPE', // 容器类型
        })
      );
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            lovData: {
              ...result,
            },
          },
        });
      }
    },
    // 获取默认工厂
    *getSiteList({ payload }, { call, put }) {
      const res = getResponse(yield call(getSiteList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            defaultSite: res,
          },
        });
      }
      return res;
    },
    // 查询工单
    *fetchWo({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchWo, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            woList: res,
          },
        });
      }
      return res;
    },
    *changeDate({ payload }, { call }) {
      const res = getResponse(yield call(changeDate, payload));
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
