/*
 * @Description: IQC日常工作计划报表
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-12-28 14:25:27
 * @LastEditTime: 2021-01-04 10:32:45
 */
import { getResponse, createPagination, parseParameters } from 'utils/utils';
import { handleSearch, handleSearchChartsData, fetchDefaultSite } from '@/services/hqms/iqcDailyWorkPlanService';

export default {
  namespace: 'iqcDailyWorkPlan',
  state: {
    list: [],
    chartsList: [],
    pagination: {}, // 分页数据
    xAxisData: [],
    okData: [],
    ngData: [],
    defaultSite: {},
  },
  effects: {
    // 获取样本量字码数据
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
      if (result) {
        const xAxisData = [];
        const okData = [];
        const ngData = [];
        result.forEach((ele) => {
          xAxisData.push(`${ele.materialName.substr(0, 6)}/${ele.supplierName.substr(0, 6)}/${ele.inspectorName}`);
          okData.push(ele.okNum);
          ngData.push(ele.ngNum);
        });
        yield put({
          type: 'updateState',
          payload: {
            xAxisData,
            okData,
            ngData,
            chartsList: result,
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
