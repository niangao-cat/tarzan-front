/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 数据查询
 */

import { getResponse, createPagination } from 'utils/utils';
import { queryDataList } from '@/services/hwms/qualityFileAnalAndQueryService';
import { queryMapIdpValue } from '../../services/api';

export default {
  namespace: 'qualityFileAnalAndQuery',
  state: {
    headList: [],
    headPagination: {},
    typeMap: [],
    colMap: [],
  },
  effects: {
    // 查询下拉框数据
    *init(_, { call, put }) {
      const result = yield call(queryMapIdpValue, {
        typeMap: 'HME.QUALITY_ANALYZE_TYPE',
      });
      yield put({
        type: 'updateState',
        payload: {
          ...result,
        },
      });
    },

    // 查询报表信息
    *queryDataList({ payload }, { call, put }) {
      // 数据查询
      const res = yield call(queryDataList, payload);
      const list = getResponse(res);
      // 成功时，更改状态
      if (list) {
        // 界面数据拼接
        if(list.lineList&&list.lineList.content){
          const data = list.lineList.content;
          // 便利数据
          for(let i=0; i<data.length; i++){
            if(data[i].resultList){
              for(let j=0; j<data[i].resultList.length; j++){
                data[i][`${j}`] = data[i].resultList[j];
              }
            }
          }
          yield put({
            type: 'updateState',
            payload: {
              headList: data,
              headPagination: createPagination(list.lineList),
            },
          });
        }
        yield put({
          type: 'updateState',
          payload: {
            colMap: list.dynamicTitleList,
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
