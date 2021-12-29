/*
 * @Description: 库龄
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-11-18 09:46:54
 * @LastEditTime: 2020-11-18 22:12:42
 */

import { getResponse, createPagination, parseParameters } from 'utils/utils';
import { unionBy } from 'lodash';
import {
  fetchStockAgeData,
  fetchStackAgeReportData,
  getSiteList,
} from '@/services/hwms/stockAgeReportService';

export default {
  namespace: 'stockAgeReport',
  state: {
    reportData: [],
    reportDataPagination: {},
    stockAgeData: [],
    stockAgeDataPagination: {},
    interval: [], //  区间数据
    defaultSite: {},
  },
  effects: {
    *fetchStackAgeReportData({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchStackAgeReportData, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            reportData: result.content,
            reportDataPagination: createPagination(result),
          },
        });
      }
      return result;
    },
    *fetchStockAgeData({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchStockAgeData, parseParameters(payload)));
      if (result) {
        const dynamicColumns = [];
        const dataSource = [];
        result.content.forEach(item => {
          item.libraryAgeList.forEach(e => {
            dynamicColumns.push({
              title: `${e.title}`,
              width: 80,
              dataIndex: `${e.title}`,
              align: 'center',
            });
          });
        });
        for (let index = 0; index < result.content.length; index++) {
          const value = {};
          result.content[index].libraryAgeList.forEach(ele => {
            value[ele.title] = ele.value;
          });
          dataSource.push({
            ...result.content[index],
            ...value,
          });
        }
        yield put({
          type: 'updateState',
          payload: {
            stockAgeData: dataSource,
            dynamicColumns: unionBy(dynamicColumns, 'dataIndex'),
            stockAgeDataPagination: createPagination(result),
          },
        });
      }
      return result;
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
