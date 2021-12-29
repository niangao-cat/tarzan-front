/**
 * abnormalCollection - 异常收集组维护
 * @date: 2020/02/27 19:53:47
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import { isArray } from 'lodash';
import uuid from 'uuid/v4';
import { getResponse, createPagination } from 'utils/utils';
import {
  fetchList,
  save,
  fetchLineList,
  deleteLineList,
  fetchOldLineList,
  fetchExceptionCodeList,
  deleteProcess,
} from '../../services/hhme/abnormalCollectionService';

export default {
  namespace: 'abnormalCollection',
  state: {
    list: [],
    pagination: {},
    headList: [],
    lineList: [],
    linePagination: {},
    processList: [],
    selectedRecord: {}, // 勾选项
  },
  effects: {
    *fetchList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            list: res.content,
            pagination: createPagination(res),
          },
        });
      }
      return res;
    },
    *fetchDetail({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchList, payload));
      if (res) {
        const {
          hmeExcGroupAssignList,
          hmeExcGroupRouterList,
          hmeExcGroupWkcAssignList,
          ...baseInfo
        } = res.content[0];
        yield put({
          type: 'updateState',
          payload: {
            baseInfo,
            headList: isArray(hmeExcGroupAssignList)
              ? hmeExcGroupAssignList.map(e => ({ ...e, headId: uuid() })) // headId 唯一性id
              : [],
            processList: isArray(hmeExcGroupWkcAssignList) ? hmeExcGroupWkcAssignList.map(e => ({ ...e, headId: uuid() })) : [],
          },
        });
      }
      return res;
    },
    *fetchLineList({ payload }, { call, put }) {
      const { selectedRecord, page } = payload;
      const res = getResponse(
        yield call(fetchLineList, { assignId: selectedRecord.exceptionGroupAssignId, page })
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
    *fetchOldLineList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchOldLineList, payload));
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
    *save({ payload }, { call }) {
      const res = getResponse(yield call(save, payload));
      return res;
    },
    *deleteLineList({ payload }, { call }) {
      const res = getResponse(yield call(deleteLineList, payload));
      return res;
    },
    *fetchExceptionCodeList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchExceptionCodeList, payload));
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {
            exceptionCodeList: res.rows,
          },
        });
      }
      return res;
    },
    *deleteProcess({ payload }, { call }) {
      const res = getResponse(yield call(deleteProcess, payload));
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
