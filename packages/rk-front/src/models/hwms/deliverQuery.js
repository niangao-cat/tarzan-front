/**
 * 送货单查询
 *@date：2019/9/21
 *@author：junhui.liu <junhui.liu@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import { getResponse, createPagination, parseParameters } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  deliverRowList,
  deliverHeadList,
  deliverDetailList,
  cancelInstruction,
  deliverCreateBarcodeData,
  printingBarcode,
  headPrint,
  fetchLineDetailList,
  getSiteList,
} from '../../services/hwms/deliverQueryService';

export default {
  namespace: 'deliverQuery', // model的唯一命名空间，与当前文件名相同，项目中不能重复

  // 保存 Model 的状态数据，直接决定了视图层的输出
  state: {
    headList: [], // 头列表
    headPagination: [], // 头分页
    rowList: [], // 行列表
    rowPagination: {}, // 行分页
    detailList: [],
    detailPagination: {},
    statusMap: [],
    barCodestatusMap: [],
    qualityStatusMap: [],
    barCodeList: [], // 条码列表
    barCodePagination: {}, // 条码分页
    lineDetailList: [], // 行明细数据源
    lineDetailPagination: {}, // 行明细表格分页
    defaultSite: {}, // 默认工厂
  },
  // 副作用，处理异步动作
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
    // 批量查询独立值集
    *batchLovData(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          statusMap: 'WMS.DELIVERY_DOC.STATUS',
          barCodestatusMap: 'Z.MTLOT.STATUS.G',
          qualityStatusMap: 'Z.MTLOT.QUALITY_STATUS.G',
          performanceLevel: 'Z.MATERIAL_LEVEL',
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
    // 送货单行查询
    *deliverRowList({ payload }, { call, put }) {
      const result = getResponse(yield call(deliverRowList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            rowList: result.content,
            rowPagination: createPagination(result),
          },
        });
      }
      return result;
    },
    // 查询值集
    *init(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          statusMap: 'HZERO.DEMO.TODO',
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

    // 查询头列表数据
    *deliverHeadList({ payload }, { call, put }) {
      const res = getResponse(yield call(deliverHeadList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            headList: res.content,
            headPagination: createPagination(res),
          },
        });
      }
      return res;
    },

    // 查询明细数据
    *deliverDetailList({ payload }, { call, put }) {
      const res = getResponse(yield call(deliverDetailList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            detailList: res.content,
            detailPagination: createPagination(res),
          },
        });
      }
    },

    // 取消送货单
    *cancelInstruction({ payload }, { call }) {
      const response = yield call(cancelInstruction, payload);
      return response;
    },

    // 送货单查询-条码创建
    *deliverCreateBarcodeData({ payload }, { call, put }) {
      const res = getResponse(yield call(deliverCreateBarcodeData, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            barCodeList: res,
          },
        });
      }
      return res;
    },

    // 条码打印
    *printingBarcode({ payload }, { call }) {
      const result = getResponse(yield call(printingBarcode, payload));
      return result;
    },

    // 头打印
    *headPrint({ payload }, { call }) {
      const res = getResponse(yield call(headPrint, payload));
      return res;
    },

    // 获取行明细数据源列表数据
    *fetchLineDetailList({ payload }, { call, put }) {
      const res = yield call(fetchLineDetailList, parseParameters(payload));
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            lineDetailList: list.content,
            lineDetailPagination: createPagination(list),
          },
        });
      }
      return list;
    },
  },

  // Action 处理器，用来处理同步操作，算出最新的 State
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
