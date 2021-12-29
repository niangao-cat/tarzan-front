/**
 * @date 2019-7-31
 * @author HDY <deying.huang@hand-china.com>
 */
import { get as chainget } from 'lodash';
import { getResponse, createPagination } from 'utils/utils';
import { ergodicData } from '@/utils/utils';

import {
  fetchMaterialCategorySetList,
  saveMaterialCategorySet,
} from '../../services/product/materialCategorySetService';
import { fetchAttributeList, saveAttribute } from '../../services/api';

export default {
  namespace: 'materialCategorySet',
  state: {
    materialCategorySetList: [], // 物料类别集数据源
    materialCategorySetPagination: {}, // 物料类别集格分页
    attributeList: [], // 扩展字段表格数据源
  },
  effects: {
    // 获取物料类别集数据
    *fetchMaterialCategorySetList({ payload }, { call, put }) {
      const res = yield call(fetchMaterialCategorySetList, payload);
      const list = getResponse(res);
      if (list && list.success) {
        yield put({
          type: 'updateState',
          payload: {
            materialCategorySetList: chainget(list, 'rows.content', []),
            materialCategorySetPagination: createPagination(list.rows),
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

    // 保存物料类别集
    *saveMaterialCategorySet({ payload }, { call }) {
      const result = yield call(saveMaterialCategorySet, ergodicData(payload));
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
