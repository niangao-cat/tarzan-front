/*
 * @Description: 标准件检验结果查询
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-01 15:19:36
 * @LastEditTime: 2021-02-04 11:27:14
 */

import { getResponse, createPagination, parseParameters } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  handleFetchLineList,
  handleFetchHeadList,
} from '@/services/hhme/standardPartsInspectionQueryService';

export default {
  namespace: 'standardPartsInspectionQuery',
  state: {
    headList: [],
    headListPagination: {},
    lineList: [],
    lineListPagination: {},
  },
  effects: {
    // 批量查询独立值集
    *batchLovData(_, { call, put }) {
      const res = getResponse(
        yield call(queryMapIdpValue, {
          workWay: 'HME.SSN_WORK_WAY', // 工作方式
        })
      );
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            ...res,
          },
        });
      }
    },
    *handleFetchHeadList({ payload }, { call, put }) {
      const res = getResponse(yield call(handleFetchHeadList, parseParameters(payload)));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            headList: res.content,
            headListPagination: createPagination(res),
          },
        });
      }
      return res;
    },
    *handleFetchLineList({ payload }, { call, put }) {
      const res = getResponse(yield call(handleFetchLineList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            lineList: res.content,
            lineListPagination: createPagination(res),
          },
        });
      }
      return res;
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
