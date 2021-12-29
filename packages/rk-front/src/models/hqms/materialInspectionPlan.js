/*
 * @Description: 物料检验计划
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-16 16:29:56
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2021-02-08 17:25:59
 * @Copyright: Copyright (c) 2019 Hand
 */
import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  fetchHeadList,
  fetchLineList,
  handleSaveMaterPlan,
  pushMaterPlan,
  fetchInspectionGroup,
  handleSaveInspectionTeam,
  handleSaveInspectionTeamLine,
  deleteTagGroup,
  partSynchronize,
  allSynchronize,
  deleteHead,
  fetchSite,
  fetchDefaultSite,
  copy,
} from '@/services/hqms/materialInspectionPlanService';

export default {
  namespace: 'materialInspectionPlan',
  state: {
    testTypeLov: [], // 检验类型
    defectLevel: [], // 缺陷等级
    statusLov: [], // 状态
    headList: [], // 头数据
    headListPagination: {}, // 头分页
    lineList: [], // 行数据
    lineListPagination: {}, // 行分页
    lineListGroup: [],
    lineListGroupPagination: {},
    inspectionGroup: [], // 检验组
    inspectionGroupPagination: {},
    inspectionTeamListPagination: {}, // 检验组分页
    siteList: [], // 组织
    selectedHeadCache: [],
    siteInfo: {},
  },
  effects: {
    *init(_, { call, put }) {
      const siteInfo = yield call(fetchDefaultSite);
      const result = getResponse(
        yield call(queryMapIdpValue, {
          testTypeLov: 'QMS.INSPECTION_TYPE',
          statusLov: 'QMS.MATERIAL_INSPECTION_STATUS',
          defectLevel: 'QMS.DEFECT_LEVEL',
          collectionMethod: 'HME.TAG_COLLECTION_METHOD',
        })
      );
      yield put({
        type: 'updateState',
        payload: {
          siteInfo,
          ...result,
        },
      });
    },
    // 头
    *fetchHeadList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchHeadList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            headList: result.content,
            headListPagination: createPagination(result),
          },
        });
      }
      return result;
    },
    // 行
    *fetchLineList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchLineList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            lineList: result.content,
            lineListPagination: createPagination(result),
          },
        });
      }
      return result;
    },
    // 检验组行
    *fetchLineListGroup({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchLineList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            lineListGroup: result.content,
            lineListGroupPagination: createPagination(result),
          },
        });
      }
      return result;
    },
    // 物料检验计划头创建
    *handleSaveMaterPlan({ payload }, { call }) {
      const result = getResponse(yield call(handleSaveMaterPlan, payload));
      return result;
    },
    // 物料检验计划发布
    *pushMaterPlan({ payload }, { call }) {
      const result = getResponse(yield call(pushMaterPlan, payload));
      return result;
    },
    // 检验组
    *fetchInspectionGroup({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchInspectionGroup, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            inspectionGroup: result.content,
            inspectionGroupPagination: createPagination(result),
          },
        });
      }
      return result;
    },
    // 获取组织
    *fetchSite({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchSite, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            siteList: result.rows.content,
          },
        });
      }
      return result;
    },
    // 检验组头数据
    *handleSaveInspectionTeam({ payload }, { call }) {
      const result = getResponse(yield call(handleSaveInspectionTeam, payload));
      return result;
    },
    // 检验组行数据
    *handleSaveInspectionTeamLine({ payload }, { call }) {
      const result = getResponse(yield call(handleSaveInspectionTeamLine, payload));
      return result;
    },
    // 删除质检组
    *deleteTagGroup({ payload }, { call }) {
      const result = getResponse(yield call(deleteTagGroup, payload));
      return result;
    },
    // 增量同步
    *partSynchronize({ payload }, { call }) {
      const result = getResponse(yield call(partSynchronize, payload));
      return result;
    },
    // 全量同步
    *allSynchronize({ payload }, { call }) {
      const result = getResponse(yield call(allSynchronize, payload));
      return result;
    },
    // 删除物料计划头数据
    *deleteHead({ payload }, { call }) {
      const result = getResponse(yield call(deleteHead, payload));
      return result;
    },
    *copy({ payload }, { call }) {
      const res = getResponse(yield call(copy, payload));
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
