/**
 * @date 2019-7-30
 * @author HDY <deying.huang@hand-china.com>
 */
import { get as chainget } from 'lodash';
import uuid from 'uuid/v4';
import { getResponse, createPagination } from 'utils/utils';
import { ergodicData } from '@/utils/utils';
import {
  fetchExtendTableList,
  saveExtendTable,
  fetchServicePackageList,
  saveExtendFieldList,
} from '../../services/hmes/extendTableService';

export default {
  namespace: 'extendTable',
  state: {
    extendTableList: [], // 扩展表数据源
    extendTablePagination: {}, // 扩展表格分页
    servicePackageList: [], // 服务包下拉框数据
    fieldDrawerList: [],
  },
  effects: {
    // 获取扩展表数据
    *fetchExtendTableList({ payload }, { call, put }) {
      const res = yield call(fetchExtendTableList, payload);
      const list = getResponse(res);
      if (list && list.success) {
        yield put({
          type: 'updateState',
          payload: {
            extendTableList: chainget(list, 'rows.content', []),
            extendTablePagination: createPagination(list.rows),
          },
        });
      }
    },

    // 获取服务包下拉框数据
    *fetchServicePackageList({ payload }, { call, put }) {
      const res = yield call(fetchServicePackageList, payload);
      const list = getResponse(res);
      if (list && list.success) {
        yield put({
          type: 'updateState',
          payload: {
            servicePackageList: chainget(list, 'rows', []).map(item => {
              return {
                ...item,
                uuid: uuid(),
                _status: 'update',
              };
            }),
          },
        });
      }
    },

    *saveExtendFieldList({ payload }, { call }) {
      const res = getResponse(yield call(saveExtendFieldList, payload));
      return res;
    },

    *changeOvge({ payload }, { call }) {
      const list = payload.fieldDrawerList.map((item, index) => ({
        ...item,
        sequence: index,
      }));
      const res = getResponse(yield call(saveExtendFieldList, list));
      return res;
    },

    // 保存扩展表
    *saveExtendTable({ payload }, { call }) {
      const result = yield call(saveExtendTable, ergodicData(payload));
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
