/*
 * @Description: 设备台账管理
 * @version: 0.0.1
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-06-04 11:12:56
 */
import { getResponse, createPagination, parseParameters } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  fetchDeviceList,
  fetchDeviceDetail,
  handleSave,
  getSiteList,
  stationChangeHistory,
  searchHistory,
  printingBarcode,
  printingCheck,
  creatingDoc,
  fetchList,
  fetchDepartment,
} from '@/services/hhme/equipmentLedgerManagementService';

export default {
  namespace: 'equipmentLedgerManagement',
  state: {
    deviceList: [], // 台账列表
    pagination: {},
    deviceDetail: {}, // 台账明细
    defaultSite: {},
    stationChangeHistoryList: [], // 工位变更历史
    stationChangeHistoryListPagination: {},
    search: {}, // 查询数据
    ledgerType: [],
    historyList: [],
    historypagination: {},
    departmentList: [], // 默认部门
    // stocktakeTypeList: [],
    // stocktakeStatusList: [],
  },
  effects: {
    // 批量查询独立值集
    *batchLovData(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          assetClass: 'HME.ASSET_CLASS', // 资产类别
          equipmentCategory: 'HME.EQUIPMENT_CATEGORY', // 设备类别
          equipmentType: 'HME.EQUIPEMNT_TYPE', // 设备类型
          applyType: 'HME.APPLY_TYPE', // 应用类型
          equipmentStatus: 'HME.EQUIPMENT_STATUS', // 设备状态
          useFrequency: 'HME.USE_FREQUENCY', // 使用频次
          belongTo: 'HME.BELONG_TO', // 归属权
          equipmentManageModel: 'HME.EQUIPMENT_MANAGE_MODEL',
          ledgerType: 'HME.LEDGER_TYPE',
          managementModeList: 'HME.EQUIPMENT_MANAGE_MODEL',
          applyTypeList: 'HME.APPLY_TYPE',
          currency: 'HME.CURRENCY',
          stocktakeTypeList: 'HME_STOCKTAKE_TYPE',
          stocktakeStatusList: 'HME_STOCKTAKE_STATUS',
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
    *fetchDeviceList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchDeviceList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            deviceList: res.content,
            pagination: createPagination(res),
          },
        });
      }
      return res;
    },
    *searchHistory({ payload }, { call, put }) {
      const res = getResponse(yield call(searchHistory, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            historyList: res.content,
            historypagination: createPagination(res),
          },
        });
      }
      return res;
    },
    *fetchDeviceDetail({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchDeviceDetail, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            deviceDetail: res,
          },
        });
      }
      return res;
    },
    *handleSave({ payload }, { call }) {
      const res = getResponse(yield call(handleSave, payload));
      return res;
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
    *fetchDepartment({ payload }, { put, call }) {
      const res = yield call(fetchDepartment, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            departmentList: list,
          },
        });
      }
      return list;
    },
    // 获取工位变更历史
    *stationChangeHistory({ payload }, { call, put }) {
      const result = getResponse(yield call(stationChangeHistory, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            stationChangeHistoryList: result.content,
            stationChangeHistoryListPagination: createPagination(result),
          },
        });
      }
      return result;
    },
    // 打印校验
    *printingCheck({ payload }, { call }) {
      const result = getResponse(yield call(printingCheck, payload));
      return result;
    },
    // 打印
    *printingBarcode({ payload }, { call }) {
      const result = getResponse(yield call(printingBarcode, payload));
      return result;
    },
    // 设备盘点 创建单据
    *creatingDoc({ payload }, { call }) {
      const res = getResponse(yield call(creatingDoc, payload));
      return res;
    },
    *fetchList({ payload }, { call }) {
      const res = getResponse(yield call(fetchList, payload));
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
