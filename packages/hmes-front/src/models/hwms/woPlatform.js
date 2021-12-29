/**
 * 工单发料平台
 *@date：2019/10/29
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */

import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  queryHeadList,
  queryLineList,
  queryDocHeadList,
  queryDocLineList,
  generateData,
  queryDocLineDetailList,
  querySiteList,
} from '@/services/hwms/woPlatformService';

export default {
  namespace: 'woPlatform',
  state: {
    woStatusMap: [], // 生产订单状态
    demandStatusMap: [], // 备料状态
    docStatusMap: [], // 备料单状态
    mtLotStatusMap: [], // 条码状态
    siteMap: [], // 工厂
    headList: [], // 生产订单列表
    headPagination: {},
    lineList: [], // 生产订单需求列表
    linePagination: {},
    docList: [], // 备料单列表
    docPagination: {},
    docLineList: [], // 备料单需求列表
    docLinePagination: {},
    detailList: [], // 备料单需求明细列表
    detailPagination: {},
    selectedRows: [], // 选中的生产订单数据
    selectedRowKeys: [],
    filterValues: {}, // 生产订单查询条件
  },
  effects: {
    // 查询独立值集
    *init({ payload }, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          woStatusMap: 'Z_INSTRUCTION_DOC_STATUS',
          demandStatusMap: 'Z_DEMAND_LIST_STATUS',
          mtLotStatusMap: 'Z.MTLOT.STATUS.G',
          docStatusMap: 'Z_INSTRUCTION_DOC_STATUS',
          tenantId: payload.tenantId,
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
    *querySiteList(_, { call, put }) {
      const res = getResponse(yield call(querySiteList));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            siteMap: res.rows,
          },
        });
      }
    },
    // 查询生产订单列表
    *queryHeadList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryHeadList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            headList: res.rows.content,
            headPagination: createPagination(res.rows),
          },
        });
      }
      return res;
    },
    // 查询生产订单需求列表
    *queryLineList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryLineList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            lineList: res.rows.content,
            linePagination: createPagination(res.rows),
          },
        });
      }
      return res;
    },
    // 生成备料单
    *generateData({ payload }, { call }) {
      return getResponse(yield call(generateData, payload));
    },
    // 查询备料单列表
    *queryDocHeadList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryDocHeadList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            docList: res.rows.content,
            docPagination: createPagination(res.rows),
          },
        });
      }
      return res;
    },
    // 查询备料单需求列表
    *queryDocLineList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryDocLineList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            docLineList: res.rows.content,
            docLinePagination: createPagination(res.rows),
          },
        });
      }
      return res;
    },
    // 查询备料单需求明细列表
    *queryDocLineDetailList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryDocLineDetailList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            detailList: res.rows.content,
            detailPagination: createPagination(res.rows),
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
