/*
 * @Description: 芯片不良
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-21 13:51:22
 * @LastEditTime: 2021-01-20 09:43:15
 */
import { getResponse } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  enterSite,
  getSiteList,
  handleCheckBarCode,
  handleConfirmPut,
} from '@/services/hhme/cosOverdueInventoryRetestService';

export default {
  namespace: 'cosOverdueInventoryRetest',
  state: {
    workcellInfo: {}, // 工位信息
    defaultSite: {},
    barCodeList: [],
  },
  effects: {
    // 批量查询独立值集
    *batchLovData(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          cosType: 'HME_COS_TYPE',
        })
      );
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            lovData: {
              ...result,
            },
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
    // 输入工位
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
    // 校验条码
    *handleCheckBarCode({ payload }, { call }) {
      const result = getResponse(yield call(handleCheckBarCode, payload));
      return result;
    },
    // 确认投料
    *handleConfirmPut({ payload }, { call }) {
      const result = getResponse(yield call(handleConfirmPut, payload));
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
