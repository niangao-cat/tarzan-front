/*
 * @Description: 异常处理平台
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-06-07 18:10:19
 */

import { getResponse } from 'utils/utils';
import {
  enterSite,
  enterOkSite,
  getWocellList,
  enterNoSite,
  commitException,
  getSiteList,
  enterEquipment,
  createExceptionRecord,
  showExceptionRecordModal,
  showExceptionNoRecordModal,
  enterMaterial,
  closeException,
  fetchLineList,
  fetchPositionData,
  asyncSetData,
  fetchUserData,
} from '@/services/hmes/exceptionHandlingPlatformService';

export default {
  namespace: 'exceptionHandlingPlatform',
  state: {
    defaultSite: {},
    exceptionList: [],
    equipmentInfo: {}, // 设备信息
    exceptionRecord: {}, // 历史记录
    materialInfo: {}, // 物料信息
    exceptionStatus: '', // 异常信息状态
    workcellInfo: {},
    areaMap: [],
    workshopMap: [],
    prodLineMap: [],
  },
  effects: {
    // 获取默认工厂
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
    // 输入工位
    *enterSite({ payload }, { call, put }) {
      const result = getResponse(yield call(enterSite, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            exceptionList: result,
          },
        });
      }
      return result;
    },

    *enterOkSite({ payload }, { call, put }) {
      const result = getResponse(yield call(enterOkSite, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            workcellInfo: {
              ...result,
            },
          },
        });
      }
      return result;
    },

    // 获取工位数据
    *enterNoSite({ payload }, { call, put }) {
      const result = getResponse(yield call(enterNoSite, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            exceptionList: result,
          },
        });
      }
      return result;
    },

    // 获取工位数据
    *getWocellList({ payload }, { call, put }) {
      const result = getResponse(yield call(getWocellList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            areaMap: result.areaInfo,
            workshopMap: result.workshopInfo,
            prodLineMap: result.prodLineInfo,
          },
        });
      }
      return result;
    },

    // 异常提交
    *commitException({ payload }, { call }) {
      const result = getResponse(yield call(commitException, payload));
      return result;
    },
    // 扫描设备
    *enterEquipment({ payload }, { call, put }) {
      const result = getResponse(yield call(enterEquipment, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            equipmentInfo: result,
          },
        });
      }
      return result;
    },
    // 扫描物料
    *enterMaterial({ payload }, { call, put }) {
      const result = getResponse(yield call(enterMaterial, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            materialInfo: result,
          },
        });
      }
      return result;
    },
    // 创建异常消息记录
    *createExceptionRecord({ payload }, { call }) {
      const result = getResponse(yield call(createExceptionRecord, payload));
      return result;
    },
    // 查看历史
    *showExceptionRecordModal({ payload }, { call, put }) {
      const result = getResponse(yield call(showExceptionRecordModal, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            exceptionRecord: result,
          },
        });
      }
      return result;
    },
    // 查看历史
    *showExceptionNoRecordModal({ payload }, { call, put }) {
      const result = getResponse(yield call(showExceptionNoRecordModal, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            exceptionRecord: result,
          },
        });
      }
      return result;
    },
    *closeException({ payload }, { call }) {
      const result = getResponse(yield call(closeException, payload));
      return result;
    },

    *fetchLineList({ payload }, { call }) {
    const res = getResponse(
      yield call(fetchLineList, payload)
    );
    return res;
    },

    *fetchPositionData({ payload }, { call }) {
      const res = getResponse(
        yield call(fetchPositionData, payload)
      );
      return res;
    },

    *asyncSetData({ payload }, { call }) {
      const res = getResponse(
        yield call(asyncSetData, payload)
      );
      return res;
    },

    *fetchUserData({ payload }, { call }) {
      const res = getResponse(
        yield call(fetchUserData, payload)
      );
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
