import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import { isArray } from 'lodash';
import {
  fetchList,
  fetchDepartment,
  handleSavePermitCount,
  handleContinueRepair,
  handleStopRepair,
} from '@/services/hhme/repairJudgeService';

export default {
  namespace: 'repairPermitJudge',
  state: {
    list: [],
    statusList: [],
    departmentList: [],
    pagination: {},
  },
  effects: {
    *fetchLovData(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          statusList: 'HME.REPAIR_STATUS', // 返修状态
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
        const resList = result.content;
        yield put ({
          type: 'updateState',
          payload: {
            list: isArray(resList) ? resList.map(e => ({ ...e, _status: 'update'})) : [],
            pagination: createPagination(result),
          },
        });
      }
    },
    *handleSavePermitCount({ payload }, { put, call }) {
      const res = getResponse(yield call(handleSavePermitCount, payload));
      const { index, list } = payload;
      if (res) {
        list.splice(index, 1, {
          ...list[index],
          ...res,
        });
        yield put({
          type: 'updateState',
          payload: {
            list,
          },
        });
      }
      return res;
    },
    *handleContinueRepair({payload}, {call}){
      const res = getResponse(yield call(handleContinueRepair, payload));
      return res;
    },
    *handleStopRepair({payload}, {call}) {
      const res = getResponse(yield call(handleStopRepair, payload));
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
