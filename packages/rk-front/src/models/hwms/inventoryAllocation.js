/**
 * @Description: 库存调拨
 * @author: ywj
 * @version 1.0
 */
// 引入依赖
import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import { ergodicData } from '@/utils/utils';
import { isEmpty } from 'lodash';
import {
  fetchHeaderList,
  fetchLineList,
  fetchLineUpdateList,
  querySiteList,
  queryWarehouseList,
  queryLocatorList,
  deleteSelectedList,
  saveData,
  getSiteList,
  fetchDetailList,
  headStop,
  headStopCancel,
  headAudit,
  headCancel,
  headClose,
  headPrint,
  showQuantity,
  fetchCurrentRoleMap,
} from '@/services/hwms/inventoryAllocationService';

export default {
  namespace: 'inventoryAllocation',
  state: {
    headList: [], // 头信息
    headPaginationList: {}, // 头分页
    lineList: [], // 行信息
    linePaginationList: {}, // 行分页
    detailList: [], // 明显信息
    detailListPagination: {},
    lineCreateList: [], // 新建行信息
    lineCreatePaginationList: {}, // 新建行分页
    siteMap: [], // 站点
    statusMap: [], // 单据状态
    roleMap: [], // 角色编码
    statusListMap: [], // 限制取消的状态值集
    currentRoleMap: [], // 当前用户权限集
    materialVersionMap: [], // 物料版本
    typeMap: [], // 单据类型
    fromWarehouseMap: [], // 仓库
    fromLocatorMap: [], // 貨位
    toWarehouseMap: [], // 仓库
    toLocatorMap: [], // 貨位
    fromCreateWarehouseMap: [], // 仓库
    fromCreateLocatorMap: [], // 貨位
    toCreateWarehouseMap: [], // 仓库
    toCreateLocatorMap: [], // 貨位
    uomMap: [], // 单位
    executeMap: [],
    fromCreateTableWarehouseMap: [], // 仓库
    fromCreateTableLocatorMap: [], // 貨位
    toCreateTableWarehouseMap: [], // 仓库
    toCreateTableLocatorMap: [], // 貨位
    inspectHeadSelect: {}, // 头选中
    inspectLineUpdate: [], // 更新头信息
    inspectLineUpdatePagination: {}, // 更新头信息
  },
  effects: {
    // 查询头信息
    *fetchHeaderList({ payload }, { call, put }) {
      const res = yield call(fetchHeaderList, payload);
      const list = getResponse(res);
      // 成功时，更改状态
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            headList: list.content,
            headPaginationList: createPagination(list),
          },
        });
      }
      return list;
    },
    // 查询行信息
    *fetchLineList({ payload }, { call, put }) {
      const res = yield call(fetchLineList, payload);
      const list = getResponse(res);
      // 成功时，更改状态
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            lineList: list.content,
            linePaginationList: createPagination(list),
          },
        });
      }
    },
    // 查询行信息
    *fetchLineUpdateList({ payload }, { call, put }) {
      const res = yield call(fetchLineUpdateList, payload);
      const list = getResponse(res);
      // 成功时，更改状态
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            inspectLineUpdate: res,
          },
        });
      };
      return list;
    },

    // 查询明细信息
    *fetchDetailList({ payload }, { call, put }) {
      const res = yield call(fetchDetailList, payload);
      const list = getResponse(res);
      // 成功时，更改状态
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            detailList: list.content,
            detailListPagination: createPagination(list),
          },
        });
      }
    },

    // 查询行信息
    *fetchLineCreateList({ payload }, { call, put }) {
      const res = yield call(fetchLineUpdateList, payload);
      const list = getResponse(res);
      // 成功时，更改状态
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            lineCreateList: res,
          },
        });
      }
    },

    // 初始化 状态下拉框
    *init(_, { call, put }) {
      const res = yield call(queryMapIdpValue, {
        statusMap: 'WMS.STOCK_ALLOCATION_DOC.STATUS',
        typeMap: 'WMS.STOCK_ALLOCATION_DOC.TYPE',
        uomMap: 'MT.UOM',
        materialVersionMap: 'HCM.MATERIAL_VERSION',
        executeMap: 'WMS.EXCESS_SETTING',
        roleMap: 'WMS.STOCK_ALLOCATION_DOC_CANCEL_LIMIT',
        statusListMap: "WMS.STOCK_ALLOCATION_DOC_CANCEL_STATUS",
      });
      // 成功时，更改状态
      yield put({
        type: 'updateState',
        payload: {
          ...res,
        },
      });
    },
    // 查询工厂下拉框
    *querySiteList({ payload }, { call, put }) {
      const res = getResponse(yield call(querySiteList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            siteMap: res,
          },
        });
      }
    },
    // 查询仓库下拉框
    *queryWarehouseList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryWarehouseList, payload));
      if (res) {
        if (isEmpty(payload.fromWarehouseGlag) && isEmpty(payload.toWarehouseGlag)) {
          yield put({
            type: 'updateState',
            payload: {
              fromWarehouseMap: res,
              toWarehouseMap: res,
            },
          });
        } else if (isEmpty(payload.fromWarehouseGlag)) {
          yield put({
            type: 'updateState',
            payload: {
              toWarehouseMap: res,
            },
          });
        } else {
          yield put({
            type: 'updateState',
            payload: {
              fromWarehouseMap: res,
            },
          });
        }
      }
    },
    // 查询貨位下拉框
    *queryLocatorList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryLocatorList, payload));
      if (res) {
        if (isEmpty(payload.fromLocatorGlag) && isEmpty(payload.toLocatorGlag)) {
          yield put({
            type: 'updateState',
            payload: {
              fromLocatorMap: res,
              toLocatorMap: res,
            },
          });
        } else if (isEmpty(payload.fromLocatorGlag)) {
          yield put({
            type: 'updateState',
            payload: {
              toLocatorMap: res,
            },
          });
        } else {
          yield put({
            type: 'updateState',
            payload: {
              fromLocatorMap: res,
            },
          });
        }
      }
    },

    // 查询仓库下拉框
    *queryCreateWarehouseList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryWarehouseList, payload));
      if (res) {
        if (isEmpty(payload.fromWarehouseGlag) && isEmpty(payload.toWarehouseGlag)) {
          yield put({
            type: 'updateState',
            payload: {
              fromCreateWarehouseMap: res,
              toCreateWarehouseMap: res,
              fromCreateTableWarehouseMap: res,
              toCreateTableWarehouseMap: res,
            },
          });
        } else if (isEmpty(payload.fromWarehouseGlag)) {
          yield put({
            type: 'updateState',
            payload: {
              toCreateWarehouseMap: res,
              toCreateTableWarehouseMap: res,
            },
          });
        } else {
          yield put({
            type: 'updateState',
            payload: {
              fromCreateWarehouseMap: res,
              fromCreateTableWarehouseMap: res,
            },
          });
        }
      }
    },
    // 查询貨位下拉框
    *queryCreateLocatorList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryLocatorList, payload));
      if (res) {
        if (isEmpty(payload.fromLocatorGlag) && isEmpty(payload.toLocatorGlag)) {
          yield put({
            type: 'updateState',
            payload: {
              fromCreateLocatorMap: res,
              toCreateLocatorMap: res,
              fromCreateTableLocatorMap: res,
              toCreateTableLocatorMap: res,
            },
          });
        } else if (isEmpty(payload.fromLocatorGlag)) {
          yield put({
            type: 'updateState',
            payload: {
              toCreateLocatorMap: res,
              toCreateTableLocatorMap: res,
            },
          });
        } else {
          yield put({
            type: 'updateState',
            payload: {
              fromCreateLocatorMap: res,
              fromCreateTableLocatorMap: res,
            },
          });
        }
      }
    },

    // 查询仓库下拉框
    *queryCreateTableWarehouseList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryWarehouseList, payload));
      if (res) {
        if (isEmpty(payload.fromWarehouseGlag) && isEmpty(payload.toWarehouseGlag)) {
          yield put({
            type: 'updateState',
            payload: {
              fromCreateTableWarehouseMap: res,
              toCreateTableWarehouseMap: res,
            },
          });
        } else if (isEmpty(payload.fromWarehouseGlag)) {
          yield put({
            type: 'updateState',
            payload: {
              toCreateTableWarehouseMap: res,
            },
          });
        } else {
          yield put({
            type: 'updateState',
            payload: {
              fromCreateTableWarehouseMap: res,
            },
          });
        }
      }
    },

    // 查询仓库下拉框
    *selectWarehouseList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryWarehouseList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            fromWarehouseMap: res,
            toWarehouseMap: res,
          },
        });
      }
    },

    // 查询貨位下拉框
    *queryCreateTableLocatorList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryLocatorList, payload));
      if (res) {
        if (isEmpty(payload.fromLocatorGlag) && isEmpty(payload.toLocatorGlag)) {
          yield put({
            type: 'updateState',
            payload: {
              fromCreateTableLocatorMap: res,
              toCreateTableLocatorMap: res,
            },
          });
        } else if (isEmpty(payload.fromLocatorGlag)) {
          yield put({
            type: 'updateState',
            payload: {
              toCreateTableLocatorMap: res,
            },
          });
        } else {
          yield put({
            type: 'updateState',
            payload: {
              fromCreateTableLocatorMap: res,
            },
          });
        }
      }
    },

    // 删除消息
    *deleteSelectedList({ payload }, { call }) {
      const result = yield call(deleteSelectedList, ergodicData(payload));
      return getResponse(result);
    },
    // 保存消息
    *saveData({ payload }, { call }) {
      const result = yield call(saveData, ergodicData(payload));
      return getResponse(result);
    },
    // 获取默认工厂
    *getSiteList({ payload }, { call }) {
      const result = getResponse(yield call(getSiteList, payload));
      return result;
    },
    // 暂停
    *headStop({ payload }, { call }) {
      const result = getResponse(yield call(headStop, payload));
      return result;
    },
    // 暂停取消
    *headStopCancel({ payload }, { call }) {
      const result = getResponse(yield call(headStopCancel, payload));
      return result;
    },
    // 审核
    *headAudit({ payload }, { call }) {
      const result = getResponse(yield call(headAudit, payload));
      return result;
    },
    // 取消
    *headCancel({ payload }, { call }) {
      const result = getResponse(yield call(headCancel, payload));
      return result;
    },
    *headClose({ payload }, { call }) {
      const result = yield call(headClose, payload);
      return result;
    },
    // 头打印
    *headPrint({ payload }, { call }) {
      const res = getResponse(yield call(headPrint, payload));
      return res;
    },
     // 查询库存
     *showQuantity({ payload }, { call }) {
      const res = getResponse(yield call(showQuantity, payload));
      return res;
    },
    *fetchCurrentRoleMap({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchCurrentRoleMap, payload));
      yield put({
        type: 'updateState',
        payload: {
          currentRoleMap: res.content,
        },
      });
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
