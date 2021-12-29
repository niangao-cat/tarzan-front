/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 在制查询报表
 */
import { isArray } from 'lodash';
import { getResponse } from 'utils/utils';
import { queryDataList, fetchDepartment, getExport } from '@/services/hwms/repairDailyThroughRateReportService';
import { queryUnifyIdpValue } from 'services/api';

export default {
  namespace: 'repairDailyThroughRateReport',
  state: {
    headList: [],
    colData: [],
    areaMap: [],
    defaultDepartment: {},
    exportData: {},
  },
  effects: {
    // 查询独立值集
    *init(_, { call, put }) {
      const result = getResponse(yield call(queryUnifyIdpValue, 'HME.AREA_NAME'));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            areaMap: result,
          },
        });
      }
    },
    // 查询报表信息
    *queryDataList({ payload }, { call, put }) {
      // 先清空数据
      yield put({
        type: 'updateState',
        payload: {
          headList: [],
          colData: [],
        },
      });
      const res = getResponse(yield call(queryDataList, payload));
      let colData = [];
      if (res && res.resultList) {
        for (let i = 0; i < res.resultList.length; i++) {
          colData = res.resultList[0].shiftData;
          if (res.resultList[i].shiftData.length > 0) {
            for (let j = 0; j < res.resultList[i].shiftData.length; j++) {
              res.resultList[i][
                `${res.resultList[i].shiftData[j].shiftName}passNum`
              ] = res.resultList[i].shiftData[j].passNum;
              res.resultList[i][
                `${res.resultList[i].shiftData[j].shiftName}ncNum`
              ] = res.resultList[i].shiftData[j].ncNum;
              res.resultList[i][
                `${res.resultList[i].shiftData[j].shiftName}productionNum`
              ] = res.resultList[i].shiftData[j].productionNum;
              res.resultList[i][
                `${res.resultList[i].shiftData[j].shiftName}rate`
              ] = res.resultList[i].shiftData[j].rate;
              res.resultList[i][
                `${res.resultList[i].shiftData[j].shiftName}identificationList`
              ] = res.resultList[i].shiftData[j].identificationList;
              res.resultList[i][
                `${res.resultList[i].shiftData[j].shiftName}ncDataList`
              ] = res.resultList[i].shiftData[j].ncDataList;
            }
          }
        }

        // 插入最后的总和数据
        const lastLine = { processName: '直通率'};
        if(res.resultList.length>0){
          for (let j = 0; j < res.resultList[0].shiftData.length; j++) {
            lastLine[
              `${res.resultList[0].shiftData[j].shiftName}passNum`
            ] = res.passRateData[j*4+0];
            lastLine[
              `${res.resultList[0].shiftData[j].shiftName}ncNum`
            ] = res.passRateData[j*4+1];
            lastLine[
              `${res.resultList[0].shiftData[j].shiftName}productionNum`
            ] = res.passRateData[j*4+2];
            lastLine[
              `${res.resultList[0].shiftData[j].shiftName}rate`
            ] = res.passRateData[j*4+3];
          }
        }
        yield put({
          type: 'updateState',
          payload: {
            headList: [ ...res.resultList, lastLine ],
            colData,
            exportData: res,
          },
        });
      }else{
        yield put({
          type: 'updateState',
          payload: {
            headList: [],
            colData: [],
          },
        });
      }
      return res;
    },
    *fetchDepartment({ payload }, { put, call }) {
      const res = yield call(fetchDepartment, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            defaultDepartment: isArray(list) ? list.find(e => e.defaultOrganizationFlag === 'Y') : {},
          },
        });
      }
      return list;
    },
    *getExport({ payload }, { call }) {
      const res = getResponse(yield call(getExport, payload));
      return res;
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
