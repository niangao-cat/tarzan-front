/**
 * workOrder - 工单派工平台
 * @date: 2020/02/27 19:53:47
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import { getResponse, createPagination } from 'utils/utils';
import { fetchList, fetchDefaultSite } from '@/services/hhme/pumpFilterReportService';
import { queryMapIdpValue } from 'services/api';

export default {
  namespace: 'pumpFilterReport',
  state: {
    list: [],
    pagination: {},
    statusList: [],
    siteInfo: {},
  },
  effects: {
    *init(_, { call, put }) {
      const res = yield call(queryMapIdpValue, {
        statusList: 'HME.PUMP_SELECT_STATUS',
      });
      const siteInfo = yield call(fetchDefaultSite);
      yield put({
        type: 'updateState',
        payload: {
          ...res,
          siteInfo,
        },
      });
    },

    *fetchList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            list: res.content,
            pagination: createPagination(res),
          },
        });
      }
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
