/**
 * @date 2019-7-29
 * @author HDY <deying.huang@hand-china.com>
 */

import { getResponse, createPagination } from 'utils/utils';
import { ergodicData } from '@/utils/utils';
import {
  fetchTagList,
  saveTag,
  fetchTagHistory,
  fetchSingleDetail,
  copyTag,
  fetchDataCollection,
  saveDataCollection,
} from '@/services/acquisition/dataItemService';
import { queryMapIdpValue } from 'hzero-front/lib/services/api';
import { fetchSelectList, saveAttribute, fetchAttributeList } from '@/services/api';
import { get as chainGet, isArray } from 'lodash';

export default {
  namespace: 'dataItem',
  state: {
    valueTypeList: [],
    collectionMthodList: [],
    tagList: [],
    tagPagination: {},
    historyList: [],
    historyPagination: {},
    tagItem: {},
    valueType: undefined,
    attributeList: [],
    dataCollection: {},
    qmsDefectLevelList: [],
    qmsInspectionLineTypeList: [],
    qmsInspectionToolList: [],
    attributeInfo: {},
  },
  effects: {
    *initData(_, { call, put }) {
      const params = {
        flagList: 'WMS.FLAG_YN',
        tagTypeList: 'HME.TAG_TYPE',
      };
      const res = getResponse(yield call(queryMapIdpValue, params));
      if(res) {
        yield put({
          type: 'updateState',
          payload: {
            ...res,
          },
        });
      }
      return res;
    },
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
    // 获取下拉值集
    *querySelect({ payload }, { call, put }) {
      const response = yield call(queryMapIdpValue, payload);
      const res = getResponse(response);
      yield put({
        type: 'updateState',
        payload: {
          qmsDefectLevelList: res.qmsDefectLevel || [],
          qmsInspectionLineTypeList: res.qmsInspectionLineType || [],
          qmsInspectionToolList: res.qmsInspectionTool || [],
        },
      });
      return res;
    },
    // 获取数据源列表数据
    *fetchTagList({ payload }, { call, put }) {
      const res = yield call(fetchTagList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            tagList: list.rows.content,
            tagPagination: createPagination(list.rows),
          },
        });
      }
      return list;
    },
    *fetchSingleDetail({ payload }, { call, put }) {
      const res = yield call(fetchSingleDetail, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            tagItem: res.rows,
            valueType: chainGet(res, 'rows.valueType', undefined),
          },
        });
      }
      return list;
    },

    // 保存消息
    *saveTag({ payload }, { call }) {
      const result = yield call(saveTag, ergodicData(payload));
      return getResponse(result);
    },
    *copyTag({ payload }, { call }) {
      const result = yield call(copyTag, ergodicData(payload));
      return getResponse(result);
    },

    // 删除消息
    *fetchTagHistory({ payload }, { call, put }) {
      const res = yield call(fetchTagHistory, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            historyList: list.rows.content,
            historyPagination: createPagination(list.rows),
          },
        });
      }
      return list;
    },

    *saveAttribute({ payload }, { call }) {
      const res = getResponse(yield call(saveAttribute, payload));
      return res;
    },

    *fetchAttributeList({ payload }, { call, put }) {
      const { flagList, tagTypeList, ...params } = payload;
      const res = getResponse(yield call(fetchAttributeList, params));
      if (res.success) {
        const { rows } = res;
        const attributeInfo = {};
        if(isArray(rows)) {
          rows.forEach(e => {
            attributeInfo[e.attrName] = e.attrValue;
          });
          yield put({
            type: 'updateState',
            payload: {
              attributeList: isArray(rows) ? rows : [],
              attributeInfo,
            },
          });
        }
      }
      return res;
    },
    // 获取数据采集
    *fetchDataCollection({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchDataCollection, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            dataCollection: res,
          },
        });
      }
      return res;
    },
    // 保存数据采集
    *saveDataCollection({ payload }, { call }) {
      const res = getResponse(yield call(saveDataCollection, payload));
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
