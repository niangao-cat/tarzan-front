/*
 * @Description: 入库单查询
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-09-11 09:08:34
 * @LastEditTime: 2020-09-11 17:10:04
 */

import { getResponse, createPagination, parseParameters } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';

import {
  fetchHeadList,
  fetchLineList,
  fetchLineDetail,
  headPrint,
  headCancelDoc,
} from '@/services/hwms/inboundOrderQueryService';

export default {
  namespace: 'inboundOrderQuery',
  state: {
    headList: [],
    pagination: {},
    lineList: [],
    linePagination: {},
    abnormalTypeList: [],
    selectedRecord: {},
    exceptionTypeList: [],
    selectedLineRow: [],
    detailList: [],
    detailListPagination: {},
  },
  effects: {
    *init(_, { call, put }) {
      const res = yield call(queryMapIdpValue, {
        statusList: 'WMS.RECEIPT_DOC_STATUS',
        barcodeStatusList: 'WMS.MTLOT.STATUS',
        qualityStatusList: 'WMS.MTLOT.QUALITY_STATUS',
      });
      yield put({
        type: 'updateState',
        payload: {
          ...res,
        },
      });
    },
    *fetchHeadList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchHeadList, parseParameters(payload)));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            headList: res.content,
            pagination: createPagination(res),
          },
        });
      }
      return res;
    },
    *fetchLineList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchLineList, parseParameters(payload)));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            lineList: res.content,
            linePagination: createPagination(res),
          },
        });
      }
      return res;
    },
    *fetchLineDetail({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchLineDetail, parseParameters(payload)));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            detailList: res.content,
            detailListPagination: createPagination(res),
          },
        });
      }
      return res;
    },
    // 头打印
    *headPrint({ payload }, { call }) {
      const res = getResponse(yield call(headPrint, payload));
      return res;
    },
    // 单据撤销
    *headCancelDoc({ payload }, { call }) {
      const res = getResponse(yield call(headCancelDoc, payload));
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
