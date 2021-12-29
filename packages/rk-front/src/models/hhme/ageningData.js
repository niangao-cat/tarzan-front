/**
 * @date: 2021-03-03
 * @author:  <junfeng.chen@hand-china.com>
 * @version: 0.0.1
 */

import { getResponse, createPagination } from 'utils/utils';
import { ergodicData } from '@/utils/utils';
import { queryMapIdpValue } from 'services/api';

import { fetchAgeningDataList, saveAgeningData } from '../../services/hhme/ageningDataService';

export default {
  namespace: 'ageningData',
  state: {
    ageningDataList: [], // 表格数据
    ageningDataPagination: {}, // 表格分页
    statusMap: [], // 条码状态
  },
  effects: {
    // 老化维护列表数据
    *fetchAgeningDataList({ payload }, { call, put }) {
      const res = yield call(fetchAgeningDataList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            ageningDataList: list.content,
            ageningDataPagination: createPagination(list),
          },
        });
      }
    },
    // 批量查询独立值集
    *batchLovData(_, { call, put }) {
        const result = getResponse(
          yield call(queryMapIdpValue, {
            statusMap: 'WMS.FLAG_YN',
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

    // 保存
    *saveAgeningData({ payload }, { call }) {
      const result = yield call(saveAgeningData, ergodicData(payload));
      return getResponse(result);
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
