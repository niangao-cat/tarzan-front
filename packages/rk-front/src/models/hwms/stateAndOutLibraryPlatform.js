/**
 * @Description: 立库出库平台
 * @author: lly
 * @date 2021/07/06 11:11
 * @version 1.0
 */
import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  fetchDocHead,
  fetchDocLineList,
  fetchSnSpecifyList,
  fetchSnEdit,
  fetchSnBatchEntry,
  fetchSnSave,
  fetchSnDelEte,
  fetchOutLibrarySpecifyList,
  fetchOutLibrarySpecifyTable,
  fetchSnOutLibrary,
  cancelSnOutLibrary,
  querySiteList,
  getSiteList,
} from '@/services/hwms/stateAndOutLibraryPlatformService';

export default {
  namespace: 'stateAndOutLibraryPlatform',
  state: {
    docHeadList: {}, // 单据头信息
    docNumList: [], // 单据号信息
    docNumListPagination: {}, // 单据号分页
    SnSpecifyQueryList: [], // SN信息
    // SnSpecifyQueryPagination: {}, // SN分页
    SnFlag: {}, // SN批量输入是否可编辑
    batchSnData: [], // 批量SN数据
    taskList: {}, // 当前任务
    pieChartData: [], // 出库任务信息饼图
    OutTableList: [], // 出库任务信息表格
    OutTableListPagination: {}, // 出库任务信息表格分页
    SnOutLibraryList: [], // 出库
    CancelSnOutLibrary: {}, // 取消
    siteMap: [], // 站点
    statusMap: [], // 单据状态
    typeMap: [], // 出口
  },
  effects: {
    // 初始化 状态下拉框
    *init(_, { call, put }) {
      const res = yield call(queryMapIdpValue, {
        statusMap: 'WMS.COST_CENTER_DOCUMENT.STATUS',
        typeMap: 'WX.WMS.EXIT_NUM',
      });
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

    // 获取默认工厂
    *getSiteList({ payload }, { call }) {
      const result = getResponse(yield call(getSiteList, payload));
      return result;
    },

    // 查询头信息
    *fetchDocHead({ payload }, { call, put }) {
      // 先清空数据
      yield put({
        type: 'updateState',
        payload: {
          docHeadList: {},
        },
      });
      const res = yield call(fetchDocHead, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            docHeadList: list,
          },
        });
      }
      return res;
    },

    // 查询单据号信息
    *fetchDocLineList({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          docNumList: [],
        },
      });
      const res = yield call(fetchDocLineList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            docNumList: list,
            docNumListPagination: createPagination(list),
          },
        });
      }
      return res;
    },

    // 查询SN信息
    *fetchSnSpecifyList({ payload }, { call, put }) {
      // 先清空数据
      yield put({
        type: 'updateState',
        payload: {
          batchSnData: [],
          SnSpecifyQueryList: [],
        },
      });
      const res = yield call(fetchSnSpecifyList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            SnSpecifyQueryList: list,
            SnSpecifyQueryPagination: createPagination(list),
          },
        });
      }
      return res;
    },

    // 查询SN批量输入可编辑校验
    *fetchSnEdit({ payload }, { call, put }) {
      const res = yield call(fetchSnEdit, payload);
      const list = getResponse(res);
      // 成功时，更改状态
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            SnFlag: list,
          },
        });
      }
      return res;
    },

    // SN批量录入
    *fetchSnBatchEntry({ payload }, { call, put }) {
      // 先清空数据
      yield put({
        type: 'updateState',
        payload: {
          batchSnData: [],
        },
      });
      const res = yield call(fetchSnBatchEntry, payload);
      const list = getResponse(res);
      // 成功时，更改状态
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            batchSnData: list,
          },
        });
      }
      return res;
    },

    // SN录入保存
    *fetchSnSave({ payload }, { call, put }) {
      const res = yield call(fetchSnSave, payload);
      const list = getResponse(res);
      // 成功时，更改状态
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            saveResult: list,
          },
        });
      }
      return res;
    },

    // SN保存删除
    *fetchSnDelEte({ payload }, { call, put }) {
      const res = yield call(fetchSnDelEte, payload);
      const list = getResponse(res);
      // 成功时，更改状态
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            deleteResult: list,
          },
        });
      }
      return res;
    },

    // 查询出库信息饼图，和卡片；
    *fetchOutLibrarySpecifyList({ payload }, { call, put }) {
      const res = yield call(fetchOutLibrarySpecifyList, payload);
      const list = getResponse(res);
      // 成功时，更改状态
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            taskList: list,
            pieChartData: list.returnDTO3List,
          },
        });
      }
      return res;
    },

    // 查询出库信息表格；
    *fetchOutLibrarySpecifyTable({ payload }, { call, put }) {
      const res = yield call(fetchOutLibrarySpecifyTable, payload);
      const list = getResponse(res);
      // 成功时，更改状态
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            OutTableList: list.content,
            OutTableListPagination: createPagination(list),
          },
        });
      }
      return res;
    },

    // 出库；
    *fetchSnOutLibrary({ payload }, { call, put }) {
      const res = yield call(fetchSnOutLibrary, payload);
      const list = getResponse(res);
      // 成功时，更改状态
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            SnOutLibraryList: list,
          },
        });
      }
      return res;
    },

    // 取消；
    *cancelSnOutLibrary({ payload }, { call, put }) {
      const res = yield call(cancelSnOutLibrary, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            CancelSnOutLibrary: list,
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
