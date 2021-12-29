/**
 * 待报废报表
 *@date：2019/10/18
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */

import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  queryList,
  submitApprove,
  queryWarehouseList,
  queryDefaultSite,
  querySiteList,
} from '@/services/hwms/scrapReportService';

export default {
  namespace: 'scrapReport',
  state: {
    statusMap: [], // 单据状态
    siteMap: [], // 工厂
    warehouseMap: [], // 仓库
    applyMap: [], // 是否已申请
    headList: [], // table数据源
    headPagination: {}, // table分页器
    defaultSite: {}, // 工厂默认值
  },
  effects: {
    // 查询独立值集
    *init({ payload }, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          statusMap: 'Z_INSTRUCTION_DOC_STATUS',
          applyMap: 'HPFM.FLAG',
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
    // 查询仓库下拉框
    *queryWarehouseList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryWarehouseList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            warehouseMap: res.rows,
          },
        });
      }
    },
    // 查询列表
    *queryList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryList, payload));
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
    // 提交审批
    *submitApprove({ payload }, { call }) {
      return getResponse(yield call(submitApprove, payload));
    },
    // 查询默认的工厂
    *queryDefaultSite(_, { call, put }) {
      const res = getResponse(yield call(queryDefaultSite));
      if (res.rows) {
        yield put({
          type: 'updateState',
          payload: {
            defaultSite: res.rows,
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
