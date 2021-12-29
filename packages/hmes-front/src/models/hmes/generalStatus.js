/**
 * @date 2019-7-30
 * @author HDY <deying.huang@hand-china.com>
 */

import { getResponse, createPagination } from 'utils/utils';
import { ergodicData } from '@/utils/utils';
import {
  fetchStatusList,
  // fetchTableList,
  saveStatus,
  deleteStatus,
  // saveTable,
  // deleteTable,
} from '../../services/hmes/generalStatusService';

export default {
  namespace: 'generalStatus',
  state: {
    statusList: [], // 状态表格数据源
    statusPagination: {}, // 状态表格分页
    tableList: [], // 关联表数据源
    tablePagination: {}, // 关联表表格分页
  },
  effects: {
    // 获取状态表数据
    *fetchStatusList({ payload }, { call, put }) {
      const res = yield call(fetchStatusList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            statusList: list.rows.content,
            statusPagination: createPagination(list.rows),
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

    // 保存状态
    *saveStatus({ payload }, { call }) {
      const result = yield call(saveStatus, ergodicData(payload));
      return getResponse(result);
    },

    // 删除状态
    *deleteStatus({ payload }, { call }) {
      const result = yield call(deleteStatus, ergodicData(payload));
      return getResponse(result);
    },

    // 保存关联表
    // *saveTable({ payload }, { call }) {
    //   const result = yield call(saveTable, payload);
    //   return getResponse(result);
    // },

    // // 删除关联表
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
