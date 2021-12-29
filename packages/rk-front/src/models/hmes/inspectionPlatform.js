/**
 * inspectionPlatform - model
 * @date: 2020/04/07 16:54:53
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */
import { isArray, isEmpty } from 'lodash';
import uuid from 'uuid/v4';
import { getResponse, createPagination } from 'utils/utils';
import {
  fetchDefaultSite,
  fetchProdLineTree,
  fetchProcessTree,
  fetchInspectionList,
  fetchPqcInfo,
  fetchResultList,
  saveInfo,
  submitPqc,
  createPqc,
  uploadFile,
} from '@/services/hmes/inspectionPlatformService';

export default {
  namespace: 'inspectionPlatform',
  state: {
    siteInfo: {},
    prodLineTree: [],
    inspectionList: [],
    inspectionPagination: {},
    pqcInfo: {},
    testItemList: [],
    changeItemList: [],
    testItemPagination: {},
    resultList: [],
    resultPagination: {},
    expandedRowKeys: [],
    resultRecord: {},
  },
  effects: {
    *fetchDefaultSite({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchDefaultSite, payload));
      if(res) {
        yield put({
          type: 'updateState',
          payload: {
            siteInfo: res,
          },
        });
        return res;
      }
    },
    *fetchProdLineTree({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchProdLineTree, payload));
      const prodLineTree = isArray(res) ? res.map(e => ({...e, children: []})) : [];
      if(res) {
        yield put({
          type: 'updateState',
          payload: {
            prodLineTree,
            expandedRowKeys: [],
            changeItemList: [],
          },
        });
      }
    },

    *fetchProcessTree({ payload }, { call, put }) {
      const { prodLineTree, ...info } = payload;
      const res = getResponse(yield call(fetchProcessTree, info));
      let newProdLineTree = [];
      if(isEmpty(prodLineTree)) {
        newProdLineTree = res;
      } else {
        newProdLineTree = prodLineTree.map(e => (
          e.prodLineId === info.prodLineId ? {
            ...e,
            children: res,
          } : e
        ));
      }
      if(res) {
        yield put({
          type: 'updateState',
          payload: {
            prodLineTree: newProdLineTree,
          },
        });
      }
    },
    *fetchInspectionList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchInspectionList, payload));
      if(res) {
        yield put({
          type: 'updateState',
          payload: {
            inspectionList: res.content,
            inspectionPagination: createPagination(res),
            changeItemList: [],
            resultRecord: {},
          },
        });
      }
    },
    *fetchPqcInfo({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchPqcInfo, payload));
      if(res) {
        yield put({
          type: 'updateState',
          payload: {
            pqcInfo: res.headData,
            testItemList: res.lineData.content,
            testItemPagination: createPagination(res.lineData),
          },
        });
      }
    },
    *fetchResultList({ payload }, { call, put }) {
      const { pqcInfo, ...info } = payload;
      const res = getResponse(yield call(fetchResultList, info));
      if(res) {
        const resultList = pqcInfo.inspectionStatus !== 'NEW' ? res.content
          : isEmpty(res.content) ? [{ pqcDetailsId: uuid(), _status: 'create' }]
          : res.content.map(e => ({...e, _status: 'update' }));
        yield put({
          type: 'updateState',
          payload: {
            resultList,
            resultPagination: createPagination(res),
            resultRecord: pqcInfo.inspectionStatus !== 'NEW' ? {} : resultList[0],
          },
        });
      }
    },
    *saveInfo({ payload }, { call, put }) {
      const res = getResponse(yield call(saveInfo, payload));
      // 清除 结果列 以及 缓存的需保存数据
      if(res) {
        yield put({
          type: 'updateState',
          payload: {
            changeItemList: [],
            resultList: [],
            resultPagination: {},
          },
        });
      }
      return res;
    },
    *submitPqc({ payload }, { call }) {
      const res = getResponse(yield call(submitPqc, payload));
      return res;
    },
    *createPqc({ payload }, { call }) {
      const res = getResponse(yield call(createPqc, payload));
      return res;
    },
    *uploadFile({ payload }, { call }) {
      const res = getResponse(yield call(uploadFile, payload ));
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
