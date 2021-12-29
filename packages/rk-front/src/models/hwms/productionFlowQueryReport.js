/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 生产流转查询报表
 */
import { get as chainGet } from 'lodash';
import { getResponse, createPagination } from 'utils/utils';
import { queryDataList, fetchNcList, fetchDefaultSite } from '@/services/hwms/productionFlowQueryReportService';
import { queryMapIdpValue } from 'services/api';
import { fetchStatueSelectList } from '@/services/api';

export default {
  namespace: 'productionFlowQueryReport',
  state: {
    headList: [],
    headPagination: {},
    ncList: [],
    cosTypeMap: [],
    workOrderStatusOptions: [],
  },
  effects: {
    // 初始化 状态下拉框
    *init(_, { call, put }) {
      const res = yield call(queryMapIdpValue, {
        cosTypeMap: 'HME.JOB_TYPE',
      });
      // 成功时，更改状态
      yield put({
        type: 'updateState',
        payload: {
          ...res,
        },
      });
    },

    *fetchDefaultSite(_, { call, put }) {
      const res = getResponse(yield call(fetchDefaultSite));
      if(res) {
        yield put({
          type: 'updateState',
          payload: {
            siteInfo: res,
          },
        });
      }
    },

    // 查询报表信息
    *queryDataList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryDataList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            headList: res.content,
            headPagination: createPagination(res),
          },
        });
      }
      return res;
    },

    // 查询不良信息
    *fetchNcList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchNcList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            ncList: res,
          },
        });
      }
      return res;
    },

    // 查询工单状态列表
    *fetchStatusSelectList({ payload }, { call, put }) {
      const res = yield call(fetchStatueSelectList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            [payload.type]: chainGet(list, 'rows', []),
          },
        });
      }
      return list;
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
