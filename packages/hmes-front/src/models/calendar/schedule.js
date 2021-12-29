/**
 * @date 2019-7-30
 * @author HDY <deying.huang@hand-china.com>
 */

import { getResponse, createPagination } from 'utils/utils';
import { get as chainGet } from 'lodash';
import { ergodicData } from '@/utils/utils';
import {
  fetchTypeList,
  // fetchTableList,
  saveType,
  // saveTable,
  // deleteTable,
} from '../../services/calendar/scheduleService';

export default {
  namespace: 'schedule',
  state: {
    typeList: [], // 类型表格数据源
    typePagination: {}, // 类型表格分页
    tableList: [], // 关联表数据源
    tablePagination: {}, // 关联表表格分页
  },
  effects: {
    // 获取类型表数据
    *fetchTypeList({ payload }, { call, put }) {
      const res = yield call(fetchTypeList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            typeList: chainGet(list, 'rows.content', []),
            typePagination: createPagination(list.rows),
          },
        });
      }
      return list;
    },

    // 获取关联表数据
    // *fetchTableList({ payload }, { call, put }) {
    //   const res = yield call(fetchTableList, payload);
    //   const list = getResponse(res);
    //   if (list) {
    //     yield put({
    //       type: 'updateState',
    //       payload: {
    //         tableList: [
    //           {
    //             genTypeId: '125.1',
    //             objectVersionNumber: null,
    //             relationTable: 'EO_ROUTER',
    //           },
    //         ],
    //         tablePagination: createPagination(list),
    //       },
    //     });
    //   }
    // },

    // 保存类型
    *saveType({ payload }, { call }) {
      const result = yield call(saveType, ergodicData(payload));
      return getResponse(result);
    },

    // 保存关联表
    // *saveTable({ payload }, { call }) {
    //   const result = yield call(saveTable, payload);
    //   return getResponse(result);
    // },

    // 删除关联表
    // *deleteTable({ payload }, { call }) {
    //   const result = yield call(deleteTable, payload);
    //   return getResponse(result);
    // },
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
