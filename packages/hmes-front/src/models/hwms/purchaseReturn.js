/**
 * 采购退货单查询
 *@date：2019/10/15
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */

import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  queryHeadList,
  queryLineList,
  queryLineDetailList,
  querySiteList,
} from '../../services/hwms/purchaseReturnService';

export default {
  namespace: 'purchaseReturn',
  state: {
    headList: [],
    headPagination: {},
    lineList: [],
    linePagination: {},
    detailList: [],
    detailPagination: {},
    statusMap: [], // 单据状态
    materialLotStatusMap: [], // 条码状态
    siteMap: [], // 工厂
  },
  effects: {
    // 查询独立值集
    *init({ payload }, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          statusMap: 'Z_INSTRUCTION_DOC_STATUS',
          materialLotStatusMap: 'MT.MTLOT.STATUS',
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
    // 查询头列表
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
    // 查询行列表
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

    // 查询行明细列表
    *queryLineDetailList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryLineDetailList, payload));
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
