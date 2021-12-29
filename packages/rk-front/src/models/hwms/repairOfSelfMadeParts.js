/**
 * 自制件返修
 */
import { getResponse } from 'utils/utils';
import { fetchData, saveData } from '@/services/hwms/repairOfSelfMadePartsService';

export default {
  namespace: 'repairOfSelfMadeParts',
  state: {
    barcodeData: {},
  },
  effects: {
    // 数据查询
    *fetchData({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchData, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            barcodeData: result,
          },
        });
      }
      return result;
    },

    // 数据保存
    *saveData({ payload }, { call, put}) {
      const result = getResponse(yield call(saveData, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            barcodeData: {},
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
