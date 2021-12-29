/**
 * @date 2019-8-8
 * @author HDY <deying.huang@hand-china.com>
 */

import notification from 'utils/notification';
import { get as chainget } from 'lodash';
import { getResponse, createPagination } from 'utils/utils';
import { ergodicData } from '@/utils/utils';

import { fetchAttributeList } from '../../services/api';

import {
  fetchAreaDetailedInfo,
  fetchBasicAlgorithm,
  fetchProdLineRule,
  fetchPlanningPhaseTime,
  fetchPlanningBase,
  fetchReleaseConcurrentRule,
  saveAreaDetailedInfo,
} from '../../services/org/areaService';

import {
  fetchSelectList,
  fetchLocatorLineList,
  saveLocator,
} from '../../services/org/locatorService';

import {
  // fetchSelectList,
  fetchWorkcellLineList,
  saveWorkcell,
} from '../../services/org/workcellService';

import {
  saveProLine,
  fetchProLineType,
  fetchRecordDetail,
  featchDispatchList,
  saveDispatchMethods,
  deleteDispatchMethods,
} from '../../services/org/prolineService';

import {
  // fetchSiteList,
  // fetchSelectList,
  fetchSiteLineList,
  saveSite,
} from '../../services/org/siteService';

import { fetchEnterpriseDetails, saveEnterprise } from '../../services/org/enterpriseService';

import {
  // fetchLocatorGroupDetails,
  saveLocatorGroup,
} from '../../services/org/locatorGroupService';

