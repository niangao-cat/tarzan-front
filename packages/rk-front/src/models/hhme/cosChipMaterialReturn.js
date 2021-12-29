/*
 * @Description: cos芯片退料
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-12-11 10:39:39
 * @LastEditTime: 2020-12-14 15:23:19
 */

import { getResponse } from 'utils/utils';
import {
  getSiteList,
  enterSite,
  fetchWorkOrder,
  scaneReturnBarCode,
  handleReturnConfirm,
  printingBarcode,
} from '@/services/hhme/cosChipMaterialReturnService';

export default {
  namespace: 'cosChipMaterialReturn',
  state: {
    workcellInfo: {}, // 工位信息
    defaultSite: {},
    record: {}, // 行信息
    returnInfo: {}, // 待退料信息
    barCodeList: [], // 扫描的条码列表
    detailList: [], // 明细信息
    detailSinkList: [], // 明细信息
  },
  effects: {
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
    *fetchWorkOrder({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchWorkOrder, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            returnInfo: result,
          },
        });
      }
      return result;
    },
    *scaneReturnBarCode({ payload }, { call }) {
      const result = getResponse(yield call(scaneReturnBarCode, payload));
      return result;
    },
    *handleReturnConfirm({ payload }, { call }) {
      const result = getResponse(yield call(handleReturnConfirm, payload));
      return result;
    },
    // 条码打印
    *printingBarcode({ payload }, { call }) {
      const result = getResponse(yield call(printingBarcode, payload));
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
