/**
 * purchaseAcceptancePosting - 过账平台models
 * @date: 2020/02/27 19:53:47
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import { getResponse, createPagination } from 'utils/utils';

import {
  fetchList,
} from '../../services/hwms/materialDistributionReportService';

export default {
  namespace: 'materialDistributionReport',
  state: {
    list: [],
    pagination: {},
  },
  effects: {

    *fetchList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchList, payload));
      if(res) {
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
