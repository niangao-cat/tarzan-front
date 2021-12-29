/**
 * operationPlatform - 工序models
 * @date: 2020/02/27 19:53:47
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import { isArray, isEmpty, get as chainget } from 'lodash';
import moment from 'moment';
import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  fetchWorkCellInfo,
  fetchBaseInfo,
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
  fetchMaterialList,
  getThorlabs,
  getOphir,
  uninstallContainer,
  returnMaterial,
  fetchFeedingRecord,
  calculate,
  fetchDataRecordList,
  fetchLocationInfo,
  fetchBomList,
  fetchBackMaterialInfo,
  checkSn,
  deleteData,
  deleteAndBand,
  scanBarcode,
  deleteBarcode,
  feedMaterialList,
  fetchWorkCellMaterialList,
  fetchESopList,
  fetchEOList,
  fetchSnDataList,
  fetchComponentDataList,
  fetchPumpList,
} from '../../services/hhme/singleOperationPlatformService';

function handleTiming(time) {
  if (isEmpty(time)) {
    const second = time % 60;
    const hour = Math.floor(time / (60 * 60));
    const minute = Math.floor((time - hour * 60 * 60) / 60);
    return `${hour > 9 ? hour : `0${hour}`}:${minute > 9 ? minute : `0${minute}`}:${second > 9 ? second : `0${second}`
      }`;
  } else {
    return '00:00:00';
  }
}

export default {
  namespace: 'singleOperationPlatform',
  state: {
    siteInfo: {},
    baseInfo: {},
    workCellInfo: {}, // 工位信息
    snNum: null,
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
    materialSelectedRows: [],
    barCodeSelectedRows: [],
    expandedRowKeys: [],
    materialList: [],
    exceptionEquipmentCodes: '',
    errorEquipmentCodes: '',
    esopList: [],
    esopPagination: {},
    snDataList: [],
    componentDataList: [],
    typeList: [],
    pumpInfo: {},
    pumpList: [],
  },
  effects: {
    *init(_, { call, put }) {
      const res = yield call(queryMapIdpValue, {
        locatorTypeList: 'HME.LOCATOR_TYPE',
        typeList: 'HME.EXHIBITION_TYPE',
      });
      yield put({
        type: 'updateState',
        payload: res,
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
          baseInfo: {
            ...baseInfo,
            inspection: baseInfo.isClickInspectionBtn === 'Y' ? baseInfo.inspection || 1 : null,
          },
          // addDataRecordList,
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

    *outSite({ payload }, { call, put }) {
      const res = getResponse(yield call(outSite, payload));
      if (res && !res.errorCode) {
        const {
          containerVO2List,
          dataRecordVOList,
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
          };
          // yield put({
          //   type: 'updateState',
          //   payload: {
          //     dataRecordList: [],
          //   },
          // });
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
        const newDataRecord = dataRecordList;
        for (let i = 0; i < newDataRecord.length; i++) {
          if (res.filter(item => item.jobRecordId === newDataRecord[i].jobRecordId).length > 0) {
            newDataRecord[i] = { ...(res.filter(item => item.jobRecordId === newDataRecord[i].jobRecordId)[0]) };
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
      return res;
    },

    *fetchMaterialList({ payload }, { call, put }) {
      const { reworkFlag, ...params } = payload;
      const res = getResponse(yield call(fetchMaterialList, params));
      if (res) {
        const { dtoList } = payload;
        let barCodeSelectedRows = [];
        const materialList = [];
        const componentMaterialSelectedIds = [];
        const materialSelectedRows = [];
        res.forEach(e => {
          if (!componentMaterialSelectedIds.includes(e.componentMaterialId) &&
            ((dtoList.length > 1 && !isEmpty(e.materialLotList) && e.productionType !== 'SN') || (dtoList.length === 1 && !isEmpty(e.materialLotList))) &&
            e.virtualComponentFlag !== 'X'
          ) {
            barCodeSelectedRows = barCodeSelectedRows.concat(e.materialLotList);
            componentMaterialSelectedIds.push(e.componentMaterialId);
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
              _status: (reworkFlag === 'Y') || (e.qtyAlterFlag === 'Y') ? 'update' : '',
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
        const componentMaterial = materialSelectedRows.find(e => e.componentMaterialId === currentMaterial.componentMaterialId);
        const materialList = componentList.map(e => {
          if (e.materialId === res.component.materialId && e.lineNumber === res.component.lineNumber) {
            return {
              ...res.component,
              materialLotList: res.component.materialLotList,
              selectedSnQty: currentMaterial.selectedSnQty + obj.primaryUomQty,
              selectedSnCount: currentMaterial.selectedSnCount + 1,
              _status: (reworkFlag === 'Y') || (res.qtyAlterFlag === 'Y') ? 'update' : '',
            };
          } else if (componentMaterial && componentMaterial.materialId !== currentMaterial.materialId && componentMaterial.lineNumber !== currentMaterial.lineNumber) {
            return {
              ...e,
              selectedSnQty: 0,
              selectedSnCount: 0,
              _status: '',
            };
          }
          return e;
        });
        let newMaterialSelectedRows = materialSelectedRows;
        let newBarCodeSelectedRows = barCodeSelectedRows;
        if (materialSelectedRows.some(e => e.lineNumber === obj.lineNumber && e.materialId === obj.materialId)) {
          newMaterialSelectedRows = newMaterialSelectedRows.map(e => {
            if (e.lineNumber === obj.lineNumber && e.materialId === obj.materialId) {
              return {
                ...res.component,
                _status: (reworkFlag === 'Y') || (e.qtyAlterFlag === 'Y') ? 'update' : '',
              };
            }
            return e;
          });
        } else if (!materialSelectedRows.some(e => e.lineNumber === res.component.lineNumber && e.materialId === res.component.materialId)) {
          newMaterialSelectedRows.push({ ...res.component, _status: (reworkFlag === 'Y') || (res.component.qtyAlterFlag === 'Y') ? 'update' : '' });
        }
        if (componentMaterial && `${componentMaterial.materialId}${componentMaterial.lineNumber}` !== `${currentMaterial.materialId}${currentMaterial.lineNumber}`) {
          newMaterialSelectedRows = newMaterialSelectedRows.filter(e => `${componentMaterial.materialId}${componentMaterial.lineNumber}` !== `${e.materialId}${e.lineNumber}`);
          newBarCodeSelectedRows = newBarCodeSelectedRows.filter(e => `${componentMaterial.materialId}${componentMaterial.lineNumber}` !== `${e.materialId}${e.lineNumber}`);
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
      return res;
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
                obj = { ...obj, _status: (reworkFlag === 'Y') || (obj.qtyAlterFlag === 'Y') ? 'update' : '' };
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
    *fetchEOList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchEOList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            eoList: res.content,
            eoPagination: createPagination(res),
          },
        });
      }
    },
    *fetchSnDataList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchSnDataList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            snDataList: res,
          },
        });
      }
    },

    *fetchComponentDataList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchComponentDataList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            componentDataList: res,
          },
        });
      }
    },

    *fetchPumpList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchPumpList, payload));
      if (res) {
        const { hmePumpingSourceVOList, ...otherParams } = res;
        yield put({
          type: 'updateState',
          payload: {
            pumpList: hmePumpingSourceVOList,
            pumpInfo: otherParams,
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
    timeUpdateState(state, action) {
      const { materialList } = state;
      const { barCodeTimeFlag, materialTimeFlag } = action.payload;
      if (materialList.length > 0 && (barCodeTimeFlag || materialTimeFlag)) {
        const newMaterialList = materialList.map(e => {
          if (e.productionType === 'TIME') {
            const timing = moment(e.deadLineDate).diff(moment(), 'seconds');
            const { materialLotList } = e;
            const newMaterialLotList = isArray(materialLotList) ? materialLotList.map(i => {
              const barCodeTiming = moment(i.deadLineDate).diff(moment(), 'seconds');
              return {
                ...i,
                timing: barCodeTiming > 0 ? handleTiming(barCodeTiming) : '00:00:00',
              };
            }) : [];
            return {
              ...e,
              materialLotList: newMaterialLotList,
              timing: timing > 0 ? handleTiming(timing) : '00:00:00',
            };
          } else {
            return e;
          }
        });
        return {
          ...state,
          ...action.payload,
          materialList: newMaterialList,
        };
      } else {
        return {
          ...state,
          ...action.payload,
        };
      }
    },
  },
};
