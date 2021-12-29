/*
 * @Description:描述
 * @Version: 0.0.1
 * @Autor: li.zhang13@hand-china.com
 * @Date: 2020-01-14 10:34:55
 */

import { getResponse, createPagination } from 'utils/utils';
import {
  fetcheEuipmentWorking,
  exportData,
} from '@/services/hmes/equipmentWorkingService';

export default {
  namespace: 'equipmentWorking',
  state: {
    reportData: [],
    reportDataPagination: {},
    equipmentWorking: [],
    defaultDate: [],
  },
  effects: {
    // 设备运行情况查询
    *fetcheEuipmentWorking({ payload }, { call, put }) {
      // 先清空数据
      yield put({
        type: 'updateState',
        payload: {
          headList: [],
          colData: [],
        },
      });
      const res = getResponse(yield call(fetcheEuipmentWorking, payload));
      // console.log('res', res);
      let colData = [];
      if (res&&res.content) {
        for (let i = 0; i < res.content.length; i++) {
          if (res.content[i].hmeEquipmentWorkingVO2List.length > 0) {
            for (let j = 0; j < res.content[i].hmeEquipmentWorkingVO2List.length; j++) {
              if(colData.filter(item=>item===res.content[i].hmeEquipmentWorkingVO2List[j].dateString).length===0){
                colData = [ ...colData, res.content[i].hmeEquipmentWorkingVO2List[j].dateString];
              }
              res.content[i][
                `${res.content[i].hmeEquipmentWorkingVO2List[j].dateString}planDate`
                ] = res.content[i].hmeEquipmentWorkingVO2List[j].planDate;
              res.content[i][
                `${res.content[i].hmeEquipmentWorkingVO2List[j].dateString}actualDate`
                ] = res.content[i].hmeEquipmentWorkingVO2List[j].actualDate;
              res.content[i][
                `${res.content[i].hmeEquipmentWorkingVO2List[j].dateString}stopDate`
                ] = res.content[i].hmeEquipmentWorkingVO2List[j].stopDate;
              res.content[i][
                `${res.content[i].hmeEquipmentWorkingVO2List[j].dateString}boot`
                ] = res.content[i].hmeEquipmentWorkingVO2List[j].boot;
              res.content[i][
                `${res.content[i].hmeEquipmentWorkingVO2List[j].dateString}utilization`
                ] = res.content[i].hmeEquipmentWorkingVO2List[j].utilization;
            }
          }
        }

        // 插入最后的总和数据
        const lastLine = { user: '合计'};
        if(res.content.length>0){
          for (let i = 0; i < res.content.length; i++) {
            if (res.content[i].hmeEquipmentWorkingVO2List.length > 0) {
              for (let j = 0; j < res.content[i].hmeEquipmentWorkingVO2List.length; j++) {
                lastLine[
                  `${res.content[i].hmeEquipmentWorkingVO2List[j].dateString}planDate`
                  ] = res.summaryList.filter(item=>item.dateString===res.content[i].hmeEquipmentWorkingVO2List[j].dateString)[0].totalPlanDate;
                lastLine[
                  `${res.content[i].hmeEquipmentWorkingVO2List[j].dateString}actualDate`
                  ] = res.summaryList.filter(item=>item.dateString===res.content[i].hmeEquipmentWorkingVO2List[j].dateString)[0].totalActualDate;
                lastLine[
                  `${res.content[i].hmeEquipmentWorkingVO2List[j].dateString}stopDate`
                  ] = res.summaryList.filter(item=>item.dateString===res.content[i].hmeEquipmentWorkingVO2List[j].dateString)[0].totalStopDate;
                lastLine[
                  `${res.content[i].hmeEquipmentWorkingVO2List[j].dateString}boot`
                  ] = res.summaryList.filter(item=>item.dateString===res.content[i].hmeEquipmentWorkingVO2List[j].dateString)[0].avgBoot;
                lastLine[
                  `${res.content[i].hmeEquipmentWorkingVO2List[j].dateString}utilization`
                  ] = res.summaryList.filter(item=>item.dateString===res.content[i].hmeEquipmentWorkingVO2List[j].dateString)[0].avgUtilization;
              }
            }
          }
        }
        yield put({
          type: 'updateState',
          payload: {
            reportData: [ ...res.content, lastLine ],
            reportDataPagination: createPagination(res),
            colData: colData.sort(),
          },
        });
      }else{
        yield put({
          type: 'updateState',
          payload: {
            reportData: [],
            colData: [],
          },
        });
      }
      return res;
    },

    // 导出数据
    *exportData({ payload }, { call }) {
      const res = getResponse(yield call(exportData, payload));
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
