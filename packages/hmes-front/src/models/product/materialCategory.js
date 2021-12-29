/**
 * @date 2019-8-23
 * @author dong.li <dong.li04@hand-china.com>
 */
import { get as chainget } from 'lodash';
import { getResponse, createPagination } from 'utils/utils';
import { ergodicData } from '@/utils/utils';

import {
  fetchMaterialCategoryList,
  saveMaterialCategory,
  inspectSiteDistribution,
  querySiteDistribution,
  addOrUpdateSite,
  deleteSite,
} from '../../services/product/materialCategoryService';
import { fetchAttributeList, saveAttribute } from '../../services/api';

export default {
  namespace: 'materialCategory',
  state: {
    materialCategoryList: [], // 物料类别数据源
    materialCategoryPagination: {}, // 物料类别格分页
    attributeList: [], // 扩展字段表格数据源
    siteList: [],
    sitePagination: {},
  },
  effects: {
    // 查询站点分配列表
    *querySiteDistribution({ payload }, { call, put }) {
      const res = yield call(querySiteDistribution, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            siteList: list.rows.content,
            sitePagination: createPagination(list.rows),
          },
        });
      }
    },

    // 获取物料类别数据
    *fetchMaterialCategoryList({ payload }, { call, put }) {
      const res = yield call(fetchMaterialCategoryList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            materialCategoryList: list.rows.content,
            materialCategoryPagination: createPagination(list.rows),
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
            attributeList: chainget(list, 'rows', []),
          },
        });
      }
    },

    // 保存物料类别
    *saveMaterialCategory({ payload }, { call }) {
      const result = yield call(saveMaterialCategory, ergodicData(payload));
      return getResponse(result);
    },

    // 保存扩展字段
    *saveAttribute({ payload }, { call }) {
      const result = yield call(saveAttribute, ergodicData(payload));
      return getResponse(result);
    },

    // 校验站点分配
    *inspectSiteDistribution({ payload }, { call }) {
      const result = yield call(inspectSiteDistribution, payload);
      return getResponse(result);
    },

    // 新增或者更新分配的站点
    *addOrUpdateSite({ payload }, { call }) {
      const result = yield call(addOrUpdateSite, ergodicData(payload));
      return getResponse(result);
    },

    // 新增或者更新分配的站点
    *deleteSite({ payload }, { call }) {
      const result = yield call(deleteSite, ergodicData(payload));
      return getResponse(result);
    },
  },

  reducers: {
    clearTableData() {
      return {
        materialCategoryList: [], // 物料类别数据源
        materialCategoryPagination: {}, // 物料类别格分页
      };
    },
    updateState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
