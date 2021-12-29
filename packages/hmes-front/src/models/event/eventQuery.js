/**
 * @date 2019-8-7
 * @author HDY <deying.huang@hand-china.com>
 */

import { getResponse, createPagination } from 'utils/utils';
import { ergodicData } from '@/utils/utils';

import {
  fetchEventList,
  fetchParentEventDetails,
  fetchEventDetails,
  saveEvent,
} from '../../services/event/eventQueryService';

export default {
  namespace: 'eventQuery',
  state: {
    eventList: [], // 事件表格数据源
    eventPagination: {}, // 事件表格分页
    expendedKeyList: [], // 表格展开行id的Array
    eventDrawerInfo: {}, // 对象详细信息抽屉信息
    parentDrawerInfo: [], // 父子事件抽屉信息
    eventDetailDrawerInfo: [], // 事件影响抽屉信息
  },
  effects: {
    // 获取事件类型表数据
    *fetchEventList({ payload }, { call, put }) {
      const res = yield call(fetchEventList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            eventList: list.rows.content,
            eventPagination: createPagination(list.rows),
            expendedKeyList: [],
          },
        });
      }
    },

    // 根据父事件获取事件记录
    *fetchParentEventDetails({ payload }, { call, put }) {
      const result = yield call(fetchParentEventDetails, payload);
      if (getResponse(result)) {
        yield put({
          type: 'updateState',
          payload: {
            parentDrawerInfo: result.rows,
          },
        });
      }
    },

    // 获取事件详细信息
    *fetchEventDetails({ payload }, { call, put }) {
      const result = yield call(fetchEventDetails, payload);
      if (getResponse(result)) {
        yield put({
          type: 'updateState',
          payload: {
            eventDetailDrawerInfo: result.rows,
          },
        });
      }
      return result;
    },

    // 保存事件类型
    *saveEvent({ payload }, { call }) {
      const result = yield call(saveEvent, ergodicData(payload));
      return getResponse(result);
    },

    // 页面关闭时清空model
    *cleanModel(_, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          eventList: [], // 事件表格数据源
          eventPagination: {}, // 事件表格分页
          expendedKeyList: [], // 表格展开行id的Array
          eventDrawerInfo: {}, // 对象详细信息抽屉信息
          parentDrawerInfo: [], // 父子事件抽屉信息
          eventDetailDrawerInfo: [], // 事件影响抽屉信息
        },
      });
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
