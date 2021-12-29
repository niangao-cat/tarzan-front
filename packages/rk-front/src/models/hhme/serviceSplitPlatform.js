/**
 * 售后拆机平台 - model
 * @date: 2020/09/08 15:27:17
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */


import { getResponse, parseParameters } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';

import {
  fetchWorkCellInfo,
  fetchDefaultSite,
  scanBarcode,
  fetchMaterialInfo,
  save,
  fetchBom,
  fetchReturnTestData,
  handlePrintCode,
  cancel,
  getSiteList,
} from '@/services/hhme/serviceSplitPlatformService';

export default {
  namespace: 'serviceSplitPlatform',
  state: {
    workcellInfo: {},
    siteInfo: {},
    baseInfo: {},
    list: [],
    statusList: [],
    flagList: [],
    bomDatas: {},
    returnTestList: [],
    defaultSite: {},
  },
  effects: {
    *init(_, { call, put }) {
      const res = yield call(queryMapIdpValue, {
        flagList: 'Z.FLAG_YN',
        statusList: 'HME.SPLIT_STATUS',
      });
      const siteInfo = yield call(fetchDefaultSite);
      yield put({
        type: 'updateState',
        payload: {
          ...res,
          siteInfo,
        },
      });
    },
    *fetchWorkCellInfo({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchWorkCellInfo, payload));
      if(res) {
        yield put({
          type: 'updateState',
          payload: {
            workcellInfo: res,
          },
        });
      }
      return res;
    },
    *scanBarcode({ payload }, { call, put }) {
      const res = getResponse(yield call(scanBarcode, payload));
      if (res) {
        const { recordLineList, ...baseInfo } = res;
        const { snNum } = payload;
        yield put({
          type: 'updateState',
          payload: {
            baseInfo: {
              ...baseInfo,
              snNum,
            },
            list: recordLineList,
          },
        });
      }
      return res;
    },

    *fetchMaterialInfo({ payload }, { call }) {
      const res = getResponse(yield call(fetchMaterialInfo, payload));
      return res;
    },
    *save({ payload }, { call }) {
      const res = getResponse(yield call(save, payload));
      return res;
    },

    *fetchBom({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchBom, payload));
      if(res) {
        yield put({
          type: 'updateState',
          payload: {
            bomDatas: res,
          },
        });
      }
      return res;
    },
    *fetchReturnTestData({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchReturnTestData, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            returnTestList: result,
          },
        });
      }
      return result;
    },
    // 打印
    *handlePrintCode({ payload }, { call }) {
      const res = getResponse(yield call(handlePrintCode, payload));
      return res;
    },
    // 登记撤销
    *cancel({ payload }, { call }) {
      const res = getResponse(yield call(cancel, payload));
      return res;
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
