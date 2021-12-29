/*
 * @Description: 销售订单变更
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-09-21 18:39:58
 * @LastEditTime: 2020-09-21 19:23:12
 */

import { getResponse, createPagination, parseParameters } from 'utils/utils';
import { handleSearch, saveSampleCode, querySiteList } from '@/services/hwms/salesOrderChangesService';
import { queryMapIdpValue } from 'services/api';

export default {
  namespace: 'salesOrderChanges',
  state: {
    detail: {},
    pagination: {}, // 分页数据
    list: [],
    statusMap: [],
    qualityStatusMap: [],
    siteMap: [],
  },
  effects: {
    // 获取值集
    // 初始化 状态下拉框
    *init(_, { call, put }) {
      // 查询值集
      const res = yield call(queryMapIdpValue, {
        statusMap: 'WMS.MTLOT.STATUS',
        qualityStatusMap: 'WMS.MTLOT.QUALITY_STATUS',
      });
      // 成功时，更改状态
      yield put({
        type: 'updateState',
        payload: {
          ...res,
        },
      });

      // 查询站点
      const resSite = getResponse(yield call(querySiteList));
      if (resSite) {
        yield put({
          type: 'updateState',
          payload: {
            siteMap: resSite,
          },
        });
      }
    },
    // 数据查询
    *handleSearch({ payload }, { call, put }) {
      const result = getResponse(yield call(handleSearch, parseParameters(payload)));
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
    // 数据保存
    *saveSampleCode({ payload }, { call }) {
      const result = getResponse(yield call(saveSampleCode, payload));
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
