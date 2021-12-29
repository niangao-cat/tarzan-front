/*
 * @Description: FAC-Y宽判定标准维护
 * @Version: 0.0.1
 * @Autor: li.zhang13@hand-china.com
 * @Date: 2021-02-04 10:45:11
 */
import { getResponse, createPagination, parseParameters } from 'utils/utils';
// import { queryMapIdpValue } from 'services/api';
import {
  fetchHeadData,
  saveHeadData,
  deleteHeadData,
  updateHeadData,
  getHistoryData,
} from '@/services/hmes/facYkDetermineService';

export default {
  namespace: 'facYk',
  state: {
    headData: [], // 头数据
    headDataPagination: {}, // 头分页
    detail: {}, // 抽屉明细
  },
  effects: {
    // 获取头数据
    *fetchHeadData({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchHeadData, parseParameters(payload)));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            headData: res.content,
            headDataPagination: createPagination(res),
          },
        });
      }
      return res;
    },
    // 保存头数据
    *saveHeadData({ payload }, { call }) {
      const res = getResponse(yield call(saveHeadData, payload));
      return res;
    },
    // 修改头数据
    *updateHeadData({ payload }, { call }) {
      const res = getResponse(yield call(updateHeadData, payload));
      return res;
    },
    // 删除头
    *deleteHeadData({ payload }, { call }) {
      const res = getResponse(yield call(deleteHeadData, payload));
      return res;
    },
    // 获取历史记录
    *getHistoryData({ payload }, { call, put }) {
      const res = getResponse(yield call(getHistoryData, parseParameters(payload)));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            historyData: res.content,
            historyDataPagination: createPagination(res),
          },
        });
      }
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
