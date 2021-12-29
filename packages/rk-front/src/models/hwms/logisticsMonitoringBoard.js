/*
 * @Description: 物流综合监控看板
 * @version: 0.1.0
 * @Author: yang.shuo@hand-china.com
 * @Date: 2021-05-13 09:01:34
 * @LastEditorts: yang.shuo@hand-china.com
 * @LastEditTime: 2021-05-13 10:55:35
 * @Copyright: Copyright (c) 2019 Hand
 */
import { getResponse } from 'utils/utils';

import {
  queryDailyDataQuery,
  proLineDataQuery,
  mouthDataQuery,
} from '@/services/hwms/logisticsMonitoringBoardServicejs';

export default {
  namespace: 'logisticsMonitoringBoard',
  state: {},
  effects: {
    // 查询日配送任务分布图
    *queryDailyDataQuery({ payload }, { call }) {
      const res = getResponse(yield call(queryDailyDataQuery, payload));
      if (res) {
        return res;
      }
    },
    // 日产线配送任务查询
    *proLineDataQuery({ payload }, { call }) {
      const res = getResponse(yield call(proLineDataQuery, payload));
      if (res) {
        return res;
      }
    },
    // 没月配送任务查询
    *mouthDataQuery({ payload }, { call }) {
      const res = getResponse(yield call(mouthDataQuery, payload));
      if (res) {
        return res;
      }
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
