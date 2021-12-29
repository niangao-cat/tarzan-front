
import { getResponse, createPagination} from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  queryHeadList,
  queryLineList,
  queryLineDetailList,
} from '@/services/hqms/pqcDocQueryService';

export default {
  namespace: 'pqcDocQuery',
  state: {
    headList: [], // 头数据源
    headPagination: {}, // 头表格分页
    lineList: [], // 行数据源
    linePagination: {}, // 行表格分页
    lineDetailList: [], // 行明细数据源
    lineDetailPagination: {}, // 行明细表格分页
    docTypeMap: [], // 单据类型
    version: [], // 版本
    inspectionResultList: [],
  },
  effects: {
    // 查询独立值集
    *init({ payload }, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          version: 'HCM.MATERIAL_VERSION',
          docTypeMap: 'QMS.PQC_00002',
          tenantId: payload.tenantId,
          inspectionResultList: 'QMS.INSPECTION_STATUS',
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
    // 查询头列表
    *queryHeadList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryHeadList, payload));
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
    // 查询行列表
    *queryLineList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryLineList, payload));
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

     // 查询行明细数据
    *queryLineDetailList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryLineDetailList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            lineDetailList: res.content,
            lineDetailPagination: createPagination(res),
          },
        });
      }
      return res;
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
