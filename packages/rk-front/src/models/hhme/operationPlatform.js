/**
 * operationPlatform - 工序models
 * @date: 2020/02/27 19:53:47
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import { isArray, isEmpty, get as chainget } from 'lodash';
import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
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
  changeEqConfirm,
  bindingEqConfirm,
  saveMaterialList,
  fetchMaterialList,
  deleteMaterialList,
  // addDataRecordBatch,
  getThorlabs,
  getOphir,
  deleteAddDataRecordList,
  uninstallContainer,
  checkBatchItem,
  checkTimeItem,
  deleteBatchItem,
  deleteTimeItem,
  feedMaterialItem,
  updateLotReleaseQty,
  updateTimeReleaseQty,
  returnMaterial,
  fetchFeedingRecord,
  deleteSerialItem,
  checkSerialItem,
  calculate,
  fetchDataRecordList,
  fetchSerialItemList,
  fetchBatchItemList,
  fetchTimeItemList,
  refreshMaterialItemList,
  fetchLocationInfo,
  fetchBomList,
  fetchBackMaterialInfo,
  checkSn,
  deleteData,
  deleteAndBand,
} from '../../services/hhme/operationPlatformService';


export default {
  namespace: 'operationPlatform',
  state: {
    baseInfo: {},
    workCellInfo: {}, // 工位信息
    snNum: null,
    materialVOList: [], // 序列号物料
    lotMaterialVOList: [], // 批次物料
    timeMaterialVOList: [], // 时序物料
    dataRecordList: [],
    containerList: [],
    selfCheckList: [],
    equipmentInfo: {},
    equipmentList: [],
    eoStepList: [], // 当前工序下拉框值
    outOfPlanMaterialList: [], // 当前工位下绑定的计划外投料
    containerInfo: {}, // 容器相关信息
    feedingRecordList: [],
    hmeTagNcVOList: [],
    locatorTypeList: [],
    backMaterialList: [],
    backMaterialPagination: {},
    locationList: [],
    locationPagination: {},
    bomList: [],
    bomPagination: {},
    exceptionEquipmentCodes: '',
    errorEquipmentCodes: '',
  },
  effects: {
    *init(_, { call, put }) {
      const res = yield call(queryMapIdpValue, {
        locatorTypeList: 'HME.LOCATOR_TYPE',
      });
      yield put({
        type: 'updateState',
        payload: {
          ...res,
        },
      });
    },
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

    *fetchBaseInfo({ payload }, { call, put }) {
      const { eoStepList, ...params } = payload;
      const res = getResponse(yield call(fetchBaseInfo, params));
      if (res) {
        const {
          containerVO2List,
          dataRecordVOList,
          materialVOList,
          lotMaterialVOList,
          timeMaterialVOList,
          hmeEoStepList,
          hmeEoJobSnList,
          ...baseInfo
        } = res;
        // const addDataRecordList = isArray(dataRecordVOList)
        // ? dataRecordVOList
        //     .filter(e => e.groupPurpose === 'DATA')
        //     .map(e => e.equipmentCategory || e.resultType === 'VALUE' ? { ...e, isEdit: false, _status: 'update' } : {...e, isEdit: false})
        // : [];
        const payloadData = {
          baseInfo,
          // addDataRecordList,
          materialVOList: isArray(materialVOList) ? materialVOList : [],
          lotMaterialVOList: isArray(lotMaterialVOList) ? lotMaterialVOList : [],
          timeMaterialVOList: isArray(timeMaterialVOList) ? timeMaterialVOList : [],
          dataRecordList: isArray(dataRecordVOList)
            ? dataRecordVOList
              .filter(e => ['DATA', 'LAB'].includes(e.groupPurpose)).map(e => ({ ...e, _status: 'update' }))
            : [],
          selfCheckList: isArray(dataRecordVOList)
            ? dataRecordVOList.filter(e => e.groupPurpose === 'GENERAL')
            : [],
          snNum: payload.snNum,
          eoStepList: isEmpty(hmeEoStepList) ? eoStepList : hmeEoStepList,
          reworkNumList: isEmpty(hmeEoJobSnList) ? [] : hmeEoJobSnList,
        };
        yield put({
          type: 'updateState',
          payload: payloadData,
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

    *outSite({ payload }, { call, put }) {
      const res = getResponse(yield call(outSite, payload));
      if (res && !res.errorCode) {
        const {
          containerVO2List,
          dataRecordVOList,
          materialVOList,
          lotMaterialVOList,
          timeMaterialVOList,
          hmeEoJobSnList,
          hmeTagNcVOList,
          ...baseInfo
        } = res;
        yield put({
          type: 'updateState',
          payload: {
            baseInfo,
            hmeTagNcVOList: isArray(hmeTagNcVOList) ? hmeTagNcVOList : [],
          },
        });
      }
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
            // addDataRecordList: dataRecordList.map(e => e.equipmentCategory || e.resultType === 'VALUE' ? { ...e, isEdit: false, _status: 'update' } : e),
          };
        }
        // else if(dataSourceName === 'addDataRecordList') {
        //   list.forEach(e => {
        //     delete e.isEdit;
        //     delete e._status;
        //   });
        //   const dataRecordList = list.map(e => (
        //     e.jobRecordId === res.jobRecordId ? res : e
        //   ));
        //   newPayload = {
        //     dataRecordList,
        //     addDataRecordList: dataRecordList.map(e => e.equipmentCategory || e.resultType === 'VALUE' ? { ...e, isEdit: false, _status: 'update' } : {...e, isEdit: false}),
        //   };
        // }
        else if (dataSourceName === 'selfCheckList') {
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
        return res;
      }
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
    *saveMaterialList({ payload }, { call }) {
      const res = getResponse(yield call(saveMaterialList, payload));
      return res;
    },
    *fetchMaterialList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchMaterialList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            outOfPlanMaterialList: isArray(res) ? res : [], // 计划外投料列表
          },
        });
      }
    },
    *deleteMaterialList({ payload }, { call }) {
      const res = getResponse(yield call(deleteMaterialList, payload));
      return res;
    },

    // *addDataRecordBatch({ payload }, { call, put }) {
    //   const { list, eqDataList, dataSourceName } = payload;
    //   const res = getResponse(yield call(addDataRecordBatch, eqDataList));
    //   if(res) {
    //     const resJobRecordIds = res.map(e => e.jobRecordId);
    //     const noCreateRecordIds = list.filter(e => e._status !== 'create').map(e => e.jobRecordId);
    //     let newDataRecord = list.filter(e => e._status !== 'create');
    //     resJobRecordIds.forEach(e => {
    //       if(noCreateRecordIds.includes(e)) {
    //         newDataRecord = newDataRecord.map(i => {
    //           if(resJobRecordIds.includes(i.jobRecordId)) {
    //             const obj = res.find(a => a.jobRecordId === i.jobRecordId);
    //             return {...obj, isEdit: false};
    //           }
    //           return {...i, isEdit: false};
    //         });
    //       } else {
    //         const obj = res.find(i => i.jobRecordId === e);
    //         const { _status, isEdit, ...newObj } = obj;
    //         newDataRecord = [{ ...newObj }].concat(newDataRecord);
    //       }
    //     });
    //     let newPayload = {};
    //     if(dataSourceName === 'addDataSourceName') {
    //       newDataRecord.forEach(e => {
    //         delete e.isEdit;
    //         delete e._status;
    //       });
    //     }
    //     newPayload = {
    //       dataRecordList: newDataRecord,
    //       // addDataRecordList: newDataRecord.map(e => e.equipmentCategory || e.resultType === 'VALUE' ? { ...e, isEdit: false, _status: 'update' } : {...e, isEdit: false}),
    //     };
    //     yield put({
    //       type: 'updateState',
    //       payload: newPayload,
    //     });
    //   }
    //   return res;
    // },

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

    *deleteAddDataRecordList({ payload }, { call }) {
      const res = getResponse(yield call(deleteAddDataRecordList, payload));
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
      let newPayload = {};
      if (res && res.failed) {
        newPayload = {
          timeMaterialVOList,
        };
      } else {
        const itemMaterialIds = itemList.map(e => e.jobMaterialId);
        const newTimeMaterialVOList = timeMaterialVOList.map(e => {
          if (itemMaterialIds.includes(e.jobMaterialId)) {
            const newObj = itemList.find(i => i.jobMaterialId === e.jobMaterialId);
            return newObj;
          }
          return e;
        });
        newPayload = {
          timeMaterialVOList: newTimeMaterialVOList,
        };
      }
      yield put({
        type: 'updateState',
        payload: newPayload,
      });
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
    *fetchDataRecordList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchDataRecordList, payload));
      if (res) {
        // const addDataRecordList = isArray(res)
        // ? res
        //     .filter(e => e.groupPurpose === 'DATA')
        //     .map(e => e.equipmentCategory || e.resultType === 'VALUE' ? { ...e, isEdit: false, _status: 'update' } : {...e, isEdit: false})
        // : [];
        yield put({
          type: 'updateState',
          payload: {
            dataRecordList: isArray(res) ? res.filter(e => e.groupPurpose === 'DATA') : [],
            // addDataRecordList,
          },
        });
      }
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
    *fetchLocationInfo({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchLocationInfo, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            locationList: res.content,
            locationPagination: createPagination(res),
          },
        });
      }
    },
    // 查询组件下面装配清单表格数据
    *fetchBomList({ payload }, { call, put }) {
      const res = yield call(fetchBomList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            bomList: chainget(list, 'rows.content', []),
            bomPagination: createPagination(list.rows),
          },
        });
      }
    },

    *fetchBackMaterialInfo({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchBackMaterialInfo, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            backMaterialList: res.content,
            backMaterialPagination: createPagination(res),
          },
        });
      }
    },

    *checkSn({ payload }, { call }) {
      const res = yield call(checkSn, payload);
      return res;
    },

    /**
     *数据删除
     */
    *deleteData({ payload }, { call }) {
      const res = getResponse(yield call(deleteData, payload));
      return res;
    },

    /**
     *条码物料删除并绑定数据
     */
    *deleteAndBand({ payload }, { call, put }) {
      const res = getResponse(yield call(deleteAndBand, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            materialVOList: res,
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
