/**
 * workOrder - 工单派工平台
 * @date: 2020/02/27 19:53:47
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import { isNull, isEmpty } from 'lodash';
import moment from 'moment';
import { getResponse, createPagination } from 'utils/utils';
import isArray from 'lodash/isArray';
import { fetchBaseInfo, fetchProdLines, save, deliveryDemand, fetchLimitDate, fetchNumberSets, fetchSuiteDetail, fetchDefaultSite } from '@/services/hhme/workOrderService';

export default {
  namespace: 'workOrder',
  state: {
    list: [],
    weekList: [],
    prodLinesWeekList: [],
    limitDate: 0,
    siteInfo: {},
    searchForm: {},
  },
  effects: {
    *fetchDefaultSite(_, { put, call }) {
      const res = getResponse(yield call(fetchDefaultSite));
      if(res) {
        yield put({
          type: 'updateState',
          payload: {
            siteInfo: res,
          },
        });
      }
    },

    *fetchLimitDate(_, { put, call }) {
      const res = getResponse(yield call(fetchLimitDate, { profileName: 'WMS_DISPATCH_DATE_LIMIT' }));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            // eslint-disable-next-line radix
            limitDate: parseInt(res),
          },
        });
      }
    },
    *fetchBaseInfo({ payload }, { put, call }) {
      const res = getResponse(yield call(fetchBaseInfo, payload));
      if (res) {
        const dataList = isArray(res) ? res : [];
        const list = [];
        dataList.forEach(area => {
          const { workOrderList = [], ...areaInfo } = area;
          (isArray(workOrderList) ? workOrderList : []).forEach(woProd => {
            const { detailList, ...woProdInfo } = woProd;
            (isArray(detailList) ? detailList : []).forEach(woProdLine => {
              const { calendarShiftList, ...workDayInfo } = woProdLine;
              const dispatchList = (isArray(calendarShiftList)
                ? calendarShiftList
                : []
              );
              const obj = {};
              if(isArray(dispatchList) && !isEmpty(dispatchList)) {
                dispatchList.forEach(b => {
                  const calendarShiftId = isNull(b.calendarShiftId) ? null : b.calendarShiftId.split('.').join('-');
                  const key = `${moment(b.shiftDate).format('YYYY-MM-DD')}#${b.shiftCode}#${calendarShiftId}`;
                  obj[key] = b;
                });
              }
              list.push({
                ...workDayInfo,
                ...woProdLine,
                ...woProdInfo,
                ...areaInfo,
                ...obj,
                // _status: 'update',
                status: 'EDIT',
              });
            });
          });
        });
        const weekList = [];
        for(let i = 0; i < 15; i++) {
          ['A', 'B', 'C'].forEach(e => {
            const shiftDate = moment().add(i, `days`).format('YYYY-MM-DD');
            weekList.push({
              shiftDate,
              shiftCode: e,
            });
          });
        }
        yield put({
          type: 'updateState',
          payload: {
            list,
            weekList,
            searchForm: {
              prodLineId: payload.prodLineId,
            },
          },
        });
      }
    },

    *fetchProdLines({ payload }, { put, call }) {
      const res = getResponse(yield call(fetchProdLines, payload));
      if (res && isArray(res)) {
        let dataList = [];
        res.forEach(e => {
          dataList = dataList.concat(e.prodLineWkcList);
        });
        const newData = dataList.map(prod => {
          const { woProdList, ...prodInfo } = prod;
          const totalObj = woProdList.pop();
          const prodList = [];
          if (woProdList.length > 0) {
            woProdList.forEach(woProd => {
              const { hmeCalendarShiftList, ...woProdInfo } = woProd;
              const dispatchList = hmeCalendarShiftList.filter(a => !isNull(a.dispatchQty));
              const obj = {};
              dispatchList.forEach(b => {
                const key = `${moment(b.shiftDate).format('YYYY-MM-DD')}#${b.shiftCode}`;
                obj[key] = b.dispatchQty;
              });
              prodList.push({
                ...prodInfo,
                ...woProdInfo,
                ...obj,
              });
            });
          } else {
            prodList.push(prodInfo);
          }
          const { hmeCalendarShiftList } = totalObj;
          const obj = {};
          hmeCalendarShiftList.forEach(e => {
            const key = `${moment(e.shiftDate).format('YYYY-MM-DD')}#${e.shiftCode}`;
            obj[key] = e.totalQty;
          });
          prodList.push(obj);
          return prodList;
        });
        const prodLinesWeekList = [];
        for (let i = 0; i < 15; i++) {
          ['A', 'B', 'C'].forEach(e => {
            const shiftDate = moment().add(i, `days`).format('YYYY-MM-DD');
            prodLinesWeekList.push({
              shiftDate,
              shiftCode: e,
            });
          });
        }
        yield put({
          type: 'updateState',
          payload: {
            prodLines: newData,
            prodLinesWeekList,
          },
        });
      }
    },
    *save({ payload }, { call }) {
      const res = getResponse(yield call(save, payload));
      return res;
    },
    *deliveryDemand({ payload }, { call }) {
      const res = yield call(deliveryDemand, payload);
      return res;
    },
    *fetchNumberSets({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchNumberSets, payload));
      const { list = [] } = payload;
      if (result) {
        for (let i = 0; i < list.length; i++) {
          // 总的数据
          for (let j = 0; j < result.length; j++) {
            // 选中的行数据
            if (`${list[i].workOrderId}${list[i].workcellId}` === `${result[j].workOrderId}${result[j].workcellId}`) {
              list.splice(i, 1, {
                ...list[i],
                suiteQty: result[j].suiteQty,
                componentSuiteList: result[j].componentSuiteList,
              });
              break; // 只要在选择的数据中得到匹配的立马跳出此次循环，进行下一次判断
            } else {
              // 如果总的数据在i位置没有匹配到选择的数据，那么该数据是不可以更新的
              list.splice(i, 1, {
                ...list[i],
              });
            }
          }
        }
        yield put({
          type: 'updateState',
          payload: {
            list,
          },
        });
      }
      return result;
    },
    *fetchSuiteDetail({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchSuiteDetail, payload));
      if(res) {
        yield put({
          type: 'updateState',
          payload: {
            suiteList: res.content,
            suitePagination: createPagination(res),
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
