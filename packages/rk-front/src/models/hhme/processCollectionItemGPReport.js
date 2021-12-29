/*
 * @Description: 工序采集项报表
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-07-13 16:50:57
 * @LastEditTime: 2020-07-14 09:35:05
 */

import { getResponse, createPagination, parseParameters } from 'utils/utils';
import {
  fetchDataList,
} from '@/services/hhme/processCollectionItemGPReportService';

export default {
  namespace: 'processCollectionItemGPReport',
  state: {
    processCollectionItemList: [], // 选中的节
    dynamicColumns: [], // 动态列
    dynamicDataSource: [], // 动态数据
    pagination: {},
  },
  effects: {
    *fetchDataList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchDataList, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            processCollectionItemList: result.gpPage.content,
            pagination: createPagination(result.gpPage),
            dynamicDataSource: result.gpPage.content,
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
