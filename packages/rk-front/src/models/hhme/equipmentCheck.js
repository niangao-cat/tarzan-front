/**
 * workOrder - 工单派工平台
 * @date: 2020/02/27 19:53:47
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import { getResponse, createPagination } from 'utils/utils';
import {
  fetchDefaultSite,
  fetchWorkCellInfo,
  fetchEquipmentInfo,
  fetchMaintenanceInfo,
  fetchCheckInfo,
  addResult,
  saveRemark,
} from '../../services/hhme/equipmentCheckService';

export default {
  namespace: 'equipmentCheck',
  state: {
    baseInfo: {},
    workCellInfo: {},
    siteInfo: {},
    equipmentInfo: {},
    checkList: [],
    checkInfo: {},
    colorDto: {},
  },
  effects: {
    *fetchDefaultSite(_, { call, put }) {
      const res = getResponse(yield call(fetchDefaultSite));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            siteInfo: res,
          },
        });
        return res;
      }
    },
    *fetchWorkCellInfo({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchWorkCellInfo, payload));
      if(res) {
        yield put({
          type: 'updateState',
          payload: {
            workCellInfo: res,
          },
        });
        return res;
      }
    },
    *fetchEquipmentInfo({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchEquipmentInfo, payload));
      if(res) { // 设备
        const { assetEncoding } = payload;

        yield put({
          type: 'updateState',
          payload: {
            equipmentInfo: {...res, assetEncoding},
            checkList: [],
            colorDto: {type: payload.timeType, color: res.docStatusMeaning?(res.docStatusMeaning==="未开始"?"yellow":(res.docStatusMeaning==="已完成"?"green":(res.docStatusMeaning==="无任务"?"grey":"white"))):"white"},
          },
        });
      }
      return res;
    },
    *fetchMaintenanceInfo({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchMaintenanceInfo, payload));
      if(res) {
        const { pageData, ...checkInfo } = res;
        const checkList = [];
        const checkDocNums = [];
        pageData.content.forEach(e => {
          if(!checkDocNums.includes(e.docNum)) {
            const thisDocNumCheckList = pageData.content.filter(i => i.docNum === e.docNum);
            checkList.push(thisDocNumCheckList);
            checkDocNums.push(e.docNum);
          }
        });
        yield put({
          type: 'updateState',
          payload: {
            checkList,
            checkInfo,
            colorDto: {type: payload.timeType, color: res.docStatusMeaning?(res.docStatusMeaning==="未开始"?"yellow":(res.docStatusMeaning==="已完成"?"green":(res.docStatusMeaning==="无任务"?"grey":"white"))):"white"},
            pagination: createPagination(pageData),
          },
        });
      }
    },
    *fetchCheckInfo({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchCheckInfo, payload));
      if(res) {
        const { pageData, ...checkInfo } = res;
        const checkList = [];
        const checkDocNums = [];
        pageData.content.forEach(e => {
          if(!checkDocNums.includes(e.docNum)) {
            const thisDocNumCheckList = pageData.content.filter(i => i.docNum === e.docNum);
            checkList.push(thisDocNumCheckList);
            checkDocNums.push(e.docNum);
          }
        });
        yield put({
          type: 'updateState',
          payload: {
            checkList,
            checkInfo,
            pagination: createPagination(pageData),
          },
        });
      }
    },
    *addResult({ payload }, { call }) {
      const res = getResponse(yield call(addResult, payload));
      return res;
    },
    *saveRemark({ payload }, { call }) {
      const res = getResponse(yield call(saveRemark, payload));
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
