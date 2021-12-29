/**
 * operationPlatform - 工序models
 * @date: 2020/02/27 19:53:47
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import { isArray, isEmpty } from 'lodash';
import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  fetchWorkCellInfo,
  fetchBatchBaseInfo,
  fetchSnList,
  fetchMaterialList,
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
  // addDataRecordBatch,
  getThorlabs,
  getOphir,
  uninstallContainer,
  calculate,
  fetchDataRecordList,
  fetchLocationInfo,
  fetchBackMaterialInfo,
  scanBarcode,
  deleteBarcode,
  feedMaterialList,
  batchOutSite,
  fetchFeedingRecord,
  returnMaterial,
  print,
  fetchESopList,
} from '@/services/hhme/lotOperationPlatformService';

export default {
  namespace: 'lotOperationPlatform',
  state: {
    baseInfo: {}, // 当前加载出来的sn信息
    workCellInfo: {}, // 工位信息
    snNum: null,
    snList: [], // 工单列表
    filterSnList: [],
    materialVOList: [], // 序列号物料
    lotMaterialVOList: [], // 批次物料
    timeMaterialVOList: [], // 时序物料
    selectedRows: [], // 勾选项
    dataRecordList: [], // 数据采集
    containerList: [], // 容器列表
    selfCheckList: [], // 自检项
    equipmentInfo: {}, // 设备信息
    equipmentList: [], // 工位设备列表
    currentEoStepList: [], // 当前工序下拉框值
    hmeEoJobContainerVO2: {}, // 容器相关信息
    locatorTypeList: [],
    materialList: [],
    materialSelectedRows: [],
    barCodeSelectedRows: [],
    expandedRowKeys: [],
    feedingRecordList: [],
    exceptionEquipmentCodes: '',
    errorEquipmentCodes: '',
    esopList: [],
    esopPagination: {},
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
              lotMaterialVOList: isArray(lotMaterialVOList) ? lotMaterialVOList : [],
              timeMaterialVOList: isArray(timeMaterialVOList) ? timeMaterialVOList : [],
            },
          },
        });
      }
      return res;
    },

    *fetchSnList({ payload }, { call, put }) {
      const { selectedRows, isOutSite, ...params } = payload;
      const res = getResponse(yield call(fetchSnList, params));
      if (res) {
        const snList = isArray(res) ? res.filter(e => e.reworkFlag !== 'Y') : [];
        let dataList = [];
        let newDataRecordList = [];
        let newSelfCheckList = [];
        let payloadData = {};
        if (!isEmpty(selectedRows) && !isOutSite) { // 自检 / 数据采集以后 更新 数据
          const newSelectedRows = selectedRows.map(e => {
            const snObj = isArray(snList) ? snList.filter(i => i.jobId === e.jobId)[0] : {};
            return snObj;
          });

          // 寻找新的勾选sn列表的 交集 数据采集项
          dataList = !isEmpty(newSelectedRows) && !isEmpty(newSelectedRows[0].dataRecordVOList) && isArray(newSelectedRows[0].dataRecordVOList) ? newSelectedRows[0].dataRecordVOList : [];
          newSelectedRows.forEach(e => {
            const dataRecordTagIds = isArray(e.dataRecordVOList) ? e.dataRecordVOList.map(i => i.tagId) : [];
            dataList = dataList.filter(i => dataRecordTagIds.includes(i.tagId));
          });
          newDataRecordList = isArray(dataList)
            ? dataList
              .filter(e => ['DATA', 'LAB'].includes(e.groupPurpose)).map(e => ({ ...e, _status: 'update' }))
            : [];
          // newAddDataRecordList = newDataRecordList.map(e => e.equipmentCategory || e.resultType === 'VALUE' ? { ...e, isEdit: false, _status: 'update' } : {...e, isEdit: false});
          newSelfCheckList = isArray(dataList)
            ? dataList.filter(e => e.groupPurpose === 'GENERAL')
            : [];
          payloadData = {
            dataRecordList: newDataRecordList,
            // addDataRecordList: newAddDataRecordList,
            selfCheckList: newSelfCheckList,
            selectedRows: newSelectedRows,
          };
        } else if (isOutSite) { // 无选中数据 出栈以后清空
          payloadData = {
            dataRecordList: [],
            selfCheckList: [],
            // addDataRecordList: [],
            selectedRows: [],
          };
        }
        // 重构 背景色显示
        let index = 0; // 设置索引
        let bomName = ""; // 设置重复数据 变量
        for (let i = 0; i < snList.length; i++) {
          // 第一次时 直接赋值
          if (i !== 0) {
            // 判断 装配工单是否相同， 不同则新增
            if (snList[i].bomName !== bomName) {
              index++;
              // eslint-disable-next-line prefer-destructuring
              bomName = snList[i].bomName;
            }
          } else {
            // eslint-disable-next-line prefer-destructuring
            bomName = snList[0].bomName;
          }
          snList[i].index = index;
        }
        yield put({
          type: 'updateState',
          payload: {
            ...payloadData,
            snList,
            filterSnList: snList,
          },
        });
        return snList;
      }
    },


    /**
     * 进站扫描
     *
     * @param {*} { payload }
     * @param {*} { call, put }
     * @returns
     */
    *fetchBaseInfo({ payload }, { call, put }) {
      const { snNum, currentEoStepList, snList, ...params } = payload;
      const res = getResponse(yield call(fetchBatchBaseInfo, { snNum, ...params }));
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
        const snJobIds = snList.map(e => e.jobId);
        // 点击sn列表时 或者 当前扫描sn已出站时 在界面上加载物料数据项等信息
        if (res.siteOutDate || snJobIds.includes(res.jobId)) {
          yield put({
            type: 'updateState',
            payload: {
              baseInfo: { ...baseInfo, snNum },
              dataRecordList: [],
              selfCheckList: [],
              // addDataRecordList,
              snNum,
              currentEoStepList: isEmpty(hmeEoJobSnList) ? currentEoStepList : hmeEoJobSnList,
            },
          });
        } else if (!snJobIds.includes(res.jobId)) {
          // 扫描sn进站
          const newSnList = snList.concat([{
            ...baseInfo,
            dataRecordVOList,
          }]);
          yield put({
            type: 'updateState',
            payload: {
              snList: newSnList,
              filterSnList: newSnList,
              baseInfo,
              dataRecordList: [],
              selfCheckList: [],
              // addDataRecordList,
              selectedRows: [{
                ...baseInfo,
                dataRecordVOList,
              }],
              materialList: [],
              barCodeSelectedRows: [],
              materialSelectedRows: [],
            },
          });
        }
      }
      return res;
    },

    *fetchMaterialList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchMaterialList, payload));
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


    *batchOutSite({ payload }, { call, put }) {
      const res = getResponse(yield call(batchOutSite, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            selectedRows: [],
            materialSelectedRows: [],
            barCodeSelectedRows: [],
            materialList: [],
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
      const { list, dataSourceName, snList, selectedRows, ...params } = payload;
      const res = getResponse(yield call(addDataRecord, params));
      if (res) {
        let newPayload = {};
        if (dataSourceName === 'dataRecordList') {
          const dataRecordList = list.map(e => (
            e.jobRecordId === params.jobRecordId ? { ...res, _status: 'update' } : e
          ));
          newPayload = {
            dataRecordList,
          };
        }
        else if (dataSourceName === 'selfCheckList') {
          newPayload = {
            selfCheckList: list.map(e => (
              e.jobRecordId === params.jobRecordId ? res : e
            )),
          };
        }
        yield put({
          type: 'updateState',
          payload: {
            ...newPayload,
          },
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
    //       addDataRecordList: newDataRecord.map(e => e.equipmentCategory || e.resultType === 'VALUE' ? { ...e, isEdit: false, _status: 'update' } : {...e, isEdit: false}),
    //     };
    //     yield put({
    //       type: 'updateState',
    //       payload: newPayload,
    //     });
    //   }
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
        const dataRecordList = isArray(res)
          ? res
            .filter(e => ['DATA', 'LAB'].includes(e.groupPurpose)).map(e => ({ ...e, _status: 'update' }))
          : [];
        const selfCheckList = isArray(res)
          ? res.filter(e => e.groupPurpose === 'GENERAL')
          : [];
        yield put({
          type: 'updateState',
          payload: {
            dataRecordList,
            selfCheckList,
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


    *scanBarcode({ payload }, { call, put }) {
      const { expandedRowKeys, materialSelectedRows, barCodeSelectedRows, ...params } = payload;
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
            };
          } else if (componentMaterial && componentMaterial.materialId !== currentMaterial.materialId && componentMaterial.lineNumber !== currentMaterial.lineNumber) {
            return {
              ...e,
              selectedSnQty: 0,
              selectedSnCount: 0,
            };
          }
          return e;
        });
        let newMaterialSelectedRows = materialSelectedRows;
        let newBarCodeSelectedRows = barCodeSelectedRows;
        if (materialSelectedRows.some(e => e.lineNumber === obj.lineNumber && e.materialId === obj.materialId)) {
          newMaterialSelectedRows = newMaterialSelectedRows.map(e => {
            if (e.lineNumber === obj.lineNumber && e.materialId === obj.materialId) {
              return res.component;
            }
            return e;
          });
        } else if (!materialSelectedRows.some(e => e.lineNumber === res.component.lineNumber && e.materialId === res.component.materialId)) {
          newMaterialSelectedRows.push(res.component);
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
      const { materialList, barCodeSelectedRows, materialSelectedRows, ...params } = payload;
      const res = getResponse(yield call(feedMaterialList, params));
      if (res && isArray(res)) {
        const newMaterialSelectedRows = [];
        let newBarCodeSelectedRows = [];

        const newMaterialList = materialList.map(e => {
          const obj = res.find(i => i.lineNumber === e.lineNumber && i.materialId === e.materialId);
          if (obj) {
            if (isArray(obj.materialLotList) && !isEmpty(obj.materialLotList) && e.virtualComponentFlag !== 'X') {
              if (materialSelectedRows.map(i => `${i.materialId}#${i.linNumber}`).includes(`${obj.materialId}#${obj.linNumber}`)) {
                newMaterialSelectedRows.push(obj);
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
              };
            } else {
              return {
                ...obj,
                selectedSnQty: 0,
                selectedSnCount: 0,
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
    *returnMaterial({ payload }, { call, put }) {
      const { feedingRecordList, ...params } = payload;
      const res = getResponse(yield call(returnMaterial, params));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            feedingRecordList: res.releaseQty === 0 ? feedingRecordList.filter(e => e.jobMaterialId !== res.jobMaterialId)
              : feedingRecordList.map(e => e.jobMaterialId === res.jobMaterialId ? res : e),
          },
        });
      }
      return res;
    },

    // 打印
    *print({ payload }, { call }) {
      const res = getResponse(yield call(print, payload));
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
