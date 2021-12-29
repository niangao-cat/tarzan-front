/*
 * @Description: modal
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-03-09 17:28:03
 * @LastEditTime: 2021-03-09 17:53:35
 */
import { isArray } from 'lodash';
import { getResponse, createPagination, parseParameters } from 'utils/utils';
import { handleSearch, fetchAreaList } from '@/services/hmes/monthlyPlanAchievementRateReportService';
import { queryMapIdpValue } from 'services/api';

export default {
  namespace: 'monthlyPlanAchievementRateReport',
  state: {
    pagination: {}, // 分页数据
    list: [],
    lovData: {}, // 值集数据
    areaList: [], // 制造部下拉框
    departmentInfo: {},
  },
  effects: {
    // 获取值集
    *getTypeLov({ payload }, { call, put }) {
      const result = getResponse(yield call(queryMapIdpValue, { ...payload }));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            lovData: result,
          },
        });
      }
      return result;
    },
    *handleFetchList({ payload }, { call, put }) {
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
    *fetchAreaList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchAreaList, payload));
      if(result) {
        yield put({
          type: 'updateState',
          payload: {
            areaList: result,
            departmentInfo: isArray(result) ? result.find(e => e.defaultOrganizationFlag === 'Y') : {},
          },
        });
      }
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
