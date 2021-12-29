/**
 * eqManageTaskDoc - 设备点检 & 保养任务查询
 * @date: 2020/02/27 19:53:47
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';

import {
  fetchHeadList,
  fetchLineList,
  updateLine,
  updateHeadLine,
  fetchHistoryList,
} from '@/services/hhme/eqManageTaskDocService';

export default {
  namespace: 'eqManageTaskDoc',
  state: {
    headList: [],
    pagination: {},
    lineList: [],
    linePagination: {},
    organizationList: [], // 送货单状态
    taskTypeList: [], // 行状态
    docTypeList: [], // 版本
    resultList: [], // 工厂
    historyList: [],
    historyPagination: {},
  },
  effects: {
    *init(_, { call, put }) {
      const res = yield call(queryMapIdpValue, {
        taskTypeList: 'HME.TASK_DOC_TYPE',
        docStatusList: 'HME_MAINTENANCE_STATUS',
        resultList: 'HME.CHECK_RESLT',
      });
      yield put({
        type: 'updateState',
        payload: {
          ...res,
        },
      });
    },
    *fetchHeadList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchHeadList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            headList: res.content,
            pagination: createPagination(res),
          },
        });
      }
      return res;
    },

    *fetchLineList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchLineList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            lineList: res.content,
            linePagination: createPagination(res),
          },
        });
      }
      return res;
    },
    *updateLine({ payload }, { call, put }) {
      const res = getResponse(yield call(updateLine, payload));
      const { index, lineList } = payload;
      if (res) {
        lineList.splice(index, 1, {
          ...res,
        });
        yield put({
          type: 'updateState',
          payload: {
            lineList,
          },
        });
      }
      return res;
    },
    *updateHeadLine({ payload }, { call, put }) {
      const res = getResponse(yield call(updateHeadLine, payload));
      const { index, headList } = payload;
      if (res) {
        headList.splice(index, 1, {
          ...res,
        });
        yield put({
          type: 'updateState',
          payload: {
            headList,
          },
        });
      }
      return res;
    },
    *fetchHistoryList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchHistoryList, payload));
      if(res) {
        yield put({
          type: 'updateState',
          payload: {
            historyList: res.content,
            historyPagination: createPagination(res),
          },
        });
      }
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
