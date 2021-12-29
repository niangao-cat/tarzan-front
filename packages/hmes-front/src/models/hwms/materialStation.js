/**
 * 料站表维护
 *@date：2019/11/5
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */

import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  queryList,
  queryDetailList,
  createHeadData,
  createLineData,
  updateHeadN,
  updateHeadY,
  updateLineN,
  updateLineY,
} from '@/services/hwms/materialStationService';

export default {
  namespace: 'materialStation', // model的唯一命名空间，与当前文件名相同，项目中不能重复

  // 保存 Model 的状态数据，直接决定了视图层的输出
  state: {
    dataList: [], // 列表
    pagination: [],
    detailList: [], // 明细列表
    detailPagination: {},
    materialTypeMap: [], // 料站类型
    enableFlagMap: [], // 有效性
  },
  // 副作用，处理异步动作
  effects: {
    // 查询独立值集
    *init({ payload }, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          materialTypeMap: 'Z_PROGRAM_STATUS',
          enableFlagMap: 'Z.FLAG_YN',
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
    // 查询基础数据列表
    *queryList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            dataList: res.rows.content,
            pagination: createPagination(res.rows),
          },
        });
      }
      return res;
    },
    // 查询明细数据列表
    *queryDetailList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryDetailList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            detailList: res.rows.content,
            detailPagination: createPagination(res.rows),
          },
        });
      }
      return res;
    },
    // 头失效按钮
    *updateHeadN({ payload }, { call }) {
      return getResponse(yield call(updateHeadN, payload));
    },
    // 头启用按钮
    *updateHeadY({ payload }, { call }) {
      return getResponse(yield call(updateHeadY, payload));
    },
    // 行失效按钮
    *updateLineN({ payload }, { call }) {
      return getResponse(yield call(updateLineN, payload));
    },
    // 行启用按钮
    *updateLineY({ payload }, { call }) {
      return getResponse(yield call(updateLineY, payload));
    },
    // 创建头数据
    *createHeadData({ payload }, { call }) {
      return getResponse(yield call(createHeadData, payload));
    },
    // 创建行数据
    *createLineData({ payload }, { call }) {
      return getResponse(yield call(createLineData, payload));
    },
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
