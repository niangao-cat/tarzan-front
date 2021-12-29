/**
 * @date 2019-8-1
 * @author TJX <jiaxu.tang@hand-china.com>
 */

import { getResponse, createPagination } from 'utils/utils';
import { ergodicData } from '@/utils/utils';
import { get as chainget } from 'lodash';
import {
  fetchProLineList,
  saveProLine,
  fetchProLineType,
  fetchRecordDetail,
  featchDispatchList,
  saveDispatchMethods,
  deleteDispatchMethods,
} from '../../services/org/prolineService';
import { fetchAttributeList, saveAttribute } from '@/services/api';

export default {
  namespace: 'proline',
  state: {
    proLineList: [], // 生产线列表
    proLinePagination: {}, // 生产线列表分页
    proLineItem: {}, // 生产线编辑
    prodLineAttrs: [], // 扩展属性
    prodLineManufacturing: {},
    prodLineSchedule: {},
    productionLine: {},
    proDispatchList: [],
    proDispatchPagination: {},
  },
  effects: {
    // 获取事件请求类型表数据
    *fetchProLineList({ payload }, { call, put }) {
      const res = yield call(fetchProLineList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            proLineList: chainget(list, 'rows.content', []),
            proLinePagination: createPagination(list.rows),
          },
        });
      }
      return list;
    },
    // 保存生产线编辑/新增
    *saveProLine({ payload }, { call }) {
      const res = yield call(saveProLine, ergodicData(payload));
      const list = getResponse(res);
      return list;
    },

    // 获取生产线类型
    *fetchProLineType({ payload }, { call }) {
      const res = yield call(fetchProLineType, payload);
      const list = getResponse(res);
      return list;
    },

    // 获取生产线单条详情
    *fetchRecordDetail({ payload }, { call, put }) {
      const res = yield call(fetchRecordDetail, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            prodLineAttrs: chainget(list, 'rows.prodLineAttrs', []),
            prodLineManufacturing: chainget(list, 'rows.prodLineManufacturing', {}) || {},
            productionLine: chainget(list, 'rows.productionLine', {}) || {},
            prodLineSchedule: chainget(list, 'rows.prodLineSchedule', {}) || {},
          },
        });
      }
    },

    // 获取指定得调度工艺
    *featchDispatchList({ payload }, { call, put }) {
      const res = yield call(featchDispatchList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            proDispatchList: chainget(list, 'rows.content', []),
            proDispatchPagination: createPagination(list.rows),
          },
        });
      }
      return list;
    },

    // 保存新增工艺
    *saveDispatchMethods({ payload }, { call }) {
      const res = yield call(saveDispatchMethods, ergodicData(payload));
      const list = getResponse(res);
      return list;
    },
    // 删除新增工艺
    *deleteDispatchMethods({ payload }, { call }) {
      const res = yield call(deleteDispatchMethods, ergodicData(payload));
      const list = getResponse(res);
      return list;
    },

    // 获取扩展字段数据
    *fetchAttributeList({ payload }, { call, put }) {
      const res = yield call(fetchAttributeList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            prodLineAttrs: chainget(list, 'rows', []),
          },
        });
      }
      return list;
    },

    // 保存扩展字段
    *saveAttribute({ payload }, { call }) {
      const result = yield call(saveAttribute, ergodicData(payload));
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
