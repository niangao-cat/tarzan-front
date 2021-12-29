/**
 * @date 2019-7-29
 * @author HDY <deying.huang@hand-china.com>
 */

import { getResponse, createPagination } from 'utils/utils';
import { ergodicData } from '@/utils/utils';
import { queryMapIdpValue } from 'services/api';

import {
  queryList,
  freezeOrThaw,
  querySiteList,
  queryWarehouseList,
  queryLocatorList,
} from '@/services/hwms/freezeThawService';

export default {
  namespace: 'freezeThaw',
  state: {
    messageList: [], // 消息表格数据源
    messagePagination: {}, // 消息表格分页
    siteMap: [], // 工厂
    warehouseMap: [], // 仓库
    locatorMap: [], // 貨位
    materialVersionMap: [], // 物料版本
    lotStatusMap: [], // 状态
    qualityStatusMap: [], // 质量状态
  },
  effects: {
    // 查询工厂下拉框
    *querySiteList(_, { call, put }) {
      const res = getResponse(yield call(querySiteList));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            siteMap: res,
          },
        });
      }
    },

    // 查询仓库
    *queryWarehouseList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryWarehouseList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            warehouseMap: res,
          },
        });
      }
    },

    // 查询貨位下拉框
    *queryLocatorList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryLocatorList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            locatorMap: res,
          },
        });
      }
    },

    // 初始化 状态下拉框
    *init(_, { call, put }) {
      const res = yield call(queryMapIdpValue, {
        materialVersionMap: 'HCM.MATERIAL_VERSION',
        lotStatusMap: 'MT.MTLOT.STATUS',
        qualityStatusMap: 'MT.MTLOT.QUALITY_STATUS',
      });
      // 成功时，更改状态
      yield put({
        type: 'updateState',
        payload: {
          ...res,
        },
      });
    },

    // 获取数据源列表数据
    *queryList({ payload }, { call, put }) {
      const res = yield call(queryList, payload);
      const list = getResponse(res);

      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            messageList: list.content,
            messagePagination: createPagination(list),
          },
        });
      }
      return list;
    },

    // 冻结
    *freezeOrThaw({ payload }, { call }) {
      const result = yield call(freezeOrThaw, ergodicData(payload));
      return getResponse(result);
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
