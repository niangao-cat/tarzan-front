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
  saveHeadList,
  updateHeadList,
  fetchBatchMaterialList,
  fetchBatchProdLineList,
  fetchBatchWorkcellList,
  deleteRangeList,
  saveRangeList,
  closeValidate,
  close,
  completeValidate,
  complete,
  release,
  fetchRangeList,
  fetchInventoryDetail,
  fetchInventorySummaryList,
  fetchMaterialList,
} from '../../services/hhme/inventoryPlatformService';

export default {
  namespace: 'inventoryPlatform',
  state: {
    list: [],
    pagination: {},
    rangeList: [],
    rangePagination: {},
    detailList: [],
    detailPagination: {},
    inventorySummaryList: [],
    inventorySummaryPagination: {},
    materialList: [],
    materialPagination: {},
  },
  effects: {
    *init(_, { call, put }) {
      const res = yield call(queryMapIdpValue, {
        statusCodeList: 'WMS.STOCKTAKE_STATUS',
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

    *saveHeadList({ payload }, { call }) {
      const res = getResponse(yield call(saveHeadList, payload));
      return res;
    },

    *updateHeadList({ payload }, { call }) {
      const res = getResponse(yield call(updateHeadList, payload));
      return res;
    },

    *fetchBatchMaterialList({ payload }, { call, put }) {
      const { rangeList, rangePagination, ...params } = payload;
      const res = getResponse(yield call(fetchBatchMaterialList, params ));
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

    *fetchBatchProdLineList({ payload }, { call, put }) {
      const { rangeList, rangePagination, ...params } = payload;
      const res = getResponse(yield call(fetchBatchProdLineList, params ));
      if(res && !isEmpty(res)) {
        const newList = isArray(res) ? res.map(e => ({
          ...e,
          _status: 'create',
          id: uuid(),
          rangeObjectId: e.prodLineId,
          rangeObjectCode: e.prodLineCode,
          rangeObjectName: e.prodLineName,
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

    *fetchBatchWorkcellList({ payload }, { call, put }) {
      const { rangeList, rangePagination, ...params } = payload;
      const res = getResponse(yield call(fetchBatchWorkcellList, params ));
      if(res && !isEmpty(res)) {
        const newList = isArray(res) ? res.map(e => ({
          ...e,
          _status: 'create',
          id: uuid(),
          rangeObjectId: e.workcellId,
          rangeObjectCode: e.workcellCode,
          rangeObjectName: e.workcellName,
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

    *closeValidate({ payload }, { call }) {
      const res = getResponse(yield call(closeValidate, payload));
      return res;
    },

    *close({ payload }, { call }) {
      const res = getResponse(yield call(close, payload));
      return res;
    },

    *completeValidate({ payload }, { call }) {
      const res = getResponse(yield call(completeValidate, payload));
      return res;
    },

    *complete({ payload }, { call }) {
      const res = getResponse(yield call(complete, payload));
      return res;
    },

    *release({ payload }, { call }) {
      const res = getResponse(yield call(release, payload));
      return res;
    },
    *fetchInventoryDetail({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchInventoryDetail, payload));
      if(res) {
        yield put({
          type: 'updateState',
          payload: {
            detailList: res.content,
            detailPagination: createPagination(res),
          },
        });
      }
    },
    *fetchInventorySummaryList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchInventorySummaryList, payload));
      if(res) {
        yield put({
          type: 'updateState',
          payload: {
            inventorySummaryList: res.content,
            inventorySummaryPagination: createPagination(res),
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
            materialList: res.content,
            materialPagination: createPagination(res),
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
