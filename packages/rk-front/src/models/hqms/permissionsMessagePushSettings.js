/*
 * @Description: permissionsMessagePushSettingsService
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-26 17:02:02
 * @LastEditTime: 2021-03-19 10:14:36
 */

import { getResponse, createPagination, parseParameters } from 'utils/utils';
import {
  getSiteList,
  handleSave,
  handleHeadList,
  handleFetchWarehouseOrProLineList,
  handleHeadDetail,
  handleDelete,
} from '@/services/hqms/permissionsMessagePushSettingsService';
import { queryMapIdpValue } from 'services/api';

export default {
  namespace: 'permissionsMessagePushSettings',
  state: {
    lovData: {}, // 值集数据
    warehouseList: [],
    warehouseListPagination: {},
    prodLineList: [],
    prodLineListPagination: {},
    headDetail: {},
  },
  effects: {
    *batchLovData(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          freezePower: 'HME_FREEZE_POWER',
          flagYn: 'WMS.FLAG_YN',
          cosFreezePower: 'HME_COS_FREEZE_POWER',
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
    // 查询头数据
    *handleFetchHeadList({ payload }, { call, put }) {
      const result = getResponse(yield call(handleHeadList, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            headList: result.content,
            headListPagination: createPagination(result),
          },
        });
      }
      return result;
    },
    // 查询仓库
    *handleFetchWarehouseList({ payload }, { call, put }) {
      const result = getResponse(yield call(handleFetchWarehouseOrProLineList, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            warehouseList: result.content,
            warehouseListPagination: createPagination(result),
          },
        });
      }
      return result;
    },
    // 查询产线
    *handleFetchProdLineList({ payload }, { call, put }) {
      const result = getResponse(yield call(handleFetchWarehouseOrProLineList, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            prodLineList: result.content,
            prodLineListPagination: createPagination(result),
          },
        });
      }
      return result;
    },
    // 保存数据
    *handleSave({ payload }, { call }) {
      const result = getResponse(yield call(handleSave, payload));
      return result;
    },
    // 头明细查询
    *handleHeadDetail({ payload }, { call, put }) {
      const result = getResponse(yield call(handleHeadDetail, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            headDetail: result,
          },
        });
      }
      return result;
    },
    // 删除
    *handleDelete({ payload }, { call }) {
      const result = getResponse(yield call(handleDelete, payload));
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
