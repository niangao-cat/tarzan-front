/**
 * 接口监控平台
 */
import { getResponse, createPagination } from 'utils/utils';
import { queryList, saveOne } from '@/services/hwms/itfObjectTransactionIfaceService.js';

export default {
  namespace: 'itfObjectTransactionIface', // model的唯一命名空间，与当前文件名相同，项目中不能重复

  // 保存 Model 的状态数据，直接决定了视图层的输出
  state: {
    listData: [],
    pagination: {},
  },
  effects: {
    // 查询列表
    *queryList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            listData: res.content,
            pagination: createPagination(res),
          },
        });
      }
      return res;
    },

    // 保存信息
    *saveOne({ payload }, { call }) {
      const result = yield call(saveOne, payload);
      return getResponse(result);
    },
  },

  // Action 处理器，用来处理同步操作，算出最新的 State
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload, // 更新state里面变量值
      };
    },
  },
};
