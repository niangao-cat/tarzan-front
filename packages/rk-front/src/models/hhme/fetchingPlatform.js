/*
 * @Description: 取片平台
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-06 16:06:44
 * @LastEditTime: 2020-11-03 17:27:08
 */

import { getResponse } from 'utils/utils';
import { queryMapIdpValue, queryUnifyIdpValue } from 'services/api';
import {
  enterSite,
  getSiteList,
  scaneMaterialCode,
  getEquipmentList,
  queryProcessing,
  createBarCode,
  siteOutPrint,
  siteInConfirm,
  queryMaxNumber,
  bindingEq,
  bindingEqConfirm,
  deleteEq,
  changeEq,
  fetchEqInfo,
  siteOutPrintList,
  putInConfirm,
  fetchNcList,
  fetchBoxList,
  deleteBoxList,
  checkInSite,
} from '@/services/hhme/fetchingPlatformService';

export default {
  namespace: 'fetchingPlatform',
  state: {
    workcellInfo: {}, // 工位信息
    defaultSite: {},
    equipmentList: [], // 设备列表
    ncList: [], // 不良列表
    containerInfo: {}, // 容器信息
    siteOutOkList: [],
    siteOutNgList: [],
    maxNumber: '',
    selectInfo: {}, // 选中的单元格
    boxList: [], // 盒子列表
    exceptionEquipmentCodes: '',
    errorEquipmentCodes: '',
  },
  effects: {
    // 批量查询独立值集
    *batchLovData(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          fetchNcCode: 'HME.COS_FETCH_NC_CODE', // 取片不良
        })
      );
      const res = getResponse(
        yield call(queryUnifyIdpValue, 'HME_COS_CONTAINER_TYPE_INFO')
      );
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            lovData: {
              containerType: res,
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
            exceptionEquipmentCodes: result.exceptionEquipmentCodes,
            errorEquipmentCodes: result.errorEquipmentCodes,
          },
        });
      }
      return result;
    },
    // 扫描条码
    *scaneMaterialCode({ payload }, { call, put }) {
      const res = getResponse(yield call(scaneMaterialCode, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            containerInfo: res,
          },
        });
      }
      return res;
    },
    // 获取正在进行
    *queryProcessing({ payload }, { call, put }) {
      const res = getResponse(yield call(queryProcessing, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            siteOutOkList: res.siteOutOkList,
            siteOutNgList: res.siteOutNgList,
            containerInfo: res,
          },
        });
      }
      return res;
    },
    // 创建
    *createBarCode({ payload }, { call }) {
      const res = getResponse(yield call(createBarCode, payload));
      return res;
    },
    // 出站打印
    *siteOutPrint({ payload }, { call }) {
      const res = getResponse(yield call(siteOutPrint, payload));
      return res;
    },
    *siteOutPrintList({ payload }, { call }) {
      const res = getResponse(yield call(siteOutPrintList, payload));
      return res;
    },
    // 上半部分确认按钮
    *siteInConfirm({ payload }, { call }) {
      const res = getResponse(yield call(siteInConfirm, payload));
      return res;
    },
    // 获取正在进行
    *queryMaxNumber({ payload }, { call, put }) {
      const res = getResponse(yield call(queryMaxNumber, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            maxNumber: res.maxLoadNumber,
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
      const res = getResponse(yield call(bindingEqConfirm, payload));
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
      const res = getResponse(yield call(fetchEqInfo, payload));
      return res;
    },
    // 投入确认
    *putInConfirm({ payload }, { call }) {
      const res = getResponse(yield call(putInConfirm, payload));
      return res;
    },
    // 查询不良列表
    *fetchNcList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchNcList, payload));
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
    // 投入盒子列表
    *fetchBoxList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchBoxList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            boxList: res,
          },
        });
      }
      return res;
    },
    *deleteBoxList({ payload }, { call }) {
      const res = getResponse(yield call(deleteBoxList, payload));
      return res;
    },
    *checkInSite({ payload }, { call }) {
      const res = getResponse(yield call(checkInSite, payload));
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
