/*
 * @Description: 售后在制品盘点半成品报表
 * @Version: 0.0.1
 * @Author: liyuan.liu@hand-china.com
 * @Date: 2021-03-31
 * @LastEditTime: 2021-03-31
 */
import { getResponse, createPagination } from 'utils/utils';
import { handleFetchList, fetchDefaultSite, fetchSiteList } from '@/services/hmes/inventorySemiManufacturesService';
import { queryMapIdpValue } from 'services/api';

export default {
  namespace: 'inventorySemiManufactures',
  state: {
    pagination: {}, // 分页数据
    list: [],
    siteInfo: {},
    siteList: [],
    docStatus: [],
    enableMap: [],
    workOrderStatusMap: [],
    materialtLotStatusMap: [],
  },
  effects: {
    // 批量查询独立值集
    *batchLovData(_, { call, put }) {
      const siteInfo = getResponse(yield call(fetchDefaultSite));
      const siteList = getResponse(yield call(fetchSiteList));
      const result = getResponse(
        yield call(queryMapIdpValue, {
          docStatus: 'HME.SPLIT_STATUS', // 当前状态
          workOrderStatusMap: 'MT.WO_STATUS', // 工单状态
          materialtLotStatusMap: 'MT.MTLOT.STATUS', // 条码状态
          enableMap: 'WMS.FLAG_YN', // 是否
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
      if (siteInfo) {
        yield put({
          type: 'updateState',
          payload: {
            siteInfo,
          },
        });
      }
      if (siteList) {
        yield put({
          type: 'updateState',
          payload: {
            siteList,
          },
        });
      }
    },
    *handleFetchList({ payload }, { call, put }) {
      const result = getResponse(yield call(handleFetchList, payload));
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
