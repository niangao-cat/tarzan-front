/**
 * feedWorkOrderMaterial - 工序models
 * @date: 2020/10/30 19:53:47
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import { getResponse, createPagination } from 'utils/utils';
// import { queryMapIdpValue } from 'services/api';
import {
  fetchList,
} from '../../services/hhme/feedMaterialReportService';



export default {
  namespace: 'feedMaterialReport',
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
