/**
 * iqc检验看板
 */
import { getResponse, createPagination } from 'utils/utils';
import { fetchList, fetchPie, fetchLine } from '@/services/hwms/iqcInspectBoardService';
import { queryMapIdpValue } from '../../services/api';

export default {
  namespace: 'iqcInspectBoard',
  state: {
    tableList: [], // 列表数据展示
    tablePagination: {}, // 分页数据展示
    pieData: {}, // 饼状图数据展示
    lineData: {}, // 折线图数据展示
    inspectStatus: [], // 下拉框
  },
  effects: {

    // 查询下拉框数据
    *init(_, { call, put }) {
        const result = yield call(queryMapIdpValue, {
            inspectStatus: 'QMS.INSPECTION_RESULT',
        });
        yield put({
          type: 'updateState',
          payload: {
           ...result,
          },
        });
      },

    // 列表数据展示
    *fetchList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            tableList: result.content,
            tablePagination: createPagination(result),
          },
        });
      }
      return result;
    },
    // 饼状图数据修复
    *fetchPie({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchPie, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            pieData: result,
          },
        });
      }
      return result;
    },
    // 最多30天间隔数据
    *fetchLine({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchLine, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            lineData: result,
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
