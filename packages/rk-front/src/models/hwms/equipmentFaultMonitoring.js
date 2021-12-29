/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 设备故障监控
 */

import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import { queryDataList } from '@/services/hwms/equipmentFaultMonitoringService';

export default {
  namespace: 'equipmentFaultMonitoring',
  state: {
    headList: [],
    headPagination: {},
    abnormalStateMap: [],
  },
  effects: {
    *batchLovData(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          abnormalStateMap: 'HME.EQUIPMENT_EXC',
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
    // 查询报表信息
    *queryDataList({ payload }, { call, put }) {
        // 数据查询
        const res = yield call(queryDataList, payload);
        const list = getResponse(res);
        // 成功时，更改状态
        if (list) {
          yield put({
            type: 'updateState',
            payload: {
              headList: list.content,
              headPagination: createPagination(list),
            },
          });
        }
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
