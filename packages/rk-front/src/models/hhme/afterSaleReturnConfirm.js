/*
 * @Description: 返品确认
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-09-08 11:18:33
 * @LastEditTime: 2020-09-09 09:06:27
 */

import { getResponse } from 'utils/utils';
import {
  enterSite,
  getSiteList,
  scaneMaterialCode,
  saveData,
  finishData,
} from '@/services/hhme/afterSaleReturnConfirmService';

export default {
  namespace: 'afterSaleReturnConfirm',
  state: {
    workcellInfo: {}, // 工位信息
    defaultSite: {},
    info: {}, // 扫描返回的信息
    recordList: [],
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
    // 扫描条码
    *scaneMaterialCode({ payload }, { call, put }) {
      const result = getResponse(yield call(scaneMaterialCode, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            info: result,
            recordList: result.recordList,
          },
        });
      }
      return result;
    },
    // 保存数据
    *saveData({ payload }, { call }) {
      const result = getResponse(yield call(saveData, payload));
      return result;
    },
    // 完成
    *finishData({ payload }, { call }) {
      const result = getResponse(yield call(finishData, payload));
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
