/*
 * @Description: 员工出勤报表
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-01 09:37:58
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-04-01 15:33:40
 * @Copyright: Copyright (c) 2019 Hand
 */
import { getResponse, createPagination, parseParameters } from 'utils/utils';
import {
  fetchHeadList,
  fetchLineList,
  fetchSiteList,
  fetchDivisionList,
  fetchWorkcellList,
  fetchMakeNumList,
  fetchDefectsNumbList,
  fetchRepairNumList,
  fetchDefaultSite,
  fetchSummaryList,
  fetchNcList,
} from '@/services/hmes/employeeAttendanceReportService';

export default {
  namespace: 'employeeAttendanceReport',
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
  },
  effects: {
    // 获取审批清单
    *fetchHeadList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchHeadList, parseParameters(payload)));
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

    *fetchSiteList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchSiteList, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            siteMap: result,
            headList: [],
            headPagination: {},
            lineList: [],
            linePagination: {},
          },
        });
      }
      return result;
    },

    *fetchDivisionList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchDivisionList, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            divisionMap: result,
          },
        });
      }
      return result;
    },

    *fetchWorkcellList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchWorkcellList, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            workcellMap: result,
          },
        });
      }
      return result;
    },
    *fetchMakeNumList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchMakeNumList, parseParameters(payload)));
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

    *fetchDefectsNumbList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchDefectsNumbList, parseParameters(payload)));
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

    *fetchRepairNumList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchRepairNumList, parseParameters(payload)));
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

    *fetchSummaryList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchSummaryList, payload));
      if(res) {
        yield put({
          type: 'updateState',
          payload: {
            makeNumList: res.content,
            makeNumPagination: createPagination(res),
          },
        });
      }
    },

    *fetchNcList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchNcList, payload));
      if(res) {
        yield put({
          type: 'updateState',
          payload: {
            defectsNumbList: res.content,
            defectsNumbPagination: createPagination(res),
          },
        });
      }
    },

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
