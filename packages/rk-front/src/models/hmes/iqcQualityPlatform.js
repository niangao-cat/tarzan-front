/*
 * @Description: IQC质检
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-20 09:51:52
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-04-20 09:54:32
 * @Copyright: Copyright (c) 2019 Hand
 */

export default {
  namespace: 'iqcQualityPlatform',
  state: {},
  effects: {},

  reducers: {
    updateState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
