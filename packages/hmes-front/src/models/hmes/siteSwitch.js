/**
 * @date 2019-12-16
 * @author HDY <deying.huang@hand-china.com>
 */

import { get as chainget } from 'lodash';
import Cookies from 'universal-cookie';
import { fetchSiteOptions } from '../../services/hmes/siteSwitchService';
import { fetchDefaultSite } from '@/services/api';

const cookies = new Cookies();

export default {
  namespace: 'siteSwitch',
  state: {
    defaultSiteId: [], // 用户默认站点
    defaultSiteCode: [], // 用户默认站点编码
    siteOptions: [], // 默认站点列表
  },
  effects: {
    // 获取用户权限数据
    *fetchDefaultSite({ payload }, { call, put }) {
      const res = yield call(fetchDefaultSite, payload);
      if (res && res.success && res.rows) {
        yield put({
          type: 'updateState',
          payload: {
            defaultSiteId: chainget(res, 'rows.siteId', ''),
            defaultSiteCode: chainget(res, 'rows.siteCode', ''),
          },
        });
        cookies.set('defaultSiteId', res.rows.siteId);
        cookies.set('defaultSiteCode', res.rows.siteCode);
      }
    },

    // 获取默认站点列表
    *fetchSiteOptions({ payload }, { call, put }) {
      const res = yield call(fetchSiteOptions, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            siteOptions: chainget(res, 'rows', []),
          },
        });
      }
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
