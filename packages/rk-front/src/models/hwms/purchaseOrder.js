/**
 * @Description: 采购订单查询
 * @author: ywj
 * @date 2020/3/17 15:02
 * @version 1.0
 */

// 引入依赖
import { getResponse, createPagination } from 'utils/utils';
import {
  fetchPurchaseOrderHeadList,
  fetchPurchaseOrderLineList,
  fetchCreateOrder,
  fetchGeneratePoDeliveryNum,
  fetchCorverNum,
  fetchDetailData,
  fetchOutLineForBoom,
  createOutSource,
  fetchOutsourceInvoiceQuery,
} from '../../services/hwms/purchaseOrderService';
import {showQuantity} from '@/services/hwms/inventoryAllocationService';
import { queryMapIdpValue } from '../../services/api';

export default {
  namespace: 'purchaseOrder',
  state: {
    code: {}, // 值集集合
    purchaseOrderHeadList: [], // 头信息存储
    purchaseOrderHeadPagination: {}, // 头表格分页
    purchaseOrderLineList: [], // 行信息存储
    purchaseOrderLinePagination: {}, // 行表格分页
    lineData: {}, // 查询行信息
    detailList: [], // 查询明细信息
    outSourceData: {}, // 外协信息
    outSourceHeadData: {}, // 外协信息
    outSourceList: [], // 外协明细信息
    outsourcingCompleteLoading: false,
    deliveryCompleteLoading: false,
  },

  /* 视图层进入model层的方法定义 */

  effects: {
    // 获取头表信息
    *fetchPurchaseOrderHeadList({ payload }, { call, put }) {
      // 调用seivice层接口 触发数据
      const res = yield call(fetchPurchaseOrderHeadList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            purchaseOrderHeadList: list.content,
            purchaseOrderLineList: [],
            purchaseOrderHeadPagination: createPagination(list),
          },
        });
      }
    },

    // 获取行信息
    *fetchPurchaseOrderLineList({ payload }, { call, put }) {
      // 调用seivice层接口 触发数据
      const res = yield call(fetchPurchaseOrderLineList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            purchaseOrderLineList: list.content,
            purchaseOrderLinePagination: createPagination(list),
          },
        });
      }
    },

    // 获取行信息
    *fetchCorverNum({ payload }, { call }) {
      // 调用seivice层接口 触发数据
      const res = yield call(fetchCorverNum, payload);
      return getResponse(res);
    },

    // 送货单创建
    *fetchCreateOrder({ payload }, { call, put}) {
      // 调用seivice层接口 触发数据
      const res = yield call(fetchCreateOrder, payload);
      yield put({
        type: 'updateState',
        payload: {
          deliveryCompleteLoading: false,
        },
      });
      // const list = getResponse(res);
      return getResponse(res);
    },

    // 生成单号，如果传了采购订单行，还能处理合并行数据
    *fetchGeneratePoDeliveryNum({ payload }, { call }) {
      const result = yield call(fetchGeneratePoDeliveryNum, payload);
      return getResponse(result);
    },

    // 查询明细信息
    *fetchDetailData({ payload }, { call, put }) {
      const result = yield call(fetchDetailData, payload);
      const res = getResponse(result);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            lineData: res.qmsInvoiceAssemblyHeadReturnDTO,
            detailList: res.qmsInvoiceAssemblyLineReturnDTOS,
          },
        });
      }
    },

    // 查询明细信息
    *fetchOutLineForBoom({ payload }, { call, put }) {
      const result = yield call(fetchOutLineForBoom, payload);
      const res = getResponse(result);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            outSourceData: res,
            outSourceHeadData: res.qmsInvoiceHeadReturnDTO,
            outSourceList: res.qmsInvoiceLineReturnDTOList,
          },
        });
      }
    },

    // 生成外协单
    *createOutSource({ payload }, { call, put }) {
      const result = yield call(createOutSource, payload);
      yield put({
        type: 'updateState',
        payload: {
          outsourcingCompleteLoading: false,
        },
      });
      return getResponse(result);
    },

    // 批量查询值集
    *init(_, { call, put }) {
      const { instructionStatusList, siteList, instructionDocType, poTypeMap } = yield call(queryMapIdpValue, {
        instructionStatusList: 'Z_INSTRUCTION_DOC_STATUS',
        siteList: 'MT.SUPPLIER_SITE',
        instructionDocType: 'WMS.PO.TYPE',
        poTypeMap: 'WMS.PO_LINE.TYPE',
      });
      yield put({
        type: 'setCodeReducer',
        payload: {
          'HIAM.RESOURCE_LEVEL': instructionStatusList,
          'HIAM.REQUEST_METHOD': siteList,
          'WMS.PO.TYPE': instructionDocType,
          'WMS.PO_LINE.TYPE': poTypeMap,
        },
      });
    },

    // 查询明细信息
    *fetchOutsourceInvoiceQuery({ payload }, { call, put }) {
      const result = yield call(fetchOutsourceInvoiceQuery, payload);
      const res = getResponse(result);
      if (res) {
        for(let i = 0; i<res.qmsInvoiceLineReturnDTOList.length; i++ ){
          res.qmsInvoiceLineReturnDTOList[i]._status = "update";
        }
        yield put({
          type: 'updateState',
          payload: {
            outSourceData: res,
            outSourceHeadData: res.qmsInvoiceHeadReturnDTO,
            outSourceList: res.qmsInvoiceLineReturnDTOList,
          },
        });
        return res;
      }
    },

    // 查询库存
    *showQuantity({ payload }, { call }) {
      const res = getResponse(yield call(showQuantity, payload));
      return res;
    },
  },

  // 调用更新状态
  reducers: {
    updateState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    setCodeReducer(state, { payload }) {
      return {
        ...state,
        code: Object.assign(state.code, payload),
      };
    },
  },
};
