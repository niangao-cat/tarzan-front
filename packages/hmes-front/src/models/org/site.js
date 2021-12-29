/**
 * @date 2019-8-7
 * @author HDY <deying.huang@hand-china.com>
 */
import { get as chainget } from 'lodash';
import { getResponse, createPagination } from 'utils/utils';
import { ergodicData } from '@/utils/utils';

import {
  fetchSiteList,
  fetchSelectList,
  fetchSiteLineList,
  saveSite,
} from '../../services/org/siteService';
import { fetchAttributeList } from '../../services/api';

export default {
  namespace: 'site',
  state: {
    siteList: [], // 显示站点表格数据
    sitePagination: {}, // 站点表格分页
    displayList: {}, // 单行详细数据表单
    siteTypeList: [], // 站点类型下拉框数据
    attritionCalculateStrategyList: [], // 损耗计算策略下拉框数据
    planList: {}, // 计划属性数据
    produceList: {}, // 生产属性数据
    attrList: [], // 扩展字段数据
  },
  effects: {
    // 获取数据源列表数据
    *fetchSiteList({ payload }, { call, put }) {
      const res = yield call(fetchSiteList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            siteList: chainget(list, 'rows.content', []),
            sitePagination: createPagination(list.rows),
          },
        });
      }
    },

    // 获取单行详细数据源列表数据
    *fetchSiteLineList({ payload }, { call, put }) {
      const res = yield call(fetchSiteLineList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            planList: chainget(list, 'rows.siteSchedule', {}),
            produceList: chainget(list, 'rows.siteManufacturing', {}),
            displayList: chainget(list, 'rows.site', {}),
            attrList: chainget(list, 'rows.siteAttrs', []),
          },
        });
      }
    },

    // 获取站点类型下拉框数据
    *fetchSiteTypeList({ payload }, { call, put }) {
      const res = yield call(fetchSelectList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            siteTypeList: chainget(list, 'rows', {}),
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
    *saveSite({ payload }, { call }) {
      const result = yield call(saveSite, ergodicData(payload));
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
