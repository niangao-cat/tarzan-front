/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 在制查询报表
 */
import { isArray } from 'lodash';
import { getResponse, createPagination } from 'utils/utils';
import { queryDataList, fetchDetailList, getSiteList, handleExport } from '@/services/hwms/inProcessQueryReportService';


export default {
  namespace: 'inProcessQueryReport',
  state: {
    headList: [],
    headPagination: {},
    colData: [],
    detailList: [],
    detailPagination: {},
    defaultSite: {},
    qty: 0,
  },
  effects: {
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
    // 查询报表信息
    *queryDataList({ payload }, { call, put }) {
      // 先清空数据
      yield put({
        type: 'updateState',
        payload: {
          headList: [],
          colData: [],
          headPagination: {},
        },
      });
      const res = getResponse(yield call(queryDataList, payload));

      const { pageData, workcellQty, qty } = res;
      const colData = pageData
        ? pageData.content.length > 0
          ? pageData.content.filter(item => item.workcells.length > 0).length > 0
            ? pageData.content.filter(item => item.workcells.length > 0)[0].workcells
            : []
          : []
        : [];
      if (res) {
        for (let i = 0; i < pageData.content.length; i++) {
          if (pageData.content[i].workcells.length > 0) {
            for (let j = 0; j < pageData.content[i].workcells.length; j++) {
              const workCellKey = pageData.content[i].workcells[j].workcellId.split('.').join('#');
              pageData.content[i][
                `${workCellKey}finishNum`
              ] = pageData.content[i].workcells[j].finishNum;
              pageData.content[i][
                `${workCellKey}runNum`
              ] = pageData.content[i].workcells[j].runNum;
            }
          }
        }
        const firstLine = {};
        if(isArray(workcellQty)) {
          workcellQty.forEach(e => {
            const { workcellId, totalQty } = e;
            const workCellKey = workcellId.split('.').join('#');
            firstLine[workCellKey] = totalQty;
          });
        }

        const headList = [firstLine].concat(pageData.content);
        const headPagination = createPagination(pageData);
        yield put({
          type: 'updateState',
          payload: {
            headList,
            colData,
            qty,
            headPagination,
          },
        });
      }
      return res;
    },

    // 查询行信息
    *fetchDetailList({ payload }, { call, put }) {
      const res = yield call(fetchDetailList, payload);
      const list = getResponse(res);
      // 成功时，更改状态
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            detailList: list.content,
            detailPagination: createPagination(list),
          },
        });
      }
    },
    *handleExport({ payload }, { call }) {
      const result = getResponse(yield call(handleExport, payload));
      return result;
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
