/*
 * @Description: 设备点检&保养项目维护
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-06-10 11:10:03
 */
import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  fetchData,
  saveData,
  deleteData,
  updateData,
} from '@/services/hhme/dataItemNcTypeService';

export default {
  namespace: 'dataItemNcType',
  state: {
    list: [],
    pagination: {},
  },
  effects: {
    // 批量查询独立值集
    *batchLovData(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          valueType: 'HME.TAG_VALUE_TYPE',
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
    // 获取数据
    *fetchData({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchData, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            list: res.content,
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
    // 修改数据
    *updateData({ payload }, { call }) {
      const res = getResponse(yield call(updateData, payload));
      return res;
    },
    // 删除数据
    *deleteData({ payload }, { call }) {
      const res = getResponse(yield call(deleteData, payload));
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
