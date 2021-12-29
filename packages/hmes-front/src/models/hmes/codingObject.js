/**
 * @date 2019-7-30
 * @author HDY <deying.huang@hand-china.com>
 */

import { getResponse, createPagination } from 'utils/utils';
import { get as chainGet } from 'lodash';
import {
  fetchCodingObjectList,
  fetchAttributeList,
  saveCodingObject,
  saveAttribute,
  saveAttributeBatch,
  fetchComBoxList,
  fetchNumrangeObjectColumn,
} from '../../services/hmes/codingObjectService';
import { ergodicData } from '@/utils/utils';

export default {
  namespace: 'codingObject',
  state: {
    codingObjectList: [], // 类型表格数据源
    codingObjectPagination: {}, // 类型表格分页
    attributeList: [], // 对象属性数据源
    attributePagination: {}, // 对象属性表格分页
    comboxList: [], // 所属服务包下拉列表
    groupComboxId: '', // 所属服务包，已设为类型组的服务包ID
  },
  effects: {
    // 获取状态表数据
    *fetchCodingObjectList({ payload }, { call, put }) {
      const res = yield call(fetchCodingObjectList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            codingObjectList: list.rows.content,
            codingObjectPagination: createPagination(list.rows),
          },
        });
      }
      return list;
    },

    // 获取对象属性数据
    *fetchAttributeList({ payload }, { call, put }) {
      const res = yield call(fetchAttributeList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            attributeList: chainGet(list, 'rows.content', []),
            attributePagination: createPagination(list.rows),
          },
        });
      }
    },

    // 保存状态
    *saveCodingObject({ payload }, { call }) {
      const result = yield call(saveCodingObject, ergodicData(payload));
      return getResponse(result);
    },

    // 保存对象属性
    *saveAttribute({ payload }, { call }) {
      const result = yield call(saveAttribute, ergodicData(payload));
      return getResponse(result);
    },
    *saveAttributeBatch({ payload }, { call }) {
      const result = yield call(saveAttributeBatch, ergodicData(payload));
      return getResponse(result);
    },
    // 获取所属服务包下拉
    *fetchComBoxList({ payload }, { call, put }) {
      const result = yield call(fetchComBoxList, payload);
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            comboxList: chainGet(result, 'rows', []),
          },
        });
      }
    },
    // 获取编码对象下已设为类型组的对象属性id
    *fetchNumrangeObjectColumn({ payload }, { call, put }) {
      const result = yield call(fetchNumrangeObjectColumn, payload);
      if (result && result.success) {
        yield put({
          type: 'updateState',
          payload: {
            groupComboxId: chainGet(result, 'rows', ''),
          },
        });
      }
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
