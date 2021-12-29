/*
 * @Description: 仓库物料进销存
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-11-19 10:25:54
 * @LastEditTime: 2020-11-22 16:25:03
 */

import { getResponse, createPagination, parseParameters } from 'utils/utils';
import moment from 'moment';
import { handleSearch, fetchDetail, handleExport } from '@/services/hwms/materialPdosReportService';

export default {
  namespace: 'materialPdosReport',
  state: {
    list: [],
    pagination: {}, // 分页数据
    detailList: [],
    detailPagination: {},
    col: [],
  },
  effects: {
    *handleSearch({ payload }, { call, put }) {
      const result = getResponse(yield call(handleSearch, parseParameters(payload)));
      if (result) {
        const dataSource = [];
        for (let index = 0; index < result.content.length; index++) {
          const value = {};
          result.content[index].qtyRecordDTO3List.forEach(ele => {
            value[`${moment(ele.showDate).format('YYYYMMDD')}IN`] = `${ele.sumInQty}/${ele.showDate}`; // 入库
            value[`${moment(ele.showDate).format('YYYYMMDD')}OUT`] = `${ele.sumOutQty}/${ele.showDate}`; // 出库
            value[`${moment(ele.showDate).format('YYYYMMDD')}IRQTY`] = ele.sumInvRecordQty; // 库存
            value.showDate = ele.showDate; // 库存
          });
          dataSource.push({
            ...result.content[index],
            ...value,
          });
        }
        yield put({
          type: 'updateState',
          payload: {
            list: dataSource,
            col: result.content,
            pagination: createPagination(result),
          },
        });
      }
      return result;
    },
    *fetchDetail({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchDetail, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            detailList: result.content,
            detailPagination: createPagination(result),
          },
        });
      }
      return result;
    },
    *handleExport({ payload }, { call }) {
      const result = getResponse(yield call(handleExport, payload));
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
