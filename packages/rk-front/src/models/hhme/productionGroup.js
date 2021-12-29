/**
 * @author:lly
 * @email:liyuan.liu@hand-china.com
 * @description产品组维护
 */

import { getResponse, createPagination, parseParameters } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  queryHeadData,
  saveHeadData,
  queryLineData,
  saveLineData,
  fetchDefaultSite,
  fetchSiteList,
} from '../../services/hhme/productionGroupService';

export default {
  namespace: 'productionGroup',
  state: {
    headList: [], // 消息表格数据源
    headPagination: {},
    lineList: [],
    linePagination: {},
    siteInfo: {},
    siteMap: [],
    flagMap: [],
  },
  effects: {
    // 查询独立值集
    *init(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          flagMap: 'WMS.FLAG_YN',
        })
      );
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            ...result,
          },
        });
      }
    },
    // 头信息查询
    *queryHeadData({ payload }, { call, put }) {
      const result = getResponse(yield call(queryHeadData, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            headList: result.content,
            headPagination: createPagination(result),
            lineList: [],
            linePagination: {},
          },
        });
      }
      return result;
    },
    // 保存头信息
    *saveHeadData({ payload }, { call }) {
      const result = yield call(saveHeadData, payload);
      return getResponse(result);
    },
    // 行信息查询
    *queryLineData({ payload }, { call, put }) {
      // 先清空数据
      yield put({
        type: 'updateState',
        payload: {
          lineList: [],
        },
      });
      const result = getResponse(yield call(queryLineData, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            lineList: result.content,
            linePagination: createPagination(result),
          },
        });
      }
      return result;
    },
    // 保存行信息
    *saveLineData({ payload }, { call }) {
      const result = yield call(saveLineData, payload);
      return getResponse(result);
    },
    // 获取默认站点
    *fetchDefaultSite({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchDefaultSite, payload));
      if(res) {
        yield put({
          type: 'updateState',
          payload: {
            siteInfo: res,
          },
        });
      }
      return res;
    },
    // 站点查询
    *fetchSiteList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchSiteList, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            siteMap: result,
          },
        });
      }
      return result;
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
