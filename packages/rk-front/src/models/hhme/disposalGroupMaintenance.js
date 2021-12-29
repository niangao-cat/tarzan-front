/**
 * @description  处置组功能维护
 * @param null
 * @author ywj
 * @email wenjie.yang01@hand-china.com
 * @date 2020/11/25
 * @time 13:52
 * @version 0.0.1
 */
import { getResponse, createPagination } from 'utils/utils';
// import { queryMapIdpValue } from 'services/api';
import {
  fetchList,
  fetchDetailList,
  handleSave,
  deleteRelationRecord,
  deleteRecord,
  getSiteList,
  fetchFunctionTypeList,
} from '@/services/hhme/disposalGroupMaintenanceService';

export default {
  namespace: 'disposalGroupMaintenance',
  state: {
    list: [], // 处置组&处置方法关系
    pagination: {},
    relationList: [],
    relationListPagination: {},
    defaultSite: {},
    detailHead: {},
    funcTypeList: [],
  },
  effects: {
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
    // 查询主数据
    *fetchList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            list: res.rows.content,
            pagination: createPagination(res.rows),
          },
        });
      }
      return res;
    },

    *fetchHeadDetail({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchList, payload));
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {
            detailHead: res.rows.content[0],
          },
        });
      }
      return res;
    },

    *fetchFunctionTypeList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchFunctionTypeList, payload));
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {
            funcTypeList: res.rows,
          },
        });
      }
      return res;
    },

    // 查询明细数据
    *fetchDetailList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchDetailList, payload));
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {
            relationList: res.rows.content,
            relationListPagination: createPagination(res.rows),
          },
        });
      }
      return res;
    },

    // 保存信息
    *handleSave({ payload }, { call }) {
      const res = getResponse(yield call(handleSave, payload));
      return res;
    },

    // 删除明细信息
    *deleteRelationRecord({ payload }, { call }) {
      const res = getResponse(yield call(deleteRelationRecord, payload));
      return res;
    },

    // 删除主信息
    *deleteRecord({ payload }, { call }) {
      const res = getResponse(yield call(deleteRecord, payload));
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
