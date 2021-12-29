/*
 * @Description: 取片平台
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-06 16:06:44
 * @LastEditTime: 2020-11-11 09:17:51
 */

import { getResponse, createPagination, parseParameters } from 'utils/utils';
import {
  getSiteList,
  saveHeadData,
  saveLineData,
  fetchHeadsDetail,
  fetchLineList,
  deleteLineData,
  fetchfileList,
} from '@/services/hhme/workInstructionservice';

export default {
  namespace: 'workInstructions',
  state: {
    defaultSite: {},
    lineData: [],
    lineDataPagination: {},
    headDetail: [],
    fileList: [],
  },
  effects: {
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
    *fetchHeadsDetail({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchHeadsDetail, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            headDetail: result,
          },
        });
      }
      return result;
    },
    // 查询文件列表
    *fetchfileList({ payload }, { call, put }) {
      const fileRes = getResponse(yield call(fetchfileList, {
        bucketName: 'file-mes',
        urls: [payload.fileUrl],
      }));
      const arr = [];
      fileRes.forEach(ele => {
        arr.push({
          uid: '-1',
          name: ele.fileName,
          status: 'done',
          url: ele.fileUrl,
        });
      });
      yield put({
        type: 'updateState',
        payload: {
          fileList: arr,
        },
      });
    },
    *fetchLineList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchLineList, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            lineData: result.content,
            lineDataPagination: createPagination(result),
          },
        });
      }
      return result;
    },
    *saveHeadData({ payload }, { call }) {
      const result = getResponse(yield call(saveHeadData, payload));
      return result;
    },
    *saveLineData({ payload }, { call }) {
      const result = getResponse(yield call(saveLineData, payload));
      return result;
    },

    *deleteLineData({ payload }, { call }) {
      const result = getResponse(yield call(deleteLineData, payload));
      return result;
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
