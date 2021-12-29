/**
 * @date 2019-7-29
 * @author HDY <deying.huang@hand-china.com>
 */

import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';

import {
  queryHeadData,
  queryLineData,
} from '../../services/hwms/chipPerformanceTableService';

export default {
  namespace: 'chipPerformanceTable',
  state: {
    headList: [], // 消息表格数据源
    headPagination: {},
    lineList: [],
    linePagination: {},
    lineMap: [],
    typeMap: [],
  },
  effects: {
    // 查询独立值集
    *init(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          lineMap: 'HME.COS_FUNCTION',
          typeMap: 'HME_COS_TYPE',
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
