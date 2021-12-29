/*
 * @Description: 领退料平台
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-05-28 18:47:44
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-11-05 10:54:46
 * @Copyright: Copyright (c) 2019 Hand
 */

import { getResponse, createPagination} from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  queryHeadList,
  queryLineList,
  queryLineDetailList,
  querySiteList,
  closeInstruction,
  saveHeadData,
  saveLineData,
  saveData,
  queryLocatorList,
  queryStorageList,
  fetchHeadAndLineDetail,
  onDeleteLine,
  printBarCode,
  deliverCreateBarcodeData,
  printingBarcode,
  headPrint,
  showQuantity,
} from '@/services/hwms/requisitionAndReturnService';

export default {
  namespace: 'requisitionAndReturn',
  state: {
    headList: [],
    headPagination: {},
    lineList: [],
    linePagination: {},
    detailList: [],
    detailPagination: {},
    statusMap: [], // 单据状态
    docTypeMap: [], // 单据类型
    siteMap: [], // 工厂
    mtLotStatusMap: [], // 条码状态
    returnQcFlagMap: [], // 退料质量状态
    executeMap: [], // 超发下拉框
    list: [], // 新建页面的table数据源
    pagination: {}, // 新建页面的table分页
    headDetail: {}, // 新建页面的头明细
    version: [], // 版本
    locatorList: [], // 仓库下拉
    storageList: [], // 货位下拉
    returnList: {}, // 创建返回值
    headAndLine: {}, // 头行一起查询
    barCodeList: [],
    barCodePagination: {},
  },
  effects: {
    // 查询独立值集
    *init({ payload }, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          statusMap: 'WMS.COST_CENTER_DOCUMENT.STATUS',
          // docTypeMap: 'Z_RP_DOC_TYPE',
          mtLotStatusMap: 'Z.MTLOT.STATUS.G',
          returnQcFlagMap: 'Z_RETURN_QC',
          version: 'HCM.MATERIAL_VERSION',
          docTypeMap: 'WMS.COST_CENTER_DOCUMENT.TYPE',
          tenantId: payload.tenantId,
          status: 'WMS.COST_CENTER_DOCUMENT.STATUS',
          accountsType: 'WMS.CC_SETTLE_ACCOUNTS.TYPE',
          executeMap: 'WMS.EXCESS_SETTING',
          orderTypes: 'WMS.INTERNAL_ORDER_TYPE',
          freeTypeOne: 'WMS.CCA_REQUISITION_MOVE_TYPE', // 费用类型一
          freeTypeTwo: 'WMS.CCA_RETURN_MOVE_TYPE', // 费用类型二
          costcenterType: 'WMS.COSTCENTER_TYPE', // 成本中心类型
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
            siteMap: res,
          },
        });
      }
    },
    // 查询头列表
    *queryHeadList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryHeadList, payload));
      if (res) {
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
    // 查询行列表
    *queryLineList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryLineList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            lineList: res.content,
            linePagination: createPagination(res),
          },
        });
      }
      return res;
    },

    // 查询行明细列表
    *queryLineDetailList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryLineDetailList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            detailList: res.content,
            detailPagination: createPagination(res),
          },
        });
      }
      return res;
    },
    // 单据取消
    *closeInstruction({ payload }, { call }) {
      return getResponse(yield call(closeInstruction, payload));
    },
    // 保存领退料单头
    *saveHeadData({ payload }, { call, put }) {
      const res = getResponse(yield call(saveHeadData, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            headDetail: res,
          },
        });
      }
      return res;
    },
    // 保存领退料单行
    *saveLineData({ payload }, { call }) {
      return getResponse(yield call(saveLineData, payload));
    },

    // 查询新建页面行列表
    *queryCreateLineList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryLineList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            list: res.content,
            pagination: createPagination(res),
          },
        });
      }
      return res;
    },
    *saveData({ payload }, { call, put }) {
      const res = getResponse(yield call(saveData, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            returnList: res.mtInstructionDoc,
            // list: res.rows.mtInstructionVO6s,
            // pagination: createPagination(res.rows),
          },
        });
      }
      return res;
    },
    // 仓库下拉
    *queryStorageList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryStorageList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            storageList: res.content,
          },
        });
      }
      return res;
    },
    // 货位下拉
    *queryLocatorList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryLocatorList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            locatorList: res.content,
          },
        });
      }
      return res;
    },
    // 头行数据一起查询
    *fetchHeadAndLineDetail({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchHeadAndLineDetail, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            headAndLine: res,
            list: res.lineVOs.content,
          },
        });
      }
      return res;
    },
    // 删除行数据
    *onDeleteLine({ payload }, { call }) {
      const res = getResponse(yield call(onDeleteLine, payload));
      return res;
    },
    // 条码打印
    *printBarCode({ payload }, { call }) {
      const res = getResponse(yield call(printBarCode, payload));
      return res;
    },

    // 新增条码创建
    *deliverCreateBarcodeData({ payload }, { call, put }) {
      const res = yield call(deliverCreateBarcodeData, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            barCodeList: list,
          },
        });
      }
      return list;
    },

    // 新增条码打印
    *printingBarcode({ payload }, { call }) {
      const result = getResponse(yield call(printingBarcode, payload));
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
