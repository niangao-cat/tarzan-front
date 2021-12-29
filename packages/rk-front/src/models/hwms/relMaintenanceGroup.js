/**
 * author: ywj
 * des:质检员与物料组关系维护
 */
import { createPagination, getResponse } from 'utils/utils';
import {
  queryList,
  updateData,
} from '@/services/hwms/relMaintenanceGroupService';
import { queryMapIdpValue } from '../../services/api';

export default {
  namespace: 'relMaintenanceGroup',
  state: {
    dataList: [], // 列表
    pagination: {}, // 分页器
    typeMap: [],
    flagMap: [],
  },
  effects: {
     // 查询下拉框数据
     *init(_, { call, put }) {
      const result = yield call(queryMapIdpValue, {
        typeMap: 'QMS.INSPECT_POWER_TYPE',
        flagMap: 'WMS.FLAG_YN',
      });
      yield put({
        type: 'updateState',
        payload: {
         ...result,
        },
      });
    },

    // 列表查询
    *queryList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            dataList: result.content,
            pagination: createPagination(result),
          },
        });
      }
      return result;
    },
    // 修改/新增条码
    *updateData({ payload }, { call }) {
      const result = yield call(updateData, payload);
      return getResponse(result);
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
