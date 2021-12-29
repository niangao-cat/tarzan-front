/*
 * @Description: 样本量字码维护
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-05-07 09:17:19
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-07-06 16:59:22
 * @Copyright: Copyright (c) 2019 Hand
 */

import { getResponse, createPagination, parseParameters } from 'utils/utils';
import { handleSearch, saveSampleCode } from '@/services/hqms/sampleCodeService';
import { queryMapIdpValue } from 'services/api';

export default {
  namespace: 'sampleCode',
  state: {
    detail: {},
    pagination: {}, // 分页数据
    sampleCodeList: [],
    lovData: {}, // 值集数据
  },
  effects: {
    // 获取值集
    *getTypeLov({ payload }, { call, put }) {
      const result = getResponse(yield call(queryMapIdpValue, { ...payload }));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            lovData: result,
          },
        });
      }
      return result;
    },
    // 获取样本量字码数据
    *handleSearch({ payload }, { call, put }) {
      const result = getResponse(yield call(handleSearch, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            sampleCodeList: result.content,
            pagination: createPagination(result),
          },
        });
      }
      return result;
    },
    // 保存样本量字码
    *saveSampleCode({ payload }, { call }) {
      const result = getResponse(yield call(saveSampleCode, payload));
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
