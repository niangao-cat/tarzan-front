/**
 * @date 2019-7-15
 * @author HDY <deying.huang@hand-china.com>
 */

import { getResponse, createPagination } from 'utils/utils';
import notification from 'utils/notification';

import {
  queryBillList,
  queryTreeData,
  fetchOrgType,
  fetchOwnerType,
  fetchHoldType,
  fetchHoldOrderType,
  getReserveTableList,
} from '../../services/inventory/queryService';

export default {
  namespace: 'query',
  state: {
    queryList: [], // 库存日记账表格数据源
    queryPagination: {}, // 库存日记账表格分页
    orgTypeList: [], // 组织类型下拉框数据
    ownerTypeList: [], // 所有者类型下拉框数据
    holdTypeList: [], // 预留类型下拉框数据
    holdOrderTypeList: [], // 预留类型指令下拉框数据
    treeJSON: [], // 左侧组织树数据
    checkedKeys: [], // 树选中id
    checkedNodesInfoList: [], // 树选中数据
    queryCriteria: {}, // 头部查询条件
    reserveDetailsInfoList: [], // 预留详情信息抽屉表格数据
    reserveDetailsPagination: [], // 预留详情信息抽屉表格分页
  },
  effects: {
    // 获取各下拉框内容
    *queryInitInfo({ payload }, { call, put }) {
      const oryType = yield call(fetchOrgType, payload);
      const ownerType = yield call(fetchOwnerType, payload);
      const holdType = yield call(fetchHoldType, payload);
      const holdOrderType = yield call(fetchHoldOrderType, payload);
      if (getResponse(oryType)) {
        yield put({
          type: 'updateState',
          payload: {
            orgTypeList: oryType.rows,
            ownerTypeList: ownerType.rows,
            holdTypeList: holdType.rows,
            holdOrderTypeList: holdOrderType.rows,
          },
        });
      }
    },

    // 获取组织树数据
    *queryTreeData({ payload }, { call, put }) {
      const res = yield call(queryTreeData, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            treeJSON: list.rows ? [list.rows] : [],
          },
        });
      }
      return list;
    },

    // 获取预留详情信息抽屉表格数据
    *getReserveTableList({ payload }, { call, put }) {
      const res = yield call(getReserveTableList, payload);
      const list = getResponse(res);
      if (list && list.success) {
        yield put({
          type: 'updateState',
          payload: {
            reserveDetailsInfoList: list.rows.content,
            reserveDetailsPagination: createPagination(list.rows),
          },
        });
      } else if (list && !list.success) {
        notification.error({ message: list.message });
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
          holdOrderTypeList: [], // 预留类型指令下拉框数据
          treeJSON: [], // 左侧组织树数据
          checkedKeys: [], // 树选中id
          checkedNodesInfoList: [], // 树选中数据
          queryCriteria: {}, // 头部查询条件
          reserveDetailsInfoList: [], // 预留详情信息抽屉表格数据
          reserveDetailsPagination: [], // 预留详情信息抽屉表格分页
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
