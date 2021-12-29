/**
 * @date 2019-8-1
 * @author TJX <jiaxu.tang@hand-china.com>
 */

import { getResponse, createPagination } from 'utils/utils';
import { get as chainget } from 'lodash';
import {
  fetchChilStepsList,
  saveChildStepsList,
  deleteChildStepsList,
  fetchSelectOption,
  fetchSiteOption,
} from '@/services/process/childStepsService';
import { fetchAttributeList, saveAttribute } from '@/services/api';
import { ergodicData } from '@/utils/utils';

export default {
  namespace: 'childSteps',
  state: {
    childStepsList: [], // 库存组列表
    childStepsPagination: {}, // 库存组列表分页
    attrList: [], // 扩展字段列表
    attrPagination: {}, // 扩展字段属性
  },
  effects: {
    // 获取子步骤列表数据
    *fetchChilStepsList({ payload }, { call, put }) {
      const res = yield call(fetchChilStepsList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            childStepsList: chainget(list, 'rows.content', []),
            childStepsPagination: createPagination(list.rows),
          },
        });
      }
      return list;
    },

    // 保存子步骤列表
    *saveChildStepsList({ payload }, { call }) {
      const result = yield call(saveChildStepsList, ergodicData(payload));
      return getResponse(result);
    },
    // 删除子步骤列表
    *deleteChildStepsList({ payload }, { call }) {
      const result = yield call(deleteChildStepsList, payload);
      return getResponse(result);
    },
    // 获取下拉
    *fetchSelectOption({ payload }, { call }) {
      const res = yield call(fetchSelectOption, payload);
      const list = getResponse(res);
      return list;
    },
    // 获取站点下拉
    *fetchSiteOption({ payload }, { call }) {
      const res = yield call(fetchSiteOption, payload);
      const list = getResponse(res);
      return list;
    },

    // 获取扩展字段属性
    *featchAttrList({ payload }, { call, put }) {
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
      return list;
    },

    // 保存扩展字段属性
    *saveAttrList({ payload }, { call }) {
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
