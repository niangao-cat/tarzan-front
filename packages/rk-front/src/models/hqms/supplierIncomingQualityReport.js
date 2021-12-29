/*
 * @Description: 供应商来料在线质量
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-12-28 16:11:27
 * @LastEditTime: 2020-12-30 15:03:04
 */

import { getResponse, createPagination, parseParameters } from 'utils/utils';
import { handleSearch, handleSearchChartsData, fetchDefaultSite, exportExcel } from '@/services/hqms/supplierIncomingQualityReportService';

export default {
  namespace: 'supplierIncomingQualityReport',
  state: {
    detail: {},
    pagination: {}, // 分页数据
    sampleCodeList: [],
    lovData: {}, // 值集数据
    xaxisList: [],
    legendDataList: [],
    seriesData: [],
    defaultSite: {},
  },
  effects: {
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
    *handleSearchChartsData({ payload }, { call, put }) {
      const result = getResponse(yield call(handleSearchChartsData, payload));
      const legendDataList = [];
      const seriesData = [];
      if (result) {
        result.verticalAxisList.forEach(ele => {
          legendDataList.push(ele.verticalAxis);
          seriesData.push({
            name: ele.verticalAxis,
            type: 'bar',
            stack: 'MS',
            barWidth: 20, // 柱图宽度
            barMaxWidth: 20,
            data: ele.valueList,
          });
        });
        yield put({
          type: 'updateState',
          payload: {
            legendDataList,
            seriesData,
            xaxisList: result.horizontalAxisList,
          },
        });
      }
      return result;
    },

     // 获取默认工厂
     *fetchDefaultSite({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchDefaultSite, payload));
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
    // 导出
    *exportExcel({ payload }, { call }) {
      const result = getResponse(yield call(exportExcel, payload));
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
