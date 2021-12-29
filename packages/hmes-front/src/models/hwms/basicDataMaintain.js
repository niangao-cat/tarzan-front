/**
 * 基础数据维护
 *@date：2019/10/21
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */

import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import { isEmpty } from 'lodash';
import {
  queryPreparingTime,
  queryPreparingList,
  queryDeliveryList,
  savePreparingData,
  saveDeliveryData,
  queryStrategyList,
  saveStrategyData,
  saveData,
  queryProdLineList,
  querySiteList,
} from '@/services/hwms/basicDataMaintainService';

export default {
  namespace: 'basicDataMaintain',
  state: {
    prepareList: [], // 备料时间列表
    prePagination: {}, // 备料时间分页器
    deliveryList: [], // 送料时间列表
    dePagination: {}, // 送料时间分页器
    strList: [], // 组件配送策略列表
    strPagination: {}, // 组件配送策略分页器
    enableFlagMap: [], // 有效性
    siteMap: [], // 工厂
    warehouseMap: [], // 仓库类型
    deliveryMethodMap: [], // 配送方式
    detail: {}, // 明细
    showPreDrawer: false, // 是否显示备料时间抽屉
    showDelDrawer: false, // 是否显示送料时间抽屉
    showStrDrawer: false, // 是否显示组件配送策略抽屉
    preparingLeadTime: '', // 备料提前期(min)
    prodLineIdList: [], // 合并规则—产线id
    prodLineCodeList: [], // 合并规则—产线code
  },
  effects: {
    // 查询独立值集
    *init({ payload }, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          enableFlagMap: 'Z.FLAG_YN',
          warehouseMap: 'Z_WAREHOUSE_TYPE',
          deliveryMethodMap: 'Z_DELIVERY_WAY',
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
    // 查询工厂下拉框
    *querySiteList(_, { call, put }) {
      const res = getResponse(yield call(querySiteList));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            siteMap: res.rows,
          },
        });
      }
    },
    // 查询备料提前期
    *queryPreparingTime(_, { call, put }) {
      const res = getResponse(yield call(queryPreparingTime));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            preparingLeadTime: res.rows,
          },
        });
      }
    },
    // 查询备料时间列表
    *queryPreparingList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryPreparingList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            prepareList: res.rows.content,
            prePagination: createPagination(res.rows),
          },
        });
      }
      return res;
    },
    // 保存备料时间数据
    *savePreparingData({ payload }, { call }) {
      return getResponse(yield call(savePreparingData, payload));
    },
    // 查询送料时间列表
    *queryDeliveryList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryDeliveryList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            deliveryList: res.rows.content,
            dePagination: createPagination(res.rows),
          },
        });
      }
      return res;
    },
    // 保存送料时间数据
    *saveDeliveryData({ payload }, { call }) {
      return getResponse(yield call(saveDeliveryData, payload));
    },
    // 查询组件配送策略列表
    *queryStrategyList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryStrategyList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            strList: res.rows.content,
            strPagination: createPagination(res.rows),
          },
        });
      }
      return res;
    },
    // 保存组件配送策略数据
    *saveStrategyData({ payload }, { call }) {
      return getResponse(yield call(saveStrategyData, payload));
    },
    // 保存合并规则数据
    *saveData({ payload }, { call }) {
      return getResponse(yield call(saveData, payload));
    },
    // 查询合并规则
    *queryProdLineList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryProdLineList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            prodLineIdList: isEmpty(res.rows.prodLineIdList) ? '' : res.rows.prodLineIdList,
            prodLineCodeList: isEmpty(res.rows.prodLineCodeList) ? '' : res.rows.prodLineCodeList,
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
