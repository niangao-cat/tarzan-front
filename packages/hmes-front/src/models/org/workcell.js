/**
 * @date 2019-8-9
 * @author HDY <deying.huang@hand-china.com>
 */
import { get as chainget } from 'lodash';
import { getResponse, createPagination } from 'utils/utils';
import { ergodicData } from '@/utils/utils';

import {
  fetchWorkcellList,
  fetchWorkcellLineList,
  fetchSelectList,
  saveWorkcell,
} from '../../services/org/workcellService';
import { fetchAttributeList, saveAttribute } from '../../services/api';

export default {
  namespace: 'workcell',
  state: {
    workcellList: [], // 显示工作单元表格数据
    workcellPagination: {}, // 工作单元表格分页
    workcellLineList: {}, // 工作单元单行详细数据
    workcellTypeList: [], // 工作单元类型下拉框数据
    rateTypeList: [], // 数率类型下拉框数据
    displayList: {}, // 详细表单数据
    planList: {}, // 计划属性数据
    produceList: {}, // 生产属性数据
    attrList: [], // 扩展字段表格数据
    organizationUnit: {},
  },
  effects: {
    // 获取数据源列表数据
    *fetchWorkcellList({ payload }, { call, put }) {
      const res = yield call(fetchWorkcellList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            workcellList: chainget(list, 'rows.content', []),
            workcellPagination: createPagination(chainget(list, 'rows', {})),
          },
        });
      }
    },

    // 获取详细列表数据
    *fetchWorkcellLineList({ payload }, { call, put }) {
      const res = yield call(fetchWorkcellLineList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            organizationUnit: list.rows.organizationUnit,
            workcellLineList: chainget(list, 'rows', []),
            displayList: chainget(list, 'rows.workcell', {}),
            attrList: chainget(list, 'rows.workcellAttrs', []),
            planList: chainget(list, 'rows.workcellSchedule', {}),
            produceList: chainget(list, 'rows.workcellManufacturing', {}),
          },
        });
      }
    },

    // 获取数率类型下拉框数据
    *fetchRateTypeList({ payload }, { call, put }) {
      const res = yield call(fetchSelectList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            rateTypeList: chainget(list, 'rows', {}),
          },
        });
      }
    },

    // 获取工作单元类型下拉框数据
    *fetchWorkcellTypeList({ payload }, { call, put }) {
      const res = yield call(fetchSelectList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            workcellTypeList: chainget(list, 'rows', {}),
          },
        });
      }
    },

    // 获取扩展字段数据
    *fetchAttributeList({ payload }, { call, put }) {
      const res = yield call(fetchAttributeList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            attrList: chainget(list, 'rows', []),
          },
        });
      }
    },

    // 保存所有数据
    *saveWorkcell({ payload }, { call }) {
      const result = yield call(saveWorkcell, ergodicData(payload));
      return getResponse(result);
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
