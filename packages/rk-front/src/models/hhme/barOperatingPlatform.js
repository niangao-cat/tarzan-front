/*
 * @Description: 来料录入
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-04 10:46:38
 * @LastEditTime: 2020-08-05 21:23:46
 */

import { getResponse, createPagination } from 'utils/utils';
import {
  fetchHeadList,
  saveHeadList,
  fetchLineList,
  saveLineList,
  deleteLineList,
  fetchExceptionTypeList,
} from '../../services/hhme/abnormalInfoService';

export default {
  namespace: 'barOperatingPlatform',
  state: {
    headList: [],
    pagination: {},
    lineList: [],
    linePagination: {},
    abnormalTypeList: [],
    selectedRecord: {},
    exceptionTypeList: [],
  },
  effects: {
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
      const { selectedRecord, page } = payload;
      const res = getResponse(
        yield call(fetchLineList, { exceptionId: selectedRecord.exceptionId, page })
      );
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            lineList: res.content,
            selectedRecord,
            linePagination: createPagination(res),
          },
        });
      }
      return res;
    },
    *saveHeadList({ payload }, { call }) {
      const res = getResponse(yield call(saveHeadList, payload));
      return res;
    },
    *saveLineList({ payload }, { call }) {
      const res = getResponse(yield call(saveLineList, payload));
      return res;
    },
    *deleteLineList({ payload }, { call }) {
      const res = getResponse(yield call(deleteLineList, payload));
      return res;
    },
    *fetchExceptionTypeList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchExceptionTypeList, payload));
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {
            exceptionTypeList: res.rows,
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
