/*
 * @Description: cos返厂复测投料
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-01-21 15:38:12
 * @LastEditTime: 2021-02-03 11:02:20
 */

import { getResponse } from 'utils/utils';
import { queryMapIdpValue, queryUnifyIdpValue } from 'services/api';
import {
  enterSite,
  getSiteList,
  fetchRemainingQty,
  changeCosType,
  handleSourceLotCode,
  cosBackFactorySplit,
} from '@/services/hhme/cosReturnFactoryRetestService';

export default {
  namespace: 'cosReturnFactoryRetest',
  state: {
    workcellInfo: {}, // 工位信息
    defaultSite: {},
    remainingQty: '',
    woWithCosType: [],
    cosTypeList: [],
    primaryUomQty: '',
    splitQty: '',
    feelMaterialLotList: [], // 批次物料
    returnMaterialLotList: [], // 退料条码
  },
  effects: {
    // 批量查询独立值集
    *batchLovData(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          cosTypeList: 'HME_COS_TYPE',
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
    // 获取剩余芯片数
    *fetchRemainingQty({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchRemainingQty, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            remainingQty: res.remainingQty,
            woWithCosType: res.cosType,
          },
        });
      }
      return res;
    },
    *changeCosType({ payload }, { call }) {
      const res = getResponse(yield call(changeCosType, payload));
      return res;
    },
    // 扫描来源条码
    *handleSourceLotCode({ payload }, { call, put }) {
      const res = getResponse(yield call(handleSourceLotCode, payload));
      if (res) {
        let splitQty = 0;
        if (res.returnMaterialLotList.length > 0) {
          res.returnMaterialLotList.forEach(ele => {
            splitQty += ele.primaryUomQty;
          });
        }
        yield put({
          type: 'updateState',
          payload: {
            primaryUomQty: res.primaryUomQty,
            feelMaterialLotList: res.feelMaterialLotList,
            returnMaterialLotList: res.returnMaterialLotList,
            splitQty,
          },
        });
      }
      return res;
    },
    *cosBackFactorySplit({ payload }, { call }) {
      const res = getResponse(yield call(cosBackFactorySplit, payload));
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
