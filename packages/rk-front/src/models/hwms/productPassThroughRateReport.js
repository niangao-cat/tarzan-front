/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 在制查询报表
 */
import { isArray, isEmpty } from 'lodash';
import { getResponse, createPagination } from 'utils/utils';
import { queryDataList, fetchDetailList, fetchDepartment, getExport } from '@/services/hwms/productPassThroughRateReportService';
import { queryUnifyIdpValue } from 'services/api';

export default {
  namespace: 'productPassThroughRateReport',
  state: {
    headList: [],
    colData: [],
    areaMap: [],
    defaultDepartment: {},
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
          if (res.resultList[i].materialData.length > 0) {
            colData = res.resultList[0].materialData;
            for (let j = 0; j < res.resultList[i].materialData.length; j++) {
              res.resultList[i][
                `${res.resultList[i].materialData[j].materialName}passNum`
              ] = res.resultList[i].materialData[j].passNum;
              res.resultList[i][
                `${res.resultList[i].materialData[j].materialName}ncNum`
              ] = res.resultList[i].materialData[j].ncNum;
              res.resultList[i][
                `${res.resultList[i].materialData[j].materialName}productionNum`
              ] = res.resultList[i].materialData[j].productionNum;
              res.resultList[i][
                `${res.resultList[i].materialData[j].materialName}rate`
              ] = res.resultList[i].materialData[j].rate;
              res.resultList[i][
                `${res.resultList[i].materialData[j].materialName}identificationList`
              ] = res.resultList[i].materialData[j].identificationList;
              res.resultList[i][
                `${res.resultList[i].materialData[j].materialName}ncDataList`
              ] = res.resultList[i].materialData[j].ncDataList;
            }
          }
        }

        // 插入最后的总和数据
        const lastLine = { processName: '直通率' };
        if (res.resultList.length > 0) {
          for (let j = 0; j < res.resultList[0].materialData.length; j++) {

            lastLine[
              `${res.resultList[0].materialData[j].materialName}passNum`
            ] = res.passRateData[j * 4 + 0];
            lastLine[
              `${res.resultList[0].materialData[j].materialName}ncNum`
            ] = res.passRateData[j * 4 + 1];
            lastLine[
              `${res.resultList[0].materialData[j].materialName}productionNum`
            ] = res.passRateData[j * 4 + 2];
            lastLine[
              `${res.resultList[0].materialData[j].materialName}rate`
            ] = res.passRateData[j * 4 + 3];
          }
        }
        yield put({
          type: 'updateState',
          payload: {
            headList: [...res.resultList, lastLine],
            colData,
          },
        });
      } else {
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
    *fetchDepartment({ payload }, { put, call }) {
      const res = yield call(fetchDepartment, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            defaultDepartment: isArray(list) && !isEmpty(list) ? list.find(e => e.defaultOrganizationFlag === 'Y') : {},
          },
        });
      }
      return list;
    },
    *getExport({ payload }, { call }) {
      const result = getResponse(yield call(getExport, payload));
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
