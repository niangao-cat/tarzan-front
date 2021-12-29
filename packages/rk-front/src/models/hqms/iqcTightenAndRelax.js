/*
 * @Description: 加严放宽设置
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-05-22 09:01:34
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-05-25 10:55:35
 * @Copyright: Copyright (c) 2019 Hand
 */
import { getResponse, createPagination } from 'utils/utils';
import { fetchList, saveData, deleteData, getSiteList } from '@/services/hqms/iqcTightenAndRelaxService';

export default {
  namespace: 'tightenAndRelax',
  state: {
    dataList: [], // 数据
    pagination: {}, // 分页
    defaultSite: {}, // 默认站点
  },
  effects: {
    // 数据查询
    *fetchList({ payload }, { call, put }) {
      const res = yield call(fetchList, payload);
      const list = getResponse(res);
      if (list) {
        for (const item of list.content) {
          item.enableFlag = item.flag;
        }
        yield put({
          type: 'updateState',
          payload: {
            dataList: list.content,
            pagination: createPagination(list),
          },
        });
      }
      return list;
    },
    // 保存数据
    *saveData({ payload }, { call }) {
      const result = getResponse(yield call(saveData, payload));
      return getResponse(result);
    },

    // 删除数据
    *deleteData({ payload }, { call }) {
      const result = yield call(deleteData, payload);
      return getResponse(result);
    },

    // 获取默认工厂
    *getSiteList({ payload }, { call, put }) {
      const result = getResponse(yield call(getSiteList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            defaultSite: result,
          },
        });
      }
      return result;
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
