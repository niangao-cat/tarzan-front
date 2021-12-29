/*
 * @Description: 入库单工作台
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-13 11:02:38
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-04-13 11:03:07
 * @Copyright: Copyright (c) 2019 Hand
 */

export default {
  namespace: 'inboundWorkbench',
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
