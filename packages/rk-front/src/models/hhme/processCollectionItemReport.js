/*
 * @Description: 工序采集项报表
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-07-13 16:50:57
 * @LastEditTime: 2020-07-14 09:35:05
 */
import { isArray } from 'lodash';
import { getResponse, createPagination, parseParameters } from 'utils/utils';
import {
  fetchDataList,
  exportExcel,
  fetchUserDefaultSite,
  fetchDetailList,
  fetchStatusOptions,
  fetchSiteList,
} from '@/services/hhme/processCollectionItemReportService';
import { queryMapIdpValue } from 'services/api';

export default {
  namespace: 'processCollectionItemReport',
  state: {
    processCollectionItemList: [], // 选中的节
    dynamicColumns: [], // 动态列
    dynamicDataSource: [], // 动态数据
    pagination: {},
    qualityStatusList: [],
    eoStatusList: [],
    userDefaultSite: {},
    detailList: [],
    detailPagination: {},
    siteList: [],
  },
  effects: {
    *init(_, { call, put }) {
      const siteList = getResponse(yield call(fetchSiteList));
      const res = getResponse(yield call(queryMapIdpValue, {
        qualityStatusList: 'HME.QUALITY_STATUS',
        eoStatusList: 'EO_STATUS',
      }));
      const eoStatusRes = getResponse(yield call(fetchStatusOptions, {
        module: 'ORDER',
        statusGroup: 'EO_STATUS',
      }));
      yield put({
        type: 'updateState',
        payload: {...res, eoStatusList: isArray(eoStatusRes.rows) ? eoStatusRes.rows : []},
      });
      if (siteList) {
        yield put({
          type: 'updateState',
          payload: {
            siteList,
          },
        });
      }
    },
    *fetchDataList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchDataList, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            processCollectionItemList: result.page.content,
            pagination: createPagination(result.page),
          },
        });
      }
      return result;
    },

    // 导出
    *exportExcel({ payload }, { call }) {
      const result = getResponse(yield call(exportExcel, payload));
      return result;
    },

    *fetchUserDefaultSite({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchUserDefaultSite, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            userDefaultSite: res,
          },
        });
      }
      return res;
    },
    *fetchDetailList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchDetailList, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            detailList: result.content,
            detailPagination: createPagination(result),
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
