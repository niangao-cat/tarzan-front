/*
 * @Description: 入库明细查询报表
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-03-04 10:27:47
 * @LastEditTime: 2021-03-10 09:33:54
 */

import { getResponse, createPagination, parseParameters } from 'utils/utils';
import {
  handleFetchList,
  getSiteList,
} from '@/services/hmes/warehousingDetailReportService';
import { queryMapIdpValue, queryUnifyIdpValue } from 'services/api';

export default {
  namespace: 'warehousingDetailReport',
  state: {
    pagination: {}, // 分页数据
    list: [],
    defaultSite: {},
  },
  effects: {
    // 批量查询独立值集
    *batchLovData(_, { call, put }) {
      const res = getResponse(
        yield call(queryUnifyIdpValue, 'HME.AREA_CODE')
      );
      const result = getResponse(
        yield call(queryMapIdpValue, {
          woType: 'MT.WO_TYPE',
          woStatus: 'MT.WO_STATUS',
          docStatus: 'HME.INSTRUCTION_DOC_STATUS',
        })
      );
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            areaName: res,
            ...result,
          },
        });
      }
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
    *handleFetchList({ payload }, { call, put }) {
      const result = getResponse(yield call(handleFetchList, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            list: result.content,
            pagination: createPagination(result),
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
