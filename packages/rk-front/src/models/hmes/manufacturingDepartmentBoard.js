/*
 * @Description: 成品检验质量看板
 * @Version: 0.0.1
 * @Autor: 张晨 <chen.zhang03@hand-china.com>
 * @Date: 2021-05-17 18:10:19
 */
import { getResponse, getCurrentOrganizationId } from 'utils/utils';
import { queryMapIdpValueForTenantId } from './../../services/api';
import {
  fetchDailyPlanChart,
  fetchMonthPlanChart,
  fetchProductionGroupList,
  fetchProcessNcList,
  fetchDepartmentList,
  // fetchRefreshFrequency,
  fetchRefreshrequencyget,
  fetchRefreshFrequencymoon,
  // fetchRefreshFrequencypull,
  fetchRefreshFrequencytop,
} from '@/services/hmes/manufacturingDepartmentBoardService';

export default {
  namespace: 'manufacturingDepartmentBoard',
  state: {
    warehouse: [],
    wareHouseMapMsg: {},
    selectWareHouse: '',
    times: [],
    pullList: [],
    moonList: [],
    topList: [],
    dailyList: [],
    departmentList: [],
    monthPlanPage: 0,
    monthPlanAllPage: 0,
    dailyPlanPage: 0,
    dailyPlanAllPage: 0,
    productionGroupList: [],
    allProductionGroupList: [],
    productionGroupPage: 0,
    productionGroupAllPage: 0,
    dailyPlanList: [],
    allDailyPlanList: [],
    processNcList: [],
    allProcessNcList: [],
    processNcPage: 0,
    processNcAllPage: 0,
    monthPlanData: {
      productionList: [],
      planCompleteList: [],
      completedList: [],
      unCompletedList: [],
    },
    allMonthPlanData: {
      productionList: [],
      planCompleteList: [],
      completedList: [],
      unCompletedList: [],
    },
    ROLLING_FREQUENCY: 0,
    REFRESH_FREQUENCY: 0,
  },
  effects: {
    // 查询独立值集
    // *init(_, { call, put }) {
    //   const result = getResponse(yield call(fetchRefreshFrequency));
    //   yield call(queryMapIdpValue, {
    //     warehouse: 'HME.AREA_SYB_KANBAN',
    //   });
    //   if (result) {
    //     const { centerConfig } = result;
    //     const REFRESH_FREQUENCY = Number(centerConfig.find(e => e.value === 'REFRESH_FREQUENCY').meaning);
    //     const ROLLING_FREQUENCY = Number(centerConfig.find(e => e.value === 'ROLLING_FREQUENCY').meaning);
    //     yield put({
    //       type: 'updateState',
    //       payload: {
    //         ROLLING_FREQUENCY,
    //         REFRESH_FREQUENCY,
    //         ...result,
    //       },
    //     });
    //   }
    //   return result;
    // },
    *init(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValueForTenantId, {
          warehouse: 'HME.AREA_SYB_KANBAN',
          times: 'HME.CENTER_KANBAN_CONFIG',
          tenantId: 0,
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
      return result;
    },

    // 月度计划
    *fetchMonthPlanChart({ payload }, { call }) {
      const result = getResponse(yield call(fetchMonthPlanChart, payload));
      return result;
    },

    // 日计划达成率
    *fetchDailyPlanChart({ payload }, { call }) {
      const result = getResponse(yield call(fetchDailyPlanChart, payload));
      return result;
    },

    *fetchProductionGroupList({ payload }, { call }) {
      const res = getResponse(yield call(fetchProductionGroupList, payload));
      return res;
    },

    *fetchProcessNcList({ payload }, { call }) {
      const result = getResponse(yield call(fetchProcessNcList, payload));
      return result;
    },


    // 达成率统计汇总 月度计划
    *fetchRefreshrequencyget({ payload }, { call, put }) {
      const result = getResponse(
        yield call(fetchRefreshrequencyget, {
          areaCode: payload.areaCode,
        })
      );
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            moonList: result,
          },
        });
      }
      return result;
    },
    //  日计划达成率
    *fetchRefreshFrequencymoon({ payload }, { call, put }) {
      const result = getResponse(
        yield call(fetchRefreshFrequencymoon, {
          areaCode: payload.areaCode,
        })
      );
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            dailyList: result,
          },
        });
      }
      return result;
    },
    // 直通率
    // *fetchRefreshFrequencypull({ payload }, { call, put }) {
    //   const result = getResponse(
    //     yield call(fetchRefreshFrequencypull, {
    //       areaCode: payload.areaCode,
    //     })
    //   );
    //   if (result) {
    //     yield put({
    //       type: 'updateState',
    //       payload: {
    //         pullList: result,
    //       },
    //     });
    //   }
    //   return result;
    // },
    // 工序不良TOP5
    *fetchRefreshFrequencytop({ payload }, { call, put }) {
      const result = getResponse(
        yield call(fetchRefreshFrequencytop, {
          areaCode: payload.areaCode,
        })
      );
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            topList: result,
          },
        });
      }
      return result;
    },

    *fetchDepartmentList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchDepartmentList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            departmentList: res,
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
