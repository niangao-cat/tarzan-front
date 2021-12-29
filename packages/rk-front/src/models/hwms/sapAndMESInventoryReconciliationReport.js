/**
 * @description SAP与MES库存核对报表
 * @author ywj
 * @email wenjie.yang01@hand-china.com
 * @date 2020/11/13
 * @time 11:11
 * @version 0.0.1
 * @return
 */
import { getResponse } from 'utils/utils';
import { queryDataList } from '@/services/hwms/sapAndMESInventoryReconciliationReportService';

export default {
  namespace: 'sapAndMESInventoryReconciliationReport',
  state: {
    headList: [],
  },
  effects: {
    // 查询报表信息
    *queryDataList({ payload }, { call, put }) {
        // 数据查询
        const res = yield call(queryDataList, payload);
        const list = getResponse(res);
        // 成功时，更改状态
        if (list) {
          yield put({
            type: 'updateState',
            payload: {
              headList: list,
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
