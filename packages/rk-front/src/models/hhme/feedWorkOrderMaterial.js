/**
 * feedWorkOrderMaterial - 工序models
 * @date: 2020/10/30 19:53:47
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import { isArray } from 'lodash';
import uuid from 'uuid/v4';
import { getResponse, createPagination, getCurrentOrganizationId } from 'utils/utils';
// import { queryMapIdpValue } from 'services/api';
import {
  fetchWorkOrderInfo,
  fetchFeedingMaterialRecord,
  save,
  scanBarcode,
  returnMaterial,
} from '../../services/hhme/feedWorkOrderMaterialService';

const tenantId = getCurrentOrganizationId();


export default {
  namespace: 'feedWorkOrderMaterial',
  state: {
    baseInfo: {},
    packingList: [],
    feedingMaterialList: [],
    feedingMaterialPagination: {},
    selectedRows: [],
  },
  effects: {
    *fetchWorkOrderInfo({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchWorkOrderInfo, payload));
      if(res) {
        yield put({
          type: 'updateState',
          payload: {
            baseInfo: res,
            packingList: isArray(res.dtoList) ? res.dtoList : [],
            selectedRows: [],
          },
        });
      }
    },
    *fetchFeedingMaterialRecord({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchFeedingMaterialRecord, payload));
      if(res) {
        yield put({
          type: 'updateState',
          payload: {
            feedingMaterialList: isArray(res.content) ? res.content.map(e => ({
              ...e,
              id: uuid(),
            })) : [],
            feedingMaterialPagination: createPagination(res),
            selectedRows: [],
          },
        });
      }
    },
    *save({ payload }, { call }) {
      const res = getResponse(yield call(save, payload));
      return res;
    },
    *scanBarcode({ payload }, { call, put }) {
      const { feedingMaterialList, selectedRows, ...params } = payload;
      const res = getResponse(yield call(scanBarcode, params ));

      if(res) {
        const newMaterialList = {
          ...res,
          _status: 'create',
          tenantId,
          id: uuid(),
        };
        yield put({
          type: 'updateState',
          payload: {
            // 扫描投料条码时给一个标识，用来判断是不是需要投料的条码
            feedingMaterialList: [newMaterialList, ...feedingMaterialList],
            selectedRows: [...selectedRows, newMaterialList],
          },
        });
        return newMaterialList;
      }
    },
    *returnMaterial({ payload }, { call }) {
      const res = getResponse(yield call(returnMaterial, payload));
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
