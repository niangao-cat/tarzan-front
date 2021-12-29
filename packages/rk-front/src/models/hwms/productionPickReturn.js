/**
 * @Description: 生产领退料平台
 * @author: lly
 * @date 2021/07/05 10:53
 * @version 1.0
 */
import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  fetchHeaderList,
  fetchLineList,
  fetchDetailList,
  querySiteList,
  getSiteList,
} from '@/services/hwms/productionPickReturnService';

export default {
  namespace: 'productionPickReturn',
  state: {
    headList: [], // 头信息
    headListPagination: {}, // 头分页
    lineList: [], // 行信息
    lineListPagination: {}, // 行分页
    detailList: [], // 明细
    detailListPagination: {}, // 明细分页
    siteMap: [], // 站点
    getSite: {}, // 用户默认站点
    statusMap: [], // 单据状态
    departmentMap: [],
    typeMap: [], // 单据类型
  },
  effects: {
    // 初始化 状态下拉框
    *init(_, { call, put }) {
      const res = yield call(queryMapIdpValue, {
        // statusMap: 'WMS.COST_CENTER_DOCUMENT.STATUS',
        statusMap: 'WX.WMS_C/R_DOC_STATUS',
        typeMap: 'WX.WMS.WO_IO_DM_TYPE',
        departmentMap: 'WX.WMS.DEPARTMENT',
      });
      yield put({
        type: 'updateState',
        payload: {
          ...res,
        },
      });
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

    // 查询头信息
    *fetchHeaderList({ payload }, { call, put }) {
      const res = yield call(fetchHeaderList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            headList: list.content,
            headListPagination: createPagination(list),
          },
        });
      }
      return res;
    },

    // 查询行信息
    *fetchLineList({ payload }, { call, put }) {
      const res = yield call(fetchLineList, payload);
      const list = getResponse(res);
      // 成功时，更改状态
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            lineList: list.content,
            lineListPagination: createPagination(list),
          },
        });
      }
      return res;
    },

    // 查询明细信息
    *fetchDetailList({ payload }, { call, put }) {
      const res = yield call(fetchDetailList, payload);
      const list = getResponse(res);
      // 成功时，更改状态
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            detailList: list.content,
            detailListPagination: createPagination(list),
          },
        });
      }
      return res;
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
