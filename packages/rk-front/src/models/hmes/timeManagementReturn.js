/*
 * @Description: 时效工序作业平台
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-06-07 18:10:19
 */

import { isArray } from 'lodash';
import { getResponse, parseParameters, createPagination } from 'utils/utils';
import {
  enterSite,
  scanningInFurnaceCode,
  addInFurnace,
  scanningOutFurnaceCode,
  addOutFurnace,
  fetchListTimeSn,
  getSiteList,
  fetchDataCollection,
  saveDataCollection,
  handleContinueRework,
  fetchDefaultData,
  fetchEquipmentList,
  changeEq,
  // checkEq,
  deleteEq,
  bindingEq,
  fetchEqInfo,
  changeEqConfirm,
  bindingEqConfirm,
} from '@/services/hmes/timeManagementReturnService';

export default {
  namespace: 'timeManagementReturn',
  state: {
    deviceInfo: {}, // 设备信息
    waitInFurnace: {}, // 待入炉数据
    fuurnace: [], // 炉内数据
    waitOutFurnace: {}, // 待出炉数据
    defaultSite: {},
    siteContainerCount: 0, // 炉内容器数
    siteSnMaterialCount: 0, // 炉内产品数
    standardReqdTimeInProcess: 0, // 标准时长
    dataCollection: [],
    dataCollectionPagination: {},
    defaultTagCode: [],
    defaultTagId: [],
    equipmentList: [],
    equipmentInfo: {},
    exceptionEquipmentCodes: null,
    errorEquipmentCodes: null,
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
            deviceInfo: result,
          },
        });
      }
      return result;
    },
    // 获取指定工位未出站时效工序作业
    *fetchListTimeSn({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchListTimeSn, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            furnacePagination: createPagination(result),
            fuurnace: result.lineList,
            siteContainerCount: result.siteContainerCount,
            siteSnMaterialCount: result.siteSnMaterialCount,
            standardReqdTimeInProcess: result.standardReqdTimeInProcess,
          },
        });
      }
      return result;
    },
    // 入炉扫描
    *scanningInFurnaceCode({ payload }, { call, put }) {
      const result = getResponse(yield call(scanningInFurnaceCode, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            waitInFurnace: result,
          },
        });
      }
      return result;
    },
    // 入炉操作
    *addInFurnace({ payload }, { call }) {
      const result = getResponse(yield call(addInFurnace, payload));
      return result;
    },
    // 出炉扫描
    *scanningOutFurnaceCode({ payload }, { call, put }) {
      const result = getResponse(yield call(scanningOutFurnaceCode, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            waitOutFurnace: result,
          },
        });
      }
      return result;
    },
    // 出炉操作
    *addOutFurnace({ payload }, { call }) {
      const result = getResponse(yield call(addOutFurnace, payload));
      return result;
    },
    // 返修
    *handleContinueRework({ payload }, { call }) {
      const result = getResponse(yield call(handleContinueRework, payload));
      return result;
    },
    // 查询数据采集数据
    *fetchDataCollection({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchDataCollection, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            dataCollectionPagination: createPagination(result),
            dataCollection: result.content,
          },
        });
      }
      return result;
    },
    *saveDataCollection({ payload }, { call }) {
      const result = getResponse(yield call(saveDataCollection, payload));
      return result;
    },
    // 查询跳转的默认值
    *fetchDefaultData({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchDefaultData, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            defaultTagCode: result.map(ele=>ele.tagCode),
            defaultTagId: result.map(ele=>ele.tagId),
          },
        });
      }
      return result;
    },
    *fetchEquipmentList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchEquipmentList, payload));
      if(res) {
        yield put({
          type: 'updateState',
          payload: {
            equipmentList: isArray(res.hmeWkcEquSwitchVOS) ? res.hmeWkcEquSwitchVOS : [],
            equipmentInfo: res.hmeWkcEquSwitchVO3,
            exceptionEquipmentCodes: res.exceptionEquipmentCodes,
            errorEquipmentCodes: res.errorEquipmentCodes,
          },
        });
      }
      return res;
    },

    *changeEq({ payload }, { call }) {
      const res = yield call(changeEq, payload);
      return res;
    },

    *deleteEq({ payload }, { call }) {
      const res = getResponse(yield call(deleteEq, payload));
      return res;
    },

    *bindingEq({ payload }, { call }) {
      const res = yield call(bindingEq, payload);
      return res;
    },

    *fetchEqInfo({ payload }, { call }) {
      const res = getResponse(yield call(fetchEqInfo, payload ));
      return res;
    },

    *bindingEqConfirm({ payload }, { call }) {
      const res = getResponse(yield call(bindingEqConfirm, payload ));
      return res;
    },

    *changeEqConfirm({ payload }, { call }) {
      const res = getResponse(yield call(changeEqConfirm, payload ));
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
