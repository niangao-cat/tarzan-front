/**
 * @Author:lly
 * @email: liyuan.liu@hand-china.com
 * @description： 完工及入库汇总查询报表
 */

import { getResponse, createPagination, parseParameters } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  queryDataList,
  fetchSiteList,
  fetchSite,
  exportExcel,
  fetchDivisionList,
} from '@/services/hmes/completionWarehousingSummaryQueryReportService';

export default {
  namespace: 'completionWarehousingSummaryQueryReport',
  state: {
    headList: [],
    headPagination: {},
    finishSumQty: '', // 完工汇总
    warehousingSumQty: '', // 入库汇总
    areaIdMap: [], // 制造部
    materialCategoryMap: [], // 物料分类
    column: [],
    siteList: [],
    getSite: {}, // 工厂信息
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
          finishSumQty: list.finishSumQty,
          warehousingSumQty: list.warehousingSumQty,
        },
      });
      return res;
    },

    // 批量查询独立值集
    *batchLovData(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          // areaIdMap: 'HME.AREA_CODE', // 制造部
          materialCategoryMap: 'HME.MATERIAL_SITE_ATTRIBUTE13', // 物料分类
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
    //  获取工厂
    *fetchSiteList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchSiteList, payload));
      if(res) {
        yield put({
          type: 'updateState',
          payload: {
            siteList: res,
          },
        });
      }
    },
    // 获取用户默认工厂
    *getSite({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchSite, payload));
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
    // 制造部查询
    *fetchDivisionList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchDivisionList, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            areaIdMap: result,
          },
        });
      }
      return result;
    },
    // 导出
    *exportExcel({ payload }, { call }) {
      const result = getResponse(yield call(exportExcel, payload));
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
