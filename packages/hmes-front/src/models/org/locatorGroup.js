/**
 * @date 2019-8-1
 * @author TJX <jiaxu.tang@hand-china.com>
 */

import { getResponse, createPagination } from 'utils/utils';
import { get as chainget } from 'lodash';
import { fetchLocatorGroupList, savLocatorGroupList } from '../../services/org/locatorGroupService';
import { fetchAttributeList, saveAttribute } from '@/services/api';
import { ergodicData } from '@/utils/utils';

export default {
  namespace: 'locatorGroup',
  state: {
    locatorGroupList: [], // 库存组列表
    locatorGroupPagination: {}, // 库存组列表分页
    attrList: [], // 扩展字段列表
    attrPagination: {}, // 扩展字段属性
  },
  effects: {
    // 获取事件请求类型表数据
    *fetchLocatorGroupList({ payload }, { call, put }) {
      const res = yield call(fetchLocatorGroupList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            locatorGroupList: chainget(list, 'rows.content', []),
            locatorGroupPagination: createPagination(list.rows),
          },
        });
      }
      return list;
    },

    // 保存事件请求类型
    *savLocatorGroupList({ payload }, { call }) {
      const result = yield call(savLocatorGroupList, ergodicData(payload));
      return getResponse(result);
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
