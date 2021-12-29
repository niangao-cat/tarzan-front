/**
 * @date 2019-7-31
 * @author HDY <deying.huang@hand-china.com>
 */
import { get as chainget } from 'lodash';
import { getResponse, createPagination } from 'utils/utils';
import { ergodicData } from '@/utils/utils';

import { fetchUomList, saveUom, fetchSelectList } from '../../services/product/uomService';
import { fetchAttributeList, saveAttribute } from '../../services/api';

export default {
  namespace: 'uom',
  state: {
    uomList: [], // 单位数据源
    uomPagination: {}, // 单位格分页
    attributeList: [], // 扩展字段表格数据源
    uomTypeList: [], // 单位类型下拉框数据
    processModeList: [], // 尾数处理模式下拉框数据
  },
  effects: {
    // 获取单位数据
    *fetchUomList({ payload }, { call, put }) {
      const res = yield call(fetchUomList, payload);
      const list = getResponse(res);
      if (list && res.success) {
        yield put({
          type: 'updateState',
          payload: {
            uomList: chainget(list, 'rows.content', []),
            uomPagination: createPagination(list.rows),
          },
        });
      }
    },

    // 获取单位类型下拉框数据
    *fetchUomTypeList({ payload }, { call, put }) {
      const res = yield call(fetchSelectList, payload);
      const list = getResponse(res);
      if (list && res.success) {
        yield put({
          type: 'updateState',
          payload: {
            uomTypeList: chainget(list, 'rows', []),
          },
        });
      }
    },

    // 获取尾数处理模式下拉框数据
    *fetchProcessModeList({ payload }, { call, put }) {
      const res = yield call(fetchSelectList, payload);
      const list = getResponse(res);
      if (list && res.success) {
        yield put({
          type: 'updateState',
          payload: {
            processModeList: chainget(list, 'rows', []),
          },
        });
      }
    },

    // 获取扩展字段数据
    *fetchAttributeList({ payload }, { call, put }) {
      const res = yield call(fetchAttributeList, payload);
      const list = getResponse(res);
      if (list && res.success) {
        yield put({
          type: 'updateState',
          payload: {
            attributeList: chainget(list, 'rows', []),
          },
        });
      }
    },

    // 保存单位
    *saveUom({ payload }, { call }) {
      const result = yield call(saveUom, ergodicData(payload));
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
