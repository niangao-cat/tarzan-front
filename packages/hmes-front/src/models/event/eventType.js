/**
 * @date 2019-7-31
 * @author HDY <deying.huang@hand-china.com>
 */
import { get as chainget } from 'lodash';
import { getResponse, createPagination } from 'utils/utils';
import { ergodicData } from '@/utils/utils';

import {
  fetchEventTypeList,
  fetchObjectTypeList,
  saveEventType,
  saveObjectType,
  fetchSelectList,
} from '../../services/event/eventTypeService';

export default {
  namespace: 'eventType',
  state: {
    eventTypeList: [], // 事件类型表格数据源
    eventTypePagination: {}, // 事件类型表格分页
    objectTypeList: [], // 对象类型数据源
    objectTypePagination: {}, // 对象类型表格分页
    onhandChangeTypeList: [], // 影响库存方向下拉框数据
  },
  effects: {
    // 获取事件类型表数据
    *fetchEventTypeList({ payload }, { call, put }) {
      const res = yield call(fetchEventTypeList, payload);
      const list = getResponse(res);
      if (list && list.success) {
        yield put({
          type: 'updateState',
          payload: {
            eventTypeList: chainget(list, 'rows.content', []),
            eventTypePagination: createPagination(list.rows),
          },
        });
      }
    },

    // 获取对象类型数据
    *fetchObjectTypeList({ payload }, { call, put }) {
      const res = yield call(fetchObjectTypeList, payload);
      const list = getResponse(res);
      if (list && list.success) {
        yield put({
          type: 'updateState',
          payload: {
            objectTypeList: chainget(list, 'rows.content', []),
            objectTypePagination: createPagination(list.rows),
          },
        });
      }
    },

    // 获取影响库存方向下拉框数据
    *fetchOnhandChangeTypeList({ payload }, { call, put }) {
      const res = yield call(fetchSelectList, payload);
      const list = getResponse(res);
      if (list && res.success) {
        yield put({
          type: 'updateState',
          payload: {
            onhandChangeTypeList: chainget(list, 'rows', []),
          },
        });
      }
    },

    // 保存事件类型
    *saveEventType({ payload }, { call }) {
      const result = yield call(saveEventType, ergodicData(payload));
      return getResponse(result);
    },

    // 保存对象类型
    *saveObjectType({ payload }, { call }) {
      const result = yield call(saveObjectType, ergodicData(payload));
      // return getResponse(result);
      return result;
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
