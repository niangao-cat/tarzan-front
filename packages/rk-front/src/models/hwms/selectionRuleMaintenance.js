/**
 * @date 2019-7-29
 * @author HDY <deying.huang@hand-china.com>
 */

import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  queryHeadData,
  saveHeadData,
  deleteHeadData,
  queryLineData,
  saveLineData,
  deleteLineData,
  queryLineSecData,
  saveLineSecData,
  deleteLineSecData,
} from '../../services/hwms/selectionRuleMaintenanceService';

export default {
  namespace: 'selectionRuleMaintenance',
  state: {
    headList: [], // 消息表格数据源
    headPagination: {},
    lineList: [],
    linePagination: {},
    lineSecList: [],
    lineSecPagination: {},
    productTypeMap: [],
    collectionItemMap: [],
    countTypeMap: [],
    rangeTypeMap: [],
    cosTypeMap: [],
    powerMap: [],
  },
  effects: {
    // 查询独立值集
    *init(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          productTypeMap: 'HME_PRODUCT_TYPE',
          collectionItemMap: 'HME.COS_FUNCTION',
          countTypeMap: 'HME_COS_COUNT_TYPE',
          rangeTypeMap: 'HME_RANGE_TYPE',
          cosTypeMap: 'HME_COS_TYPE',
          powerMap: 'HME_COS_POWER',
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
    // 头信息查询
    *queryHeadData({ payload }, { call, put }) {
      const result = getResponse(yield call(queryHeadData, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            headList: result.content,
            headPagination: createPagination(result),
            lineList: [],
            linePagination: {},
          },
        });
      }
      return result;
    },
    // 保存头信息
    *saveHeadData({ payload }, { call }) {
      const result = yield call(saveHeadData, payload);
      return getResponse(result);
    },
    // 删除头信息
    *deleteHeadData({ payload }, { call }) {
      const result = yield call(deleteHeadData, payload);
      return getResponse(result);
    },
    // 行信息查询
    *queryLineData({ payload }, { call, put }) {
      const result = getResponse(yield call(queryLineData, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            lineList: result.content,
            linePagination: createPagination(result),
          },
        });
      }
      return result;
    },
    // 保存行信息
    *saveLineData({ payload }, { call }) {
      const result = yield call(saveLineData, payload);
      return getResponse(result);
    },
    // 删除行信息
    *deleteLineData({ payload }, { call }) {
      const result = yield call(deleteLineData, payload);
      return getResponse(result);
    },
    // 行信息查询
    *queryLineSecData({ payload }, { call, put }) {
      const result = getResponse(yield call(queryLineSecData, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            lineSecList: result.content,
            lineSecPagination: createPagination(result),
          },
        });
      }
      return result;
    },
    // 保存行信息
    *saveLineSecData({ payload }, { call }) {
      const result = yield call(saveLineSecData, payload);
      return getResponse(result);
    },
    // 删除行信息
    *deleteLineSecData({ payload }, { call }) {
      const result = yield call(deleteLineSecData, payload);
      return getResponse(result);
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