export default {
  namespace: 'relationMaintainDrawer',
  state: {
    /** *****************************似乎是公用的****************************** */

    /** *****************************区域****************************** */

    basicAlgorithmList: [], // 基础排程算法下拉选项
    prodLineRuleList: [], // 选线规则下拉选项
    planningPhaseTimeList: [], // 区间类型下拉选项
    planningBaseList: [], // 排程类型下拉选项
    releaseConcurrentRuleList: [], // 关联下达策略下拉选项

    areaDetailedInfo: {}, // 区域详情
    attrList: [], // 扩展字段

    /** *****************************库位****************************** */

    locatorTypeList: [], // 库位类型下拉框数据
    locatorCategoryList: [], // 库位类别下拉框数据
    attritionCalculateStrategyList: [], // 损耗计算策略下拉框数据

    displayList: {}, // 单行详细数据表单
    // attrList: [], // 扩展字段数据

    /** *****************************库位****************************** */

    workcellLineList: {}, // 工作单元单行详细数据
    workcellTypeList: [], // 工作单元类型下拉框数据
    rateTypeList: [], // 数率类型下拉框数据
    planList: {}, // 计划属性数据
    produceList: {}, // 生产属性数据

    // displayList: {}, // 详细表单数据
    // attrList: [], // 扩展字段表格数据

    /** *****************************生产线****************************** */

    proLineItem: {}, // 生产线编辑
    prodLineAttrs: [], // 扩展属性
    prodLineManufacturing: {},
    prodLineSchedule: {},
    productionLine: {},
    proDispatchList: [],
    proDispatchPagination: {},

    /** *****************************站点****************************** */

    // displayList: {}, // 单行详细数据表单
    siteTypeList: [], // 站点类型下拉框数据
    // attritionCalculateStrategyList: [], // 损耗计算策略下拉框数据
    // planList: {}, // 计划属性数据
    // produceList: {}, // 生产属性数据
    // attrList: [], // 扩展字段数据

    /** *****************************企业****************************** */

    enterpriseDetailsInfo: {}, // 企业详细数据

    /** *****************************库位组****************************** */

    locatorGroupDetailsInfo: {}, // 库位组详细信息
    // attrList: [], // 扩展字段数据
  },

  effects: {
    /** *****************************似乎是公用的****************************** */
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

    /** *****************************区域****************************** */

    // 获取所有下拉框值
    *InitSelectValue({ payload }, { call, put }) {
      const basicAlgorithm = yield call(fetchBasicAlgorithm, payload);
      const prodLineRule = yield call(fetchProdLineRule, payload);
      const planningPhaseTime = yield call(fetchPlanningPhaseTime, payload);
      const planningBase = yield call(fetchPlanningBase, payload);
      const releaseConcurrentRule = yield call(fetchReleaseConcurrentRule, payload);
      yield put({
        type: 'updateState',
        payload: {
          basicAlgorithmList: basicAlgorithm.rows,
          prodLineRuleList: prodLineRule.rows,
          planningPhaseTimeList: planningPhaseTime.rows,
          planningBaseList: planningBase.rows,
          releaseConcurrentRuleList: releaseConcurrentRule.rows,
        },
      });
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

    /** *****************************库位****************************** */

    // 获取损耗计算策略下拉框数据
    *fetchAttritionCalculateStrategyList({ payload }, { call, put }) {
      const res = yield call(fetchSelectList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            attritionCalculateStrategyList: chainget(list, 'rows', {}),
          },
        });
      }
    },

    // 获取库位类型下拉框数据
    *fetchLocatorTypeList({ payload }, { call, put }) {
      const res = yield call(fetchSelectList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            locatorTypeList: chainget(list, 'rows', {}),
          },
        });
      }
    },

    // 获取库位类型下拉框数据
    *fetchLocatorCategoryList({ payload }, { call, put }) {
      const res = yield call(fetchSelectList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            locatorCategoryList: chainget(list, 'rows', {}),
          },
        });
      }
    },

    // 获取单行详细数据源列表数据
    *fetchLocatorLineList({ payload }, { call, put }) {
      const res = yield call(fetchLocatorLineList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            displayList: chainget(list, 'rows', {}),
            attrList: chainget(list, 'rows.locatorAttrList', []),
          },
        });
      }
    },

    // 保存所有数据
    *saveLocator({ payload }, { call }) {
      const result = yield call(saveLocator, ergodicData(payload));
      return getResponse(result);
    },

    /** *****************************工作单元****************************** */

    // 获取数率类型下拉框数据
    *fetchRateTypeList({ payload }, { call, put }) {
      const res = yield call(fetchSelectList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            rateTypeList: chainget(list, 'rows', {}),
          },
        });
      }
    },

    // 获取工作单元类型下拉框数据
    *fetchWorkcellTypeList({ payload }, { call, put }) {
      const res = yield call(fetchSelectList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            workcellTypeList: chainget(list, 'rows', {}),
          },
        });
      }
    },

    // 获取详细列表数据
    *fetchWorkcellLineList({ payload }, { call, put }) {
      const res = yield call(fetchWorkcellLineList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            workcellLineList: chainget(list, 'rows', []),
            displayList: chainget(list, 'rows.workcell', {}),
            attrList: chainget(list, 'rows.workcellAttrs', []),
            planList: chainget(list, 'rows.workcellSchedule', {}),
            produceList: chainget(list, 'rows.workcellManufacturing', {}),
          },
        });
      }
    },

    // 保存所有数据
    *saveWorkcell({ payload }, { call }) {
      const result = yield call(saveWorkcell, ergodicData(payload));
      return getResponse(result);
    },

    /** *****************************生产线****************************** */

    // 获取生产线单条详情
    *fetchRecordDetail({ payload }, { call, put }) {
      const res = yield call(fetchRecordDetail, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            prodLineAttrs: chainget(list, 'rows.prodLineAttrs', []),
            prodLineManufacturing: chainget(list, 'rows.prodLineManufacturing', {}) || {},
            productionLine: chainget(list, 'rows.productionLine', {}) || {},
            prodLineSchedule: chainget(list, 'rows.prodLineSchedule', {}) || {},
          },
        });
      }
    },

    *fetchProdLineAttributeList({ payload }, { call, put }) {
      const res = yield call(fetchAttributeList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            prodLineAttrs: chainget(list, 'rows', []),
          },
        });
      }
    },

    // 保存生产线编辑/新增
    *saveProLine({ payload }, { call }) {
      const res = yield call(saveProLine, ergodicData(payload));
      const list = getResponse(res);
      return list;
    },

    // 获取生产线类型
    *fetchProLineType({ payload }, { call }) {
      const res = yield call(fetchProLineType, payload);
      const list = getResponse(res);
      return list;
    },

    // 获取指定得调度工艺
    *featchDispatchList({ payload }, { call, put }) {
      const res = yield call(featchDispatchList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            proDispatchList: chainget(list, 'rows.content', []),
            proDispatchPagination: createPagination(list.rows),
          },
        });
      }
      return list;
    },

    // 保存新增工艺
    *saveDispatchMethods({ payload }, { call }) {
      const res = yield call(saveDispatchMethods, ergodicData(payload));
      const list = getResponse(res);
      return list;
    },

    // 删除新增工艺
    *deleteDispatchMethods({ payload }, { call }) {
      const res = yield call(deleteDispatchMethods, ergodicData(payload));
      const list = getResponse(res);
      return list;
    },

    /** *****************************站点****************************** */

    // 获取站点类型下拉框数据
    *fetchSiteTypeList({ payload }, { call, put }) {
      const res = yield call(fetchSelectList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            siteTypeList: chainget(list, 'rows', {}),
          },
        });
      }
    },

    // 保存所有数据
    *saveSite({ payload }, { call }) {
      const result = yield call(saveSite, ergodicData(payload));
      return getResponse(result);
    },

    // 获取单行详细数据源列表数据
    *fetchSiteLineList({ payload }, { call, put }) {
      const res = yield call(fetchSiteLineList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            planList: chainget(list, 'rows.siteSchedule', {}),
            produceList: chainget(list, 'rows.siteManufacturing', {}),
            displayList: chainget(list, 'rows.site', {}),
            attrList: chainget(list, 'rows.siteAttrs', []),
          },
        });
      }
    },

    /** *****************************企业****************************** */

    // 获取单行详细数据源列表数据
    *fetchEnterpriseDetails({ payload }, { call, put }) {
      const res = yield call(fetchEnterpriseDetails, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            enterpriseDetailsInfo: chainget(list, 'rows', {}),
          },
        });
      }
    },

    // 保存企业信息
    *saveEnterprise({ payload }, { call }) {
      const result = yield call(saveEnterprise, ergodicData(payload));
      return getResponse(result);
    },

    /** *****************************库位组****************************** */

    // // 获取单行详细数据源列表数据
    // *fetchLocatorGroupDetails({ payload }, { call, put }) {
    //   const res = yield call(fetchLocatorGroupDetails, payload);
    //   const list = getResponse(res);
    //   if (list) {
    //     yield put({
    //       type: 'updateState',
    //       payload: {
    //         displayList: chainget(list, 'rows', {}),
    //         attrList: chainget(list, 'rows.locatorAttrList', []),
    //       },
    //     });
    //   }
    // },

    // 保存库位组信息
    *saveLocatorGroup({ payload }, { call }) {
      const result = yield call(saveLocatorGroup, ergodicData(payload));
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
