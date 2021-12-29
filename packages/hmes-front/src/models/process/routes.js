/**
 * @date 2019-8-1
 * @author TJX <jiaxu.tang@hand-china.com>
 */

import { getResponse, createPagination } from 'utils/utils';
import { get as chainget } from 'lodash';
import {
  fetchRouteList,
  saveRoutesList,
  copyRoutesList,
  removeRoutesList,
  // fetchSelectOption,
  fetchStatusOption,
  fetchRoutesItemDetails,
  fetchRoutesItemStep,
  fetchRoutesItemSite,
  fetchStepOption,
  // fetchStepDecisionOption,
  saveTableAttrList,
  fetchOperationDetails,
  confirmRoutesList,
} from '@/services/process/routesService';
import { fetchAttributeList, saveAttribute } from '@/services/api';
import { ergodicData } from '@/utils/utils';
import uuid from 'uuid/v4';

export default {
  namespace: 'routes',
  state: {
    routesList: [], // 工艺路线列表
    oldBomId: '', // 旧的装配清单
    routesListPagination: {}, // 工艺路线列表分页
    typeList: [], // 工艺路线类型
    statusList: [], // 工艺路线状态
    tabAttrList: [], // 扩展字段列表
    stepTypeList: [], // 表格步骤类型列表
    stepGroupTypeList: [], // 类型设置: 步骤组  抽屉  步骤组类型下拉
    stepDecisionList: [], // 表格路径选择策略列表
    nextStepDecisionList: [], // 下一步骤设置 表格选择策略列表
    returnTypeList: [], // 返回步骤下拉
    routesItem: {}, // 详情
    stepsList: [], // 工艺步骤列表
    sitesList: [], // 站点分配列表
    tabbleAttrList: [], // 表格扩展字段

    selectedRouterType: '', // 选中的路线类型，用与判断工艺步骤表格返回步骤策略是否可编辑,  为'SPECIAL', 'NC'可以编辑
  },
  effects: {
    // 获取工艺路线列表数据
    *fetchRouteList({ payload }, { call, put }) {
      const res = yield call(fetchRouteList, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            routesList: chainget(res, 'rows.content', []),
            routesListPagination: createPagination(res.rows),
          },
        });
      }
      return res;
    },
    // 保存工艺路线列表
    *saveRoutesList({ payload }, { call }) {
      const result = yield call(saveRoutesList, payload);
      return result;
    },

    // 保存工艺路线列表验证
    *confirmRoutesList({ payload }, { call }) {
      const result = yield call(confirmRoutesList, payload);
      return result;
    },
    // 复制工艺路线列表
    *copyRoutesList({ payload }, { call }) {
      const result = yield call(copyRoutesList, ergodicData(payload));
      return result;
    },
    // 删除工艺路线列表
    *removeRoutesList({ payload }, { call }) {
      const result = yield call(removeRoutesList, payload);
      return result;
    },
    // 获取类型下拉
    *fetchSelectOption({ payload }, { call, put }) {
      const res = yield call(fetchStepOption, payload);
      yield put({
        type: 'updateState',
        payload: {
          typeList: chainget(res, 'rows', []),
        },
      });
      return res;
    },
    // 获取状态下拉
    *fetchStatusOption({ payload }, { call, put }) {
      const res = yield call(fetchStatusOption, payload);
      yield put({
        type: 'updateState',
        payload: {
          statusList: chainget(res, 'rows', []),
        },
      });
      return res;
    },
    // 步骤类型
    *fetchStepOption({ payload }, { call, put }) {
      const res = yield call(fetchStepOption, payload);
      yield put({
        type: 'updateState',
        payload: {
          stepTypeList: chainget(res, 'rows', []),
        },
      });
      return res;
    },
    // 步骤组类型
    *fetchStepGroupOption({ payload }, { call, put }) {
      const res = yield call(fetchStepOption, payload);
      yield put({
        type: 'updateState',
        payload: {
          stepGroupTypeList: chainget(res, 'rows', []),
        },
      });
      return res;
    },
    // 路径选中策略
    *fetchStepDecisionOption({ payload }, { call, put }) {
      const res = yield call(fetchStepOption, payload);
      yield put({
        type: 'updateState',
        payload: {
          stepDecisionList: chainget(res, 'rows', []),
        },
      });
      return res;
    },
    // 下一步骤设置 选择策略下拉
    *fetchNextStepDecisionOption({ payload }, { call, put }) {
      const res = yield call(fetchStepOption, payload);
      yield put({
        type: 'updateState',
        payload: {
          nextStepDecisionList: chainget(res, 'rows', []),
        },
      });
      return res;
    },
    // 返回步骤下拉
    *fetchReturnStepsOption({ payload }, { call, put }) {
      const res = yield call(fetchStepOption, payload);
      yield put({
        type: 'updateState',
        payload: {
          returnTypeList: chainget(res, 'rows', []),
        },
      });
      return res;
    },
    // 站点类型 用于 code->description
    *fetchSiteTypeOption({ payload }, { call, put }) {
      const res = yield call(fetchStepOption, payload);
      yield put({
        type: 'updateState',
        payload: {
          siteTypeList: chainget(res, 'rows', []),
        },
      });
      return res;
    },
    // 获取扩展字段属性
    *featchAttrList({ payload }, { call, put }) {
      const res = yield call(fetchAttributeList, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            tabAttrList: chainget(res, 'rows', []),
          },
        });
      }
      return res;
    },
    // 保存扩展字段属性
    *saveAttrList({ payload }, { call }) {
      const result = yield call(saveAttribute, ergodicData(payload));
      return result;
    },
    // 获取工艺路线明细信息
    *fetchRoutesItemDetails({ payload }, { call, put }) {
      const res = yield call(fetchRoutesItemDetails, payload);
      if (res && res.success) {
        yield put({
          type: 'updateState',
          payload: {
            routesItem: { ...chainget(res, 'rows', {}) },
            selectedRouterType: chainget(res, 'rows.routerType', ''),
          },
        });
      }
      return res;
    },
    // 获取工艺路线明细步骤
    *fetchRoutesItemStep({ payload }, { call, put }) {
      const res = yield call(fetchRoutesItemStep, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            stepsList: [],
          },
        });
        const newStepsList = chainget(list, 'rows', []).map(item => {
          return {
            ...item,
            uuid: uuid(),
          };
        });
        yield put({
          type: 'updateState',
          payload: {
            // stepsList: chainget(list, 'rows', []),
            stepsList: newStepsList,
          },
        });
      }
      return list;
    },
    // 获取工艺路线明细站点分配
    *fetchRoutesItemSite({ payload }, { call, put }) {
      const res = yield call(fetchRoutesItemSite, payload);
      if (res && res.success) {
        const newSitesList = chainget(res, 'rows', []).map(item => {
          return {
            ...item,
            uuid: uuid(),
          };
        });
        yield put({
          type: 'updateState',
          payload: {
            sitesList: newSitesList,
          },
        });
      }
      return res;
    },
    // 获取工艺步骤表格内的扩展字段
    *featchTableAttrList({ payload }, { call, put }) {
      const res = yield call(fetchAttributeList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            tabbleAttrList: chainget(list, 'rows', []),
          },
        });
      }
      return list;
    },
    // 保存工艺步骤表格内的扩展字段
    *saveTableAttrList({ payload }, { call }) {
      const result = yield call(saveTableAttrList, ergodicData(payload));
      return getResponse(result);
    },
    // 获取工艺详细信息
    *fetchOperationDetails({ payload }, { call }) {
      const result = yield call(fetchOperationDetails, payload);
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
    clear() {
      return {
        routesList: [], // 工艺路线列表
        routesListPagination: {}, // 工艺路线列表分页
        typeList: [], // 工艺路线类型
        statusList: [], // 工艺路线状态
        tabAttrList: [], // 扩展字段列表
        stepTypeList: [], // 表格步骤类型列表
        stepGroupTypeList: [], // 类型设置: 步骤组  抽屉  步骤组类型下拉
        stepDecisionList: [], // 表格路径选择策略列表
        nextStepDecisionList: [], // 下一步骤设置 表格选择策略列表
        returnTypeList: [], // 返回步骤下拉
        routesItem: {}, // 详情
        stepsList: [], // 工艺步骤列表
        sitesList: [], // 站点分配列表
        tabbleAttrList: [], // 表格扩展字段
        selectedRouterType: '', // 选中的路线类型，用与判断工艺步骤表格返回步骤策略是否可编辑,  为'SPECIAL', 'NC'不可以编辑
      };
    },
  },
};
