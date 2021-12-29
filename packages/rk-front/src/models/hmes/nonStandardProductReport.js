/*
 * @Description: 非标产品报表
 * @version: 0.1.0
 * @Author: xinyu.wang02@hand-china.com
 * @Date: 2020-12-14 09:37:58
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-04-01 15:33:40
 * @Copyright: Copyright (c) 2019 Hand
 */
import { getResponse, createPagination, parseParameters } from 'utils/utils';
import { queryMapIdpValue, queryUnifyIdpValue } from 'services/api';
import {
  fetchHeadList,
  fetchLineList,
  fetchmakeNumList,
  fetchdefectsNumbList,
  fetchrepairNumList,
} from '@/services/hmes/nonStandardProductReportService';

export default {
  namespace: 'nonStandardProductReport',
  state: {
    headList: [],
    headPagination: {},
    lineList: [],
    linePagination: {},
    siteMap: [],
    divisionMap: [],
    workcellMap: [],
    makeNumList: [],
    makeNumPagination: {},
    defectsNumbList: [],
    defectsNumbPagination: {},
    repairNumList: [],
    repairNumPagination: {},

    siteAreaList: [],
  },
  effects: {

    // 批量查询独立值集
    *batchLovData(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          woStatus: 'MT.WO_STATUS',
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
    // 获取审批清单
    *fetchHeadList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchHeadList, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            headList: result.content,
            headPagination: createPagination(result),
          },
        });
      }
      return result;
    },

    *fetchLineList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchLineList, parseParameters(payload)));
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
    *fetchmakeNumList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchmakeNumList, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            makeNumList: result.content,
            makeNumPagination: createPagination(result),
          },
        });
      }
      return result;
    },

    *fetchdefectsNumbList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchdefectsNumbList, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            defectsNumbList: result.content,
            defectsNumbPagination: createPagination(result),
          },
        });
      }
      return result;
    },

    *fetchrepairNumList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchrepairNumList, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            repairNumList: result.content,
            repairNumPagination: createPagination(result),
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
