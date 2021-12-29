/*
 * @Description: global-mes
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-03-08 14:38:58
 * @LastEditTime: 2021-03-08 15:43:26
 */

import { getResponse } from 'utils/utils';
import { handleCheckMaterialCode } from '@/services/api';

export default {
  namespace: 'globalMes',
  state: {
    detail: {},
    pagination: {}, // 分页数据
    sampleCodeList: [],
    lovData: {}, // 值集数据
  },
  effects: {
    *handleCheckMaterialCode({ payload }, { call }) {
      const result = getResponse(yield call(handleCheckMaterialCode, payload));
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