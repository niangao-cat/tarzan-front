/**
 * @Author:lly
 * @email: liyuan.liu@hand-china.com
 * @description： 单据执行统计报表
 */

import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import { queryDataList, querySiteList, getSiteList } from '@/services/hwms/documentsPerformStatisticalReportService';

export default {
  namespace: 'documentsPerformStatisticalReport',
  state: {
    headList: [],
    headPagination: {},
    docTypeMap: [],
    siteMap: [], // 站点
    getSite: {}, // 用户默认站点
  },
  effects: {
    // 查询报表信息
    *queryDataList({ payload }, { call, put }) {
      // 数据查询
      const res = yield call(queryDataList, payload);
      const list = getResponse(res);
      yield put({
        type: 'updateState',
        payload: {
          headList: list.content ? list.content : [],
          headPagination: createPagination(list),
        },
      });
      return res;
    },

    // 批量查询独立值集
    *batchLovData(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          docTypeMap: 'WX.WMS.INSTRUCTION_DOC_TYPE',
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

    // 查询工厂下拉框
    *querySiteList({ payload }, { call, put }) {
      const res = getResponse(yield call(querySiteList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            siteMap: res,
          },
        });
      }
    },

    // 获取默认工厂
    *getSiteList({ payload }, { call, put }) {
      const result = getResponse(yield call(getSiteList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            getSite: result,
          },
        });
      }
      return result;
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
