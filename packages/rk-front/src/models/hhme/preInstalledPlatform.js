/**
 * operationPlatform - 工序models
 * @date: 2020/02/27 19:53:47
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import { isArray, isEmpty } from 'lodash';
import { getResponse } from 'utils/utils';
import {
  fetchWorkCellInfo,
  fetchBaseInfo,
  feedBatchItem,
  feedTimeItem,
  feedSerialItem,
  outSite,
  updateContainer,
  addDataRecord,
  fetchContainerInfo,
  fetchDefaultSite,
  fetchEquipmentList,
  changeEq,
  // checkEq,
  deleteEq,
  bindingEq,
  fetchEqInfo,
  fetchCompletedMaterialInfo,
  changeEqConfirm,
  bindingEqConfirm,
  getThorlabs,
  getOphir,
  uninstallContainer,
  checkBatchItem,
  checkTimeItem,
  deleteBatchItem,
  deleteTimeItem,
  deleteSerialItem,
  feedMaterialItem,
  updateLotReleaseQty,
  updateTimeReleaseQty,
  returnMaterial,
  fetchFeedingRecord,
  checkSerialItem,
  calculate,
  fetchSerialItemList,
  fetchBatchItemList,
  fetchTimeItemList,
  refreshMaterialItemList,
} from '../../services/hhme/operationPlatformService';

export default {
  namespace: 'preInstalledPlatform',
  state: {
    baseInfo: {},
    workCellInfo: {},
    snNum: null,
    materialVOList: [], // 序列号物料
    lotMaterialVOList: [], // 批次物料
    timeMaterialVOList: [], // 时序物料
    equipmentList: [],
    dataRecordList: [],
    containerList: [],
    selfCheckList: [],
    equipmentInfo: {},
    workOrderInfo: {},
    currentEoStepList: [], // 当前工序下拉框值
    outOfPlanMaterialList: [],
    containerInfo: {}, // 容器相关信息
    exceptionEquipmentCodes: '',
    errorEquipmentCodes: '',
  },
  effects: {
    *fetchWorkCellInfo({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchWorkCellInfo, payload));
      if (res) {
        const {
          hmeEoJobContainerVO2,
          lotMaterialVOList,
          timeMaterialVOList,
          ...workCellInfo
        } = res;
        yield put({
          type: 'updateState',
          payload: {
            workCellInfo: {
              ...workCellInfo,
              activity: workCellInfo.activity * workCellInfo.rate / 100,
            },
            containerInfo: {
              ...hmeEoJobContainerVO2,
              maxLoadQty: isEmpty(hmeEoJobContainerVO2) ? 0 : hmeEoJobContainerVO2.maxLoadQty,
              materialLotList: isEmpty(hmeEoJobContainerVO2) ? [] : hmeEoJobContainerVO2.materialLotList,
            },
            lotMaterialVOList: isArray(lotMaterialVOList) ? lotMaterialVOList : [],
            timeMaterialVOList: isArray(timeMaterialVOList) ? timeMaterialVOList : [],
          },
        });
      }
      return res;
    },

    *fetchCompletedMaterialInfo({ payload }, { call, put }) {
      const { workOrderInfo, workOrderId, materialId } = payload;
      const params = {
        workOrderId,
        materialId,
      };
      const res = getResponse(yield call(fetchCompletedMaterialInfo, params));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            workOrderInfo: {
              ...workOrderInfo,
              preparedQty: res.preparedQty,
            },
          },
        });
      }
    },

    *fetchBaseInfo({ payload }, { call, put }) {
      const { currentEoStepList, workOrderInfo, ...params } = payload;
      const res = getResponse(yield call(fetchBaseInfo, params));
      if (res) {
        const {
          containerVO2List,
          dataRecordVOList,
          materialVOList,
          lotMaterialVOList,
          timeMaterialVOList,
          hmeEoJobSnList,
          ...baseInfo
        } = res;
        yield put({
          type: 'updateState',
          payload: {
            baseInfo,
            materialVOList: isArray(materialVOList) ? materialVOList : [],
            lotMaterialVOList: isArray(lotMaterialVOList) ? lotMaterialVOList : [],
            timeMaterialVOList: isArray(timeMaterialVOList) ? timeMaterialVOList : [],
            dataRecordList: isArray(dataRecordVOList)
              ? dataRecordVOList
                .filter(e => e.groupPurpose === 'DATA').map(e => ({ ...e, _status: 'update' }))
              : [],
            selfCheckList: isArray(dataRecordVOList)
              ? dataRecordVOList.filter(e => e.groupPurpose === 'GENERAL')
              : [],
            snNum: payload.snNum,
            currentEoStepList: isEmpty(hmeEoJobSnList) ? currentEoStepList : hmeEoJobSnList,
            workOrderInfo: { ...workOrderInfo, prepareQty: payload.prepareQty },
          },
        });
      }
      return res;
    },

    *feedBatchItem({ payload }, { call, put }) {
      const res = getResponse(yield call(feedBatchItem, payload));
      if (res && isArray(res) && res.length > 0 && res[0].deleteFlag !== 'Y') {
        yield put({
          type: 'updateState',
          payload: {
            lotMaterialVOList: res,
          },
        });
      }
      return res;
    },

    *feedTimeItem({ payload }, { call, put }) {
      const res = getResponse(yield call(feedTimeItem, payload));
      if (res && isArray(res) && res.length > 0 && res[0].deleteFlag !== 'Y') {
        yield put({
          type: 'updateState',
          payload: {
            timeMaterialVOList: res,
          },
        });
      }
      return res;
    },

    *feedSerialItem({ payload }, { call, put }) {
      const res = getResponse(yield call(feedSerialItem, payload));
      if (res && isArray(res) && res.length > 0 && res[0].deleteFlag !== 'Y') {
        yield put({
          type: 'updateState',
          payload: {
            materialVOList: res,
          },
        });
      }
      return res;
    },

    *outSite({ payload }, { call }) {
      const res = getResponse(yield call(outSite, payload));
      return res;
    },

    *updateContainer({ payload }, { call, put }) {
      const { workCellInfo, ...params } = payload;
      const res = getResponse(yield call(updateContainer, params));
      if (res) {
        const { jobContainerId, containerCode, materialLotList } = res;
        yield put({
          type: 'updateState',
          payload: {
            workCellInfo: {
              ...workCellInfo,
              jobContainerId,
              containerCode,
            },
            containerInfo: {
              ...res,
              materialLotList: isArray(materialLotList) ? materialLotList : [],
            },
          },
        });
      }
      return res;
    },

    *addDataRecord({ payload }, { call, put }) {
      const { list, dataSourceName, ...params } = payload;
      const res = getResponse(yield call(addDataRecord, params));
      if (res) {
        let newPayload = {};
        if (dataSourceName === 'dataRecordList') {
          const dataRecordList = list.map(e => (
            e.jobRecordId === res.jobRecordId ? { ...res, _status: 'update' } : e
          ));
          newPayload = {
            dataRecordList,
          };
        } else if (dataSourceName === 'selfCheckList') {
          newPayload = {
            selfCheckList: list.map(e => (
              e.jobRecordId === res.jobRecordId ? res : e
            )),
          };
        }
        yield put({
          type: 'updateState',
          payload: newPayload,
        });
      }
      return res;
    },

    *fetchContainerInfo({ payload }, { call, put }) {
      const { containerInfo, workCellInfo, ...params } = payload;
      const res = getResponse(yield call(fetchContainerInfo, params));
      if (res) {
        const { jobContainerId, containerCode, materialLotList } = res;
        yield put({
          type: 'updateState',
          payload: {
            workCellInfo: {
              ...workCellInfo,
              jobContainerId,
              containerCode,
            },
            containerInfo: {
              ...containerInfo,
              ...res,
              materialLotList: isArray(materialLotList) ? materialLotList : [],
            },
            containerList: materialLotList,
          },
        });
      }
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
      }
      return res;
    },

    *fetchEquipmentList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchEquipmentList, payload));
      if (res) {
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
      const res = getResponse(yield call(changeEq, payload));
      return res;
    },

    *deleteEq({ payload }, { call }) {
      const res = getResponse(yield call(deleteEq, payload));
      return res;
    },

    *bindingEq({ payload }, { call }) {
      const res = getResponse(yield call(bindingEq, payload));
      return res;
    },

    *fetchEqInfo({ payload }, { call }) {
      const res = getResponse(yield call(fetchEqInfo, payload));
      return res;
    },

    *bindingEqConfirm({ payload }, { call }) {
      const res = getResponse(yield call(bindingEqConfirm, payload));
      return res;
    },

    *changeEqConfirm({ payload }, { call }) {
      const res = getResponse(yield call(changeEqConfirm, payload));
      return res;
    },

    // *checkEq({ payload }, { call }) {
    //   const res = getResponse(yield call(checkEq, payload));
    //   return res;
    // },
    *getOphir({ payload }, { call }) {
      const res = getResponse(yield call(getOphir, payload));
      return res;
    },

    *getThorlabs({ payload }, { call }) {
      const res = getResponse(yield call(getThorlabs, payload));
      return res;
    },
    *uninstallContainer({ payload }, { call, put }) {
      const { workCellInfo, containerInfo, ...params } = payload;
      const res = getResponse(yield call(uninstallContainer, params));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            workCellInfo: {
              ...workCellInfo,
              jobContainerId: null,
              containerCode: null,
            },
            containerInfo: {
              ...containerInfo,
              maxLoadQty: 0,
              materialLotList: [],
            },
          },
        });
      }
      return res;
    },

    *checkBatchItem({ payload }, { call, put }) {
      const { itemList, lotMaterialVOList } = payload;
      const res = yield call(checkBatchItem, itemList);
      let newPayload = {};
      if (res && res.failed) {
        newPayload = {
          lotMaterialVOList,
        };
      } else {
        const itemMaterialIds = itemList.map(e => e.jobMaterialId);
        const newLotMaterialVOList = lotMaterialVOList.map(e => {
          if (itemMaterialIds.includes(e.jobMaterialId)) {
            const newObj = itemList.find(i => i.jobMaterialId === e.jobMaterialId);
            return newObj;
          }
          return e;
        });
        newPayload = {
          lotMaterialVOList: newLotMaterialVOList,
        };
      }
      yield put({
        type: 'updateState',
        payload: newPayload,
      });
      return res;
    },
    *checkTimeItem({ payload }, { call, put }) {
      const { itemList, timeMaterialVOList } = payload;
      const res = yield call(checkTimeItem, itemList);
      let newTimeMaterialVOList = {};
      if (res && res.failed) {
        newTimeMaterialVOList = [];
      } else {
        const itemMaterialIds = res.map(e => e.jobMaterialId);
        newTimeMaterialVOList = timeMaterialVOList.map(e => {
          if (itemMaterialIds.includes(e.jobMaterialId)) {
            const newObj = res.find(i => i.jobMaterialId === e.jobMaterialId);
            return newObj;
          }
          return e;
        });
      }
      yield put({
        type: 'updateState',
        payload: {
          timeMaterialVOList: newTimeMaterialVOList,
        },
      });
      return res;
    },
    *deleteTimeItem({ payload }, { call, put }) {
      const res = getResponse(yield call(deleteTimeItem, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            timeMaterialVOList: isArray(res) ? res : [],
          },
        });
      }
      return res;
    },
    *deleteBatchItem({ payload }, { call, put }) {
      const res = getResponse(yield call(deleteBatchItem, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            lotMaterialVOList: isArray(res) ? res : [],
          },
        });
      }
      return res;
    },

    *deleteSerialItem({ payload }, { call, put }) {
      const res = getResponse(yield call(deleteSerialItem, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            materialVOList: isArray(res) ? res : [],
          },
        });
      }
      return res;
    },
    *feedMaterialItem({ payload }, { call, put }) {
      const res = getResponse(yield call(feedMaterialItem, payload));
      if (res) {
        if (res.overReleaseFlag !== 'Y') {
          const newPayload = payload.materialType === 'TIME' ? {
            timeMaterialVOList: isArray(res.timeMaterialVOList) ? res.timeMaterialVOList : [],
          } : payload.materialType === 'LOT' ? {
            lotMaterialVOList: isArray(res.lotMaterialVOList) ? res.lotMaterialVOList : [],
          } : {
            materialVOList: isArray(res.materialVOList) ? res.materialVOList : [],
          };
          yield put({
            type: 'updateState',
            payload: newPayload,
          });
        }
      }
      return res;
    },
    *checkSerialItem({ payload }, { call, put }) {
      const { itemList, materialVOList } = payload;
      const res = yield call(checkSerialItem, itemList);
      let newPayload = {};
      if (res && res.failed) {
        newPayload = {
          materialVOList,
        };
      } else {
        const itemMaterialIds = itemList.map(e => e.jobMaterialId);
        const newMaterialVOList = materialVOList.map(e => {
          if (itemMaterialIds.includes(e.jobMaterialId)) {
            const newObj = itemList.find(i => i.jobMaterialId === e.jobMaterialId);
            return newObj;
          }
          return e;
        });
        newPayload = {
          materialVOList: newMaterialVOList,
        };
      }
      yield put({
        type: 'updateState',
        payload: newPayload,
      });
      return res;
    },
    *updateLotReleaseQty({ payload }, { call, put }) {
      const { info, lotMaterialVOList } = payload;
      const res = getResponse(yield call(updateLotReleaseQty, info));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            lotMaterialVOList: lotMaterialVOList.map(e => e.jobMaterialId === res.jobMaterialId ? res : e),
          },
        });
      }
      return res;
    },
    *updateTimeReleaseQty({ payload }, { call, put }) {
      const { info, timeMaterialVOList } = payload;
      const res = getResponse(yield call(updateTimeReleaseQty, info));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            timeMaterialVOList: timeMaterialVOList.map(e => e.jobMaterialId === res.jobMaterialId ? res : e),
          },
        });
      }
      return res;
    },

    *returnMaterial({ payload }, { call }) {
      const res = getResponse(yield call(returnMaterial, payload));
      return res;
    },

    *fetchFeedingRecord({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchFeedingRecord, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            feedingRecordList: res,
          },
        });
      }
      return res;
    },
    *calculate({ payload }, { call, put }) {
      const { dataRecordList, data } = payload;
      const res = getResponse(yield call(calculate, data));
      if (res) {
        const newDataRecord = dataRecordList.map(e => e.jobRecordId === res.jobRecordId ? { ...res, _status: 'update' } : e);
        yield put({
          type: 'updateState',
          payload: {
            dataRecordList: newDataRecord,
          },
        });
      }
      return res;
    },
    *fetchSerialItemList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchSerialItemList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            materialVOList: isArray(res) ? res : [],
          },
        });
      }
      return res;
    },
    *fetchBatchItemList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchBatchItemList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            lotMaterialVOList: isArray(res) ? res : [],
          },
        });
      }
      return res;
    },
    *fetchTimeItemList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchTimeItemList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            timeMaterialVOList: isArray(res) ? res : [],
          },
        });
      }
      return res;
    },
    *refreshMaterialItemList({ payload }, { call, put }) {
      const res = getResponse(yield call(refreshMaterialItemList, payload));
      if (res) {
        const {
          materialVOList,
          lotMaterialVOList,
          timeMaterialVOList,
        } = res;
        const payloadData = {
          materialVOList: isArray(materialVOList) ? materialVOList : [],
          lotMaterialVOList: isArray(lotMaterialVOList) ? lotMaterialVOList : [],
          timeMaterialVOList: isArray(timeMaterialVOList) ? timeMaterialVOList : [],
        };
        yield put({
          type: 'updateState',
          payload: payloadData,
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
