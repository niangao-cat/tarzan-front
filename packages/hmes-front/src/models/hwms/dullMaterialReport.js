/**
 * 呆滞物料报表
 *@date：2019/10/24
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  queryList,
  querySiteList,
  queryImportList,
  saveData,
  submitApprove,
} from '@/services/hwms/dullMaterialReportService';

export default {
  namespace: 'dullMaterialReport',
  state: {
    dataList: [],
    pagination: {},
    importList: [], // 导入数据源
    impPagination: {}, // 导入分页器
    siteMap: [], // 工厂
    dullTypeMap: [], // 呆滞类型
    qualityStatusMap: [], // 质量状态
  },
  effects: {
    // 查询独立值集
    *init({ payload }, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          dullTypeMap: 'Z_DULL_TYPE',
          qualityStatusMap: 'Z.MTLOT.QUALITY_STATUS.G',
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
    // 查询工厂下拉框
    *querySiteList(_, { call, put }) {
      const res = getResponse(yield call(querySiteList));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            siteMap: res,
          },
        });
      }
    },
    // 查询呆滞物料列表
    *queryList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            dataList: res.content,
            pagination: createPagination(res),
          },
        });
      }
      return res;
    },
    // 查询需要导入的呆滞物料列表
    *queryImportList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryImportList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            importList: res.rows.content,
            impPagination: createPagination(res.rows),
          },
        });
      }
      return res;
    },
    // 导入数据
    *saveData({ payload }, { call }) {
      return getResponse(yield call(saveData, payload));
    },
    // 提交审批
    *submitApprove({ payload }, { call }) {
      return getResponse(yield call(submitApprove, payload));
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
