/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 工序不良报表
 */

import { getResponse, createPagination } from 'utils/utils';
import { queryDataList, fetchSiteList } from '@/services/hwms/processDefectReportService';
import { queryMapIdpValue } from 'services/api';

export default {
  namespace: 'processDefectReport',
  state: {
    headList: [],
    headPagination: {},
    detailMap: [],
    qualityStatusList: [],
    ncIncidentStatusList: [],
  },
  effects: {
    // 初始化 状态下拉框
    *init(_, { call, put }) {
      const res = yield call(queryMapIdpValue, {
        detailMap: 'HME.NC_PROCESS_METHOD',
        qualityStatusList: 'HME.QUALITY_STATUS',
        ncIncidentStatusList: 'HME.NC_INCIDENT_STATUS',
      });
      const siteList = getResponse(yield call(fetchSiteList));
      // 成功时，更改状态
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            ...res,
          },
        });
      }
      if (siteList) {
        yield put({
          type: 'updateState',
          payload: {
            siteList,
          },
        });
      }
    },
    // 查询报表信息
    *queryDataList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryDataList, payload));
      if (res) {
        // 排序
        if (res.content.length > 0) {
          res.content = res.content.sort(
            (arr = ['description', 'workcellName', 'process'], rev = false) => {
              let revCount = 0;
              if (rev === undefined) {
                revCount = 1;
              } else {
                revCount = rev ? 1 : -1;
              }
              // eslint-disable-next-line func-names
              return function(a, b) {
                for (let i = 0; i < arr.length; i++) {
                  const attr = arr[i];
                  if (a[attr] !== b[attr]) {
                    if (a[attr] > b[attr]) {
                      return revCount * 1;
                    } else {
                      return revCount * -1;
                    }
                  }
                }
              };
            }
          );
        }
        yield put({
          type: 'updateState',
          payload: {
            headList: res.content,
            headPagination: createPagination(res),
          },
        });
      }
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
