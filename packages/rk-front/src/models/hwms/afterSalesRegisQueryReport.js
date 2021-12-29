/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 售后登记查询报表
 */

import { getResponse, createPagination } from 'utils/utils';
import { queryDataList } from '@/services/hwms/afterSalesRegisQueryReportService';
import { queryMapIdpValue } from 'services/api';

export default {
  namespace: 'afterSalesRegisQueryReport',
  state: {
    headList: [],
    headPagination: {},
    logisticMap: [],
    statusMap: [],
  },
  effects: {
    // 获取下拉框的值
    *init(_, { call, put }) {
      // 调用状态接口
      const result = getResponse(
        yield call(queryMapIdpValue, {
          logisticMap: 'HME.LOGISTICS',
          statusMap: 'HME.RECEIVE_STATUS',
        })
      );
      if (result) {
        // 返回成功状态赋值
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
