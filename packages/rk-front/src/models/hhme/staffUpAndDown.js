/*
 * @Description: 员工上下岗
 * @version: 0.1.0
 * @Author: ywj
 * @Autor: quanhe.zhao@hand-china.com
 */
import { getResponse, parseParameters, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  queryStaffData,
  queryUpAndDownData,
  queryFrequencyData,
  queryList,
  setDateForStaff,
  queryLineData,
} from '@/services/hhme/staffUpAndDownService';

export default {
  namespace: 'staffUpAndDown',
  state: {
      staffData: {}, // 员工信息
      upAndDownData: [], // 上下岗信息
      frequencyData: [], // 班次信息
      listData: [], // 列表信息
      pagination: {}, // 分页
      workcellLists: [], // 工位
      reasonList: [], // 原因列表
  },
  effects: {
    *queryStaffData({ payload }, { put, call }) {
      const res = yield call(queryLineData, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            // 先把默认的工位带出来，重新选择班组时通过updateState来更新工位列表
            workcellLists: list,
          },
        });
      }

      const resUser = yield call(queryStaffData, payload);
      const listUser = getResponse(resUser);
      if (listUser) {
        yield put({
          type: 'updateState',
          payload: {
            // 先把默认的工位带出来，重新选择班组时通过updateState来更新工位列表
            staffData: listUser,
          },
        });
      }

      const resReason = yield call(queryMapIdpValue, {
        reasonList: 'HME.STAFF_OFFREASON',
      });
      yield put({
        type: 'updateState',
        payload: {
          ...resReason,
        },
      });
      return list;
    },

    *queryUpAndDownData({ payload }, { put, call }) {
      const res = yield call(queryUpAndDownData, parseParameters(payload));
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            upAndDownData: list,
          },
        });
      }
      return list;
    },

    *queryFrequencyData({ payload }, { put, call }) {
      const res = yield call(queryFrequencyData, parseParameters(payload));
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            frequencyData: list,
          },
        });
      }
      return list;
    },

    *queryList({ payload }, { put, call }) {
      const res = yield call(queryList, parseParameters(payload));
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            listData: list.content,
            pagination: createPagination(list),
          },
        });
      }
      return list;
    },

    // 修改备注及交期
    *setDateForStaff({ payload }, { call }) {
      const res = yield call(setDateForStaff, payload);
      return getResponse(res);
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
