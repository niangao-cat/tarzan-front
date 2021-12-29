/*
 * @Description: 数据看板基础数据维护功能
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-10-26 10:17:15
 * @LastEditTime: 2020-10-26 14:46:40
 */
import { getResponse, createPagination, parseParameters } from 'utils/utils';
import {
  getSiteList,
  handleSearch,
  handleSave,
  deleteData,
} from '@/services/hmes/productionBoardBaseDataService';
import { queryMapIdpValue } from 'services/api';

export default {
  namespace: 'productionBoardBaseData',
  state: {
    defaultSite: {},
    siteNameBoard: {},
    list: [],
    pagination: {},
    lovData: {},
  },
  effects: {
    *getTypeLov({ payload }, { call, put }) {
      const result = getResponse(yield call(queryMapIdpValue, { ...payload }));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            lovData: result,
          },
        });
      }
      return result;
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
    // 查询行
    *handleSearch({ payload }, { call, put }) {
      const result = getResponse(yield call(handleSearch, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            list: result.content,
            pagination: createPagination(result),
          },
        });
      }
      return result;
    },
    *handleSave({ payload }, { call }) {
      const result = getResponse(yield call(handleSave, payload));
      return result;
    },
    *deleteData({ payload }, { call }) {
      const result = getResponse(yield call(deleteData, payload));
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
