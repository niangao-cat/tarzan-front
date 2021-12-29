/**
 * @date 2019-12-23
 * @author HDY <deying.huang@hand-china.com>
 */
import { get as chainget } from 'lodash';
import { getResponse, createPagination } from 'utils/utils';
import { ergodicData } from '@/utils/utils';

import {
  fetchExecuteList,
  fetchSelectList,
  fetchRoutingList,
  fetchDetailList,
  fetchModuleList,
  fetchBomList,
  fetchStepList,
  fetchPoorPerformanceList,
  fetchDataCollectionList,
  fetchExecuteJobList,
  saveExecute,
  mergeExecute,
  splitExecute,
  fetchStatusOptions,
  updateExecuteStatus,
  fetchTagGroupList,
} from '@/services/execute/executeService';
import { fetchAttributeList, saveAttribute } from '@/services/api';

export default {
  namespace: 'execute',
  state: {
    executeList: [], // 显示执行作业表格数据
    executePagination: {}, // 执行作业表格分页
    displayList: {}, // 单行详细数据表单
    eoTypeOptions: [], // EO类型下拉框数据
    executeStatusOptions: [], // EO状态下拉框数据
    workOrderStatusOptions: [], // WO状态下拉框数据
    eoRelOptions: [], // EO关系下拉框数据
    routingList: [], // 工艺路线表格数据
    routingPagination: {}, // 工艺路线表格分页
    moduleList: [], // 组件表格数据
    modulePagination: {}, // 组件表格分页
    stepList: [], // 步骤实绩表格数据
    stepPagination: {}, // 步骤实绩表格分页
    poorPerformanceList: [], // 不良实绩表格
    poorPerformancePagination: {}, // 不良实绩表格分页
    dataCollectionList: [], // 数据收集组表格
    dataCollectionPagination: {}, // 数据收集组分页
    tagGroupList: [], // 有多少个数据收集组
    executeJobList: [], // 执行作业表格
    executeJobPagination: {}, // 执行作业分页
    bomList: [], // 组件下面物料表格
    bomListPagination: {}, // 分页
    attrList: [], // 扩展字段表格数据
  },
  effects: {
    // 获取执行作业管理表格列表数据
    *fetchExecuteList({ payload }, { call, put }) {
      const res = yield call(fetchExecuteList, payload);
      const list = getResponse(res);
      if (list.success) {
        yield put({
          type: 'updateState',
          payload: {
            executeList: chainget(list, 'rows.content', []),
            executePagination: createPagination(list.rows),
          },
        });
        return list;
      }
    },

    // 获取执行作业类型下拉框数据
    *fetchExecuteTypeOptions({ payload }, { call, put }) {
      const res = yield call(fetchSelectList, payload);
      const list = getResponse(res);
      if (list.success) {
        yield put({
          type: 'updateState',
          payload: {
            eoTypeOptions: chainget(list, 'rows', []),
          },
        });
      }
    },

    // 获取EO关系下拉框数据
    *fetchEoRelOptions({ payload }, { call, put }) {
      const res = yield call(fetchSelectList, payload);
      const list = getResponse(res);
      if (list.success) {
        yield put({
          type: 'updateState',
          payload: {
            eoRelOptions: chainget(list, 'rows', []),
          },
        });
        return list;
      }
    },

    // 获取EO状态下拉框数据
    *fetchExecuteStatusOptions({ payload }, { call, put }) {
      const res = yield call(fetchStatusOptions, payload);
      const list = getResponse(res);
      if (list.success) {
        yield put({
          type: 'updateState',
          payload: {
            executeStatusOptions: chainget(list, 'rows', []),
          },
        });
      }
    },

    // 获取WO状态下拉框数据
    *fetchWOStatusOptions({ payload }, { call, put }) {
      const res = yield call(fetchStatusOptions, payload);
      const list = getResponse(res);
      if (list.success) {
        yield put({
          type: 'updateState',
          payload: {
            workOrderStatusOptions: chainget(list, 'rows', []),
          },
        });
      }
    },

    // 查询执行作业管理详细数据
    *fetchDetailList({ payload }, { call, put }) {
      const res = yield call(fetchDetailList, payload);
      const list = getResponse(res);
      if (list.success) {
        yield put({
          type: 'updateState',
          payload: {
            displayList: chainget(list, 'rows', {}),
          },
        });
        return list;
      }
    },

    // 查询工艺路线表格数据
    *fetchRoutingList({ payload }, { call, put }) {
      const res = yield call(fetchRoutingList, payload);
      const list = getResponse(res);
      if (list.success) {
        yield put({
          type: 'updateState',
          payload: {
            routingList: chainget(list, 'rows.content', []),
            routingPagination: createPagination(list.rows),
          },
        });
      }
    },

    // 查询组件表格数据
    *fetchModuleList({ payload }, { call, put }) {
      const res = yield call(fetchModuleList, payload);
      const list = getResponse(res);
      if (list.success) {
        yield put({
          type: 'updateState',
          payload: {
            moduleList: chainget(list, 'rows.content', []),
            modulePagination: createPagination(list.rows),
          },
        });
      }
    },

    // 查询步骤实绩表格数据
    *fetchStepList({ payload }, { call, put }) {
      const res = yield call(fetchStepList, payload);
      const list = getResponse(res);
      if (list.success) {
        yield put({
          type: 'updateState',
          payload: {
            stepList: chainget(list, 'rows.content', []),
            stepPagination: createPagination(list.rows),
          },
        });
      }
    },

    // 查询不良实绩表格数据
    *fetchPoorPerformanceList({ payload }, { call, put }) {
      const res = yield call(fetchPoorPerformanceList, payload);
      const list = getResponse(res);
      if (list.success) {
        yield put({
          type: 'updateState',
          payload: {
            poorPerformanceList: chainget(list, 'rows.content', []),
            poorPerformancePagination: createPagination(list.rows),
          },
        });
      }
    },

    // 查询数据收集组表格数据
    *fetchDataCollectionList({ payload }, { call, put }) {
      const res = yield call(fetchDataCollectionList, payload);
      const list = getResponse(res);
      if (list.success) {
        yield put({
          type: 'updateState',
          payload: {
            dataCollectionList: chainget(list, 'rows.content', []),
            dataCollectionPagination: createPagination(list.rows),
          },
        });
        return list;
      }
    },

    // 查询有多少个数据收集组
    *fetchTagGroupList({ payload }, { call, put }) {
      const res = yield call(fetchTagGroupList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            tagGroupList: chainget(list, 'rows', []),
          },
        });
      }
    },

    // 查询执行作业表格数据
    *fetchExecuteJobList({ payload }, { call, put }) {
      const res = yield call(fetchExecuteJobList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            executeJobList: chainget(list, 'rows.content', []),
            executeJobPagination: createPagination(list.rows),
          },
        });
      }
    },

    // 查询组件下面装配清单表格数据
    *fetchBomList({ payload }, { call, put }) {
      const res = yield call(fetchBomList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            bomList: chainget(list, 'rows.content', []),
            bomListPagination: createPagination(list.rows),
          },
        });
      }
    },

    // 获取扩展字段数据
    *fetchAttributeList({ payload }, { call, put }) {
      const res = yield call(fetchAttributeList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            attrList: chainget(list, 'rows', []),
          },
        });
      }
      return list;
    },

    // 保存扩展字段
    *saveAttribute({ payload }, { call }) {
      const result = yield call(saveAttribute, ergodicData(payload));
      return getResponse(result);
    },

    // 保存所有数据
    *saveExecute({ payload }, { call }) {
      const result = yield call(saveExecute, ergodicData(payload));
      return getResponse(result);
    },

    // 执行作业合并
    *mergeExecute({ payload }, { call }) {
      const result = yield call(mergeExecute, ergodicData(payload));
      return getResponse(result);
    },

    // 执行作业拆分
    *splitExecute({ payload }, { call }) {
      const result = yield call(splitExecute, ergodicData(payload));
      return getResponse(result);
    },

    // 执行作业状态变
    *updateExecuteStatus({ payload }, { call }) {
      const result = yield call(updateExecuteStatus, ergodicData(payload));
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
