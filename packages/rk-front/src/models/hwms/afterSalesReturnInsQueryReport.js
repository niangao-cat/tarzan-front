/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 售后退库检测查询报表
 */

import { getResponse, createPagination } from 'utils/utils';
import { queryDataList, fetchSiteList, fetchDefaultSite } from '@/services/hwms/afterSalesReturnInsQueryReportService';
import { queryMapIdpValue } from 'services/api';

export default {
  namespace: 'afterSalesReturnInsQueryReport',
  state: {
    headList: [],
    headPagination: {},
    logisticMap: [],
    statusMap: [],
    siteList: [],
    siteId: '',
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

    // 获取站点分配数据
    *fetchSiteList({ payload }, { call, put }) {
      const res = yield call(fetchSiteList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            siteList: list,
          },
        });
      }
    },

    *fetchDefaultSite(_, { call, put }) {
      const res = getResponse(yield call(fetchDefaultSite));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            siteId: res.siteId,
          },
        });
        return res;
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
