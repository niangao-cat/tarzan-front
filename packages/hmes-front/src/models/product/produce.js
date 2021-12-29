/**
 * @date 2019-7-31
 * @author HDY <deying.huang@hand-china.com>
 */

import { getResponse, createPagination } from 'utils/utils';
import { get as chainGet } from 'lodash';
import { ergodicData } from '@/utils/utils';
import {
  fetchProduceList, // 获取物料生产属性列表
  saveProduce, // 保存物料生产属性
  fetchSingleProduce, // 获取单条详情数据
  fetchOption, // 获取下拉数据
  checkProduceItem, // 检查物料生产属性
} from '@/services/product/produceService';
import { fetchAttributeList } from '@/services/api';

export default {
  namespace: 'produce',
  state: {
    produceList: [], // 物料生产属性列表
    producePagination: {}, // 物料生产属性翻页
    produceItem: {}, // 当前编辑得数据
    attributeTabList: [], // tab页扩展字段
    isCreate: false,
  },
  effects: {
    // 获取物料生产属性列表
    *fetchProduceList({ payload }, { call, put }) {
      const res = yield call(fetchProduceList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            produceList: chainGet(list, 'rows.content', []),
            producePagination: createPagination(list.rows),
          },
        });
      }
    },
    // 保存物料生产属性
    *saveProduce({ payload }, { call }) {
      const result = yield call(saveProduce, ergodicData(payload));
      return getResponse(result);
    },
    // 单条物料生产属性查询
    *fetchSingleProduce({ payload }, { call, put }) {
      const res = yield call(fetchSingleProduce, payload);
      const list = getResponse(res);
      yield put({
        type: 'updateState',
        payload: {
          produceItem: chainGet(list, 'rows', {}),
        },
      });
      return list;
    },
    // 获取下拉数据
    *fetchSelectOption({ payload }, { call }) {
      const res = yield call(fetchOption, payload);
      const list = getResponse(res);
      return list;
    },
    // 获取扩展字段数据
    *fetchAttrCreate({ payload }, { call, put }) {
      const res = yield call(fetchAttributeList, payload);
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
    // 检查物料生产属性
    *checkProduceItem({ payload }, { call, put }) {
      const result = yield call(checkProduceItem, ergodicData(payload));
      const list = getResponse(result);
      if (list && list.rows) {
        yield put({
          type: 'updateState',
          payload: {
            produceItem: chainGet(list, 'rows', {}),
            isCreate: false,
          },
        });
      }
      return list;
    },
  },

  reducers: {
    clear() {
      return {
        produceList: [], // 物料生产属性列表
        producePagination: {}, // 物料生产属性翻页
        produceItem: {}, // 当前编辑得数据
        attributeTabList: [], // tab页扩展字段
        isCreate: false,
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
