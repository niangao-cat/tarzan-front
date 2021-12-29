import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  fetchHeadList,
  addHeadList,
  updateHeadList,
} from '../../services/hhme/basicDataMaintenDistriService';

export default {
  namespace: 'basicDataMaintenDistri',
  state: {
    typeGroup: [], // 策略组
    pagination: {},
    dateList: [],
  },
  effects: {
    // 批量查询独立值集
    *batchData(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          typeGroup: 'WMS.DISTRIBUTION',
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
    *fetchHeadList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchHeadList, payload));
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
    *addHeadList({ payload }, { call }) {
      const res = getResponse(yield call(addHeadList, payload));
      return res;
    },
    *updateHeadList({ payload }, { call }) {
      const res = getResponse(yield call(updateHeadList, payload));
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
