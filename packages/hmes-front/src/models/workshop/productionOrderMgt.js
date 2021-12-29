/**
 * @date 2019-12-17
 * @author 许碧婷 <biting.xu@hand-china.com>
 */
import { get as chainGet } from 'lodash';
import { getResponse, createPagination } from 'utils/utils';
import { ergodicData } from '@/utils/utils';
import {
  fetchStatueSelectList,
  fetchSelectList,
  saveAttribute,
  fetchAttributeList,
} from '@/services/api';
import {
  fetchProductionList,
  fetchProductionDetail,
  fetchEoList,
  postProductionStatus,
  saveProductionDetailForm,
  fetchProductionRelList,
  fetchEoCreateDetail,
  saveEoCreateForm,
  saveWoSplitForm,
  saveWoMergeForm,
  fetchProcessRouteList,
  fetchSubStepList,
  fetchAssemblyList,
  fetchChildrenAssemblyList,
  fetchBomSplit,
} from '../../services/workshop/productionOrderMgtService';

export default {
  namespace: 'productionOrderMgt',
  state: {
    workOrderList: [],
    workOrderDetail: {},
    workOrderTypeOptions: [],
    workOrderStatusOptions: [],
    completeOptions: [], // 完工限制类型
    productionList: [],
    productionPagination: {},
    eoList: [], // eo
    eoPagination: {}, // eo分页
    eoStatusOptions: [], // eo状态
    eoTypeOptions: [], // eo类型
    productionRelList: [], // 生产指令关系
    prodRelPagination: {}, // 生产指令关系分页
    prodRelOptions: [], // wo关系
    prodRelTypeOptions: [], // wo关系类型
    eoCreateDetail: {}, // eo类型
    tabAttributeList: [], // 扩展字段
    processRouteList: [], // 工艺路线
    processRoutePagination: {}, // 工艺路线分页
    expandedRowList: [], // 工艺路线扩展
    assemblyList: [], // 装配清单
    assemblyPagination: {},
    childrenAssemblyList: [], // 装配子行
    controlTypeOptions: [], // 完工限制类型
    expandedRowKeysArray: [], // 展开行assembly
    searchState: {}, // 存储搜索状态
    substitutePolicy: [], // 替代策略
  },
  effects: {
    *fetchProductionList({ payload }, { call, put }) {
      const res = yield call(fetchProductionList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            productionList: chainGet(list, 'rows.content', []),
            productionPagination: createPagination(chainGet(list, 'rows', {})),
          },
        });
      }
      return list;
    },
    *fetchChildrenAssemblyList({ payload }, { call }) {
      const res = yield call(fetchChildrenAssemblyList, payload);
      return getResponse(res);
    },
    *fetchBomSplit({ payload }, { call }) {
      const res = yield call(fetchBomSplit, payload);
      return getResponse(res);
    },
    *fetchAssemblyList({ payload }, { call, put }) {
      const res = yield call(fetchAssemblyList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            assemblyList: chainGet(list, 'rows.content', []),
            assemblyPagination: createPagination(chainGet(list, 'rows', {})),
          },
        });
      }
    },
    *fetchProcessRouteList({ payload }, { call, put }) {
      // process route
      const res = yield call(fetchProcessRouteList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            processRouteList: chainGet(list, 'rows.content', []),
            processRoutePagination: createPagination(chainGet(list, 'rows', {})),
            expandedRowList: [],
          },
        });
      }
      return list;
    },
    *fetchEoList({ payload }, { call, put }) {
      const res = yield call(fetchEoList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            eoList: chainGet(list, 'rows.content', []),
            eoPagination: createPagination(chainGet(list, 'rows', {})),
          },
        });
      }
      return list;
    },
    *fetchStatusSelectList({ payload }, { call, put }) {
      const res = yield call(fetchStatueSelectList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            [payload.type]: chainGet(list, 'rows', []),
          },
        });
      }
      return list;
    },
    *fetchTypeSelectList({ payload }, { call, put }) {
      const res = yield call(fetchSelectList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            [payload.type]: chainGet(list, 'rows', []),
          },
        });
      }
      return list;
    },
    *fetchProductionDetail({ payload }, { call, put }) {
      const res = yield call(fetchProductionDetail, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            workOrderDetail: chainGet(list, 'rows', []),
          },
        });
      }
      return list;
    },
    *postProductionStatus({ payload }, { call }) {
      const res = yield call(postProductionStatus, payload);
      return getResponse(res);
    },
    *saveWoSplitForm({ payload }, { call }) {
      const res = yield call(saveWoSplitForm, payload);
      return getResponse(res);
    },
    *saveProductionDetailForm({ payload }, { call }) {
      const res = yield call(saveProductionDetailForm, payload);
      return getResponse(res);
    },
    *saveEoCreateForm({ payload }, { call }) {
      const res = yield call(saveEoCreateForm, payload);
      return getResponse(res);
    },
    *saveWoMergeForm({ payload }, { call }) {
      const res = yield call(saveWoMergeForm, payload);
      return getResponse(res);
    },
    *fetchAttributeList({ payload }, { call, put }) {
      const res = yield call(fetchAttributeList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            tabAttributeList: chainGet(list, 'rows', []),
          },
        });
      }
      return list;
    },
    *saveAttribute({ payload }, { call }) {
      const result = yield call(saveAttribute, ergodicData(payload));
      return getResponse(result);
    },
    *fetchProductionRelList({ payload }, { call, put }) {
      const res = yield call(fetchProductionRelList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            productionRelList: chainGet(list, 'rows.content', []),
            prodRelPagination: createPagination(chainGet(list, 'rows', {})),
          },
        });
      }
      return list;
    },
    *fetchSubStepList({ payload }, { call }) {
      const res = yield call(fetchSubStepList, payload);
      return getResponse(res);
    },
    *fetchEoCreateDetail({ payload }, { call, put }) {
      const res = yield call(fetchEoCreateDetail, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            eoCreateDetail: chainGet(list, 'rows', {}),
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
    clear(state) {
      return {
        ...state,
        workOrderDetail: {},
        processRouteList: [], // 工艺路线
        processRoutePagination: {}, // 工艺路线分页
        assemblyList: [], // 装配清单
        assemblyPagination: {}, // 装配分页
        childrenAssemblyList: [], // 装配子行
        eoList: [], // eo
        eoPagination: {}, // eo分页
        productionRelList: [], // 生产指令关系
        prodRelPagination: {}, // 生产指令关系分页
        tabAttributeList: [], // 扩展字段
        expandedRowList: [], // 工艺路线扩展
      };
    },
    clearAssemblyList() {
      return {
        assemblyList: [], // 装配清单
        assemblyPagination: {}, // 装配分页
      };
    },
  },
};
