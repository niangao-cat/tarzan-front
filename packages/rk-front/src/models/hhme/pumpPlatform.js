/**
 * operationPlatform - 工序models
 * @date: 2020/02/27 19:53:47
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import { isArray, isEmpty } from 'lodash';
import { getResponse, createPagination } from 'utils/utils';
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
  deleteEq,
  bindingEq,
  fetchEqInfo,
  changeEqConfirm,
  bindingEqConfirm,
  fetchMaterialList,
  getThorlabs,
  getOphir,
  uninstallContainer,
  firstProcessSerialItem,
  fetchMaterialLotList,
  fetchEoList,
  fetchIsContainer,
  returnMaterial,
  fetchFeedingRecord,
  calculate,
  fetchDataRecordList,
  deleteData,
  deleteAndBand,
  autoCreateSnNum,
  scanBarcode,
  deleteBarcode,
  feedMaterialList,
  fetchWorkCellMaterialList,
  fetchESopList,
  returnSnMaterial,
  printMaterialCode,
} from '../../services/hhme/pumpPlatformService';


export default {
  namespace: 'pumpPlatform',
  state: {
    baseInfo: {},
    workCellInfo: {},
    siteInfo: {},
    snNum: null,
    operationId: '',
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
    materialLotList: [], // 序列号物料扫描容器条码 弹出 容器下的物料批条码弹框
    materialLotPagination: {}, // 序列号物料扫描容器条码 弹出 容器下的物料批条码 弹框的分页参数
    eoList: [], // 扫描sn后 需选择关联的eo
    eoPagination: {},
    virtualNumList: [], // 虚拟号列表
    materialSelectedRows: [],
    barCodeSelectedRows: [],
    expandedRowKeys: [],
    materialList: [],
    exceptionEquipmentCodes: '',
    errorEquipmentCodes: '',
    esopList: [],
    esopPagination: {},
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
              lotMaterialVOList: isArray(lotMaterialVOList) ? lotMaterialVOList : [],
              timeMaterialVOList: isArray(timeMaterialVOList) ? timeMaterialVOList : [],
            },
          },
        });
      }
      return res;
    },

    *fetchIsContainer({ payload }, { call }) {
      const res = getResponse(yield call(fetchIsContainer, payload));
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
        const addDataRecordList = isArray(dataRecordVOList)
          ? dataRecordVOList
            .filter(e => ['DATA', 'LAB'].includes(e.groupPurpose))
            .map(e => e.equipmentCategory || e.resultType === 'VALUE' ? { ...e, isEdit: false, _status: 'update' } : { ...e, isEdit: false })
          : [];
        const payloadData = {
          baseInfo,
          addDataRecordList,
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
          operationId: baseInfo.operationId,
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
          ...baseInfo
        } = res;
        yield put({
          type: 'updateState',
          payload: {
            baseInfo,
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
      const { isData, list, dataSourceName, ...params } = payload;
      const res = getResponse(yield call(addDataRecord, params));
      if (res) {
        let newPayload = {};
        if (isData && dataSourceName === 'dataRecordList') {
          const dataRecordList = list.map(e => (
            e.jobRecordId === res.jobRecordId ? { ...res, _status: 'update' } : e
          ));
          newPayload = {
            dataRecordList,
          };
        } else if (isData && dataSourceName === 'addDataRecordList') {
          list.forEach(e => {
            delete e.isEdit;
            delete e._status;
          });
          const dataRecordList = list.map(e => (
            e.jobRecordId === res.jobRecordId ? res : e
          ));
          newPayload = {
            dataRecordList,
          };
        } else if (!isData) {
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
            siteInfo: res,
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
    *firstProcessSerialItem({ payload }, { call, put }) {
      const res = getResponse(yield call(firstProcessSerialItem, payload));
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
    *fetchMaterialLotList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchMaterialLotList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            materialLotList: res.content,
            materialLotPagination: createPagination(res),
          },
        });
      }
      return res;
    },
    *fetchEoList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchEoList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            eoList: res.content,
            eoPagination: createPagination(res),
          },
        });
      }
      return res;
    },

    *returnMaterial({ payload }, { call }) {
      const res = getResponse(yield call(returnMaterial, payload));
      return res;
    },

    *returnSnMaterial({ payload }, { call }) {
      const res = getResponse(yield call(returnSnMaterial, payload));
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
        const newDataRecord = dataRecordList;
        for (let i = 0; i < newDataRecord.length; i++) {
          if (res.filter(item => item.jobRecordId === newDataRecord[i].jobRecordId).length > 0) {
            newDataRecord[i] = { ...(res.filter(item => item.jobRecordId === newDataRecord[i].jobRecordId)[0]), _status: 'update' };
          }
        }
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
        yield put({
          type: 'updateState',
          payload: {
            dataRecordList: [],
          },
        });
        yield put({
          type: 'updateState',
          payload: {
            dataRecordList: isArray(res) ? res.filter(e => e.groupPurpose === 'DATA').map(e => ({ ...e, _status: 'update' })) : [],
          },
        });
      }
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
    *autoCreateSnNum({ payload }, { call }) {
      const res = getResponse(yield call(autoCreateSnNum, payload));
      return res;
    },

    *fetchMaterialList({ payload }, { call, put }) {
      const { reworkFlag, ...params } = payload;
      const res = getResponse(yield call(fetchMaterialList, params));
      if (res) {
        const { dtoList } = payload;
        let barCodeSelectedRows = [];
        const materialList = [];
        const materialSelectedRows = [];
        res.forEach(e => {
          if (
            ((dtoList.length > 1 && !isEmpty(e.materialLotList) && e.productionType !== 'SN') || (dtoList.length === 1 && !isEmpty(e.materialLotList)))
          ) {
            barCodeSelectedRows = barCodeSelectedRows.concat(e.materialLotList);
            let newSelectedSnQty = 0;
            e.materialLotList.forEach(i => {
              newSelectedSnQty += i.primaryUomQty;
            });
            const newMaterial = {
              ...e,
              selectedSnQty: newSelectedSnQty,
              selectedSnCount: e.materialLotList.length,
              timing: e.productionType === 'TIME' ? '00:00:00' : '',
              materialLotList: e.productionType === 'TIME' && isArray(e.materialLotList) ? e.materialLotList.map(i => ({
                ...i,
                timing: '00:00:00',
              })) : e.materialLotList,
              _status: reworkFlag === 'Y' ? 'update' : '',
            };
            materialSelectedRows.push(newMaterial);
            materialList.push(newMaterial);
          } else {
            materialList.push({
              ...e,
              timing: e.productionType === 'TIME' ? '00:00:00' : '',
              materialLotList: e.productionType === 'TIME' && isArray(e.materialLotList) ? e.materialLotList.map(i => ({
                ...i,
                timing: '00:00:00',
              })) : e.materialLotList,
            });
          }
        });
        yield put({
          type: 'updateState',
          payload: {
            materialList,
            materialSelectedRows,
            barCodeSelectedRows,
          },
        });
      }
      return res;
    },

    *scanBarcode({ payload }, { call, put }) {
      const { expandedRowKeys, materialSelectedRows, barCodeSelectedRows, reworkFlag, ...params } = payload;
      const { componentList } = payload;
      const res = getResponse(yield call(scanBarcode, params));
      if (res && res.deleteFlag === 'N') {
        // 当前扫描条码信息
        const obj = res.component.materialLotList.find(i => i.materialLotCode === params.materialLotCode);
        // 当前条码的物料信息
        const currentMaterial = componentList.find(i => i.lineNumber === res.component.lineNumber && i.materialId === res.component.materialId);
        // 勾选条码中，与当前条码物料的组件物料id一致的物料
        const materialList = componentList.map(e => {
          if (e.materialId === res.component.materialId && e.lineNumber === res.component.lineNumber) {
            return {
              ...res.component,
              materialLotList: res.component.materialLotList,
              selectedSnQty: currentMaterial.selectedSnQty + obj.primaryUomQty,
              selectedSnCount: currentMaterial.selectedSnCount + 1,
              _status: reworkFlag === 'Y' ? 'update' : '',
            };
          }
          return e;
        });
        let newMaterialSelectedRows = materialSelectedRows;
        const newBarCodeSelectedRows = barCodeSelectedRows;
        if (materialSelectedRows.some(e => e.lineNumber === obj.lineNumber && e.materialId === obj.materialId)) {
          newMaterialSelectedRows = newMaterialSelectedRows.map(e => {
            if (e.lineNumber === obj.lineNumber && e.materialId === obj.materialId) {
              return {
                ...res.component,
                _status: reworkFlag === 'Y' ? 'update' : '',
              };
            }
            return e;
          });
        } else if (!materialSelectedRows.some(e => e.lineNumber === res.component.lineNumber && e.materialId === res.component.materialId)) {
          newMaterialSelectedRows.push({ ...res.component, _status: reworkFlag === 'Y' ? 'update' : '' });
        }
        newBarCodeSelectedRows.push(res.component.materialLotList.find(e => e.materialLotCode === params.materialLotCode));
        const newExpandedRowKeys = [`${res.component.materialId}#${res.component.lineNumber}`];
        yield put({
          type: 'updateState',
          payload: {
            materialList,
            expandedRowKeys: newExpandedRowKeys,
            materialSelectedRows: newMaterialSelectedRows,
            barCodeSelectedRows: newBarCodeSelectedRows,
          },
        });
      }
      return res;
    },

    *deleteBarcode({ payload }, { call, put }) {
      const { materialList, barCodeSelectedRows, materialSelectedRows, component, barcode } = payload;
      const res = getResponse(yield call(deleteBarcode, component));
      if (res) {
        const newBarCodeSelectedRows = barCodeSelectedRows.filter(e => !(e.materialId === res.materialId && e.materialLotCode === barcode));
        let newMaterialSelectedRows = materialSelectedRows;
        let newSelectedSnQty = 0;
        res.materialLotList.forEach(i => {
          newSelectedSnQty += i.primaryUomQty;
        });
        const currentObj = {
          ...res,
          selectedSnQty: newSelectedSnQty,
          selectedSnCount: res.materialLotList.length,
        };
        if (!newBarCodeSelectedRows.some(e => e.lineNumber === res.lineNumber && e.materialId === res.materialId)) {
          newMaterialSelectedRows = newMaterialSelectedRows.filter(e => !(e.lineNumber === res.lineNumber && e.materialId === res.materialId));
        } else {
          newMaterialSelectedRows = newMaterialSelectedRows.map(e => {
            if (e.lineNumber === res.lineNumber && e.materialId === res.materialId) {
              return currentObj;
            }
            return e;
          });
        }
        const newMaterialList = materialList.map(e => {
          if (e.lineNumber === res.lineNumber && e.materialId === res.materialId) {
            return currentObj;
          }
          return e;
        });
        yield put({
          type: 'updateState',
          payload: {
            materialList: newMaterialList,
            barCodeSelectedRows: newBarCodeSelectedRows,
            materialSelectedRows: newMaterialSelectedRows,
          },
        });
      }
    },
    *feedMaterialList({ payload }, { call, put }) {
      const { materialList, barCodeSelectedRows, materialSelectedRows, reworkFlag, ...params } = payload;
      const res = getResponse(yield call(feedMaterialList, params));
      if (res && isArray(res)) {
        const newMaterialSelectedRows = [];
        let newBarCodeSelectedRows = [];
        yield put({
          type: 'updateState',
          payload: {
            materialList: [],
          },
        });
        const newMaterialList = materialList.map(e => {
          let obj = res.find(i => i.lineNumber === e.lineNumber && i.materialId === e.materialId);
          if (obj) {
            if (isArray(obj.materialLotList) && !isEmpty(obj.materialLotList) && e.virtualComponentFlag !== 'X') {
              if (materialSelectedRows.map(i => `${i.materialId}#${i.linNumber}`).includes(`${obj.materialId}#${obj.linNumber}`)) {
                newMaterialSelectedRows.push(obj);
                obj = { ...obj, _status: reworkFlag === 'Y' ? 'update' : '' };
                newBarCodeSelectedRows = newBarCodeSelectedRows.concat(obj.materialLotList);
              }
              let newSelectedSnQty = 0;
              obj.materialLotList.forEach(i => {
                newSelectedSnQty += i.primaryUomQty;
              });
              return {
                ...obj,
                selectedSnQty: newSelectedSnQty,
                selectedSnCount: obj.materialLotList.length,
                isReleased: 0,
              };
            } else {
              return {
                ...obj,
                selectedSnQty: 0,
                selectedSnCount: 0,
                isReleased: 0,
              };
            }
          }
          return e;
        });
        yield put({
          type: 'updateState',
          payload: {
            materialList: newMaterialList,
            barCodeSelectedRows: newBarCodeSelectedRows,
            materialSelectedRows: newMaterialSelectedRows,
          },
        });
      }
      return res;
    },
    *fetchWorkCellMaterialList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchWorkCellMaterialList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            materialList: res,
            expandedRowKeys: res.map(e => `${e.materialId}#${e.lineNumber}`),
          },
        });
      }
      return res;
    },
    *fetchESopList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchESopList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            esopList: res.content,
            esopPagination: createPagination(res),
          },
        });
      }
    },
    *printMaterialCode({ payload }, { call }) {
      const res = getResponse(yield call(printMaterialCode, payload));
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
