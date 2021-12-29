/*
 * @Description: 冻结解冻平台
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-22 15:27:53
 * @LastEditTime: 2021-03-04 09:39:56
 */

import { getResponse, createPagination, parseParameters } from 'utils/utils';
import {
  handleFetchHeadList,
  handleFetchLineList,
  handleFetchBarCodeList,
  handleExport,
  handleFetchSn,
  handleCreate,
  // handleFetchLineListSn,
  handleUnfreeze,
  handleLineUnfreeze,
  getSiteList,
  handleApproval,
  freeze,
} from '@/services/hqms/freezeUnfreezePlatformService';
import { queryMapIdpValue } from 'services/api';

export default {
  namespace: 'freezeUnfreezePlatform',
  state: {
    pagination: {}, // 分页数据
    headListPagination: {},
    headList: [],
    snList: [],
    createInfo: {}, // 创建的信息
    defaultSite: {},
    barCodeListPagination: {},
    barCodeList: [],
  },
  effects: {
    // 获取值集
    *batchLovData(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          freezeType: 'HME_FREEZE_TYPE',
          cosType: 'HME_COS_TYPE',
          freezeStatus: 'HME_FREEZE_STATUS',
        })
      );
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            ...result,
          },
        });
      }
    },
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
    // 查询头数据
    *handleFetchHeadList({ payload }, { call, put }) {
      const result = getResponse(yield call(handleFetchHeadList, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            headList: result.content,
            headListPagination: createPagination(result),
          },
        });
      }
      return result;
    },
    // 查询行数据
    *handleFetchLineList({ payload }, { call, put }) {
      const result = getResponse(yield call(handleFetchLineList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            lineList: result.content,
            linePagination: createPagination(result),
          },
        });
      }
      return result;
    },
    // 查询条码明细
    *handleFetchBarCodeList({ payload }, { call, put }) {
      const result = getResponse(yield call(handleFetchBarCodeList, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            barCodeList: result.content,
            // barCodeListPagination: createPagination(result),
          },
        });
      }
      return result;
    },
    // // 查询行数据-通过sn
    // *handleFetchLineListSn({ payload }, { call, put }) {
    //   const result = getResponse(yield call(handleFetchLineListSn, payload));
    //   if (result) {
    //     yield put({
    //       type: 'updateState',
    //       payload: {
    //         lineList: result,
    //       },
    //     });
    //   }
    //   return result;
    // },
    // sn查询
    *handleFetchSn({ payload }, { call, put }) {
      const result = getResponse(yield call(handleFetchSn, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            snList: result,
          },
        });
      }
      return result;
    },
    // 创建
    *handleCreate({ payload }, { call, put }) {
      const result = getResponse(yield call(handleCreate, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            createInfo: result,
          },
        });
      }
      return result;
    },
    // 导出
    *handleExport({ payload }, { call }) {
      const result = getResponse(yield call(handleExport, payload));
      return result;
    },
    *handleUnfreeze({ payload }, { call }) {
      const result = getResponse(yield call(handleUnfreeze, payload));
      return result;
    },
    *handleLineUnfreeze({ payload }, { call }) {
      const result = getResponse(yield call(handleLineUnfreeze, payload));
      return result;
    },
    *handleApproval({ payload }, { call }) {
      const result = getResponse(yield call(handleApproval, payload));
      return result;
    },
    *freeze({ payload }, { call }) {
      const result = getResponse(yield call(freeze, payload));
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
