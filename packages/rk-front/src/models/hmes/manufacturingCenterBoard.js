/*
 * @Description: 成品检验质量看板
 * @Version: 0.0.1
 * @Autor: 张晨 <chen.zhang03@hand-china.com>
 * @Date: 2021-05-17 18:10:19
 */
import { isEmpty, cloneDeep, isArray } from 'lodash';
import { getResponse, createPagination } from 'utils/utils';
import {
  fetchDailyPlanChart,
  fetchMonthPlanChart,
  fetchProductionGroupList,
  fetchProcessNcList,
  fetchInspectionNcList,
  fetchRefreshFrequency,
  fetchProdLineList,
} from '@/services/hmes/manufacturingCenterService';

export default {
  namespace: 'manufacturingCenterBoard',
  state: {
    visible: true,
    monthPlanPage: 0,
    dailyPlanPage: 0,
    productionGroupList: [],
    allProductionGroupList: [],
    productionGroupPage: 0,
    dailyPlanList: [],
    allDailyPlanList: [],
    inspectionNcList: [],
    allInspectionNcList: [],
    inspectionNcPage: 0,
    processNcList: [],
    allProcessNcList: [],
    processNcPage: 0,
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
    *init(_, { call, put }) {
      const result = getResponse(yield call(fetchRefreshFrequency));
      if (result) {
        const { centerConfig } = result;
        const REFRESH_FREQUENCY = Number(centerConfig.find(e => e.value === 'REFRESH_FREQUENCY').meaning);
        const ROLLING_FREQUENCY = Number(centerConfig.find(e => e.value === 'ROLLING_FREQUENCY').meaning);
        yield put({
          type: 'updateState',
          payload: {
            ROLLING_FREQUENCY,
            REFRESH_FREQUENCY,
          },
        });
      }
      return result;
    },
    // 月度计划
    *fetchMonthPlanChart({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchMonthPlanChart, payload));
      if (result) {
        const { xaxisList, yaxisList } = result;
        const { noticeIndexList = [], valueList = [] } = isEmpty(xaxisList) ? {} : xaxisList.find(e => e.xaxisType === "1");
        if (!isEmpty(valueList)) {
          const completedList = cloneDeep(valueList).map(e => e === 0 ? '-' : e);
          const unCompletedList = valueList.map(() => '-');
          const planCompleteList = result.xaxisList.find(e => e.xaxisType === "0").valueList.map(e => e === 0 ? '-' : e);
          noticeIndexList.forEach(e => {
            completedList[e] = '-';
            unCompletedList[e] = valueList[e];
          });
          const allMonthPlanData = {
            // productionList: yaxisList.reverse(),
            // planCompleteList: planCompleteList.reverse(),
            // completedList: completedList.reverse(),
            // unCompletedList: unCompletedList.map(e => e === 0 ? '-' : e).reverse(),
            productionList: yaxisList,
            planCompleteList,
            completedList,
            unCompletedList,
          };
          yield put({
            type: 'updateState',
            payload: {
              allMonthPlanData,
              monthPlanData: {
                productionList: allMonthPlanData.productionList.slice(0, 6),
                planCompleteList: allMonthPlanData.planCompleteList.slice(0, 6).map(e => e === 0 ? '-' : e),
                completedList: allMonthPlanData.completedList.slice(0, 6).map(e => e === 0 ? '-' : e),
                unCompletedList: allMonthPlanData.unCompletedList.slice(0, 6).map(e => e === 0 ? '-' : e),
              },
            },
          });
        }
      }
      return result;
    },

    // 日计划达成率
    *fetchDailyPlanChart({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchDailyPlanChart, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            allDailyPlanList: result,
            dailyPlanList: result.slice(0, 10),
          },
        });
      }
      return result;
    },

    *fetchProductionGroupList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchProductionGroupList, payload));
      if (result) {
        const allProductionGroupList = isArray(result) ? result.map(e => {
          return {
            title: e.chartTitle,
            overFlag: e.overFlag,
            processList: e.chartValueList.map(i => i.processName),
            actualYieldList: e.chartValueList.map(i => i.processThroughRate === 0 ? '-' : i.processThroughRate),
            targetYieldList: e.chartValueList.map(i => i.targetThroughRate === 0 ? '-' : i.targetThroughRate),
            throughRateList: e.chartValueList.map(i => i.throughRate === 0 ? '-' : i.throughRate),
          };
        }) : [];
        yield put({
          type: 'updateState',
          payload: {
            allProductionGroupList,
            productionGroupList: allProductionGroupList.slice(0, 3),
          },
        });
      }
    },

    *fetchProcessNcList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchProcessNcList, payload));
      if (result) {
        const allProcessNcList = isArray(result) ? result.map(e => {
          return {
            title: e.chartsTitle,
            ncList: e.chartsValueList.map(i => i.description),
            ncNumberList: e.chartsValueList.map(i => i.ncCount),
          };
        }) : [];
        yield put({
          type: 'updateState',
          payload: {
            allProcessNcList,
            processNcList: allProcessNcList.slice(0, 2),
          },
        });
      }
    },

    // 巡检不良
    *fetchInspectionNcList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchInspectionNcList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            inspectionNcRate: result.inspectionNcRate,
            allInspectionNcList: result.inspectionNcList,
            inspectionNcList: result.inspectionNcList.slice(0, 8),
          },
        });
      }
      return result;
    },

    *fetchProdLineList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchProdLineList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            prodLineList: result.content,
            pagination: createPagination(result),
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
