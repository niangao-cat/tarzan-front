/**
 * abnormalReport - 异常信息查看报表models
 * @date: 2020/02/27 19:53:47
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import { isArray } from 'lodash';
import { getResponse } from 'utils/utils';
import {
  fetchSnInfo,
  create,
  save,
  revise,
  submit,
  cancel,
  fetchSendDate,
  fetchDefaultSite,
} from '../../services/hhme/afterSaleQuotationService';

export default {
  namespace: 'afterSaleQuotation',
  state: {
    baseInfo: {},
    electricLineList: [],
    hourFeeLineList: [],
    opticsLineList: [],
    deleteLineList: [],
  },
  effects: {
    *fetchSnInfo({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchSnInfo, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            baseInfo: { ...res.headData, electricNoFlag: res.electricNoFlag, materialLotId: res.materialLotId, opticsNoFlag: res.opticsNoFlag },
            electricLineList: isArray(res.electricLineList) ? res.electricLineList : [],
            hourFeeLineList: isArray(res.hourFeeLineList) ? res.hourFeeLineList : [],
            opticsLineList: isArray(res.opticsLineList) ? res.opticsLineList : [],
            deleteLineList: [],
          },
        });
      }
      return res;
    },
    *create({ payload }, { call, put }) {
      const res = getResponse(yield call(create, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            baseInfo: { ...res.headData, electricNoFlag: res.electricNoFlag, materialLotId: res.materialLotId, opticsNoFlag: res.opticsNoFlag },
            electricLineList: isArray(res.electricLineList) ? res.electricLineList : [],
            hourFeeLineList: isArray(res.hourFeeLineList) ? res.hourFeeLineList : [],
            opticsLineList: isArray(res.opticsLineList) ? res.opticsLineList : [],
          },
        });
      }
    },
    *save({ payload }, { call }) {
      const res = getResponse(yield call(save, payload));
      return res;
    },
    *cancel({ payload }, { call }) {
      const res = getResponse(yield call(cancel, payload));
      return res;
    },
    *submit({ payload }, { call }) {
      const res = getResponse(yield call(submit, payload));
      return res;
    },
    *revise({ payload }, { call }) {
      const res = getResponse(yield call(revise, payload));
      return res;
    },
    *fetchSendDate({ payload }, { call, put }) {
      const { listName, currentMaterialId, ...params } = payload;
      const res = getResponse(yield call(fetchSendDate, params));
      if (res) {
        yield put({
          type: 'updateItemListState',
          payload: {
            sendDate: res,
            listName,
            currentMaterialId,
          },
        });
      }
    },
    *fetchDefaultSite(_, { call, put }) {
      const res = getResponse(yield call(fetchDefaultSite));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            siteInfo: res,
          },
        });
      }
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
    updateItemListState(state, action) {
      const { sendDate, listName, currentMaterialId } = action.payload;
      const { [listName]: dataSource } = state;
      return {
        ...state,
        ...action.payload,
        [listName]: dataSource.map(e => e.materialId === currentMaterialId ? ({ ...e, sendDate }) : e),
      };
    },
  },
};
