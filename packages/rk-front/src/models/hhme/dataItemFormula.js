/*
 * @Description: 设备点检&保养项目维护
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-06-10 11:10:03
 */
import { getResponse, createPagination, parseParameters } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  getSiteList,
  fetchHeadData,
  fetchLineData,
  saveHeadData,
  saveLineData,
  deleteLineData,
  deleteHeadData,
  getDataType,
  getCollectionMethod,
  updateHeadData,
  updateLineData,
} from '@/services/hhme/dataItemFormulaService';

export default {
  namespace: 'dataItemFormula',
  state: {
    headData: [], // 头数据
    headDataPagination: {}, // 头分页
    lineData: [], // 行数据
    lineDataPagination: {}, // 行分页
    detail: {}, // 抽屉明细
    defaultSite: {}, // 默认工厂
    dataTypeList: [], // 数据类型
    collectionMethodList: [], // 收集方式
  },
  effects: {
    // 批量查询独立值集
    *batchLovData(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          equipemntCategqry: 'HME.EQUIPMENT_CATEGORY', // 设备类别
          status: 'HME.EQUIPMENT_MANAGE_STATUS', // 状态
          checkCycle: 'HME.CHECK_CYCLE', // 点检周期
          maintainCycle: 'HME.MAINTAIN_CYCLE', // 保养周期
          maintainLeadtime: 'HME.MAINTAIN_LEADTIME', // 保养提前提醒期
          serviceLife: 'HME.SERVICE_LIFE', // 设备使用年限
          equipemntManageType: 'HME.EQUIPMENT_MANAGE_TYPE', // 设备管理类型
          equipemntManageCycle: 'HME.EQUIPMENT_MANAGE_CYCLE', // 周期
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
    // 获取头数据
    *fetchHeadData({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchHeadData, parseParameters(payload)));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            headData: res.content,
            headDataPagination: createPagination(res),
          },
        });
      }
      return res;
    },
    // 获取行数据
    *fetchLineData({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchLineData, parseParameters(payload)));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            lineData: res.content,
            lineDataPagination: createPagination(res),
          },
        });
      }
      return res;
    },
    // 保存头数据
    *saveHeadData({ payload }, { call }) {
      const res = getResponse(yield call(saveHeadData, payload));
      return res;
    },
     // 修改头数据
     *updateHeadData({ payload }, { call }) {
      const res = getResponse(yield call(updateHeadData, payload));
      return res;
    },
    // 保存行数据
    *saveLineData({ payload }, { call }) {
      const res = getResponse(yield call(saveLineData, payload));
      return res;
    },
    // 修改行数据
    *updateLineData({ payload }, { call }) {
      const res = getResponse(yield call(updateLineData, payload));
      return res;
    },
    // 删除行数据
    *deleteLineData({ payload }, { call }) {
      const res = getResponse(yield call(deleteLineData, payload));
      return res;
    },
    // 删除头
    *deleteHeadData({ payload }, { call }) {
      const res = getResponse(yield call(deleteHeadData, payload));
      return res;
    },
    // 获取数据类型
    *getDataType({ payload }, { call, put }) {
      const res = getResponse(yield call(getDataType, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            dataTypeList: res.rows,
          },
        });
      }
      return res;
    },
    // 收集方式
    *getCollectionMethod({ payload }, { call, put }) {
      const res = getResponse(yield call(getCollectionMethod, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            collectionMethodList: res.rows,
          },
        });
      }
      return res;
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
