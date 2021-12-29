/*
 * @Description: 来料录入
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-04 10:46:38
 * @LastEditTime: 2020-11-03 12:31:57
 */

import { getResponse, parseParameters, createPagination } from 'utils/utils';
import { queryMapIdpValue, queryUnifyIdpValue } from 'services/api';
import {
  fetchWorkDetails,
  createWoIncomingRecord,
  fetchWoIncomingRecord,
  bindMaterialWo,
  enterSite,
  getSiteList,
  fetchCosNumRemainingNum,
  scaneMaterialCode,
  getEquipmentList,
  ncLoad,
  deleteNcLoad,
  fetchrRemainingQty,
  changeCosType,
  bindingEq,
  bindingEqConfirm,
  deleteEq,
  changeEq,
  fetchEqInfo,
  fetchMainMaterial,
  updateWo,
} from '@/services/hhme/incomingMaterialEntryService';

export default {
  namespace: 'incomingMaterialEntry',
  state: {
    workcellInfo: {}, // 工位信息
    defaultSite: {},
    containerCapacity: {}, // 容器芯片扩展属性-行数、列数、芯片数
    woIncomingRecordList: [], // 工单来料记录表
    materialContainerInfo: {}, // 物料、容器的部分信息
    materialList: [], // 物料信息
    incomingQtyAndremainingQty: {}, // 工单来料芯片数、剩余芯片数
    materialInfo: {}, // 扫描条码返回的条码信息
    equipmentList: [], // 设备列表
    locationMapInfo: {}, // 点击每个小格子带出的数据
    barCol: '', // bar条的位置
    heightBack: '',
    woInfo: {}, // 工单信息
    ncList: [], // 点击的nc
    remainingQty: '',
    incomingQty: '',
    unitQty: '',
    mainMaterialList: [],
    woWithCosType: '', // 选中工单带出的costype
  },
  effects: {
    // 批量查询独立值集
    *batchLovData(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          cosType: 'HME_COS_TYPE',
        })
      );
      const res = getResponse(
        yield call(queryUnifyIdpValue, 'HME_COS_CONTAINER_TYPE_INFO')
      );
      if (result&&res) {
        yield put({
          type: 'updateState',
          payload: {
            lovData: {
              ...result,
              containerType: res,
            },
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
      }
      return result;
    },
    *getEquipmentList({ payload }, { call, put }) {
      const result = getResponse(yield call(getEquipmentList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            equipmentList: result.hmeWkcEquSwitchVOS,
          },
        });
      }
      return result;
    },
    *fetchWoIncomingRecord({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchWoIncomingRecord, parseParameters(payload)));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            woIncomingRecordList: res.content,
            woIncomingRecordListPagination: createPagination(res),
          },
        });
      }
      return res;
    },
    *fetchWorkDetails({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchWorkDetails, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            materialList: res.dtoList,
            materialInfo: res,
          },
        });
      }
      return res;
    },
    // 获取工单来料芯片数、剩余芯片数量
    *fetchCosNumRemainingNum({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchCosNumRemainingNum, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            incomingQty: res.incomingQty,
          },
        });
      }
      return res;
    },
    *createWoIncomingRecord({ payload }, { call }) {
      const res = getResponse(yield call(createWoIncomingRecord, payload));
      return res;
    },
    // 扫描条码
    *scaneMaterialCode({ payload }, { call, put }) {
      const res = getResponse(yield call(scaneMaterialCode, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            materialInfo: res,
          },
        });
      }
      return res;
    },
    *bindMaterialWo({ payload }, { call }) {
      const res = getResponse(yield call(bindMaterialWo, payload));
      return res;
    },
    // 不良确认
    *ncLoad({ payload }, { call }) {
      const res = getResponse(yield call(ncLoad, payload));
      return res;
    },
    // 不良取消
    *deleteNcLoad({ payload }, { call }) {
      const res = getResponse(yield call(deleteNcLoad, payload));
      return res;
    },
    // 获取剩余芯片数
    *fetchrRemainingQty({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchrRemainingQty, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            remainingQty: res.remainingQty,
            woWithCosType: res.cosType,
          },
        });
      }
      return res;
    },
    // 更改costype
    *changeCosType({ payload }, { call, put }) {
      const res = getResponse(yield call(changeCosType, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            unitQty: res.incomingQty,
          },
        });
      }
      return res;
    },
    *bindingEq({ payload }, { call }) {
      const res = getResponse(yield call(bindingEq, payload));
      return res;
    },
    *bindingEqConfirm({ payload }, { call }) {
      const res = getResponse(yield call(bindingEqConfirm, payload ));
      return res;
    },
    *deleteEq({ payload }, { call }) {
      const res = getResponse(yield call(deleteEq, payload));
      return res;
    },
    *changeEq({ payload }, { call }) {
      const res = getResponse(yield call(changeEq, payload));
      return res;
    },

    *fetchEqInfo({ payload }, { call }) {
      const res = getResponse(yield call(fetchEqInfo, payload ));
      return res;
    },
    // 获取工单组件
    *fetchMainMaterial({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchMainMaterial, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            mainMaterialList: res,
          },
        });
      }
      return res;
    },
    *updateWo({ payload }, { call }) {
      const res = getResponse(yield call(updateWo, payload ));
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
