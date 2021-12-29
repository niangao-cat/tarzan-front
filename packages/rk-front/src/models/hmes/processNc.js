/*
 * @Description: 工序不良判定标准维护
 * @Version: 0.0.1
 * @Autor: li.zhang13@hand-china.com
 * @Date: 2021-01-21 09:36:44
 */
import { getResponse, createPagination, parseParameters } from 'utils/utils';
import { fetchStatueSelectList } from '@/services/api';
import {
  fetchHeadData,
  fetchLineData,
  fetchDetailData,
  saveHeadData,
  saveLineData,
  saveDetailData,
  deleteLineData,
  deleteHeadData,
  deleteDetailData,
  updateHeadData,
  updateLineData,
  updateDetailData,
} from '@/services/hmes/processNcService';
import { get as chainGet } from 'lodash';

export default {
  namespace: 'processNc',
  state: {
    headData: [], // 头数据
    headDataPagination: {}, // 头分页
    lineData: [], // 行数据
    lineDataPagination: {}, // 行分页
    detailData: [], // 明细数据
    detailDataPagination: {}, // 明细分页
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
    // 获取行数据
    *fetchLineData({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchLineData, parseParameters(payload)));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            lineData: res.content,
            lineDataPagination: createPagination(res),
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
    // 保存行数据
    *saveLineData({ payload }, { call }) {
      const res = getResponse(yield call(saveLineData, payload));
      return res;
    },
    // 修改行数据
    *updateLineData({ payload }, { call }) {
      const res = getResponse(yield call(updateLineData, payload));
      return res;
    },
    // 删除行数据
    *deleteLineData({ payload }, { call }) {
      const res = getResponse(yield call(deleteLineData, payload));
      return res;
    },
    // 删除头
    *deleteHeadData({ payload }, { call }) {
      const res = getResponse(yield call(deleteHeadData, payload));
      return res;
    },
    // 获取行明细数据
    *fetchDetailData({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchDetailData, parseParameters(payload)));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            detailData: res.content,
            detaulDataPagination: createPagination(res),
          },
        });
      }
      return res;
    },
    // 保存行明细数据
    *saveDetailData({ payload }, { call }) {
      const res = getResponse(yield call(saveDetailData, payload));
      return res;
    },
    // 修改行明细数据
    *updateDetailData({ payload }, { call }) {
      const res = getResponse(yield call(updateDetailData, payload));
      return res;
    },
    // 删除行明细数据
    *deleteDetailData({ payload }, { call }) {
      const res = getResponse(yield call(deleteDetailData, payload));
      return res;
    },
    // 获取status下拉
    *fetchStatueSelectList({ payload }, { call, put }) {
      const res = yield call(fetchStatueSelectList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            [payload.type]: chainGet(list, 'rows', []),
          },
        });
      }
      return list;
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
