/*
 *@description:配送单查询Models
 *@author: wangxinyu
 *@date: 2020-09-03 13:21:48
 *@version: V0.0.1
 */
import { isArray } from 'lodash';
import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'hzero-front/lib/services/api';
import {
  fetchHeadList,
  fetchLineList,
  fetchLineDetailList,
  fetchSelectOption,
  fetchStatueSelectList,
  fetchTypeSelectList,
  print,
  cancel,
  close,
  fetchReplenishmentLineList,
  saveReplenishmentList,
  fetchDefaultSite,
} from '@/services/hwms/deliveryOrderQueryService';

export default {
  namespace: 'deliveryOrderQuery',
  state: {
    headList: [], // 头数据源
    headPagination: {}, // 头表格分页
    lineList: [], // 行数据源
    linePagination: {}, // 行表格分页
    lineDetailList: [], // 行明细数据源
    lineDetailPagination: {}, // 行明细表格分页
    instructionDocStatusList: [], // 配送单状态
    distributionLineStatusList: [], // 配送单行状态
    replenishmentLineList: [],
    replenishmentInfo: {},
    siteInfo: {},
  },
  effects: {
    *fetchDefaultSite(_, { call, put }) {
      const res = getResponse(yield call(fetchDefaultSite));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            siteInfo: res,
          },
        });
        return res;
      }
    },
    // 获取Hzero值集
    *querySelect({ payload }, { call, put }) {
      const response = yield call(queryMapIdpValue, payload);
      const res = getResponse(response);
      yield put({
        type: 'updateState',
        payload: {
          instructionDocStatusList: res.instructionDocStatus || [],
          distributionLineStatusList: res.distributionLineStatus || [],
        },
      });
      return res;
    },

    // 获取头数据源列表数据
    *fetchHeadList({ payload }, { call, put }) {
      const res = yield call(fetchHeadList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            headList: list.content,
            headPagination: createPagination(list),
          },
        });
      }
      return list;
    },

    // 获取行数据源列表数据
    *fetchLineList({ payload }, { call, put }) {
      const res = yield call(fetchLineList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            lineList: list.content,
            linePagination: createPagination(list),
          },
        });
      }
      return list;
    },

    // 获取行明细数据源列表数据
    *fetchLineDetailList({ payload }, { call, put }) {
      const res = yield call(fetchLineDetailList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            lineDetailList: list.content,
            lineDetailPagination: createPagination(list),
          },
        });
      }
      return list;
    },

    // 获取Hzero值集
    *fetchSelectOption({ payload }, { call }) {
      const res = yield call(fetchSelectOption, payload);
      const list = getResponse(res);
      return list;
    },

    // 获取类型下拉
    *fetchTypeSelectList({ payload }, { call }) {
      const res = yield call(fetchTypeSelectList, payload);
      const list = getResponse(res);
      return list;
    },

    // 获取状态下拉
    *fetchStatueSelectList({ payload }, { call }) {
      const res = yield call(fetchStatueSelectList, payload);
      const list = getResponse(res);
      return list;
    },

    // 打印
    *print({ payload }, { call }) {
      const res = getResponse(yield call(print, payload));
      return res;
    },

    // 取消
    *cancel({ payload }, { call }) {
      const res = getResponse(yield call(cancel, payload));
      return res;
    },

    // 关闭
    *close({ payload }, { call }) {
      const res = getResponse(yield call(close, payload));
      return res;
    },

    *fetchReplenishmentLineList({ payload }, { call, put }) {
      const { replenishmentInfo, ...params } = payload;
      const res = getResponse(yield call(fetchReplenishmentLineList, params));
      if(res) {
        yield put({
          type: 'updateState',
          payload: {
            replenishmentLineList: isArray(res) ? res.map(e => ({...e, isReplace: true, originReplenishQty: e.replenishQty })) : [],
            replenishmentInfo,
          },
        });
      }
      return res;
    },
    *saveReplenishmentList({ payload }, { call }) {
      const res = getResponse(yield call(saveReplenishmentList, payload));
      return res;
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
