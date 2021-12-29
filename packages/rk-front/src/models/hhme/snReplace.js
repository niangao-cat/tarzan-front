/*
 * @Description: sn替换
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-11-04 10:20:07
 * @LastEditTime: 2020-11-04 10:22:20
 */

import { getResponse } from 'utils/utils';
import {
  snReplace,
} from '@/services/hhme/snReplaceService';

export default {
  namespace: 'snReplace',
  state: {
  },
  effects: {
    *snReplace({ payload }, { call }) {
      const res = getResponse(yield call(snReplace, payload));
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
