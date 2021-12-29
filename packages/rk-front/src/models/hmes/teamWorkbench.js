/*
 * @Description: 班组工作台
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-10 14:17:52
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-08-05 01:30:25
 * @Copyright: Copyright (c) 2019 Hand
 */
import { getResponse, createPagination, parseParameters } from 'utils/utils';
import {
  fetchLineList,
  fetchShiftList,
  fetchSectionAndShift,
  startClass,
  stopClass,
  getSiteList,
  fetchLineCloseShift,
  fetchShiftInfo,
  fetchCompletionStatistics,
  fetchProductBeat,
  saveHandoverMatter,
  fetchHandoverMatter,
  fetchOperationQuality,
  fetchOtherException,
  fetchEquipmentManage,
  fetchEmployeeSecurity,
  handleRollback,
} from '@/services/hmes/teamWorkbenchService';

export default {
  namespace: 'teamWorkbench',
  state: {
    defaultSite: {}, // 默认站点信息
    lineList: [], // 工段
    shiftList: [], // 班次
    openEndShift: {}, // 开结班
    lineShift: {},
    completionStatistics: [],
    shiftInfo: {}, // 班组信息
    productBeat: {}, // 产品节拍
    handoverMatter: {},
    operationQuality: {},
    otherException: [],
    otherExceptionPagination: {},
    equipmentManage: {},
    employeeSecurity: [],
  },
  effects: {
    *getSiteList({ payload }, { call, put }) {
      const result = getResponse(yield call(getSiteList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            defaultSite: result,
          },
        });
      }
      return result;
    },
    *fetchLineList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchLineList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            lineList: result,
          },
        });
      }
      return result;
    },
    *fetchShiftList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchShiftList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            shiftList: result,
          },
        });
      }
      return result;
    },
    *fetchSectionAndShift({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchSectionAndShift, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            openEndShift: result,
          },
        });
      }
      return result;
    },
    *startClass({ payload }, { call }) {
      const result = getResponse(yield call(startClass, payload));
      return result;
    },
    *stopClass({ payload }, { call }) {
      const result = getResponse(yield call(stopClass, payload));
      return result;
    },
    *fetchLineCloseShift({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchLineCloseShift, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            lineShift: result,
          },
        });
      }
      return result;
    },
    // 查询班组信息
    *fetchShiftInfo({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchShiftInfo, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            shiftInfo: result,
          },
        });
      }
      return result;
    },
    *fetchCompletionStatistics({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchCompletionStatistics, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            completionStatistics: result.content,
            completionStatisticsPagination: createPagination(result),
          },
        });
      }
      return result;
    },
    // 产品节拍
    *fetchProductBeat({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchProductBeat, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            productBeat: result,
          },
        });
      }
      return result;
    },
    // 保存注意事项
    *saveHandoverMatter({ payload }, { call }) {
      const result = getResponse(yield call(saveHandoverMatter, payload));
      return result;
    },
    // 查询注意事项
    *fetchHandoverMatter({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchHandoverMatter, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            handoverMatter: result,
          },
        });
      }
      return result;
    },
    // 工艺质量
    *fetchOperationQuality({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchOperationQuality, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            operationQuality: result,
          },
        });
      }
      return result;
    },
    *fetchOtherException({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchOtherException, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            otherException: result.content,
            otherExceptionPagination: createPagination(result),
          },
        });
      }
      return result;
    },
    // 设备管理
    *fetchEquipmentManage({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchEquipmentManage, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            equipmentManage: result,
          },
        });
      }
      return result;
    },
    *fetchEmployeeSecurity({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchEmployeeSecurity, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            employeeSecurity: result,
          },
        });
      }
      return result;
    },
    // 撤回
    *handleRollback({ payload }, { call }) {
      const result = getResponse(yield call(handleRollback, payload));
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
