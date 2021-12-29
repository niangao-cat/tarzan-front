/*
 * @Description: 销售发货平台
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-12-09 10:20:37
 * @LastEditTime: 2020-12-14 21:35:47
 */

import { getResponse, createPagination, parseParameters } from 'utils/utils';
import {
  fetchHeadData,
  fetchLineData,
  fetchDetail,
  getSiteList,
  saveData,
  handleHeadCancel,
  handleCancelRelease,
  handleRelease,
  handleLineCancle,
  getConfigInfo,
  getConfigInfoValue,
  fetchPost,
  fetchDeleteDetail,
} from '@/services/hwms/soDeliveryPlatformService';
import { queryMapIdpValue } from 'services/api';

export default {
  namespace: 'soDeliveryPlatform',
  state: {
    statusMap: [],
    headList: [],
    headPagination: {},
    lineList: [],
    linePagination: {},
    detailList: [],
    detailPagination: {},
    pagination: {}, // 分页数据
    sampleCodeList: [],
    lovData: {}, // 值集数据
  },
  effects: {
    // 查询独立值集
    *init({ payload }, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          statusMap: 'WX.WMS.SO_DELIVERY_STATUS',
          lotStatus: 'WMS.MTLOT.STATUS',
          qualityStatus: 'WMS.MTLOT.QUALITY_STATUS',
          tenantId: payload.tenantId,
          typeMap: 'WX.WMS.SO_DOC_TYPE',
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
    *fetchHeadData({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchHeadData, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            headList: result.content,
            headPagination: createPagination(result),
          },
        });
      }
      return result;
    },
    *fetchLineData({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchLineData, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            lineList: result.content,
            linePagination: createPagination(result),
          },
        });
      }
      return result;
    },
    *fetchDetail({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchDetail, parseParameters(payload)));
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
    *saveData({ payload }, { call }) {
      const result = getResponse(yield call(saveData, payload));
      return result;
    },
    *handleHeadCancel({ payload }, { call }) {
      const result = getResponse(yield call(handleHeadCancel, payload));
      return result;
    },
    *handleCancelRelease({ payload }, { call }) {
      const result = getResponse(yield call(handleCancelRelease, payload));
      return result;
    },
    *handleRelease({ payload }, { call }) {
      const result = getResponse(yield call(handleRelease, payload));
      return result;
    },
    *handleLineCancle({ payload }, { call }) {
      const result = getResponse(yield call(handleLineCancle, payload));
      return result;
    },
    *getConfigInfo({ payload }, { call }) {
      const result = getResponse(yield call(getConfigInfo, parseParameters(payload)));
      return result;
    },
    *fetchPost({ payload }, { call }) {
      const result = getResponse(yield call(fetchPost, payload));
      return result;
    },
    *fetchDeleteDetail({ payload }, { call }) {
      const result = getResponse(yield call(fetchDeleteDetail, payload));
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
