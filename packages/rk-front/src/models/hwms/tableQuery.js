/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 表增量报表
 */

import { getResponse, createPagination } from 'utils/utils';
import { queryDataList } from '@/services/hwms/tableQueryService';

export default {
  namespace: 'tableQuery',
  state: {
    headList: [],
    headPagination: {},
  },
  effects: {
    // 查询报表信息
    *queryDataList({ payload }, { call, put }) {
        // 数据查询
        const res = yield call(queryDataList, payload);
        const list = getResponse(res);
        // 成功时，更改状态
        if (list) {
            // 将对应的数据 数据相减求
            for(let i=0; i< list.content.length; i++){
                if(i>0){
                    // 判断数据是否相同 相同则 减去数据
                    if(list.content[i].tableName === list.content[i-1].tableName ){
                        list.content[i].addCountCurrent = list.content[i].tableRows - list.content[i-1].tableRows;
                    }else{
                        list.content[i].addCountCurrent = 0;
                    }
                }else{
                    list.content[i].addCountCurrent = 0;
                }
            }
          yield put({
            type: 'updateState',
            payload: {
              headList: list.content,
              headPagination: createPagination(list),
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
