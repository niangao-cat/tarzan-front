/*
 * @Description: 生产数据采集
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-07-14 16:57:40
 * @LastEditTime: 2020-11-02 14:00:00
 */

import { getResponse, createPagination } from 'utils/utils';
import {
  enterSite,
  getSiteList,
  scanningMaterialLotCode,
  updateDataCollectLineInfo,
  querySnMaterialQty,
  handleFinish,
} from '@/services/hhme/productionDataCollectionService';
import { queryMapIdpValue } from 'services/api';

export default {
  namespace: 'productionDataCollection',
  state: {
    workcellInfo: {}, // 输入工位返回的初始化数据
    defaultSite: {},
    tableData: [],
    pagination: {}, // 分页数据
    headInfo: {}, // 头信息
  },
  effects: {
    // 批量查询独立值集
    *batchLovData(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          woStatus: 'MT.WO_STATUS',
          woType: 'MT.WO_TYPE',
          woShop: 'MT.SHOP',
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
            workcellInfo: result,
          },
        });
      }
      return result;
    },
    // 扫描序列号
    *scanningMaterialLotCode({ payload }, { call, put }) {
      const result = getResponse(yield call(scanningMaterialLotCode, payload));
      if (result) {
        const arr = [];
        result.lineContent.forEach(ele => {
          arr.push({
            ...ele,
            _status: 'update',
          });
        });
        yield put({
          type: 'updateState',
          payload: {
            tableData: arr,
            headInfo: {
              qty: result.qty || '',
              materialId: result.materialId || '',
              materialCode: result.materialCode || '',
              remark: result.remark || '',
              siteInDate: result.siteInDate || '',
              siteOutDate: result.siteOutDate || '',
              collectHeaderId: result.collectHeaderId || '',
            },
            pagination: createPagination(result.lineContent),
          },
        });
      }
      return result;
    },
    // 头数据更新
    *updateHeadInfo({ payload }, { call, put }) {
      const result = getResponse(yield call(scanningMaterialLotCode, payload));
      if (result) {
        const arr = [];
        result.lineContent.forEach(ele => {
          arr.push({
            ...ele,
            _status: 'update',
          });
        });
        yield put({
          type: 'updateState',
          payload: {
            tableData: arr,
            headInfo: {
              qty: result.qty || '',
              materialId: result.materialId || '',
              materialCode: result.materialCode || '',
              remark: result.remark || '',
              siteInDate: result.siteInDate || '',
              siteOutDate: result.siteOutDate || '',
              collectHeaderId: result.collectHeaderId || '',
            },
            pagination: createPagination(result.lineContent),
          },
        });
      }
      return result;
    },
    // 行数据更新
    *updateDataCollectLineInfo({ payload }, { call }) {
      const result = getResponse(yield call(updateDataCollectLineInfo, payload));
      return result;
    },
    *querySnMaterialQty({ payload }, { call }) {
      const result = getResponse(yield call(querySnMaterialQty, payload));
      return result;
    },
    // 完成
    *handleFinish({ payload }, { call }) {
      const result = getResponse(yield call(handleFinish, payload));
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
