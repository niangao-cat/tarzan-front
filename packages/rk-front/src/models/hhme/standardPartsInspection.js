/*
 * @Description: 标准件检验
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-01 10:17:50
 * @LastEditTime: 2021-02-07 15:07:36
 */

import { getResponse } from 'utils/utils';
import {
  handleFetchList,
  getSiteList,
  enterSite,
  handleSaveResult,
  handleSubmitResult,
} from '@/services/hhme/standardPartsInspectionService';
import { queryMapIdpValue } from 'services/api';

export default {
  namespace: 'standardPartsInspection',
  state: {
    defaultSite: {},
    workcellInfo: {},
    list: [],
  },
  effects: {
    // 批量查询独立值集
    *batchLovData(_, { call, put }) {
      const res = getResponse(
        yield call(queryMapIdpValue, {
          workWay: 'HME.SSN_WORK_WAY',
        })
      );
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            ...res,
          },
        });
      }
    },
    // 获取默认工厂
    *getSiteList({ payload }, { call, put }) {
      const result = getResponse(yield call(getSiteList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            defaultSite: result,
          },
        });
      }
      return result;
    },
    *enterSite({ payload }, { call, put }) {
      const result = getResponse(yield call(enterSite, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            workcellInfo: {
              ...result,
              operationId: result.operationIdList[0],
            },
          },
        });
      }
      return result;
    },
    *handleFetchList({ payload }, { call, put }) {
      const res = getResponse(yield call(handleFetchList, payload));
      if (res) {
        const arr = [];
        res.forEach(ele => {
          arr.push({
            ...ele,
            _status: 'update',
          });
        });
        yield put({
          type: 'updateState',
          payload: {
            list: arr,
          },
        });
      }
      return res;
    },
    *handleSaveResult({ payload }, { call, put }) {
      const res = getResponse(yield call(handleSaveResult, payload));
      const { index, list } = payload;
      if (res) {
        list.splice(index, 1, {
          ...list[index],
          ...res,
        });
        yield put({
          type: 'updateState',
          payload: {
            list,
          },
        });
      }
      return res;
    },
    *handleSubmitResult({ payload }, { call }) {
      const res = getResponse(yield call(handleSubmitResult, payload));
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
