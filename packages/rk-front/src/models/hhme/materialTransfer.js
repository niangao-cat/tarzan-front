/*
 * @Description: 物料转移
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-03-16 14:40:43
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-10-23 11:10:38
 * @Copyright: Copyright (c) 2019 Hand
 */
import { isEmpty } from 'lodash';
import { getResponse } from 'utils/utils';
import {
  getMaterialData,
  getMaterialTransfers,
  onSubmit,
  printingBarcode,
  sacnTargetCode,
} from '@/services/hhme/materialTransferService';

export default {
  namespace: 'materialTransfer',
  state: {
    materialsInfo: {},
    barCodeList: [],
    materialTransfers: {},
    materialTransfersList: [],
    formCardList: [],
  },
  effects: {
    *getMaterialData({ payload }, { call, put }) {
      const result = getResponse(yield call(getMaterialData, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            materialsInfo: result.rows,
          },
        });
      }
      return result;
    },
    *getMaterialTransfers({ payload }, { call, put }) {
      const result = getResponse(yield call(getMaterialTransfers, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            materialTransfers: result.rows,
          },
        });
      }
      return result;
    },
    *onSubmit({ payload }, { call, put }) {
      const result = getResponse(yield call(onSubmit, payload));
      if (result) {
        const { dtoList } = result;
        yield put({
          type: 'updateState',
          payload: {
            materialsInfo: result,
            barCodeList: isEmpty(dtoList) ? [] : dtoList,
          },
        });
      }
      return result;
    },
    *printingBarcode({ payload }, { call }) {
      const result = getResponse(yield call(printingBarcode, payload));
      return result;
    },
    *sacnTargetCode({ payload }, { call }) {
      const result = getResponse(yield call(sacnTargetCode, payload));
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
