/**
 * @date 2019-7-30
 * @author HDY <deying.huang@hand-china.com>
 */

import { getResponse, createPagination } from 'utils/utils';
import notification from 'utils/notification';
import { ergodicData } from '@/utils/utils';
import {
  fetchExtendFieldList,
  saveExtendField,
  // fetchServicePackage
} from '../../services/hmes/extendFieldService';

export default {
  namespace: 'extendField',
  state: {
    extendFieldList: [], // 扩展字段数据源
    extendFieldPagination: {}, // 扩展字段格分页
    // servicePackageList: [], // 服务包类型列表
  },
  effects: {
    // 获取扩展字段数据
    *fetchExtendFieldList({ payload }, { call, put }) {
      const res = yield call(fetchExtendFieldList, payload);
      const list = getResponse(res);
      if (list && list.success) {
        yield put({
          type: 'updateState',
          payload: {
            extendFieldList: list.rows.content,
            extendFieldPagination: createPagination(list.rows),
          },
        });
      }
    },

    // 保存扩展字段
    *saveExtendField({ payload }, { call }) {
      const result = yield call(saveExtendField, ergodicData(payload));
      if (result && result.success) {
        notification.success();
      } else {
        notification.error({ message: result.message });
      }
      return getResponse(result);
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
