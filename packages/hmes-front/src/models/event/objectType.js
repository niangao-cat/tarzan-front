/**
 * @date 2019-8-7
 * @author HDY <deying.huang@hand-china.com>
 */

import { getResponse, createPagination } from 'utils/utils';
import { ergodicData } from '@/utils/utils';

import {
  fetchObjectTypeList,
  fetchTableList,
  fetchColumnType,
  saveObjectType,
  saveTable,
  deleteObjectType,
  deleteObjectColumn,
  queryObjectTypeSQL,
} from '../../services/event/objectTypeService';

export default {
  namespace: 'objectType',
  state: {
    objectTypeList: [], // 事件类型表格数据源
    objectTypePagination: {}, // 事件类型表格分页
    selectedRowKeys: [], // 选中的行id
    tableList: [], // 对象展示表数据源
    tablePagination: {}, // 对象展示表表格分页
    columnTypeList: [], // 展示列类型数组
  },
  effects: {
    // 获取事件类型表数据
    *fetchObjectTypeList({ payload }, { call, put }) {
      const res = yield call(fetchObjectTypeList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            objectTypeList: list.rows.content,
            objectTypePagination: createPagination(list.rows),
          },
        });
      }
    },

    // 获取展示列类型
    *fetchColumnType({ payload }, { call, put }) {
      const res = yield call(fetchColumnType, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            columnTypeList: list.rows,
          },
        });
      }
    },

    // 获取关联表数据
    *fetchTableList({ payload }, { call, put }) {
      const res = yield call(fetchTableList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            tableList: list.rows.content,
            tablePagination: createPagination(list.rows),
          },
        });
      }
    },

    // 保存事件类型
    *saveObjectType({ payload }, { call }) {
      const result = yield call(saveObjectType, ergodicData(payload));
      return getResponse(result);
    },

    // 删除对象类型
    *deleteObjectType({ payload }, { call, put }) {
      const result = yield call(deleteObjectType, ergodicData(payload));
      if (result.rows > 0) {
        const res = yield call(fetchObjectTypeList, {});
        const list = getResponse(res);
        if (list) {
          yield put({
            type: 'updateState',
            payload: {
              objectTypeList: list.rows.content,
              objectTypePagination: createPagination(list.rows),
              selectedRowKeys: [],
            },
          });
        }
      }
    },

    // 保存展示列维护
    *saveTable({ payload }, { call }) {
      const result = yield call(saveTable, ergodicData(payload));
      return getResponse(result);
    },

    // 删除展示列维护
    *deleteObjectColumn({ payload }, { call, put }) {
      const result = yield call(deleteObjectColumn, ergodicData(payload.list));
      if (result.rows > 0) {
        const res = yield call(fetchTableList, ergodicData({ objectTypeId: payload.objectTypeId }));
        const list = getResponse(res);
        if (list) {
          yield put({
            type: 'updateState',
            payload: {
              tableList: list.rows.content,
              tablePagination: createPagination(list.rows),
            },
          });
        }
      }
      return getResponse(result);
    },

    // 查询对象列表sql语句
    *queryObjectTypeSQL({ payload }, { call }) {
      const result = yield call(queryObjectTypeSQL, payload);
      return getResponse(result);
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
