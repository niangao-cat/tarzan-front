/*
 * @Description: IQC免检设置
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-29 09:34:39
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-07-07 13:58:24
 * @Copyright: Copyright (c) 2019 Hand
 */
import { getResponse, createPagination } from 'utils/utils';
import {
  queryIQCfree,
  getSiteList,
  createFreeData,
  deleteFreeData,
} from '@/services/hqms/iqcInspectionFreeService';
import { queryMapIdpValue } from 'services/api';


export default {
  namespace: 'iqcInspectionFree',
  state: {
    detail: {},
    statusMap: [],
    enableMap: [],
    typeList: [],
    qualityStatusMap: [],
    performanceLevel: [],
    reasonMap: [],
    getSite: {},
    iqcList: [], // iqc列表
    defaultSite: {}, // 默认工厂
    pagination: {}, // 分页数据
  },
  effects: {
    *init(_, { call, put }) {
      const res = yield call(queryMapIdpValue, {
        typeList: 'QMS.EXEMPTION_TYPE',
      });
      yield put({
        type: 'updateState',
        payload: {
          ...res,
        },
      });
    },
    // 获取免检数据
    *queryIQCfree({ payload }, { call, put }) {
      const result = getResponse(yield call(queryIQCfree, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            iqcList: result.content,
            pagination: createPagination(result),
          },
        });
      }
      return result;
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
    // 创建免检数据
    *createFreeData({ payload }, { call }) {
      const result = getResponse(yield call(createFreeData, payload));
      return result;
    },
    // 删除免检数据
    *deleteFreeData({ payload }, { call }) {
      const result = getResponse(yield call(deleteFreeData, payload));
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
