/**
 * operationPlatform - 工序models
 * @date: 2020/02/27 19:53:47
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import { getResponse, createPagination } from 'utils/utils';
import {
  fetchWorkCellInfo,
  fetchToolingList,
  save,
} from '../../services/hhme/toolingManagementService';


export default {
  namespace: 'toolingManagement',
  state: {
    workCellInfo: {},
    toolingList: [],
    pagination: {},
  },
  effects: {
    *fetchWorkCellInfo({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchWorkCellInfo, payload));
      if (res) {
        const {
          hmeEoJobContainerVO2,
          lotMaterialVOList,
          timeMaterialVOList,
          ...workCellInfo
        } = res;
        yield put({
          type: 'updateState',
          payload: { workCellInfo },
        });
      }
      return res;
    },
    *fetchToolingList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchToolingList, payload));
      if(res) {
        yield put({
          type: 'updateState',
          payload: {
            toolingList: [],
          },
        });
        yield put({
          type: 'updateState',
          payload: {
            toolingList: res.content.map(e => ({ ...e, _status: 'update'})),
            pagination: createPagination(res),
          },
        });
      }
    },
    *save({ payload }, { call }) {
      const res = getResponse(yield call(save, payload));
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
