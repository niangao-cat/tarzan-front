/**
 * purchaseAcceptancePosting - 过账平台models
 * @date: 2020/02/27 19:53:47
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import { isArray, isEmpty } from 'lodash';
import uuid from 'uuid/v4';
import { getResponse, createPagination, addItemsToPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';

import {
  fetchDefaultSite,
  fetchList,
  saveDoc,
  updateDoc,
  closeStockTakeDoc,
  completeStockTakeDoc,
  releaseStockTakeDoc,
  fetchRangeList,
  deleteRangeList,
  saveRangeList,
  fetchBatchItemList,
  fetchSelectList,
  fetchBatchLocatorList,
  fetchMaterialList,
  fetchBarcodeList,
  fetchIsLeak,
} from '../../services/hwms/stockTakePlatformService';

export default {
  namespace: 'stockTakePlatform',
  state: {
    list: [],
    pagination: {},
    docStatusList: [],
    siteInfo: {},
    rangeList: [],
    rangePagination: {},
    locatorList: [],
    locatorPagination: {},
    locatorTypeList: [],
    barcodeList: [],
    barcodePagination: {},
    recordStatus: '',
  },
  effects: {
    *init(_, { call, put }) {
      const res = yield call(queryMapIdpValue, {
        docStatusList: 'WMS.STOCKTAKE_STATUS',
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

    *barCodeInit(_, { call, put }) {
      const res = yield call(queryMapIdpValue, {
        barcodeStatusList: 'MT.MTLOT.STATUS',
      });
      yield put({
        type: 'updateState',
        payload: {
          ...res,
        },
      });
    },

    *fetchLocatorTypeList(_, { call, put }) {
      const res = getResponse(yield call(fetchSelectList, {
        module: 'MODELING',
        typeGroup: 'LOCATOR_TYPE',
      }));
      if(res) {
        yield put({
          type: 'updateState',
          payload: {
            locatorTypeList: isArray(res.rows) ? res.rows.filter(e => e.typeCode !== 'PRE_LOAD') : [],
          },
        });
      }
    },

    *fetchList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchList, payload));
      if(res) {
        yield put({
          type: 'updateState',
          payload: {
            list: res.content,
            pagination: createPagination(res),
          },
        });
      }
    },

    *saveDoc({ payload }, { call }) {
      const res = getResponse(yield call(saveDoc, payload));
      return res;
    },

    *updateDoc({ payload }, { call }) {
      const res = getResponse(yield call(updateDoc, payload));
      return res;
    },

    *closeStockTakeDoc({ payload }, { call }) {
      const res = yield call(closeStockTakeDoc, payload);
      return res;
    },

    *fetchIsLeak({ payload }, { call }) {
      const res = yield call(fetchIsLeak, payload);
      return res;
    },

    *completeStockTakeDoc({ payload }, { call }) {
      const res = yield call(completeStockTakeDoc, payload);
      return res;
    },
    *releaseStockTakeDoc({ payload }, { call }) {
      const res = yield call(releaseStockTakeDoc, payload);
      return res;
    },

    *fetchRangeList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchRangeList, payload));
      if(res) {
        const rangeList = res.content.map(e => ({...e, id: uuid()}));
        yield put({
          type: 'updateState',
          payload: {
            rangeList,
            rangePagination: createPagination(res),
          },
        });
      }
    },

    *deleteRangeList({ payload }, { call }) {
      const res = getResponse(yield call(deleteRangeList, payload));
      return res;
    },

    *saveRangeList({ payload }, { call }) {
      const res = getResponse(yield call(saveRangeList, payload));
      return res;
    },

    *fetchBatchItemList({ payload }, { call, put }) {
      const { rangeList, rangePagination, ...params } = payload;
      const res = getResponse(yield call(fetchBatchItemList, params));
      if(res && !isEmpty(res)) {
        const newList = isArray(res) ? res.map(e => ({
          ...e,
          _status: 'create',
          id: uuid(),
          rangeObjectId: e.materialId,
          rangeObjectCode: e.materialCode,
          rangeObjectName: e.materialName,
        })).concat(rangeList) : rangeList;
        yield put({
          type: 'updateState',
          payload: {
            rangeList: newList,
            rangePagination: addItemsToPagination(newList.length - rangeList.length, rangeList.length, rangePagination),
          },
        });
      }
    },
    *fetchBatchLocatorList({ payload }, { call, put }) {
      const { rangeList, rangePagination, ...params } = payload;
      const res = getResponse(yield call(fetchBatchLocatorList, params));
      if(res && !isEmpty(res)) {
        const newList = isArray(res) ? res.map(e => ({
          ...e,
          _status: 'create',
          id: uuid(),
          rangeObjectId: e.locatorId,
          rangeObjectCode: e.locatorCode,
          rangeObjectName: e.locatorName,
        })).concat(rangeList) : rangeList;
        yield put({
          type: 'updateState',
          payload: {
            rangeList: newList,
            rangePagination: addItemsToPagination(newList.length - rangeList.length, rangeList.length, rangePagination),
          },
        });
      }
    },

    *fetchMaterialList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchMaterialList, payload));
      if(res) {
        yield put({
          type: 'updateState',
          payload: {
            barcodeList: res.content,
            barcodePagination: createPagination(res),
          },
        });
      }
    },

    *fetchBarcodeList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchBarcodeList, payload));
      if(res) {
        yield put({
          type: 'updateState',
          payload: {
            barcodeList: res.content,
            barcodePagination: createPagination(res),
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
