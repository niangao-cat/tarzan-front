/**
 * @date 2019-8-1
 * @author TJX <jiaxu.tang@hand-china.com>
 */

import { getResponse, createPagination } from 'utils/utils';
import { get as chainget } from 'lodash';
import {
  fetchOperationList, // 工艺维护列表
  fetchSiteOption, // 获取站点下拉
  fetchStatusOption, // 获取状态下拉
  fetchSingleOperation, // 获取单条工艺
  saveOperationList, // 保存工艺维护列表信息
  fetchChilStepsList, // 获取子步骤列表数据
  deleteChildStepsList, // 删除子步骤列表数据
  fetchQuality, // 查询资质数据-点击添加资质按钮
  saveQuality, // 保存资质数据
  fetchQualityList, // 查询已保存的资质数据
  delQuality, // 删除资质数据
  fetchEquipmentList,
  saveEquipmentList,
  deleteEquipmentList,
  saveDataItemList,
  fetchDataItemList,
  deleteDataItemList,
} from '@/services/process/technologyService';
import { fetchAttributeList, saveAttribute, fetchSelectList } from '@/services/api';
import { ergodicData } from '@/utils/utils';
import { queryMapIdpValue } from 'hzero-front/lib/services/api';

export default {
  namespace: 'technology',
  state: {
    operationList: [], // 工艺维护列表
    operationPagination: {}, // 工艺维护分页
    technologyItem: {}, // 工艺维护单条详情
    typeList: [], // 类型下拉
    sitesList: [], // 站点下拉
    statusList: [], // 状态下拉
    workCellList: [], // 工作单元类型下拉
    childStepsList: [], // 子步骤列表
    childStepsPagination: {}, // 子步骤列表分页
    currentChangeChildSteps: [], // 子步骤列表修改项
    attrTabList: [], // Tab扩展列表
    attrList: [], // 扩展字段列表
    attrPagination: {}, // 扩展字段属性
    qualityList: [], // 资质列表
    qualityPagination: {}, // 资质列表分页
    qualityListSave: [], // 已保存的资质数据
    qualityPaginationSave: {}, // 已保存的资质数据分页
    equipmentCategoryList: [], // 设备类别
    qualityType: [], // 熟练程度
    equipmentList: [], // 设备要求
    equipmentPagination: {}, // 设备要求 分页
    dataItemList: [],
    dataItemPagination: {},
  },
  effects: {
    // 获取值集
    * fetchEnum(_, { call, put }) {
      const res = yield call(queryMapIdpValue, {
        qualityType: 'HME.QUALITY_TYPE', // 熟练程度
        equipmentCategoryList: 'HME.EQUIPMENT_CATEGORY', // 设备类别
      });
      const safeRes = getResponse(res);
      if (safeRes) {
        yield put({
          type: 'updateState',
          payload: {
            ...safeRes,
          },
        });
      }
    },
    // 获取工艺维护列表
    *fetchOperationList({ payload }, { call, put }) {
      const res = yield call(fetchOperationList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            operationList: chainget(list, 'rows.content', []),
            operationPagination: createPagination(list.rows),
          },
        });
      }
      return list;
    },
    // 获取下拉
    *fetchSelectList({ payload }, { call, put }) {
      const result = yield call(fetchSelectList, payload);
      const list = getResponse(result);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            [payload.stateType]: list.rows,
          },
        });
      }
      return getResponse(result);
    },
    // 获取站点下拉
    *fetchSiteOption({ payload }, { call, put }) {
      const res = yield call(fetchSiteOption, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            sitesList: list.rows,
          },
        });
      }
      return list;
    },
    // 获取状态下拉
    *fetchStatusOption({ payload }, { call, put }) {
      const res = yield call(fetchStatusOption, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            statusList: list.rows,
          },
        });
      }
      return list;
    },
    // 获取单条数据详情
    *fetchSingleOperation({ payload }, { call, put }) {
      const res = yield call(fetchSingleOperation, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            technologyItem: list.rows,
          },
        });
        return res;
      }
      return list;
    },
    // 保存工艺维护数据
    *saveOperationList({ payload }, { call }) {
      const result = yield call(saveOperationList, ergodicData(payload));
      return getResponse(result);
    },
    // 获取工艺维护扩展字段
    *fetchAttrCreate({ payload }, { call, put }) {
      const res = yield call(fetchAttributeList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            attrTabList: chainget(list, 'rows', []),
          },
        });
      }
    },
    // 获取子步骤列表数据
    *fetchChilStepsList({ payload }, { call, put, select }) {
      const result = yield select(state => {
        return state.technology.currentChangeChildSteps;
      });
      const res = yield call(fetchChilStepsList, payload);
      const list = getResponse(res);
      if (list) {
        const lastResult = chainget(list, 'rows.content', []).map(ele => {
          if (result.some(eles => ele.operationSubstepId === eles.operationSubstepId)) {
            return {
              ...result.filter(eles => ele.operationSubstepId === eles.operationSubstepId)[0],
            };
          }
          return ele;
        });
        yield put({
          type: 'updateState',
          payload: {
            childStepsList: lastResult,
            childStepsPagination: createPagination(list.rows),
          },
        });
      }
      return list;
    },
    // 删除子步骤列表
    *deleteChildStepsList({ payload }, { call }) {
      const result = yield call(deleteChildStepsList, payload);
      return getResponse(result);
    },

    // 获取扩展字段属性
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

    // 保存扩展字段属性
    *saveAttrList({ payload }, { call }) {
      const result = yield call(saveAttribute, ergodicData(payload));
      if (result) {
        return result;
      }
    },
    // 查询已保存的资质数据
    *fetchQualityList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchQualityList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            qualityListSave: res.content,
            qualityPaginationSave: createPagination(res),
          },
        });
      }
      return res;
    },
    // 查询已保存数据项
    *fetchDataItemList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchDataItemList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            dataItemList: res.content,
            dataItemPagination: createPagination(res),
          },
        });
      }
      return res;
    },
    // 查询资质
    *fetchQuality({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchQuality, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            qualityList: res.content,
            qualityPagination: createPagination(res),
          },
        });
      }
      return res;
    },
    // 保存资质
    *saveQuality({ payload }, { call }) {
      const res = getResponse(yield call(saveQuality, payload));
      return res;
    },
    // 删除资质
    *delQuality({ payload }, { call }) {
      const res = getResponse(yield call(delQuality, payload));
      return res;
    },
    *fetchEquipmentList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchEquipmentList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            equipmentList: res.content,
            equipmentPagination: createPagination(res),
          },
        });
      }
    },
    *saveEquipmentList({ payload }, { call }) {
      const res = getResponse(yield call(saveEquipmentList, payload));
      return res;
    },
    *deleteEquipmentList({ payload }, { call }) {
      const res = getResponse(yield call(deleteEquipmentList, payload));
      return res;
    },
    *saveDataItemList({ payload }, { call }) {
      const res = getResponse(yield call(saveDataItemList, payload));
      return res;
    },
    *deleteDataItemList({ payload }, { call }) {
      const res = getResponse(yield call(deleteDataItemList, payload));
      return res;
    },
  },

  reducers: {
    clear() {
      return {
        technologyItem: {}, // 工艺维护单条详情
        typeList: [], // 类型下拉
        sitesList: [], // 站点下拉
        statusList: [], // 状态下拉
        workCellList: [], // 工作单元类型下拉
        childStepsList: [], // 子步骤列表
        childStepsPagination: {}, // 子步骤列表分页
        currentChangeChildSteps: [], // 子步骤列表修改项
        attrTabList: [], // Tab扩展列表
        attrList: [], // 扩展字段列表
      };
    },
    updateState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
