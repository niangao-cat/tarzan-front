/*
 * @Description: cos芯片检验
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-27 10:26:20
 * @LastEditTime: 2020-09-29 15:10:19
 */
import { isArray } from 'lodash';
import { getResponse } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  enterSite,
  getSiteList,
  chipNcRecordSiteIn,
  getEquipmentList,
  autoQueryInfo,
  queryLoadData,
  queryDataInspection,
  addDataRecordBatch,
  addDataRecord,
  deleteAddDataRecordList,
  checkComplete,
  checkCompleteOutSite,
  bindingEq,
  bindingEqConfirm,
  deleteEq,
  changeEq,
  fetchEqInfo,
} from '@/services/hhme/cosInspectionPlatformService';

export default {
  namespace: 'cosInspectionPlatform',
  state: {
    workcellInfo: {}, // 工位信息
    defaultSite: {},
    equipmentList: [], // 设备列表
    dataRecordList: [],
    addDataRecordList: [],
    woInfo: [],
    woRecord: {},
  },
  effects: {
    // 批量查询独立值集
    *batchLovData(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          containerType: 'HME_COS_CONTAINER_TYPE', // 容器类型
        })
      );
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            lovData: {
              ...result,
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
    // 扫描条码
    // *scaneMaterialCode({ payload }, { call, put }) {
    //   const { woInfo, ...params} = payload;
    //   const res = yield call(chipNcRecordSiteIn, params);
    //   if (res && !res.failed) {
    //     yield put({
    //       type: 'updateState',
    //       payload: {
    //         containerInfo: res,
    //       },
    //     });
    //     // const obj = isArray(woInfo) ? this.state.woInfo.find(e => e.materialLotCode === params.materialLotCode) : [];
    //     // const newParams = isEmpty(obj) ? {} : {
    //     //   materialLotId: obj.materialLotId,
    //     //   materialLotCode: obj.materialLotCode,
    //     //   operationRecordId: obj.operationRecordId,
    //     //   eoJobSnId: obj.eoJobSnId,
    //     // };
    //     // const result = getResponse(yield call(queryLoadData, newParams));
    //     // if(result) {
    //     //   yield put({
    //     //     type: 'updateState',
    //     //     payload: {
    //     //       woRecord: obj,
    //     //       containerInfo: result,
    //     //     },
    //     //   });
    //     // }
    //   }
    //   return res;
    // },
    *scaneMaterialCode({ payload }, { call, put }) {
      const result = getResponse(yield call(chipNcRecordSiteIn, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            containerInfo: result,
          },
        });
      }
      return result;
    },
    // 初始化查询
    *autoQueryInfo({ payload }, { call, put }) {
      const res = getResponse(yield call(autoQueryInfo, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            woInfo: res,
          },
        });
      }
      return res;
    },
    // 查询装载信息
    *queryLoadData({ payload }, { call, put }) {
      const { woRecord, ...params } = payload;
      const res = getResponse(yield call(queryLoadData, params));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            containerInfo: res,
            woRecord,
          },
        });
      }
      return res;
    },
    // 查询数据采集
    *queryDataInspection({ payload }, { call, put }) {
      const res = getResponse(yield call(queryDataInspection, payload));
      if (res) {
        const addDataRecordList = isArray(res)
        ? res
            .map(e => e.equipmentCategory || e.resultType === 'VALUE' ? { ...e, isEdit: false, _status: 'update' } : {...e, isEdit: false})
        : [];
        yield put({
          type: 'updateState',
          payload: {
            dataRecordList: res,
            addDataRecordList,
          },
        });
      }
      return res;
    },
    *addDataRecordBatch({ payload }, { call, put }) {
      const { list, eqDataList, dataSourceName } = payload;
      const res = getResponse(yield call(addDataRecordBatch, eqDataList));
      if(res) {
        const resJobRecordIds = res.map(e => e.jobRecordId);
        const noCreateRecordIds = list.filter(e => e._status !== 'create').map(e => e.jobRecordId);
        let newDataRecord = list.filter(e => e._status !== 'create');
        resJobRecordIds.forEach(e => {
          if(noCreateRecordIds.includes(e)) {
            newDataRecord = newDataRecord.map(i => {
              if(resJobRecordIds.includes(i.jobRecordId)) {
                const obj = isArray(res) ? res.find(a => a.jobRecordId === i.jobRecordId) : [];
                return {...obj, isEdit: false};
              }
              return {...i, isEdit: false};
            });
          } else {
            const obj = isArray(res) ? res.find(i => i.jobRecordId === e) : [];
            const { _status, isEdit, ...newObj } = obj;
            newDataRecord = [{ ...newObj }].concat(newDataRecord);
          }
        });
        let newPayload = {};
        if(dataSourceName === 'addDataSourceName') {
          newDataRecord.forEach(e => {
            delete e.isEdit;
            delete e._status;
          });
        }
        newPayload = {
          dataRecordList: newDataRecord,
          addDataRecordList: newDataRecord.map(e => e.equipmentCategory || e.resultType === 'VALUE' ? { ...e, isEdit: false, _status: 'update' } : {...e, isEdit: false}),
        };
        yield put({
          type: 'updateState',
          payload: newPayload,
        });
      }
    },

    *addDataRecord({ payload }, { call, put }) {
      const { list, dataSourceName, ...params } = payload;
      const res = getResponse(yield call(addDataRecord, params));
      if(res) {
        let newPayload = {};
        if(dataSourceName === 'dataRecordList') {
          const dataRecordList = list.map(e => (
            e.jobRecordId === res.jobRecordId ? res : e
          ));
          newPayload = {
            dataRecordList,
            addDataRecordList: dataRecordList.map(e => e.equipmentCategory || e.resultType === 'VALUE' ? { ...e, isEdit: false, _status: 'update' } : e),
          };
        } else if(dataSourceName === 'addDataRecordList') {
          list.forEach(e => {
            delete e.isEdit;
            delete e._status;
          });
          const dataRecordList = list.map(e => (
            e.jobRecordId === res.jobRecordId ? res : e
          ));
          newPayload = {
            dataRecordList,
            addDataRecordList: dataRecordList.map(e => e.equipmentCategory || e.resultType === 'VALUE' ? { ...e, isEdit: false, _status: 'update' } : {...e, isEdit: false}),
          };
        }
        yield put({
          type: 'updateState',
          payload: newPayload,
        });
      }
    },
    *deleteAddDataRecordList({ payload }, { call }) {
      const res = getResponse(yield call(deleteAddDataRecordList, payload));
      return res;
    },
    *checkComplete({ payload }, { call }) {
      const res = getResponse(yield call(checkComplete, payload));
      return res;
    },
    *checkCompleteOutSite({ payload }, { call }) {
      const res = getResponse(yield call(checkCompleteOutSite, payload));
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
