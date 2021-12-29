/**
 * author: ywj
 * des:设备盘点平台
 */
import { createPagination, getResponse } from 'utils/utils';
import {
  queryList,
  updateData,
  checkComplete,
  setComplete,
  setCancel,
  setComcat,
  queryLineList,
  updateLineData,
} from '@/services/hwms/equipmentInventoryPlatformService';
import { queryMapIdpValue } from '../../services/api';

export default {
  namespace: 'equipmentInventoryPlatform',
  state: {
    dataList: [], // 列表
    pagination: {}, // 分页器
    statusMap: [],
    typeMap: [],
    flagMap: [],
    ledgerType: [],
    dataLineList: [], // 列表
    linePagination: {}, // 分页器
  },
  effects: {
     // 查询下拉框数据
     *init(_, { call, put }) {
      const result = yield call(queryMapIdpValue, {
        statusMap: 'HME_STOCKTAKE_STATUS',
        typeMap: 'HME_STOCKTAKE_TYPE',
        flagMap: 'WMS.FLAG_YN',
        ledgerType: 'HME.LEDGER_TYPE',
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
    // 更新状态
    *updateLineData({ payload }, { call }) {
      const result = yield call(updateLineData, payload);
      return getResponse(result);
    },
    // 列表历史查询
    *queryLineList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryLineList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            dataLineList: result.content,
            linePagination: createPagination(result),
          },
        });
      }
      return result;
    },
    // 完成确认
    *checkComplete({ payload }, { call }) {
      const result = yield call(checkComplete, payload);
      return getResponse(result);
    },
    // 完成确认
    *setComplete({ payload }, { call }) {
      const result = yield call(setComplete, payload);
      return getResponse(result);
    },
    // 取消确认
    *setCancel({ payload }, { call }) {
      const result = yield call(setCancel, payload);
      return getResponse(result);
    },
    // 合并
    *setComcat({ payload }, { call }) {
      const result = yield call(setComcat, payload);
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
