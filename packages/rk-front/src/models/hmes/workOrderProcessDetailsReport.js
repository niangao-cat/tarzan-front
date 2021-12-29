/*
 * @Description: 不良处理平台
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-06-07 18:10:19
 */
import { getResponse, createPagination, parseParameters } from 'utils/utils';
import {
  fetchData,
  getSiteList,
  fetchSiteList,
} from '@/services/hmes/workOrderProcessDetailsReportService';
import { queryMapIdpValue } from 'services/api';

export default {
  namespace: 'workOrderProcessDetailsReport',
  state: {
    defaultSite: {},
    data: [],
    pagination: {},
    siteList: [],
  },
  effects: {
    // 批量查询独立值集
    *batchLovData(_, { call, put }) {
      const res = getResponse(
        yield call(queryMapIdpValue, {
          woStatus: 'MT.WO_STATUS',
          qualityStatus: 'HME.QUALITY_STATUS',
        })
      );
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            ...res,
          },
        });
      }
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
    // 主查询
    *fetchData({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchData, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            data: result.content,
            pagination: createPagination(result),
          },
        });
      }
      return result;
    },

    *fetchSiteList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchSiteList, payload));
      if(res) {
        yield put({
          type: 'updateState',
          payload: {
            siteList: res,
          },
        });
      }
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
