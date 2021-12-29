/**
 * @date 2019-8-1
 * @author TJX <jiaxu.tang@hand-china.com>
 */

import { getResponse, createPagination } from 'utils/utils';
import { get as chainget } from 'lodash';
import {
  fetchDefectCodeList, // 获取不良代码列表
  saveDefectCodeList, // 保存不良代码列表
  fetchSingleCode,
  deleteSecCode,
  deleteProcessDispatch, // 删除工艺分配
  // fetchChilStepsList,
  // saveChildStepsList,
  // deleteChildStepsList,
  // fetchSelectOption,
} from '@/services/badCode/defectCodeService';
import { fetchAttributeList, saveAttribute, fetchSelectList } from '@/services/api';
import { ergodicData } from '@/utils/utils';

export default {
  namespace: 'defectCode',
  state: {
    defectCodeList: [], // 不良代码列表
    defectCodePagination: {}, // 不良代码分页
    tabAttributeList: [], // tab页扩展字段列表
    defectCodeItem: {}, // 不良代码单条详情
    mtNcSecondaryCodeList: [], //
    mtNcValidOperList: [],
    secCodeList: [], // 次级不良代码列表
    ncTypeList: [], // 不良代码类型
    canBePrimaryCode: true, // 可以为主代码开启
    limitSiteId: undefined,
  },
  effects: {
    // 获取不良代码列表
    *fetchDefectCodeList({ payload }, { call, put }) {
      const res = yield call(fetchDefectCodeList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            defectCodeList: chainget(list, 'rows.content', []),
            defectCodePagination: createPagination(chainget(list, 'rows', {})),
          },
        });
      }
      return list;
    },
    // 保存不良代码列表
    *saveDefectCodeList({ payload }, { call }) {
      const result = yield call(saveDefectCodeList, ergodicData(payload));
      return getResponse(result);
    },

    // 获取tab扩展字段属性
    *fetchAttributeList({ payload }, { call, put }) {
      const res = yield call(fetchAttributeList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            tabAttributeList: chainget(list, 'rows', []),
          },
        });
      }
      return list;
    },
    // 获取不良代码类型下拉
    *fetchCommonOption({ payload }, { call, put }) {
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
    // 获取单条详情数据
    *fetchSingleCode({ payload }, { call, put }) {
      const res = yield call(fetchSingleCode, payload);
      const list = getResponse(res);
      if (list) {
        const data = list.rows.mtNcValidOperList;
        // data.forEach(item => {
        //   // eslint-disable-next-line no-param-reassign
        //   item.uuid = new Date().getTime().toString();
        // });

        // 代码规范
        for(let i=0; i<data.length; i++){
          data[i].uuid =new Date().getTime().toString();
        }

        yield put({
          type: 'updateState',
          payload: {
            defectCodeItem: chainget(list, 'rows.mtNcCode', {}),
            mtNcSecondaryCodeList: chainget(list, 'rows.mtNcSecondaryCodeList', []),
            mtNcValidOperList: chainget(list, 'rows.mtNcValidOperList', []),
            canBePrimaryCode: chainget(list, 'rows.mtNcCode.canBePrimaryCode', true) !== 'N',
            limitSiteId: chainget(list, 'rows.mtNcCode.siteId', undefined),
          },
        });
      }
      return list;
    },
    // 删除次级不良代码
    *deleteSecCode({ payload }, { call }) {
      const result = yield call(deleteSecCode, ergodicData(payload));
      return getResponse(result);
    },
    // 删除工艺分配
    *deleteProcessDispatch({ payload }, { call }) {
      const result = yield call(deleteProcessDispatch, ergodicData(payload));
      return getResponse(result);
    },
    // // 删除子步骤列表
    // *deleteChildStepsList({ payload }, { call }) {
    //   const result = yield call(deleteChildStepsList, payload);
    //   return getResponse(result);
    // },
    // 获取下拉
    // *fetchSelectOption({ payload }, { call }) {
    //   const res = yield call(fetchSelectOption, payload);
    //   const list = getResponse(res);
    //   return list;
    // },

    // 保存扩展字段属性
    *saveAttrList({ payload }, { call }) {
      const result = yield call(saveAttribute, ergodicData(payload));
      return getResponse(result);
    },
    *updateStateSelf({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload,
      });
      return '';
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
