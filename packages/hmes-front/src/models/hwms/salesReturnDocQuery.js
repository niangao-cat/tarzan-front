/**
 *销退单号
 *@date：2019/11/9
 *@author：junhui.liu <junhui.liu@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  salesReturnDocRowList,
  salesReturnDocHeadList,
  salesReturnDocDetailList,
  querySiteList,
} from '../../services/hwms/salesReturnDocService';

export default {
  namespace: 'salesReturnDocQuery', // model的唯一命名空间，与当前文件名相同，项目中不能重复

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
    siteMap: [], // 工厂
    instructionDocMap: [],
  },
  // 副作用，处理异步动作
  effects: {
    // 查询工厂下拉框
    *querySiteList(_, { call, put }) {
      const res = getResponse(yield call(querySiteList));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            siteMap: res.rows,
          },
        });
      }
    },
    // 批量查询独立值集
    *batchLovData({ payload }, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          statusMap: 'Z.DELIVERYDOC.STATUS',
          barCodestatusMap: 'MT.MTLOT.STATUS',
          qualityStatusMap: 'Z.MTLOT.QUALITY_STATUS.G',
          instructionDocMap: 'Z_INSTRUCTION_DOC_STATUS',
          tenantId: payload.tenantId,
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
    *salesReturnDocRowList({ payload }, { call, put }) {
      const result = getResponse(yield call(salesReturnDocRowList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            rowList: result.rows.content,
            rowPagination: createPagination(result.rows),
          },
        });
      }
      return result;
    },
    // 查询头列表数据
    *salesReturnDocHeadList({ payload }, { call, put }) {
      const res = getResponse(yield call(salesReturnDocHeadList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            headList: res.rows.content,
            headPagination: createPagination(res.rows),
          },
        });
      }
      return res;
    },

    // 查询明细数据
    *salesReturnDocDetailList({ payload }, { call, put }) {
      const res = getResponse(yield call(salesReturnDocDetailList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            detailList: res.rows.content,
            detailPagination: createPagination(res.rows),
          },
        });
      }
    },
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
