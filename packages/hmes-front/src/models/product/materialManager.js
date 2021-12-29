/**
 * @date 2019-7-31
 * @author HDY <deying.huang@hand-china.com>
 */

import { getResponse, createPagination } from 'utils/utils';
import { get as chainGet } from 'lodash';
import { ergodicData } from '@/utils/utils';
import {
  fetchMaterialList,
  saveMaterial,
  checkMaterial,
  fetchSingleMaterial,
  materialSitesList,
  materialSitesDelete,
  fetchAttr,
  fetchSitesDispatch,
  deleteSitesDispatch,
} from '@/services/product/materialManagerService';
import { saveAttribute, fetchAttributeList } from '@/services/api';

export default {
  namespace: 'materialManager',
  state: {
    materialList: [],
    materialPagination: {},
    materialManagerItem: {}, // 当前编辑得数据
    materialSitesList: [],
    materialSitesPagination: {},
    attributeList: [],
    attributeTabList: [],
    materialSitesDispatchList: [],
    materialSitesDispatchPagination: {},
    isCreate: null,
  },
  effects: {
    // 获取物料数据
    *fetchMaterialList({ payload }, { call, put }) {
      const res = yield call(fetchMaterialList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            materialList: chainGet(list, 'rows.content', []),
            materialPagination: createPagination(list.rows),
          },
        });
      }
    },
    // 保存物料数据
    *saveMaterial({ payload }, { call }) {
      const result = yield call(saveMaterial, ergodicData(payload));
      return getResponse(result);
    },
    // 单条物料信息查询
    *fetchSingleMaterial({ payload }, { call, put }) {
      const res = yield call(fetchSingleMaterial, payload);
      const list = getResponse(res);
      yield put({
        type: 'updateState',
        payload: {
          materialManagerItem: chainGet(list, 'rows', {}),
          isCreate: payload.current,
        },
      });
      return list;
    },
    // 物料校验
    *checkMaterial({ payload }, { call, put }) {
      const result = yield call(checkMaterial, ergodicData(payload));
      const list = getResponse(result);
      if (list && list.rows) {
        yield put({
          type: 'updateState',
          payload: {
            materialManagerItem: chainGet(list, 'rows', {}),
          },
        });
      }
      return list;
    },

    // 物料站点查询
    *materialSitesList({ payload }, { call, put }) {
      const res = yield call(materialSitesList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            materialSitesList: chainGet(list, 'rows.content', []),
            materialSitesPagination: createPagination(list.rows),
          },
        });
      }
    },

    // 删除物料站点
    *materialSitesDelete({ payload }, { call }) {
      const result = yield call(materialSitesDelete, ergodicData(payload));
      return getResponse(result);
    },

    // 获取扩展字段数据
    *fetchAttrCreate({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchAttributeList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            attributeTabList: chainGet(res, 'rows', []),
          },
        });
        return res;
      }
    },
    *fetchAttrList({ payload }, { call, put }) {
      const res = yield call(fetchAttr, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            attributeTabList: chainGet(list, 'rows', []),
          },
        });
      }
    },
    // 获取站点扩展字段
    *fetchAttributeList({ payload }, { call, put }) {
      const res = yield call(fetchAttributeList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            attributeList: chainGet(list, 'rows', []),
          },
        });
      }
    },
    // 保存站点扩展字段
    *saveAttr({ payload }, { call }) {
      const result = yield call(saveAttribute, ergodicData(payload));
      return getResponse(result);
    },

    // 获取物料类别站点分配
    *fetchSitesDispatch({ payload }, { call, put }) {
      const res = yield call(fetchSitesDispatch, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            materialSitesDispatchList: chainGet(list, 'rows.content', []),
            materialSitesDispatchPagination: createPagination(list.rows),
          },
        });
      }
    },

    // 删除物料类别站点分配
    *deleteSitesDispatch({ payload }, { call }) {
      const result = yield call(deleteSitesDispatch, payload);
      return getResponse(result);
    },
  },

  reducers: {
    clear(state) {
      return {
        ...state,
        materialManagerItem: {}, // 当前编辑得数据
        materialSitesList: [],
        materialSitesPagination: {},
        attributeList: [],
        attributeTabList: [],
        materialSitesDispatchList: [],
        materialSitesDispatchPagination: {},
        isCreate: null,
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
