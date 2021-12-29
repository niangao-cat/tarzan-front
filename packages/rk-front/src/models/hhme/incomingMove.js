/*
 * @Description: 来料转移
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-12-29 15:04:57
 * @LastEditTime: 2021-03-11 18:33:59
 */

import { getResponse } from 'utils/utils';
import { queryMapIdpValue, queryUnifyIdpValue } from 'services/api';
import {
  enterSite,
  getSiteList,
  scanSourceLotCode,
  changeContainerTypeCode,
  materiallotSplit,
} from '@/services/hhme/incomingMoveService';
import { handleCheckMaterialCode } from '@/services/api';

export default {
  namespace: 'incomingMove',
  state: {
    targetList: [],
    sourceInfo: {},
    defaultSite: {},
    workcellInfo: {},
    unitQty: null,
  },
  effects: {
    // 批量查询独立值集
    *batchLovData(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          cosType: 'HME_COS_TYPE',
        })
      );
      const res = getResponse(
        yield call(queryUnifyIdpValue, 'HME_COS_CONTAINER_TYPE_INFO')
      );
      if (result && res) {
        yield put({
          type: 'updateState',
          payload: {
            ...result,
            containerType: res,
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
    *scanSourceLotCode({ payload }, { call, put }) {
      const result = getResponse(yield call(scanSourceLotCode, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            sourceInfo: result,
          },
        });
      }
      return result;
    },
    *changeContainerTypeCode({ payload }, { call, put }) {
      const res = getResponse(yield call(changeContainerTypeCode, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            unitQty: res.incomingQty,
          },
        });
      }
      return res;
    },
    *materiallotSplit({ payload }, { call }) {
      const res = getResponse(yield call(materiallotSplit, payload));
      return res;
    },
    *handleCheckMaterialCode({ payload }, { call }) {
      const result = getResponse(yield call(handleCheckMaterialCode, payload));
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
