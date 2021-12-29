/**
 * @date 2019-8-8
 * @author HDY <deying.huang@hand-china.com>
 */

import { getResponse, createPagination } from 'utils/utils';
import notification from 'utils/notification';
import { get as chainget } from 'lodash';
import { ergodicData } from '@/utils/utils';

import {
  fetchAreaList,
  fetchAreaDetailedInfo,
  fetchBasicAlgorithm,
  fetchProdLineRule,
  fetchPlanningPhaseTime,
  fetchPlanningBase,
  fetchReleaseConcurrentRule,
  saveAreaDetailedInfo,
} from '../../services/org/areaService';
import {
  fetchAttributeList,
  saveAttribute,
  fetchSelectList,
  queryMapIdpValue,
} from '@/services/api';

export default {
  namespace: 'area',
  state: {
    areaList: [], // 显示区域表格数据
    areaPagination: {}, // 区域表格分页
    areaDetailedInfo: {}, // 区域详情
    basicAlgorithmList: [], // 基础排程算法下拉选项
    prodLineRuleList: [], // 选线规则下拉选项
    planningPhaseTimeList: [], // 区间类型下拉选项
    planningBaseList: [], // 排程类型下拉选项
    releaseConcurrentRuleList: [], // 关联下达策略下拉选项

    distributionModeList: [], // 配送模式下拉选项
    businessTypeList: [], // 指令业务类型下拉选项

    attrList: [], // 扩展字段

    lovData: {}, // 值集
  },

  effects: {
    // 获取值集
    *getTypeLov({ payload }, { put, call }) {
      const res = yield call(queryMapIdpValue, { ...payload });
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            lovData: list,
          },
        });
      }
      return list;
    },
    // 获取所有下拉框值
    *InitSelectValue({ payload }, { call, put }) {
      const basicAlgorithm = yield call(fetchBasicAlgorithm, payload);
      const prodLineRule = yield call(fetchProdLineRule, payload);
      const planningPhaseTime = yield call(fetchPlanningPhaseTime, payload);
      const planningBase = yield call(fetchPlanningBase, payload);
      const releaseConcurrentRule = yield call(fetchReleaseConcurrentRule, payload);
      const distributionMode = yield call(fetchSelectList, {
        module: 'PULL',
        typeGroup: 'DISTRIBUTION_MODE',
      });
      // console.log(distributionMode);
      const businessType = yield call(fetchSelectList, {
        module: 'INSTRUCTION',
        typeGroup: 'INSTRUCTION_BUSINESS_TYPE',
      });
      // console.log(businessType);
      yield put({
        type: 'updateState',
        payload: {
          basicAlgorithmList: basicAlgorithm.rows,
          prodLineRuleList: prodLineRule.rows,
          planningPhaseTimeList: planningPhaseTime.rows,
          planningBaseList: planningBase.rows,
          releaseConcurrentRuleList: releaseConcurrentRule.rows,
          distributionModeList: distributionMode.rows,
          businessTypeList: businessType.rows,
        },
      });
    },

    // 获取区域列表数据
    *fetchAreaList({ payload }, { call, put }) {
      const res = yield call(fetchAreaList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            areaList: list.rows.content,
            areaPagination: createPagination(list.rows),
          },
        });
      }
    },

    // 获取区域详细信息
    *fetchAreaDetailedInfo({ payload }, { call, put }) {
      const res = yield call(fetchAreaDetailedInfo, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            areaDetailedInfo: list.rows,
            // attrList: list.rows.areaAttrList,
          },
        });
      }
    },

    // 保存区域详细信息
    *saveAreaDetailedInfo({ payload }, { call }) {
      const res = yield call(saveAreaDetailedInfo, ergodicData(payload));
      if (res && res.success) {
        notification.success();
      } else {
        notification.error({ message: res.message });
      }
      return getResponse(res);
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
    },

    // 保存扩展字段
    *saveAttribute({ payload }, { call }) {
      const result = yield call(saveAttribute, ergodicData(payload));
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
