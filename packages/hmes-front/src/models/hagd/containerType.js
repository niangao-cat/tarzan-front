/**
 * @date 2019-12-4
 * @author Xubiting <biting.xu@hand-china.com>
 */
import { get as chainGet } from 'lodash';
import { ergodicData } from '@/utils/utils';
import { getResponse, createPagination, parseParameters } from 'utils/utils';
import {
  fetchContainerList,
  fetchContainerItem,
  saveContainerItem,
  fetchExtendedAttributes,
  saveExtendedAttributes,
  deleteData,
} from '@/services/hagd/containerService';
import { fetchSelectList, fetchAttributeList, saveAttribute } from '@/services/api';
import { queryMapIdpValue } from 'services/api';

export default {
  namespace: 'containerType',
  state: {
    packingLevel: [], // 包装级别
    containerList: [], // 容器列表
    containerPage: {}, // 容器分页
    attributeList: [], // 扩展字段
    containerItem: {}, // 容器详细
    extendedAttributesList: [],
    pagination: {},
  },
  effects: {
    // 批量查询独立值集
    *batchLovData(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          cosTagType: 'HME_COS_TYPE', // 设备类别
          loadingRules: 'HME.LOADING_RULES',
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
    // 获取包装类型
    *fetchSelectList({ payload }, { call, put }) {
      const res = yield call(fetchSelectList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            [payload.type]: chainGet(list, 'rows', []),
          },
        });
      }
      return list;
    },
    *fetchContainerList({ payload }, { call, put }) {
      const res = yield call(fetchContainerList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            containerList: chainGet(list, 'rows.content', []),
            containerPage: createPagination(chainGet(list, 'rows', {})),
          },
        });
      }
      return list;
    },
    *fetchContainerItem({ payload }, { call, put }) {
      const res = yield call(fetchContainerItem, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            containerItem: chainGet(list, 'rows', {}),
            // attributeList: chainGet(list.rows, 'containerTypeAttrList', []),
          },
        });
      }
    },
    *saveContainerItem({ payload }, { call }) {
      const result = yield call(saveContainerItem, ergodicData(payload));
      return getResponse(result);
    },
    // 获取扩展字段
    *fetchAttributeList({ payload }, { call, put }) {
      const res = yield call(fetchAttributeList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            attributeList: chainGet(list, 'rows', []),
          },
        });
      }
      return list;
    },
    *saveAttribute({ payload }, { call }) {
      const result = yield call(saveAttribute, ergodicData(payload));
      return getResponse(result);
    },
    // 获取扩展属性
    *fetchExtendedAttributes({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchExtendedAttributes, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            extendedAttributesList: result.content,
            pagination: createPagination(result),
          },
        });
      }
      return result;
    },
    *saveExtendedAttributes({ payload }, { call }) {
      const result = yield call(saveExtendedAttributes, payload);
      return getResponse(result);
    },
    *deleteData({ payload }, { call }) {
      const result = yield call(deleteData, payload);
      return getResponse(result);
    },
  },
  reducers: {
    clear() {
      // form默认值
      return {
        containerItem: {},
        attributeList: [],
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
