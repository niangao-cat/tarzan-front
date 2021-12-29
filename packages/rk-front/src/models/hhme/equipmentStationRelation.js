/*
 * @Description: 设备工位关系维护
 * @version: 0.0.1
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-06-08 09:34:06
 */
import { getResponse, createPagination } from 'utils/utils';
import {
  handleSearch,
  saveData,
  getSiteList,
} from '@/services/hhme/equipmentStationRelationService';

export default {
  namespace: 'equipmentStationRelation',
  state: {
    dataList: [], // 数据列表
    pagination: {},
    defaultSite: {},
  },
  effects: {
    // 查询头列表
    *handleSearch({ payload }, { call, put }) {
      const res = getResponse(yield call(handleSearch, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            dataList: res.content,
            pagination: createPagination(res),
          },
        });
      }
      return res;
    },
    // 保存数据
    *saveData({ payload }, { call }) {
      const res = getResponse(yield call(saveData, payload));
      return res;
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
