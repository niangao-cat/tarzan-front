/**
 * purchaseAcceptancePosting - 过账平台models
 * @date: 2020/02/27 19:53:47
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import { isArray } from 'lodash';
import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';

import {
  fetchList,
  fetchAreaList,
} from '../../services/hhme/dataItemDisplayReportService';

export default {
  namespace: 'dataItemDisplayReport',
  state: {
    list: [],
    pagination: {},
    typeList: [],
    priorityList: [],
    areaList: [],
    departmentInfo: {},
  },
  effects: {
    *init(_, { call, put }) {
      const res = yield call(queryMapIdpValue, {
        typeList: 'HME.EXHIBITION_TYPE',
        priorityList: 'HME_PRIORITY_TYPE',
      });
      yield put({
        type: 'updateState',
        payload: {
          ...res,
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

    *fetchAreaList(_, { call, put }) {
      const result = getResponse(yield call(fetchAreaList));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            areaList: result,
            departmentInfo: isArray(result) ? result.find(e => e.defaultOrganizationFlag === 'Y') : {},
          },
        });
      }
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
