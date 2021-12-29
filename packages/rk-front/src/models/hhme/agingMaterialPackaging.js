/*
 * @Description: 时效物料物料封装
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-09-12 10:39:22
 * @LastEditTime: 2020-09-17 19:15:44
 */

import { getResponse } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  scanMaterialLotCode,
  printingBarcode,
  rawMaterialsTime,
  targetConfirm,
  sacnTargetCode,
} from '@/services/hhme/agingMaterialPackagingService';

export default {
  namespace: 'agingMaterialPackaging',
  state: {
    targetCard: [{}, {}, {}, {}],
    materialsInfo: {},
  },
  effects: {
    // 批量查询独立值集
    *batchLovData(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          mtlotTime: 'HME.ORIGINAL_MTLOT_TIME', // 原始条码时长设置
          objectQty: 'HME.SPLIT_OBJECT_QUANTITY', // 分装对象数量设置
          objectTime: 'HME.SPLIT_OBJECT_TIME', // 分装对象时长设置
          timeUom: 'HME.TIME_UOM', // 时长单位
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
    // 扫描来源
    *scanSourceCode({ payload }, { call, put }) {
      const result = getResponse(yield call(scanMaterialLotCode, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            materialsInfo: result,
          },
        });
      }
      return result;
    },
    // 原材料剩余时长提交
    *rawMaterialsTime({ payload }, { call }) {
      const result = getResponse(yield call(rawMaterialsTime, payload));
      return result;
    },
    // 扫描目标
    *scanTargetCode({ payload }, { call }) {
      const result = getResponse(yield call(scanMaterialLotCode, payload));
      return result;
    },
    // 打印条码
    *printingBarcode({ payload }, { call }) {
      const result = getResponse(yield call(printingBarcode, payload));
      return result;
    },
    // 目标条码确认
    *targetConfirm({ payload }, { call }) {
      const result = getResponse(yield call(targetConfirm, payload));
      return result;
    },
    *sacnTargetCode({ payload }, { call }) {
      const result = getResponse(yield call(sacnTargetCode, payload));
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
