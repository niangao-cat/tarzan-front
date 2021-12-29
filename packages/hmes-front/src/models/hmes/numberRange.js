/**
 * @date 2019-8-21
 * @author HDY <deying.huang@hand-china.com>
 */

import { getResponse, createPagination } from 'utils/utils';
import { get as chainGet } from 'lodash';
import { ergodicData } from '@/utils/utils';
import {
  fetchNumberRangeList,
  fetchHistoryList,
  saveNumberRange,
  fetchHistoryItemList,
  fetchNumberRangeLineList,
} from '../../services/hmes/numberRangeService';
import { fetchSelectList } from '../../services/api';

export default {
  namespace: 'numberRange',
  state: {
    numberRangeList: [], // 号码段表格数据源
    numberRangePagination: {}, // 号码段表格分页
    displayList: {}, // 详细展示数据
    ruleList: [], // 规则框数据源
    historyList: [], // 修改历史数据源
    historyPagination: {}, // 修改历史表格分页
    historyItemList: [], // 修改历史次表数据源
    historyItemPagination: {}, // 修改历史次表表格分页
    numberLevelList: [], // 序列号层级下拉框数据
    numAlertTypeList: [], // 号段预警下拉框数据
    numRadixList: [], // 号段进制下拉框数据
    numResetTypeList: [], // 序列号重置周期下拉框数据
    dateFormatList: [], // 日期格式下拉框数据
    timeFormatList: [], // 时间格式下拉框数据
    inputBox1List: {}, // 规则框1数据
    inputBox2List: {}, // 规则框2数据
    inputBox3List: {}, // 规则框3数据
    inputBox4List: {}, // 规则框4数据
    inputBox5List: {}, // 规则框5数据
  },
  effects: {
    // 获取号码段表数据
    *fetchNumberRangeList({ payload }, { call, put }) {
      const res = yield call(fetchNumberRangeList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            numberRangeList: chainGet(list, 'rows.content', []),
            numberRangePagination: createPagination(list.rows),
          },
        });
      }
    },

    // 获取号码段详细数据
    *fetchNumberRangeLineList({ payload }, { call, put }) {
      const res = yield call(fetchNumberRangeLineList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            displayList: chainGet(list, 'rows', {}),
            ruleList: chainGet(list, 'rows.rules', []),
            inputBox1List: chainGet(list, 'rows.rules.[0]', null)
              ? chainGet(list, 'rows.rules.[0]', null)
              : {},
            inputBox2List: chainGet(list, 'rows.rules.[1]', null)
              ? chainGet(list, 'rows.rules.[1]', null)
              : {},
            inputBox3List: chainGet(list, 'rows.rules.[2]', null)
              ? chainGet(list, 'rows.rules.[2]', null)
              : {},
            inputBox4List: chainGet(list, 'rows.rules.[3]', null)
              ? chainGet(list, 'rows.rules.[3]', null)
              : {},
            inputBox5List: chainGet(list, 'rows.rules.[4]', null)
              ? chainGet(list, 'rows.rules.[4]', null)
              : {},
          },
        });
      }
    },

    // 获取修改历史数据
    *fetchHistoryList({ payload }, { call, put }) {
      const res = yield call(fetchHistoryList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            historyList: chainGet(list, 'rows.content', []),
            historyPagination: createPagination(list.rows),
          },
        });
      }
    },

    // 获取修改历史次表数据
    *fetchHistoryItemList({ payload }, { call, put }) {
      const res = yield call(fetchHistoryItemList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            historyItemList: chainGet(list, 'rows.content', []),
            historyItemPagination: createPagination(list.rows),
          },
        });
      }
    },

    // 获取序列号层级下拉框数据
    *fetchNumLevelList({ payload }, { call, put }) {
      const res = yield call(fetchSelectList, payload);
      const list = getResponse(res);
      if (list && res.success) {
        yield put({
          type: 'updateState',
          payload: {
            numberLevelList: chainGet(list, 'rows', []),
          },
        });
      }
    },

    // 获取号段预警类型下拉框数据
    *fetchNumAlertTypeList({ payload }, { call, put }) {
      const res = yield call(fetchSelectList, payload);
      const list = getResponse(res);
      if (list && res.success) {
        yield put({
          type: 'updateState',
          payload: {
            numAlertTypeList: chainGet(list, 'rows', []),
          },
        });
      }
    },

    // 获取号段进制下拉框数据
    *fetchNumRadixList({ payload }, { call, put }) {
      const res = yield call(fetchSelectList, payload);
      const list = getResponse(res);
      if (list && res.success) {
        yield put({
          type: 'updateState',
          payload: {
            numRadixList: chainGet(list, 'rows', []),
          },
        });
      }
    },

    // 获取序列号重置周期下拉框数据
    *fetchNumResetTypeList({ payload }, { call, put }) {
      const res = yield call(fetchSelectList, payload);
      const list = getResponse(res);
      if (list && res.success) {
        yield put({
          type: 'updateState',
          payload: {
            numResetTypeList: chainGet(list, 'rows', []),
          },
        });
      }
    },

    // 获取日期格式下拉框数据
    *fetchDateFormatList({ payload }, { call, put }) {
      const res = yield call(fetchSelectList, payload);
      const list = getResponse(res);
      if (list && res.success) {
        yield put({
          type: 'updateState',
          payload: {
            dateFormatList: chainGet(list, 'rows', []),
          },
        });
      }
    },

    // 获取时间格式下拉框数据
    *fetchTimeFormatList({ payload }, { call, put }) {
      const res = yield call(fetchSelectList, payload);
      const list = getResponse(res);
      if (list && res.success) {
        yield put({
          type: 'updateState',
          payload: {
            timeFormatList: chainGet(list, 'rows', []),
          },
        });
      }
    },

    // 保存号码段
    *saveNumberRange({ payload }, { call }) {
      const result = yield call(saveNumberRange, ergodicData(payload));
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
