/*
 * @Description: COS报废复测投料
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-01-19 17:18:31
 * @LastEditTime: 2021-02-04 10:07:27
 */

import { getResponse } from 'utils/utils';
import { queryUnifyIdpValue, queryMapIdpValue } from 'services/api';
import {
  enterSite,
  getSiteList,
  handleSearchSurplusCosNum,
  handleSearchCosTypeList,
  cosScrapSplit,
  cosScrapScanMaterialLot,
  printingBarcode,
} from '@/services/hhme/cosScrapRetestService';

export default {
  namespace: 'cosScrapRetest',
  state: {
    workcellInfo: {}, // 工位信息
    defaultSite: {},
    targetList: [],
    splitQty: null, // 拆分数量
    surplusCosNum: null, // 剩余cos数量
    primaryUomQty: null, // 条码数量
    cosTypeList: [], // cos类型
    editFlag: true, // 是否可编辑
  },
  effects: {
    *init(_, { call, put }) {
      const res = yield call(queryMapIdpValue, {
        lotList: 'HME.COS_SELECT_BARCODE_LOT',
      });
      yield put({
        type: 'updateState',
        payload: res,
      });
    },

    // 批量查询独立值集
    *batchLovData(_, { call, put }) {
      const res = getResponse(
        yield call(queryUnifyIdpValue, 'HME_COS_CONTAINER_TYPE_INFO')
      );
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
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
    // 查询剩余cos数量
    *handleSearchSurplusCosNum({ payload }, { call, put }) {
      const result = getResponse(yield call(handleSearchSurplusCosNum, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            surplusCosNum: result.remainingQty,
          },
        });
      }
      return result;
    },
    // 查询cos列表
    *handleSearchCosTypeList({ payload }, { call, put }) {
      const result = getResponse(yield call(handleSearchCosTypeList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            cosTypeList: result,
          },
        });
      }
      return result;
    },
    *cosScrapSplit({ payload }, { call, put }) {
      const result = getResponse(yield call(cosScrapSplit, payload));
      if (result) {
        const resArr = result.targetList.filter(ele => ele.materialLotId);
        yield put({
          type: 'updateState',
          payload: {
            editFlag: !(resArr.length > 0),
            targetList: result.targetList,
          },
        });
      }
      return result;
    },
    // 来源条码扫描
    *cosScrapScanMaterialLot({ payload }, { call, put }) {
      const result = getResponse(yield call(cosScrapScanMaterialLot, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            primaryUomQty: result.primaryUomQty,
          },
        });
      }
      return result;
    },
    // 条码打印
    *printingBarcode({ payload }, { call }) {
      const result = getResponse(yield call(printingBarcode, payload));
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
