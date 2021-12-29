/*
 * @Description: 售后在制品盘点成品报表
 * @Version: 0.0.1
 * @Author: liyuan.liu@hand-china.com
 * @Date: 2021-03-31
 * @LastEditTime: 2021-03-31
 */
import { getResponse, createPagination, parseParameters } from 'utils/utils';
import { handleFetchList, fetchDefaultSite, fetchSiteList } from '@/services/hmes/inventoryFinishedProductService';
import { queryMapIdpValue } from 'services/api';
import { fetchSelectList } from '@/services/api';

export default {
  namespace: 'inventoryFinishedProduct',
  state: {
    pagination: {}, // 分页数据
    list: [],
    expendedKeyList: [], // 表格展开行id的Array
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
          materialLotCodeStatusList: 'MT.MTLOT.STATUS', // 条码状态
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
    *handleFetchList({ payload }, { call, put }) {
      // 先清空数据
      yield put({
        type: 'updateState',
        payload: {
          list: [],
        },
      });
      const result = getResponse(yield call(handleFetchList, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            list: result.content,
            pagination: createPagination(result),
            expendedKeyList: [],
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
