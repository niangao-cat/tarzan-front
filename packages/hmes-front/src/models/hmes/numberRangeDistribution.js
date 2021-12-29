/**
 * @date 2019-8-1
 * @author HDY <deying.huang@hand-china.com>
 */

import { getResponse, createPagination } from 'utils/utils';
import { ergodicData } from '@/utils/utils';
import {
  fetchNumberRangeDistributionList,
  fetchHistoryList,
  saveNumberRangeDistribution,
  deleteNumberRangeDistribution,
} from '../../services/hmes/numberRangeDistributionService';

export default {
  namespace: 'numberRangeDistribution',
  state: {
    numberRangeDistributionList: [], // 号码段分配表格数据源
    numberRangeDistributionPagination: {}, // 号码段分配表格分页
    historyList: [], // 修改历史数据源
    historyPagination: {}, // 修改历史表格分页
  },
  effects: {
    // 获取号码段分配表数据
    *fetchNumberRangeDistributionList({ payload }, { call, put }) {
      const res = yield call(fetchNumberRangeDistributionList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            numberRangeDistributionList: list.rows.content,
            numberRangeDistributionPagination: createPagination(list.rows),
          },
        });
      }
    },

    // 获取修改历史数据
    *fetchHistoryList({ payload }, { call, put }) {
      const res = yield call(fetchHistoryList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            historyList: list.rows.content,
            historyPagination: createPagination(list.rows),
          },
        });
      }
      return list;
    },

    // 保存号码段分配
    *saveNumberRangeDistribution({ payload }, { call }) {
      const result = yield call(saveNumberRangeDistribution, ergodicData(payload));
      return getResponse(result);
    },

    // 删除号码段分配
    *deleteNumberRangeDistribution({ payload }, { call }) {
      const result = yield call(deleteNumberRangeDistribution, ergodicData(payload));
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
