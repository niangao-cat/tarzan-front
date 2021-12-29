/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 工位产量明细查询
 */

import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  queryDataList,
  getSiteList,
} from '@/services/hwms/cosOutboundQueryService';

export default {
  namespace: 'cosOutboundQuery',
  state: {
    headList: [],
    headPagination: {},
    defaultSite: {},
    jobMap: [],
    cosTypeMap: [],
  },
  effects: {

    *batchLovData(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          jobMap: 'HME_COS_JOB_TYPE',
          cosTypeMap: 'HME_COS_TYPE',
        })
      );
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            ...result,
          },
        });
      }
    },

    // 查询报表信息
    *queryDataList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryDataList, payload));
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

    // 获取默认工厂
    *getSiteList({ payload }, { call, put }) {
      const result = getResponse(yield call(getSiteList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            defaultSite: result,
          },
        });
      }
      return result;
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
