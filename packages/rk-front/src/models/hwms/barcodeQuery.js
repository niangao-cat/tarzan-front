/**
 * 条码查询
 *@date：2019/9/12
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import { createPagination, getResponse } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import { ergodicData } from '@/utils/utils';
import {
  queryBarcodeList,
  queryBarcodeHistoryList,
  createBarcodeData,
  queryCreateReason,
  printingBarcode,
  printingBarcodeCos,
  fetchSite,
  createRDNum,
  queryLabCodeList,
  fetchOperationLabCodeList,
  saveOperationLabCode,
  fetchSiteList,
} from '@/services/hwms/barcodeQueryService';

export default {
  namespace: 'barcodeQuery',
  state: {
    dataList: [], // 条码列表
    detail: {}, // 条码明细
    pagination: {}, // 条码分页器
    historyList: [], // 条码历史列表
    hisPagination: {}, // 条码历史分页器
    statusMap: [], // 条码状态
    enabledMap: [], // 有效性
    qualityStatusMap: [], // 质量状态
    performanceLevel: [], // 性能等级
    reasonMap: [], // 创建原因
    enableMap: [], // 是否有效
    getSite: {}, // 工厂信息
    labCodeList: [], // 实验代码列表
    labCodePagination: {}, // 实验代码分页器
    operationLabCodeList: [], // 工艺实验代码列表
    operationLabCodePagination: {}, // 工艺实验代码分页器
    siteList: [],
  },
  effects: {
    // 查询创建原因
    *queryCreateReason(_, { call, put }) {
      const result = getResponse(yield call(queryCreateReason));
      if (result.success) {
        yield put({
          type: 'updateState',
          payload: {
            reasonMap: result.rows,
          },
        });
      }
    },
    // 批量查询独立值集
    *batchLovData(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          statusMap: 'MT.MTLOT.STATUS',
          qualityStatusMap: 'MT.MTLOT.QUALITY_STATUS',
          performanceLevel: 'Z.MATERIAL_LEVEL',
          enableMap: 'Z_MTLOT_ENABLE_FLAG',
          enabledMap: 'WMS.FLAG_YN',
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
    // 条码列表查询
    *queryBarcodeList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryBarcodeList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            dataList: result.content,
            pagination: createPagination(result),
          },
        });
      }
      return result;
    },
    // 条码历史列表查询
    *queryBarcodeHistoryList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryBarcodeHistoryList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            historyList: result.content,
            hisPagination: createPagination(result),
          },
        });
      }
      return result;
    },
    // 创建条码
    *createBarcodeData({ payload }, { call }) {
      const result = yield call(createBarcodeData, payload);
      return getResponse(result);
    },
    // 条码打印
    *printingBarcode({ payload }, { call }) {
      const result = getResponse(yield call(printingBarcode, payload));
      return result;
    },
    // 条码打印-cos
    *printingBarcodeCos({ payload }, { call }) {
      const result = getResponse(yield call(printingBarcodeCos, payload));
      return result;
    },
    // 获取工厂
    *getSite({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchSite, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            getSite: result,
          },
        });
      }
      return result;
    },
    *createRDNum({ payload }, { call }) {
      const result = yield call(createRDNum, payload);
      return getResponse(result);
    },

    // 实验代码列表查询
    *queryLabCodeList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryLabCodeList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            labCodeList: result.content,
            labCodePagination: createPagination(result),
          },
        });
      }
      return result;
    },

    // 工艺实验代码列表查询
    *fetchOperationLabCodeList({ payload }, { call, put }) {
      const res = yield call(fetchOperationLabCodeList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            operationLabCodeList: list.content,
            operationLabCodePagination: createPagination(list),
          },
        });
      }
    },

    // 保存工艺实验代码
    *saveOperationLabCode({ payload }, { call }) {
      const result = yield call(saveOperationLabCode, ergodicData(payload));
      return getResponse(result);
      // return result;
    },

    *fetchSiteList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchSiteList, payload));
      if(res) {
        yield put({
          type: 'updateState',
          payload: {
            siteList: res,
          },
        });
      }
    },


  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
