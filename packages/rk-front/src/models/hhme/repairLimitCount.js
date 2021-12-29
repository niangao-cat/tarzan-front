import { queryMapIdpValue } from 'hzero-front/lib/services/api';
import { getResponse, createPagination } from 'utils/utils';
import {
  fetchList,
  deleteLimitCount,
  saveLimitCount,
  fetchDepartment,
  fetchHisRecord,
} from '@/services/hhme/repairLimitCountService';

export default {
  namespace: 'repairLimitCount',
  state: {
    list: [],
    pagination: {},
    departmentList: [],
    enableFlag: [],
    hisList: [],
    hisPagination: {},
  },

  effects: {
    *fetchEnum(_, { call, put }) {
      const res = yield call(queryMapIdpValue, {
        enableFlag: 'Z.FLAG_YN',
      });
      const safeRes = getResponse(res);
      if (safeRes) {
        yield put({
          type: 'updateState',
          payload: {
            enableFlag: safeRes.enableFlag,
          },
        });
      }
    },
    *fetchDepartment({ payload }, { put, call }) {
      const res = yield call(fetchDepartment, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            departmentList: list,
          },
        });
      }
      return list;
    },
    *fetchList({ payload }, { put, call }) {
      const result = getResponse(yield call(fetchList, payload));
      if (result) {
        yield put ({
          type: 'updateState',
          payload: {
            list: result.content,
            pagination: createPagination(result),
          },
        });
      }
    },
    *deleteLimitCount({payload}, {call}) {
      return getResponse(yield call(deleteLimitCount, payload));

    },
    *saveLimitCount({payload}, {call}) {
      const res = getResponse(yield call(saveLimitCount, payload));
      return res;
    },
    *fetchHisRecord({payload}, {put, call}) {
      const result = getResponse(yield call(fetchHisRecord, payload));
      if (result) {
        yield put ({
          type: 'updateState',
          payload: {
            hisList: result.content,
            hisPagination: createPagination(result),
          },
        });
      }
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
