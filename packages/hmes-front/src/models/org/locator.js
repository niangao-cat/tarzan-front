/**
 * @date 2019-8-16
 * @author HDY <deying.huang@hand-china.com>
 */
import { get as chainget } from 'lodash';
import { getResponse, createPagination } from 'utils/utils';
import { fetchAttributeList } from '../../services/api';
import { ergodicData } from '@/utils/utils';

import {
  fetchLocatorList,
  fetchSelectList,
  fetchLocatorLineList,
  saveLocator,
} from '../../services/org/locatorService';

export default {
  namespace: 'locator',
  state: {
    locatorList: [], // 显示库位表格数据
    locatorPagination: {}, // 库位表格分页
    displayList: {}, // 单行详细数据表单
    locatorTypeList: [], // 库位类型下拉框数据
    locatorCategoryList: [], // 库位类别下拉框数据
    attritionCalculateStrategyList: [], // 损耗计算策略下拉框数据
    planList: {}, // 计划属性数据
    attrList: [], // 扩展字段数据
  },
  effects: {
    // 获取数据源列表数据
    *fetchLocatorList({ payload }, { call, put }) {
      const res = yield call(fetchLocatorList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            locatorList: chainget(list, 'rows.content', []),
            locatorPagination: createPagination(list.rows),
          },
        });
      }
    },

    // 获取单行详细数据源列表数据
    *fetchLocatorLineList({ payload }, { call, put }) {
      const res = yield call(fetchLocatorLineList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            displayList: chainget(list, 'rows', {}),
            attrList: chainget(list, 'rows.locatorAttrList', []),
          },
        });
      }
    },

    // 获取库位类型下拉框数据
    *fetchLocatorTypeList({ payload }, { call, put }) {
      const res = yield call(fetchSelectList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            locatorTypeList: chainget(list, 'rows', {}),
          },
        });
      }
    },

    // 获取库位类型下拉框数据
    *fetchLocatorCategoryList({ payload }, { call, put }) {
      const res = yield call(fetchSelectList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            locatorCategoryList: chainget(list, 'rows', {}),
          },
        });
      }
    },

    // 获取损耗计算策略下拉框数据
    *fetchAttritionCalculateStrategyList({ payload }, { call, put }) {
      const res = yield call(fetchSelectList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            attritionCalculateStrategyList: chainget(list, 'rows', {}),
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
    *saveLocator({ payload }, { call }) {
      const result = yield call(saveLocator, ergodicData(payload));
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
