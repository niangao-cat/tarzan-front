/*
 * @Description: 单据汇总查询报表
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-23 10:54:32
 * @LastEditTime: 2021-02-26 12:13:34
 */
import { getResponse, createPagination, parseParameters } from 'utils/utils';
import { handleFetchList } from '@/services/hmes/billSummaryReprotService';
import { queryMapIdpValue } from 'services/api';

export default {
  namespace: 'billSummaryReprot',
  state: {
    pagination: {}, // 分页数据
    list: [],
  },
  effects: {
    // 批量查询独立值集
    *batchLovData(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          docType: 'HME.INSTRUCTION_DOC_TYPE', // 单据类型
          docStatus: 'HME.INSTRUCTION_DOC_STATUS', // 单据状态
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
    *handleFetchList({ payload }, { call, put }) {
      const result = getResponse(yield call(handleFetchList, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            list: result.content,
            pagination: createPagination(result),
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
