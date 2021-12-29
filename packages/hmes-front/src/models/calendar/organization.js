/**
 * @date 2019-12-23
 * @author HDY <deying.huang@hand-china.com>
 */
import { get as chainget } from 'lodash';
import { getResponse, createPagination } from 'utils/utils';

import { fetchSelectList, fetchCalendarOrgList } from '../../services/calendar/organizationService';

export default {
  namespace: 'organization',
  state: {
    orgTypeList: [], // 组织类型下拉框数据
    calendarOrgList: [], // 组织所属日历list
    calendarOrgPagination: {}, // 组织所属日历分页
  },
  effects: {
    // 获取工作日历类型下拉框数据
    *fetchOrgTypeList({ payload }, { call, put }) {
      const res = yield call(fetchSelectList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            orgTypeList: chainget(list, 'rows', []),
          },
        });
      }
    },

    // 查询组织所属日历
    *fetchCalendarOrgList({ payload }, { call, put }) {
      const res = yield call(fetchCalendarOrgList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            calendarOrgList: chainget(list, 'rows.content', []),
            calendarOrgPagination: createPagination(list.rows),
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
