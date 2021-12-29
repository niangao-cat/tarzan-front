/**
 * @date 2019-7-15
 * @author HDY <deying.huang@hand-china.com>
 */

import { getResponse, createPagination } from 'utils/utils';
import { ergodicData } from '@/utils/utils';
import uuid from 'uuid/v4';

import {
  fetchQueryBomList,
  fetchComponentLineRowList,
  fetchSubstituteGroupList,
  fetchSubstituteItemList,
  fetchReferencePointList,
  fetchSiteList,
  fetchExtendedAttributeList,
  copyBom,
  saveSite,
  saveExtendedField,
  saveComponentLineRow,
  saveSubstituteGroup,
  saveSubstituteItem,
  saveReferencePoint,
  fetchAssemblyTypes,
  fetchAssemblyStatus,
  saveAssemblyDetail,
  confirmAssembly,
  fetchBomDetail,
} from '../../services/product/assemblyListService';
import { queryMapIdpValue } from '../../services/api';

export default {
  namespace: 'assemblyList',
  state: {
    displayList: {}, // 显示装配清单表单的数据
    bomList: [], // 装配清单表格数据源
    bomPagination: {}, // 装配清单分页
    componentLineList: [], // 组件行表格数据源
    componentLineRowList: {}, // 组件行表格行数据
    issueList: [], // 库位关系表格数据源
    issuePagination: {}, // 库位关系分页
    substituteGroupList: [], // 替代组表格数据源
    substituteItemList: [], // 替代项表格数据源
    substituteItemPagination: {}, // 替代项分页
    referencePointList: [], // 参考点表格数据源
    referencePointPagination: {}, // 参考点分页
    siteList: [], // 站点分配表格数据源
    sitePagination: {}, // 站点分配分页
    extendedFieldList: [], // 扩展字段表格数据源
    extendedFieldPagination: {}, // 扩展字段分页
    attributeList: [], // 扩展属性表格数据源
    attributePagination: {}, // 扩展属性分页
    bomStatusList: [], // select中的状态数据源
    bomTypesList: [], // select中的类型数据源
    // bomTypesTargetsList: [], // 目标BOM类型select中的数据源
    displayListDetail: {}, // 装配清单表单的数据
    bomSubstitutePolicy: [], // 替代策略的数据
    queryFormFieldsValue: {},
    queryFormPagination: {},
  },
  effects: {
    // 统一获取值级的数据
    *batchCode({ payload }, { put, call }) {
      const { lovCodes } = payload;
      const code = getResponse(yield call(queryMapIdpValue, lovCodes));
      if (code) {
        const {
          dataSourceType: dataSourceTypeList = [],
          dbPoolType: dbPoolTypeList = [],
          dsPurposeCode: dsPurposeCodeList = [],
        } = code;
        yield put({
          type: 'updateState',
          payload: {
            dataSourceTypeList,
            dbPoolTypeList,
            dsPurposeCodeList,
          },
        });
      }
      return code;
    },

    // 获取装配清单首页列表数据
    *fetchQueryBomList({ payload }, { call, put }) {
      const res = yield call(fetchQueryBomList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            bomList: list.rows.content,
            bomPagination: createPagination(list.rows),
          },
        });
      }
    },

    // 查询筛选条件的类型
    *fetchAssemblyTypes({ payload }, { call, put }) {
      const result = yield call(fetchAssemblyTypes, payload);
      const list = getResponse(result);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            bomTypesList: list.rows,
          },
        });
      }
    },

    // 查询替代策略
    *fetchAssemblySubstitutePolicy({ payload }, { call, put }) {
      const result = yield call(fetchAssemblyTypes, payload);
      const list = getResponse(result);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            bomSubstitutePolicy: list.rows,
          },
        });
      }
    },

    // 查询组件行详情里的组件类型
    *fetchAssemblyComponentLineTypes({ payload }, { call }) {
      const result = yield call(fetchAssemblyTypes, payload);
      return getResponse(result);
    },

    // 查询筛选条件的状态
    *fetchAssemblyStatus({ payload }, { call, put }) {
      const result = yield call(fetchAssemblyStatus, payload);
      const list = getResponse(result);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            bomStatusList: list.rows,
          },
        });
      }
    },

    // 获取装配清单明细数据
    *fetchComponentLineList({ payload }, { call, put }) {
      const res = yield call(fetchBomDetail, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            displayList: [],
            displayListDetail: list.rows,
            componentLineList: list.rows.componentList,
          },
        });
      }
      return getResponse(res);
    },

    // 获取装配清单明细数据
    *fetchComponentLineRowList({ payload }, { call, put }) {
      const res = yield call(fetchComponentLineRowList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            componentLineRowList: list,
          },
        });
      }
      return getResponse(res);
    },

    // 获取替代组数据
    *fetchSubstituteGroupList({ payload }, { call, put }) {
      const res = yield call(fetchSubstituteGroupList, payload);
      if (res && res.success) {
        const newSubStituteGroupList = res.rows.map(item => {
          return {
            ...item,
            uuid: uuid(),
          };
        });
        yield put({
          type: 'updateState',
          payload: {
            substituteGroupList: newSubStituteGroupList,
          },
        });
      }
    },

    // 获取替代项数据
    *fetchSubstituteItemList({ payload }, { call, put }) {
      const res = yield call(fetchSubstituteItemList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            substituteItemList: list.rows,
          },
        });
      }
    },

    // 获取参考点数据
    *fetchReferencePointList({ payload }, { call, put }) {
      const res = yield call(fetchReferencePointList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            referencePointList: list.rows,
          },
        });
      }
    },

    // 获取站点分配数据
    *fetchSiteList({ payload }, { call, put }) {
      const res = yield call(fetchSiteList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            siteList: list.rows,
          },
        });
      }
    },

    // 获取扩展属性数据
    *fetchExtendedAttributeList({ payload }, { call, put }) {
      const res = yield call(fetchExtendedAttributeList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            attributeList: list.rows,
            attributePagination: createPagination(list),
          },
        });
      }
    },

    // 复制
    *copyBom({ payload }, { call }) {
      const result = yield call(copyBom, ergodicData(payload));
      return getResponse(result);
    },

    // 分配站点保存站点
    *saveSite({ payload }, { call }) {
      const result = yield call(saveSite, ergodicData(payload));
      return getResponse(result);
    },
    // 保存扩展字段
    *saveExtendedField({ payload }, { call }) {
      const result = yield call(saveExtendedField, ergodicData(payload));
      return getResponse(result);
    },
    // 保存组件行
    *saveComponentLineRow({ payload }, { call }) {
      const result = yield call(saveComponentLineRow, ergodicData(payload));
      return getResponse(result);
    },
    // 保存替代组
    *saveSubstituteGroup({ payload }, { call }) {
      const result = yield call(saveSubstituteGroup, ergodicData(payload));
      return getResponse(result);
    },
    // 保存替代项
    *saveSubstituteItem({ payload }, { call }) {
      const result = yield call(saveSubstituteItem, ergodicData(payload));
      return getResponse(result);
    },
    // 保存参考点
    *saveReferencePoint({ payload }, { call }) {
      const result = yield call(saveReferencePoint, ergodicData(payload));
      return getResponse(result);
    },
    // 保存装配清单明细saveAssemblyDetail
    *saveAssemblyDetail({ payload }, { call }) {
      const result = yield call(saveAssemblyDetail, ergodicData(payload));
      return getResponse(result);
    },
    // 保存装配清单前进行验证confirmAssembly
    *confirmAssembly({ payload }, { call }) {
      const result = yield call(confirmAssembly, ergodicData(payload));
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
