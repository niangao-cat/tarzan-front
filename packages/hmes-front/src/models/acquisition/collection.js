/**
 * @date 2019-7-29
 * @author HDY <deying.huang@hand-china.com>
 */

import { getResponse, createPagination } from 'utils/utils';
import { ergodicData } from '@/utils/utils';
import {
  fetchTagList,
  saveTag,
  fetchSingleTag,
  copyTag,
  fetchTagGroupList,
  fetchTagListHistory,
  fetchTagAssinHistory,
  fetchObjectHistory,
  synchronous,
  removeTagGroupList,
} from '@/services/acquisition/collectionService';
import {
  fetchAttributeList,
  fetchSelectList,
  fetchStatueSelectList,
  saveAttribute,
} from '@/services/api';
import { get as chainGet } from 'lodash';

export default {
  namespace: 'collection',
  state: {
    tagList: [], // 消息表格数据源
    tagPagination: {}, // 消息表格分页
    attributeList: [], // 扩展字段列表
    mtTagGroupDTO: {},
    mtTagGroupObjectDTO: {},
    statusList: [], // 状态下拉列表
    typeList: [], // 类型下拉列表
    businessList: [], // 业务类型
    collectionTimeControl: [], // 数据收集时点
    collectionMthodList: [],
    valueTypeList: [],
    tagGroupList: [], // 数据项信息
    tagGroupPagination: {},
    tagListHistory: [],
    tagPaginationHistory: {},
    tagGroupListHistory: [],
    tagGroupPaginationHistory: {},
    tagObjectHistory: [],
    tagObjectPaginationHistory: {},
  },
  effects: {
    // 获取下拉
    *fetchSelectOption({ payload }, { call, put }) {
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

    // 获取status下拉
    *fetchStatueSelectList({ payload }, { call, put }) {
      const res = yield call(fetchStatueSelectList, payload);
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
    // 获取数据源列表数据
    *fetchTagList({ payload }, { call, put }) {
      const res = yield call(fetchTagList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            tagList: chainGet(list, 'rows.content', []),
            tagPagination: createPagination(chainGet(list, 'rows', {})),
          },
        });
      }
      return list;
    },

    // 删除数据项tab表格行
    *removeTagGroupList({ payload }, { call }) {
      const result = yield call(removeTagGroupList, payload);
      return getResponse(result);
    },

    // 保存消息
    *saveTag({ payload }, { call }) {
      const result = yield call(saveTag, ergodicData(payload));
      return getResponse(result);
    },

    // 数据详情
    *fetchSingleTag({ payload }, { call, put }) {
      const res = yield call(fetchSingleTag, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            mtTagGroupObjectDTO: chainGet(list, 'rows.mtTagGroupObjectDTO', {}),
            mtTagGroupDTO: chainGet(list, 'rows.mtTagGroupDTO', {}),
          },
        });
      }
      return list;
    },
    // 复制数据
    *copyTag({ payload }, { call }) {
      const result = yield call(copyTag, ergodicData(payload));
      return getResponse(result);
    },
    *synchronous({ payload }, { call }) {
      const res = yield call(synchronous, payload);
      const list = getResponse(res);
      return list;
    },
    // 获取数据项信息
    *fetchTagGroupList({ payload }, { call, put }) {
      const res = yield call(fetchTagGroupList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            tagGroupList: chainGet(list, 'rows.content', []),
            tagGroupPagination: createPagination(chainGet(list, 'rows', {})),
          },
        });
      }
      return list;
    },
    *fetchTagListHistory({ payload }, { call, put }) {
      const res = yield call(fetchTagListHistory, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            tagListHistory: chainGet(list, 'rows.content', []),
            tagPaginationHistory: createPagination(chainGet(list, 'rows', {})),
          },
        });
      }
      return list;
    },
    *fetchTagAssinHistory({ payload }, { call, put }) {
      const res = yield call(fetchTagAssinHistory, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            tagGroupListHistory: chainGet(list, 'rows.content', []),
            tagPaginationHistory: createPagination(chainGet(list, 'rows', {})),
          },
        });
      }
      return list;
    },
    *fetchObjectHistory({ payload }, { call, put }) {
      const res = yield call(fetchObjectHistory, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            tagObjectHistory: chainGet(list, 'rows.content', []),
            tagObjectPaginationHistory: createPagination(chainGet(list, 'rows', {})),
          },
        });
      }
      return list;
    },
    // 保存扩展字段
    *saveAttribute({ payload }, { call }) {
      const result = yield call(saveAttribute, ergodicData(payload));
      return getResponse(result);
    },
  },

  reducers: {
    clear() {
      return {
        tagList: [], // 消息表格数据源
        tagPagination: {}, // 消息表格分页
        attributeList: [], // 扩展字段列表
        mtTagGroupDTO: {},
        mtTagGroupObjectDTO: {},
        statusList: [], // 状态下拉列表
        typeList: [], // 类型下拉列表
        businessList: [], // 业务类型
        collectionTimeControl: [], // 数据收集时点
        collectionMthodList: [],
        valueTypeList: [],
        tagGroupList: [], // 数据项信息
        tagGroupPagination: {},
        tagListHistory: [],
        tagPaginationHistory: {},
        tagGroupListHistory: [],
        tagGroupPaginationHistory: {},
        tagObjectHistory: [],
        tagObjectPaginationHistory: {},
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
