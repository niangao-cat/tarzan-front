/**
 * 锡膏/红胶管理
 *@date：2019/10/30
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */

import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  queryHeadList,
  queryLineList,
  queryProductLineList,
  queryDataByCode,
  operate,
} from '../../services/hwms/solderGlueManageService';

export default {
  namespace: 'solderGlueManage',
  state: {
    headList: [], // 查询列表
    headPagination: {},
    lineList: [], // 明细列表
    proLineList: [], // 产线数据查询列表
    proLinePagination: {},
    mgrList: [], // 管理列表
    mgrPagination: {},
    objectMap: [], // 对象
    statusMap: [], // 状态
    btnType: '', // 点击按钮类型
  },
  effects: {
    // 查询独立值集
    *init({ payload }, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          objectMap: 'Z_SOLDER_GLUE',
          statusMap: 'Z_SOLDER_GLUE_STATUS',
          tenantId: payload.tenantId,
        })
      );
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            ...result,
          },
        });
      }
    },
    // 锡膏/红胶查询头列表
    *queryHeadList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryHeadList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            headList: res.rows.content,
            headPagination: createPagination(res.rows),
          },
        });
      }
      return res;
    },
    // 锡膏/红胶查询明细列表
    *queryLineList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryLineList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            lineList: res.rows,
          },
        });
      }
      return res;
    },

    // 产线数据查询
    *queryProductLineList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryProductLineList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            proLineList: res.rows.content,
            proLinePagination: createPagination(res.rows),
          },
        });
      }
      return res;
    },
    // 锡膏/红胶管理——扫描条码
    *queryDataByCode({ payload }, { call }) {
      return getResponse(yield call(queryDataByCode, payload));
    },
    // 锡膏/红胶操作：确认、回温、待领用、领用、归还
    *operate({ payload }, { call, put }) {
      const res = getResponse(yield call(operate, payload));
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {
            mgrList: [],
            mgrPagination: false,
          },
        });
      }
      return res;
    },
    // 锡膏/红胶操作——接收
    *operateReceive({ payload }, { call, put }) {
      const res = getResponse(yield call(operate, payload));
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {
            mgrList: res.rows.dataList.content,
            mgrPagination: createPagination(res.rows.dataList),
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
