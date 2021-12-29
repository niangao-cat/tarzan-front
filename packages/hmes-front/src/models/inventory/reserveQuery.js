/**
 * @date 2019-7-15
 * @author HDY <deying.huang@hand-china.com>
 */

import { getResponse, createPagination } from 'utils/utils';
import notification from 'utils/notification';

import {
  queryBillList,
  fetchOrgType,
  fetchOwnerType,
  fetchHoldrType,
  fetchHoldOrderType,
} from '../../services/inventory/reserveQueryService';

export default {
  namespace: 'reserveQuery',
  state: {
    queryList: [], // 库存日记账表格数据源
    queryPagination: {}, // 库存日记账表格分页
    orgTypeList: [], // 组织类型下拉框数据
    ownerTypeList: [], // 所有者类型下拉框数据
    holdTypeList: [], // 预留类型下拉框数据
    holdOrderTypeList: [], //  预留指令类型下拉框数据
  },
  effects: {
    *queryInitInfo({ payload }, { call, put }) {
      const orgType = yield call(fetchOrgType, payload);
      const ownerType = yield call(fetchOwnerType, payload);
      const orderType = yield call(fetchHoldrType, payload);
      const holdOrderType = yield call(fetchHoldOrderType, payload);
      if (getResponse(orgType) && getResponse(ownerType)) {
        yield put({
          type: 'updateState',
          payload: {
            orgTypeList: orgType.rows,
            ownerTypeList: ownerType.rows,
            holdTypeList: orderType.rows,
            holdOrderTypeList: holdOrderType.rows,
          },
        });
      }
    },

    // 获取数据源列表数据
    *queryBillList({ payload }, { call, put }) {
      const res = yield call(queryBillList, payload);
      const list = getResponse(res);
      if (list && list.success) {
        yield put({
          type: 'updateState',
          payload: {
            queryList: list.rows.content,
            queryPagination: createPagination(list.rows),
          },
        });
      } else if (list && !list.success) {
        notification.error({ message: list.message });
      }
    },

    // 页面关闭时清空model
    *cleanModel(_, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          queryList: [], // 库存日记账表格数据源
          queryPagination: {}, // 库存日记账表格分页
          orgTypeList: [], // 组织类型下拉框数据
          ownerTypeList: [], // 所有者类型下拉框数据
          holdTypeList: [], // 预留类型下拉框数据
          holdOrderTypeList: [], //  预留指令类型下拉框数据
        },
      });
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
