/*
 * @Description: 来料录入-新版
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-11-03 11:41:49
 * @LastEditTime: 2020-11-23 21:45:09
 */

import { getResponse, parseParameters, createPagination } from 'utils/utils';
import { queryMapIdpValue, queryUnifyIdpValue } from 'services/api';
import {
  fetchWorkDetails,
  createWoIncomingRecord,
  fetchWoIncomingRecord,
  enterSite,
  getSiteList,
  fetchCosNumRemainingNum,
  scaneMaterialCode,
  getEquipmentList,
  fetchrRemainingQty,
  changeCosType,
  fetchMainMaterial,
  queryMateriallotQty,
  materiallotSplit,
  fetchWorkDetailsCreate,
  handleSave,
  materiallotWaferSplit,
  queryHeadDataList,
  queryLineDataList,
  headPrint,
  exportExcel,
} from '@/services/hhme/incomingMaterialEntryService';

export default {
  namespace: 'incomingMaterialEntryPlus',
  state: {
    workcellInfo: {}, // 工位信息
    defaultSite: {},
    containerCapacity: {}, // 容器芯片扩展属性-行数、列数、芯片数
    woIncomingRecordList: [], // 工单来料记录表
    woIncomingRecordListPagination: {},
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
    splitQty: 0, // 拆分数量
    incomingQty: '',
    unitQty: '',
    mainMaterialList: [],
    woWithCosType: '', // 选中工单带出的costype
    enterSiteVisible: true,
    primaryUomQty: '',
    targetList: [],
    materiallotSplitData: {}, // 拆分
    barNumCount: '',
    cosNumCount: '',
    headList: [],
    headPagination: {},
    lineList: [],
    linePagination: {},
  },
  effects: {
    // 批量linePagination查询独立值集
    *batchLovData(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          cosType: 'HME_COS_TYPE',
        })
      );
      const res = getResponse(
        yield call(queryUnifyIdpValue, 'HME_COS_CONTAINER_TYPE_INFO')
      );
      if (result && res) {
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
    // 扫描条码带出数量
    *queryMateriallotQty({ payload }, { call, put }) {
      const res = getResponse(yield call(queryMateriallotQty, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            primaryUomQty: res.primaryUomQty,
            materialLotId: res.materialLotId,
          },
        });
      }
      return res;
    },
    // 拆分
    *materiallotSplit({ payload }, { call }) {
      const res = getResponse(yield call(materiallotSplit, payload));
      return res;
    },

    // WAFER拆分
    *materiallotWaferSplit({ payload }, { call }) {
      const res = getResponse(yield call(materiallotWaferSplit, payload));
      return res;
    },

    // 查询明细
    *fetchWorkDetailsCreate({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchWorkDetailsCreate, payload));
      if (res) {
        // 计算对应的拆分数量
        let splitQty = 0;
        for(let i=0; i<res.targetList.length; i++){
          splitQty+=(res.targetList[i].transferQuantity?Number(res.targetList[i].transferQuantity):0);
        }
        yield put({
          type: 'updateState',
          payload: {
            materiallotSplitData: res,
            targetList: res.targetList,
            splitQty,
          },
        });
      }
      return res;
    },
    *handleSave({ payload }, { call }) {
      const res = getResponse(yield call(handleSave, payload));
      return res;
    },

    *queryHeadDataList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryHeadDataList, parseParameters(payload)));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            headList: res.content,
            headPagination: createPagination(res),
            lineList: [],
            linePagination: {},
          },
        });
      }
      return res;
    },

    *queryLineDataList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryLineDataList, parseParameters(payload)));
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

    // 头打印
    *headPrint({ payload }, { call }) {
      const res = getResponse(yield call(headPrint, payload));
      return res;
    },

    // 导出
    *exportExcel({ payload }, { call }) {
      const result = getResponse(yield call(exportExcel, payload));
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
