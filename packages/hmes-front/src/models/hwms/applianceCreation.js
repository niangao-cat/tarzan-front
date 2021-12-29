/**
 * 物流器具
 *@date：2019/9/21
 *@author：junhui.liu <junhui.liu@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  queryHeaderList,
  queryHeaderHisList,
  queryLineList,
  queryLineHisList,
  createData,
  getSiteList,
  print,
  fetchSiteList,
} from '../../services/hwms/applianceCreationService.js';

export default {
  namespace: 'applianceCreation', // model的唯一命名空间，与当前文件名相同，项目中不能重复

  // 保存 Model 的状态数据，直接决定了视图层的输出
  state: {
    headList: [],
    headPagination: {},
    headHisList: [],
    headHisPagination: {},
    lineList: [],
    linePagination: {},
    lineHisList: [],
    lineHisPagination: {},
    detail: {}, // 新建item
    statusMap: [], // 容器状态
    ownerTypeMap: [], // 所有者类型
    isEmptyMap: [], // 物流器具是否为空
    defaultSite: {},
    siteList: [],
  },
  // 副作用，处理异步动作
  effects: {
    // 查询独立值集
    *init(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          statusMap: 'Z.CONTAINER.STATUS',
          ownerTypeMap: 'Z.CONTAINER.OWNER_TYPE',
          isEmptyMap: 'Z.CONTAINER.ISEMPTY',
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
    // 查询头列表
    *queryHeaderList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryHeaderList, payload));
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

    *queryHeaderHisList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryHeaderHisList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            headHisList: result.content,
            headHisPagination: createPagination(result),
          },
        });
      }
      return result;
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

    *queryLineHisList({ payload }, { call, put }) {
      const result = getResponse(yield call(queryLineHisList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            lineHisList: result.content,
            lineHisPagination: createPagination(result),
          },
        });
      }
      return result;
    },

    // 创建物流器具
    *createData({ payload }, { call }) {
      const result = yield call(createData, payload);
      return getResponse(result);
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
    // 打印
    *print({ payload }, { call }) {
      const res = getResponse(yield call(print, payload));
      return res;
    },
    *fetchSiteList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchSiteList, payload));
      if(res) {
        yield put({
          type: 'updateState',
          payload: {
            siteList: res,
          },
        });
      }
    },
  },
  // Action 处理器，用来处理同步操作，算出最新的 State
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload, // 更新state里面变量值
      };
    },
  },
};
