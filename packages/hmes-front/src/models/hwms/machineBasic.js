/**
 * 机台基础数据维护
 *@date：2019/9/21
 *@author：jiaming.liu <jiaming.liu01@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  queryList,
  queryHistoryList,
  create,
  updateN,
  updateY,
  querySiteList,
} from '@/services/hwms/machineBasicService';

export default {
  namespace: 'machineBasic', // model的唯一命名空间，与当前文件名相同，项目中不能重复

  // 保存 Model 的状态数据，直接决定了视图层的输出
  state: {
    dataList: [], // 列表
    pagination: [],
    hisList: [], // 历史列表
    hisPagination: {},
    machineTypeMap: [], // 机台类型
    enableFlagMap: [], // 有效性
    siteMap: [], // 工厂
  },
  // 副作用，处理异步动作
  effects: {
    // 查询独立值集
    *init({ payload }, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          machineTypeMap: 'Z_MACHINE_TYPE',
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
    // 查询工厂下拉框
    *querySiteList(_, { call, put }) {
      const res = getResponse(yield call(querySiteList));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            siteMap: res.rows,
          },
        });
      }
    },
    // 查询机台基础数据列表
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
    // 查询历史数据列表
    *queryHistoryList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryHistoryList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            hisList: res.rows.content,
            hisPagination: createPagination(res.rows),
          },
        });
      }
      return res;
    },
    // 失效按钮
    *updateN({ payload }, { call }) {
      return getResponse(yield call(updateN, payload));
    },
    // 启用按钮
    *updateY({ payload }, { call }) {
      return getResponse(yield call(updateY, payload));
    },
    // 创建
    *create({ payload }, { call }) {
      return getResponse(yield call(create, payload));
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
