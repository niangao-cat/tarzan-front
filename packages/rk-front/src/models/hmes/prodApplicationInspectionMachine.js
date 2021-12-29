/*
 * @Description: 产品应用检机报表
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-12-16 09:51:32
 * @LastEditTime: 2021-02-08 15:13:13
 */

import { getResponse, createPagination, parseParameters } from 'utils/utils';
import {
  handleSearch,
  handleExport,
  handleFetchDetail,
} from '@/services/hmes/prodApplicationInspectionMachineService';
import { unionBy } from 'lodash';
import { queryMapIdpValue } from 'services/api';

export default {
  namespace: 'prodApplicationInspectionMachine',
  state: {
    badApplicationList: [],
    pagination: {},
    defaultSite: {},
    dynamicColumns: [],
    detailListPagination: {},
    detailList: [],
  },
  effects: {
    // 批量查询独立值集
    *batchLovData(_, { call, put }) {
      const res = getResponse(
        yield call(queryMapIdpValue, {
          operationList: 'QMS.OQC_0001',
        })
      );
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            ...res,
          },
        });
      }
    },
    // 获取审批清单
    *handleSearch({ payload }, { call, put }) {
      const result = getResponse(yield call(handleSearch, parseParameters(payload)));
      if (result) {
        const { flag } = payload;
        let dynamicColumns = [];
        let dataSource = [];
        if (flag === 'Y') {
          result.content.forEach(item => {
            item.hmeEoJobDataRecordReturnDTO2s.forEach(e => {
              dynamicColumns.push({
                title: `${e.userName}`,
                width: 80,
                dataIndex: `ID${e.userId}`,
                align: 'center',
              });
            });
          });
          for (let index = 0; index < result.content.length; index++) {
            const value = {};
            result.content[index].hmeEoJobDataRecordReturnDTO2s.forEach(ele => {
              value[`ID${ele.userId}`] = ele.inspectionNum;
            });
            dataSource.push({
              ...result.content[index],
              ...value,
            });
          }
        } else {
          dataSource = result.content;
          dynamicColumns = [];
        }
        yield put({
          type: 'updateState',
          payload: {
            badApplicationList: dataSource,
            dynamicColumns: unionBy(dynamicColumns, 'dataIndex'),
            pagination: createPagination(result),
          },
        });
      }
      return result;
    },
    *handleExport({ payload }, { call }) {
      const result = getResponse(yield call(handleExport, payload));
      return result;
    },
    *handleFetchDetail({ payload }, { call, put }) {
      const result = getResponse(yield call(handleFetchDetail, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            detailList: result.content,
            detailListPagination: createPagination(result),
          },
        });
      }
      return result;
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
