/*
 * @Description: 不良申请单审核
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-03-30 09:33:29
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2021-01-06 16:01:16
 * @Copyright: Copyright (c) 2019 Hand
 */
import { getResponse, createPagination, parseParameters } from 'utils/utils';
import { queryMapIdpValue, queryUnifyIdpValue } from 'services/api';
import {
  fetchBabApplocationList,
  submit,
  getSiteList,
  fetchStatueSelectList,
} from '@/services/hmes/badApplicationReviewService';

export default {
  namespace: 'badApplicationReview',
  state: {
    badApplicationList: [],
    pagination: {},
    defaultSite: {},
    defaultOrganizationVal: null, // 事业部默认值
  },
  effects: {
    // 批量查询独立值集
    *batchLovData(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          processMethod: 'HME.NC_PROCESS_METHOD', // 处理方法
          ncTypeList: 'HME.NC_TYPE',
        })
      );
      const res = getResponse(yield call(queryUnifyIdpValue, 'HME.NC_DIVISION'));
      const defaultOrganizationFlagArr = res.filter(ele => ele.defaultOrganizationFlag === 'Y');
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            lovData: {
              ...result,
            },
            businessdList: res,
            defaultOrganizationVal: defaultOrganizationFlagArr.length > 0 ? defaultOrganizationFlagArr[0].areaId : null,
          },
        });
      }
    },
    // 获取审批清单
    *fetchBabApplocationList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchBabApplocationList, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            badApplicationList: result.content,
            pagination: createPagination(result),
          },
        });
      }
      return result;
    },
    *submit({ payload }, { call }) {
      const result = getResponse(yield call(submit, payload));
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
    // 获取状态下拉
    *fetchStatueSelectList({ payload }, { call }) {
      const res = yield call(fetchStatueSelectList, payload);
      const list = getResponse(res);
      return list;
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
