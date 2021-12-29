/**
 * @date 2019-7-31
 * @author HDY <deying.huang@hand-china.com>
 */

import { get as chainget } from 'lodash';
import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import { ergodicData } from '@/utils/utils';
import {
  fetchUserRightsList,
  saveUserRights,
  fetchDocPrivilegeList,
  saveDocPrivilege,
  fetchOrganizationTypeList,
} from '../../services/hmes/userRightsService';

export default {
  namespace: 'userRights',
  state: {
    userRightsList: [], // 用户权限数据源
    userRightsPagination: {}, // 用户权限格分页
    docPrivilegeList: [], // 对象类型数据源
    docPrivilegePagination: {}, // 对象类型表格分页
    organizationTypeList: [], // 组织层级下拉框数据
    docTypeMap: [], // 单据类型
    locationTypeMap: [], // 仓库类型
    operationTypeMap: [], // 操作类型
  },
  effects: {

    // 查询独立值集
    *init(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          docTypeMap: 'WMS.USER_DOC_TYPE',
          locationTypeMap: 'WMS.USER_WAREHOUSE_TYPE',
          operationTypeMap: 'WMS.USER_OPERATION_TYPE',
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
    // 获取用户权限数据
    *fetchUserRightsList({ payload }, { call, put }) {
      const res = yield call(fetchUserRightsList, payload);
      const list = getResponse(res);
      if (list && list.success) {
        yield put({
          type: 'updateState',
          payload: {
            userRightsList: chainget(list, 'rows.content', []),
            userRightsPagination: createPagination(list.rows),
          },
        });
      }
    },

    // 获取用户权限数据
    *fetchOrganizationTypeList({ payload }, { call, put }) {
      const res = yield call(fetchOrganizationTypeList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            organizationTypeList: chainget(list, 'rows', []),
          },
        });
      }
    },

    // 保存用户权限
    *saveUserRights({ payload }, { call }) {
      const result = yield call(saveUserRights, ergodicData(payload));
      return getResponse(result);
    },

    // 获取单据授权
    *fetchDocPrivilegeList({ payload }, { call, put }) {
      const res = yield call(fetchDocPrivilegeList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            docPrivilegeList: list.content,
            docPrivilegePagination: createPagination(list),
          },
        });
      }
    },

    // 保存单据授权
    *saveDocPrivilege({ payload }, { call }) {
      const result = yield call(saveDocPrivilege, ergodicData(payload));
      return getResponse(result);
      // return result;
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
