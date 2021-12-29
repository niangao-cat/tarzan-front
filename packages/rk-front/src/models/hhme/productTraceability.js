/**
 * productTraceability - models
 * @date: 2020/03/16 15:45:10
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import { getResponse, parseParameters, createPagination } from 'utils/utils';
import {
  fetchWorkcellList,
  fetchWorkcellDetail,
  fetchProductComponent,
  fetchEquipment,
  fetchException,
  fetchNcList,
  fetchReverse,
  printSnReportCheck,
  printSnReport,
  fetchDetail,
  fetchPumpList,
} from '@/services/hhme/productTraceabilityService';

export default {
  namespace: 'productTraceability',
  state: {
    treeSelectedKeys: [], // 选中的节点
    productComponentList: [], // 树形数据
    ncList: [], // 不良信息
    processTransferList: [],
    equipmentList: [], // 设备列表
    itemList: [],
    processQualityList: [],
    errorList: [], // 异常信息
    reverseist: [],
    reverseistPagination: {},
    detailList: [],
    pumpInfo: {},
    pumpList: [],
  },
  effects: {
    *fetchWorkcellList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchWorkcellList, payload));
      if (res) {
        // 变色显示
        let record = '0';
        let flag = true;
        if (res && res.length > 0) {
          for (let i = 0; i < res.length; i++) {
            if (i === 0) {
              record = res[i].eoId;
              res[i].colorFlag = flag;
            } else if (res[i].eoId === record) {
              res[i].colorFlag = flag;
            } else {
              record = res[i].eoId;
              flag = !flag;
              res[i].colorFlag = flag;
            }
          }
        }
        yield put({
          type: 'updateState',
          payload: {
            processTransferList: res,
          },
        });
      }
    },
    *fetchWorkcellDetail({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchWorkcellDetail, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            itemList: res.materialList,
            processQualityList: res.jobDataList,
          },
        });
      }
    },
    // 查询产品组件
    *fetchProductComponent({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchProductComponent, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            productComponentList: res,
          },
        });
      }
      return res;
    },
    // 查询树展开节点下层
    *queryTreeChildred({ payload }, { call }) {
      const res = yield call(fetchProductComponent, payload);
      return getResponse(res);
    },
    // 设备查询
    *fetchEquipment({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchEquipment, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            equipmentList: res,
          },
        });
      }
      return res;
    },
    // 获取异常信息
    *fetchException({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchException, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            errorList: res,
          },
        });
      }
      return res;
    },
    // 查询不良信息
    *fetchNcList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchNcList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            ncList: res,
          },
        });
      }
      return res;
    },
    // 逆向追溯查询
    *fetchReverse({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchReverse, parseParameters(payload)));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            reverseist: res.content,
            reverseistPagination: createPagination(res),
          },
        });
      }
      return res;
    },

    // 打印报告校验
    *printSnReportCheck({ payload }, { call }) {
      const res = yield call(printSnReportCheck, payload);
      return getResponse(res);
    },

    // 打印报告
    *printSnReport({ payload }, { call }) {
      const res = yield call(printSnReport, payload);
      return getResponse(res);
    },

    // 查询列表
    *fetchDetail({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchDetail, parseParameters(payload)));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            detailList: res,
          },
        });
      }
    },
    *fetchPumpList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchPumpList, payload));
      if (res) {
        const { hmePumpingSourceVOList, ...otherParams } = res;
        yield put({
          type: 'updateState',
          payload: {
            pumpList: hmePumpingSourceVOList,
            pumpInfo: otherParams,
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
