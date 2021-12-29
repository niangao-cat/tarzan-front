
/**
 * @description 条码库存现有量查询
 * @author ywj
 * @email wenjie.yang01@hand-china.com
 * @date 2020/11/13
 * @time 11:17
 * @version 0.0.1
 * @return
 */
import { getResponse, createPagination } from 'utils/utils';
import { fetchList, fetchDetailList } from '@/services/hwms/wmsBarcodeInventoryOnHandQueryService';
import { queryMapIdpValue } from 'services/api';

export default {
  namespace: 'wmsBarcodeInventoryOnHandQuery',
  state: {
    headList: [],
    headPagination: {},
    detailList: [],
    detailPagination: {},
    enableMap: [], // 是否有效
  },
  effects: {

    //查询独立值集
    *batchLovData(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          enableMap: 'Z_MTLOT_ENABLE_FLAG',
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

    // 信息查询
    *fetchList({ payload }, { call, put }) {
      const res = yield call(fetchList, payload);
      const list = getResponse(res);
      // 成功时，更改状态
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            headList: list.content,
            headPagination: createPagination(list),
          },
        });
      }
    },

    // 信息明细询
    *fetchDetailList({ payload }, { call, put }) {
      const res = yield call(fetchDetailList, payload);
      const list = getResponse(res);
      // 成功时，更改状态
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            detailList: list.content,
            detailPagination: createPagination(list),
          },
        });
      }
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
