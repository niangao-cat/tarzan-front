/**
 * workOrder - 工单派工平台
 * @date: 2020/02/27 19:53:47
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

// import { isNull, isEmpty } from 'lodash';
// import moment from 'moment';
import { getResponse, createPagination } from 'utils/utils';
import notification from 'utils/notification';
// import isArray from 'lodash/isArray';
import {
  fetchWorkCellInfo,
  fetchDefaultSite,
  fetchRuleList,
  scanBarcode,
  filterConfirm,
  fetchRecallBarcode,
  recall,
  filterPump,
  fetchBarcodeByLot,
  fetchSetNumInfoByLot,
} from '@/services/hhme/pumpFilterService';

export default {
  namespace: 'pumpFilter',
  state: {
    ruleList: [],
    rulePagination: {},
    barcodeList: [],
    recallBarcodePagination: {},
    recallBarcodeList: [],
    workCellInfo: {},
    siteInfo: {},
    barcodeInfo: {
      containerQty: 0,
      pumpQty: 0,
    },
  },
  effects: {
    *fetchDefaultSite(_, { call, put }) {
      const res = getResponse(yield call(fetchDefaultSite));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            siteInfo: res,
          },
        });
        return res;
      }
    },
    *fetchWorkCellInfo({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchWorkCellInfo, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            workCellInfo: res,
          },
        });
      }
      return res;
    },
    *fetchRuleList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchRuleList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            ruleList: res,
          },
        });
      }
    },
    *scanBarcode({ payload }, { call, put }) {
      const res = getResponse(yield call(scanBarcode, payload));
      if (res) {
        const { pumpMaterialLotInfoList, containerQty, pumpQty, ...barcodeInfo } = res;
        yield put({
          type: 'updateBarcodeList',
          payload: {
            pumpMaterialLotInfoList,
            barcodeInfo: {
              ...barcodeInfo,
              containerQty: containerQty || 0,
              pumpQty: pumpQty || 0,
            },
          },
        });
      }
      return res;
    },
    *filterConfirm({ payload }, { call, put }) {
      const res = getResponse(yield call(filterConfirm, payload));
      if (res) {
        const { materialLotCodeList } = payload;
        yield put({
          type: 'filterConfirmUpdateState',
          payload: {
            materialLotCodeList,
          },
        });
      }
      return res;
    },
    *fetchRecallBarcode({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchRecallBarcode, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            recallBarcodeList: res.content,
            recallBarcodePagination: createPagination(res),
          },
        });
      }
    },
    *recall({ payload }, { call }) {
      const res = getResponse(yield call(recall, payload));
      return res;
    },
    *filterPump({ payload }, { call, put }) {
      const res = getResponse(yield call(filterPump, payload));
      if (res) {
        const { pumpMaterialLotInfoList, ...info } = res;
        yield put({
          type: 'updateFilterBarcodeList',
          payload: {
            pumpMaterialLotInfoList,
            info,
          },
        });
      }
      return res;
    },
    *fetchBarcodeByLot({ payload }, { call, put }) {
      const { selectionLot, ...params } = payload;
      const res = getResponse(yield call(fetchBarcodeByLot, params));
      if (res) {
        const { pumpMaterialLotInfoList, ...info } = res;
        yield put({
          type: 'updateFilterBarcodeList',
          payload: {
            pumpMaterialLotInfoList,
            info: { ...info, selectionLot },
          },
        });
      }
      return res;
    },
    *fetchSetNumInfoByLot({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchSetNumInfoByLot, payload));
      if (res) {
        yield put({
          type: 'updateBarcodeInfo',
          payload: {
            info: res,
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
    updateBarcodeList(state, action) {
      const { barcodeList } = state;
      const { pumpMaterialLotInfoList, barcodeInfo } = action.payload;
      const barcodes = barcodeList.map(e => e.materialLotCode);
      const newPumpBarcodeList = pumpMaterialLotInfoList.filter(e => !barcodes.includes(e.materialLotCode));
      if (newPumpBarcodeList.length === 0) {
        notification.warning({ description: '当前条码已扫描，请重新更换条码扫描！' });
      }
      return {
        ...state,
        barcodeList: barcodeList.concat(newPumpBarcodeList),
        barcodeInfo,
      };
    },
    updateFilterBarcodeList(state, action) {
      const { barcodeInfo } = state;
      const { pumpMaterialLotInfoList, info: { pumpQty, containerQty, ...otherInfo } } = action.payload;
      let newBarcodeList = [];
      const resetBarcodeList = pumpMaterialLotInfoList.filter(e => e.groupNum);
      const nullBarcodeList = pumpMaterialLotInfoList.filter(e => e.groupNum === null);
      const sortBarcodeList = (resetList) => {
        if (resetList.length > 0) {
          newBarcodeList = newBarcodeList.concat(resetList.filter(e => e.groupNum === resetList[0].groupNum));
          sortBarcodeList(resetList.filter(e => e.groupNum !== resetList[0].groupNum));
        }
      };
      sortBarcodeList(resetBarcodeList);
      return {
        ...state,
        barcodeList: newBarcodeList.concat(nullBarcodeList),
        barcodeInfo: { ...barcodeInfo, ...otherInfo, pumpQty: pumpQty || 0, containerQty: containerQty || 0 },
      };
    },
    filterConfirmUpdateState(state, action) {
      const { barcodeList } = state;
      const { materialLotCodeList } = action.payload;
      return {
        ...state,
        barcodeList: barcodeList.filter(e => !materialLotCodeList.includes(e.materialLotCode)),
      };
    },
    updateBarcodeInfo(state, action) {
      const { barcodeInfo } = state;
      const { info } = action.payload;
      return {
        ...state,
        barcodeInfo: { ...barcodeInfo, ...info },
      };
    },
  },
};
