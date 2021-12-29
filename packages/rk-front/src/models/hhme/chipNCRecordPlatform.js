/*
 * @Description: 芯片不良
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-21 13:51:22
 * @LastEditTime: 2021-03-09 16:54:52
 */

import { getResponse } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  enterSite,
  getSiteList,
  chipNcRecordSiteIn,
  getEquipmentList,
  fetchNcCode,
  ncRecordConfirm,
  ncRecordDelete,
  fetchQueryProcessing,
  siteOut,
  bindingEq,
  bindingEqConfirm,
  deleteEq,
  changeEq,
  fetchEqInfo,
  chipScrapped,
} from '@/services/hhme/chipNCRecordPlatformService';

export default {
  namespace: 'chipNCRecordPlatform',
  state: {
    workcellInfo: {}, // 工位信息
    defaultSite: {},
    equipmentList: [], // 设备列表
    ncList: [], // 不良列表
    containerInfo: {}, // 容器信息
    selectInfo: [], // 选中单元格的信息
    selectChipInfo: {}, // 选中芯片的信息
    errorEquipmentCodes: null,
    exceptionEquipmentCodes: null,
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
            errorEquipmentCodes: result.errorEquipmentCodes,
            exceptionEquipmentCodes: result.exceptionEquipmentCodes,
            equipmentList: result.hmeWkcEquSwitchVOS,
          },
        });
      }
      return result;
    },
    // 获取未出站信息
    *fetchNcCode({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchNcCode, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            ncList: res,
          },
        });
      }
      return res;
    },
    // 扫描条码
    *scaneMaterialCode({ payload }, { call, put }) {
      const res = getResponse(yield call(chipNcRecordSiteIn, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            containerInfo: res,
            // materialLotNcList: res.materialLotNcList,
          },
        });
      }
      return res;
    },
    // 不良创建
    *ncRecordConfirm({ payload }, { call }) {
      const res = getResponse(yield call(ncRecordConfirm, payload));
      return res;
    },
    // 不良删除
    *ncRecordDelete({ payload }, { call }) {
      const res = getResponse(yield call(ncRecordDelete, payload));
      return res;
    },
    // 查询未出站数据
    *fetchQueryProcessing({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchQueryProcessing, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            containerInfo: res,
            // materialLotNcList: res.materialLotNcList,
          },
        });
      }
      return res;
    },
    // 出站
    *siteOut({ payload }, { call }) {
      const res = getResponse(yield call(siteOut, payload));
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
    // 芯片报废
    *chipScrapped({ payload }, { call }) {
      const res = getResponse(yield call(chipScrapped, payload ));
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
