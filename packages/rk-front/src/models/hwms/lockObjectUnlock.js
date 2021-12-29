/**
 * 送货单查询
 *@date：2019/9/21
 *@author：junhui.liu <junhui.liu@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  recordLocksQuery,
  releaseLock,
} from '../../services/hwms/lockObjectUnlockService';

export default {
  namespace: 'lockObjectUnlock', // model的唯一命名空间，与当前文件名相同，项目中不能重复

  // 保存 Model 的状态数据，直接决定了视图层的输出
  state: {
    headList: [], // 头列表
    headPagination: [], // 头分页
    lockObjectTypeList: [],
  },
  // 副作用，处理异步动作
  effects: {

    // 获取Hzero值集
    *querySelect({ payload }, { call, put }) {
      const response = yield call(queryMapIdpValue, payload);
      const res = getResponse(response);
      yield put({
        type: 'updateState',
        payload: {
          lockObjectTypeList: res.lockObjectType || [],
        },
      });
      return res;
    },

    // 查询头列表数据
    *recordLocksQuery({ payload }, { call, put }) {
      const res = getResponse(yield call(recordLocksQuery, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            headList: res.content,
            headPagination: createPagination(res),
          },
        });
      }
      return res;
    },

    // 取消锁定
    *releaseLock({ payload }, { call }) {
      const res = getResponse(yield call(releaseLock, payload));
      return res;
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
