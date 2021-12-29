/**
 * purchaseAcceptancePosting - 过账平台models
 * @date: 2020/02/27 19:53:47
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';

import {
  fetchList,
  handlePost,
  fetchDefaultSite,
  fetchDetail,
  fetchPoInfo,
} from '../../services/hwms/purchaseAcceptancePostingService';

export default {
  namespace: 'purchaseAcceptancePosting',
  state: {
    list: [],
    pagination: {},
    deliveryNoteStatusList: [], // 送货单状态
    lineStatusList: [], // 行状态
    versionList: [], // 版本
    factoryList: [], // 工厂
    inspectionOrderTypeList: [], // 检验单类型
    inspectionOrderStatusList: [], // 检验单状态
    siteInfo: {}, // 默认工厂
    detailList: [],
    detailListPagination: {},
  },
  effects: {
    *init(_, { call, put }) {
      const res = yield call(queryMapIdpValue, {
        deliveryNoteStatusList: 'WMS.DELIVERY_DOC.STATUS',
        versionList: 'HCM.MATERIAL_VERSION',
        inspectionOrderTypeList: 'QMS.DOC_INSPECTION_TYPE',
        inspectionOrderStatusList: 'QMS.INSPECTION_DOC_STATUS',
      });
      const siteInfo = yield call(fetchDefaultSite);
      yield put({
        type: 'updateState',
        payload: {
          ...res,
          siteInfo,
        },
      });
    },
    *fetchList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            list: res.content,
            pagination: createPagination(res),
          },
        });
      }
    },

    *fetchDetail({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchDetail, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            detailList: res.content,
            detailListPagination: createPagination(res),
          },
        });
      }
    },

    *handlePost({ payload }, { call }) {
      const res = getResponse(yield call(handlePost, payload));
      return res;
    },

    *fetchPoInfo({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchPoInfo, payload));
      if(res) {
        yield put({
          type: 'updateState',
          payload: {
            poList: res.content,
            poPagination: createPagination(res),
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
