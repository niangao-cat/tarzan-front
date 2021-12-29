/*
 * @Description: 容器转移
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-18 15:22:09
 * @LastEditTime: 2021-03-09 16:54:38
 */

import { getResponse } from 'utils/utils';
import { queryUnifyIdpValue, queryMapIdpValue } from 'services/api';
import {
  fetchContainerInfo,
  enterSite,
  getSiteList,
  scaneMaterialCode,
  getEquipmentList,
  targetScaneMaterialCode,
  fetchSiteInCode,
  moveChip,
  autoAssignTransfer,
  autoAssignTransferNc,
  moveOver,
  changeEq,
  deleteEq,
  bindingEq,
  fetchEqInfo,
  changeEqConfirm,
  bindingEqConfirm,
} from '@/services/hhme/cosChipMoveService';

export default {
  namespace: 'cosChipMove',
  state: {
    workcellInfo: {}, // 工位信息
    defaultSite: {},
    equipmentList: [], // 设备列表
    sourceContainer: {}, // 来源
    targetContainer: {}, // 目标
    sourceChipList: [], // 来源芯片
    targetRules: 'INIT',
    errorEquipmentCodes: null,
    exceptionEquipmentCodes: null,
  },
  effects: {
    // 批量查询独立值集
    *batchLovData(_, { call, put }) {
      const result = getResponse(
        yield call(queryUnifyIdpValue, 'HME_COS_CONTAINER_TYPE_INFO')
      );
      const res = getResponse(
        yield call(queryMapIdpValue, {
          loadingRules: 'HME.LOADING_RULES',
        })
      );
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            lovData: result,
            ...res,
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
    *fetchSiteInCode({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchSiteInCode, payload));
      const { targetList = [] } = result;
      if (result.transferVo) {
        yield put({
          type: 'updateState',
          payload: {
            sourceContainer: { ...result.transferVo, loadingRules: 'A' },
            targetContainer: {
              row: result.transferVo.locationRow,
              col: result.transferVo.locationColumn,
              transContainerType: result.transferVo.transContainerType,
              cosType: result.transferVo.cosType,
            },
          },
        });
      }
      if (targetList.length > 0) {
        yield put({
          type: 'updateState',
          payload: {
            targetContainer: {
              targetList: result.targetList,
              row: targetList[0].locationRow,
              col: targetList[0].locationColumn,
              transContainerType: targetList[0].containerType,
              cosType: targetList[0].cosType,
            },
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
            sourceContainer: { ...res, loadingRules: 'A' },
            targetContainer: {
              row: res.locationRow,
              col: res.locationColumn,
            },
          },
        });
      }
      return res;
    },
    // 扫描目标容器条码
    *targetScaneMaterialCode({ payload }, { call, put }) {
      const res = getResponse(yield call(targetScaneMaterialCode, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            targetContainer: {
              ...res,
              row: res.locationRow,
              col: res.locationColumn,
            },
          },
        });
      }
      return res;
    },
    // 根据容器类型查询容器信息
    *fetchContainerInfo({ payload }, { call, put }) {
      const { containerType } = payload;
      const res = getResponse(yield call(fetchContainerInfo, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            targetRules: res.loadRuleMeaning,
            targetContainer: { transContainerType: containerType, ...res, row: res.locationRow, col: res.locationColumn },
          },
        });
      }
      return res;
    },
    // 转移芯片
    *moveChip({ payload }, { call }) {
      const res = getResponse(yield call(moveChip, payload));
      return res;
    },
    // 自动转移
    *autoAssignTransfer({ payload }, { call }) {
      const res = getResponse(yield call(autoAssignTransfer, payload));
      return res;
    },
    // 不良自动分配
    *autoAssignTransferNc({ payload }, { call }) {
      const res = getResponse(yield call(autoAssignTransferNc, payload));
      return res;
    },
    *moveOver({ payload }, { call }) {
      const res = getResponse(yield call(moveOver, payload));
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
      const res = getResponse(yield call(fetchEqInfo, payload ));
      return res;
    },

    *bindingEqConfirm({ payload }, { call }) {
      const res = getResponse(yield call(bindingEqConfirm, payload ));
      return res;
    },

    *changeEqConfirm({ payload }, { call }) {
      const res = getResponse(yield call(changeEqConfirm, payload ));
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
