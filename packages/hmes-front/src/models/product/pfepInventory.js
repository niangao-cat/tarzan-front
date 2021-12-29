/**
 * @date 2019-8-19
 * @author HDY <deying.huang@hand-china.com>
 */
import { get as chainget } from 'lodash';
import { getResponse, createPagination } from 'utils/utils';
import { ergodicData } from '@/utils/utils';

import {
  fetchPfepInventoryList,
  savePfepInventory,
  fetchPfepInventoryLineList,
  fetchSelectList,
  copyPfepInventory,
} from '../../services/product/pfepInventoryService';

export default {
  namespace: 'pfepInventory',
  state: {
    pfepInventoryList: [], // PFEP数据源
    pfepInventoryPagination: {}, // PFEP格分页
    displayList: {}, // 明细数据
    attrList: [], // 扩展字段表格数据源
    identifyTypeList: [], // 存储标识类型下拉框数据
  },
  effects: {
    // 获取PFEP数据
    *fetchPfepInventoryList({ payload }, { call, put }) {
      const res = yield call(fetchPfepInventoryList, payload);
      const list = getResponse(res);
      if (list && res.success) {
        yield put({
          type: 'updateState',
          payload: {
            pfepInventoryList: chainget(list, 'rows.content', []),
            pfepInventoryPagination: createPagination(list.rows),
          },
        });
      }
    },

    // 获取PFEP数据
    *fetchPfepInventoryLineList({ payload }, { call, put }) {
      const res = yield call(fetchPfepInventoryLineList, payload);
      const list = getResponse(res);
      if (list && res.success) {
        yield put({
          type: 'updateState',
          payload: {
            displayList: chainget(list, 'rows.content[0]', {}),
            attrList: chainget(list, 'rows.content[0].mtExtendAttrDTOList', []),
          },
        });
      }
    },

    // 获取存储标识类型下拉框数据
    *fetchIdentifyTypeListList({ payload }, { call, put }) {
      const res = yield call(fetchSelectList, payload);
      const list = getResponse(res);
      if (list && res.success) {
        yield put({
          type: 'updateState',
          payload: {
            identifyTypeList: chainget(list, 'rows', []),
          },
        });
      }
    },

    // 保存PFEP
    *savePfepInventory({ payload }, { call }) {
      const result = yield call(savePfepInventory, ergodicData(payload));
      return getResponse(result);
    },

    // 保存扩展字段
    *copyPfepInventory({ payload }, { call }) {
      const result = yield call(copyPfepInventory, ergodicData(payload));
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
