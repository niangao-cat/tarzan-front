/*
 * @Description: 成品检验质量看板
 * @Version: 0.0.1
 * @Autor: 张晨 <chen.zhang03@hand-china.com>
 * @Date: 2021-05-17 18:10:19
 */
import { getResponse } from 'utils/utils';
import {
  queryInspectionCharts,
  querybadConditionTable,
  fetchRefreshFrequency,
} from '@/services/hmes/finishedProductInspectionBoardService';

export default {
  namespace: 'finishedProductInspectionBoard',
  state: {
    allList: [],
    list: [],
    inspectionChartsData: {},
    badConditionList: [],
    NC_ROWS_NUM: null,
    ROLLING_FREQUENCY: null,
    REFRESH_FREQUENCY: null,
  },
  effects: {
    // 查询独立值集
    *init(_, { call, put }) {
      const result = getResponse(yield call(fetchRefreshFrequency));
      if(result) {
        const { productInspectionConfig } = result;
        const NC_ROWS_NUM = Number(productInspectionConfig.find(e => e.value === 'NC_ROWS_NUM').meaning);
        const ROLLING_FREQUENCY = Number(productInspectionConfig.find(e => e.value === 'ROLLING_FREQUENCY').meaning);
        const REFRESH_FREQUENCY = Number(productInspectionConfig.find(e => e.value === 'REFRESH_FREQUENCY').meaning);
        yield put({
          type: 'updateState',
          payload: {
            NC_ROWS_NUM,
            ROLLING_FREQUENCY,
            REFRESH_FREQUENCY,
          },
        });
      }
      return result;
    },
    // 查询检验情况
    *queryInspectionCharts({ payload }, { call, put }) {
      const result = getResponse(yield call(queryInspectionCharts, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            inspectionChartsData: result,
          },
        });
      }
      return result;
    },
    // 查询不良情况说明
    *querybadConditionTable({ payload }, { call, put }) {
      const { pageSize, page } = payload;
      const result = getResponse(yield call(querybadConditionTable));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            allList: result,
            list: result.slice(page * pageSize, pageSize),
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
