// 贴片录入
import { isArray } from 'lodash';
import { getResponse } from 'utils/utils';
import { queryUnifyIdpValue } from 'services/api';

import {
  enterSite,
  getSiteList,
  getEquipmentList,
  getMaterialList,
  queryBox,
  scanBox,
  queryBoxNo,
  deleteBox,
  setOutBox,
  checkMaterialCode,
  queryQty,
  createBarCode,
  setOut,
  print,
  bindingMaterial,
  unbindingMaterial,
  fetchDefaultSite,
  changeEq,
  deleteEq,
  bindingEq,
  fetchEqInfo,
  changeEqConfirm,
  bindingEqConfirm,
  deleteBoxData,
} from '@/services/hhme/goldThreadService';

export default {
  namespace: 'goldThread',
  state: {
    workcellInfo: {}, // 工位信息
    defaultSite: {},
    equipmentList: [], // 设备列表
    materialLot: {}, // 物料批
    materialList: [], // 物料批列表
    boxNoList: {}, // 贴片列表
    lineList: [], // 根据容器切割数据
    equipmentInfo: {},
    errorEquipmentCodes: "",
    exceptionEquipmentCodes: "",
    siteId: '',
  },
  effects: {
    // 批量查询独立值集
    *batchLovData(_, { call, put }) {
      const result = getResponse(yield call(queryUnifyIdpValue, 'HME_COS_CONTAINER_TYPE_INFO'));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            containerType: result,
          },
        });
      }
    },
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
            workcellInfo: {
              ...result,
              operationId: result.operationIdList[0],
            },
          },
        });
        // 查询对应的物料批
        const resultMa = getResponse(yield call(getMaterialList, result));
        if (resultMa) {
          yield put({
            type: 'updateState',
            payload: {
              materialList: resultMa,
            },
          });
        }
      }
      return result;
    },

    // 查询设备
    *getEquipmentList({ payload }, { call, put }) {
      const result = getResponse(yield call(getEquipmentList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            equipmentList: isArray(result.hmeWkcEquSwitchVOS) ? result.hmeWkcEquSwitchVOS : [],
            equipmentInfo: result.hmeWkcEquSwitchVO3,
            errorEquipmentCodes: result.errorEquipmentCodes,
            exceptionEquipmentCodes: result.exceptionEquipmentCodes,
          },
        });
      }
      return result;
    },

    // 查询物料批
    *getMaterialList({ payload }, { call, put }) {
      const result = getResponse(yield call(getMaterialList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            materialList: result,
          },
        });
      }
      return result;
    },

    // 查询shuj了
    *queryQty({ payload }, { call }) {
      const result = getResponse(yield call(queryQty, payload));
      return result;
    },

    // 扫描条码
    *checkMaterialCode({ payload }, { call }) {
      const res = getResponse(yield call(checkMaterialCode, payload));
      return res;
    },


    // 查询盒子
    *queryBox({ payload }, { call, put }) {
      const res = getResponse(yield call(queryBox, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            materialLot: res,
          },
        });
      }
      return res;
    },
    // 查询盒子
    *scanBox({ payload }, { call, put }) {
      const res = getResponse(yield call(scanBox, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            materialLot: res,
          },
        });
      }
      return res;
    },

    // 查询贴片信息
    *queryBoxNo({ payload }, { call, put }) {
      // 先清空表数据
      const res = getResponse(yield call(queryBoxNo, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            boxNoList: res,
          },
        });
      }
      return res;
    },


    // 出站
    *setOutBox({ payload }, { call }) {
      const res = getResponse(yield call(setOutBox, payload));
      return res;
    },

    // 删除
    *deleteBox({ payload }, { call }) {
      const res = getResponse(yield call(deleteBox, payload));
      return res;
    },

    // 新建贴片数据
    *createBarCode({ payload }, { call }) {
      const res = getResponse(yield call(createBarCode, payload));
      return res;
    },

    // 出站
    *setOut({ payload }, { call }){
      const res = getResponse(yield call(setOut, payload));
       return res;
    },

    // 打印
    *print({ payload }, { call }) {
      const resPrint =getResponse( yield call(print, payload));
        return resPrint;
    },

    // 绑定
    *bindingMaterial({ payload }, { call }) {
      const res = getResponse(yield call(bindingMaterial, payload));
      return res;
    },

    // 解绑
    *unbindingMaterial({ payload }, { call }) {
      const res = getResponse(yield call(unbindingMaterial, payload));
      return res;
    },
    *fetchDefaultSite(_, { call, put }) {
      const res = getResponse(yield call(fetchDefaultSite));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            siteId: res.siteId,
          },
        });
        return res;
      }
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

    *deleteBoxData({ payload }, { call }) {
      const res = getResponse(yield call(deleteBoxData, payload ));
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
