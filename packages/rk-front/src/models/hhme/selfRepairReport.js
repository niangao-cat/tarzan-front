/**
 * operationPlatform - 自制件返修报表models
 * @date: 2021/07/06 08:53:47
 * @author: TX <xin.t@raycuslaser.com>
 */

import { getResponse, createPagination, parseParameters } from 'utils/utils';
import {handleFetchList, fetchDefaultSite, fetchSiteList} from '../../services/hhme/selfRepairReportService';
import { queryMapIdpValue } from 'services/api';
import { fetchSelectList, queryUnifyIdpValue } from '@/services/api';

export default {
  namespace: 'selfRepairReport',
  state: {
    workShopList: [],
    pagination: {}, // 分页数据
    list: [],
    siteInfo: {},
    siteList: [],
    warehouseTypeList: [],
    wordOrderStatusList: [],
    materialLotCodeStatusList: [],
    flagList: [],
  },
  effects: {
    // 批量查询独立值集
    *batchLovData(_, { call, put }) {
      const siteInfo = getResponse(yield call(fetchDefaultSite));
      const siteList = getResponse(yield call(fetchSiteList));
      const result = getResponse(
        yield call(queryMapIdpValue, {
          docStatus: 'HME.SPLIT_STATUS', // 当前状态
          wordOrderStatusList: 'MT.WO_STATUS', // 工单状态
          materialLotCodeStatusList: 'HME.WIP_MTLOT_STATUS', // 条码状态
          flagList: 'WMS.FLAG_YN',
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
    // 查询单个Lov
    *fetchLovWorkShop({ payload }, { call, put }) {
      const result = getResponse(yield call(queryUnifyIdpValue, payload.lovCode, payload.params));
      if(result){
        yield put({
          type: 'updateState',
          payload: {
            workShopList: result,
          },
        });
      }
    },
    *handleFetchList({ payload }, { call, put }) {
      const result = getResponse(yield call(handleFetchList, parseParameters(payload)));
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
    *fetchWarehouseTypeList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchSelectList, payload));
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {
            warehouseTypeList: res.rows,
          },
        });
      }
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
