/**
 * abnormalReport - 异常信息查看报表models
 * @date: 2020/02/27 19:53:47
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import { getResponse, createPagination, getCurrentOrganizationId } from 'utils/utils';
import { queryMapIdpValue, queryUnifyIdpValue } from 'services/api';
import { isArray } from 'lodash';
import {
  fetchList,
} from '../../services/hhme/abnormalReportService';

const tenantId = getCurrentOrganizationId();

export default {
  namespace: 'abnormalReport',
  state: {
    list: [],
    pagination: {},
    abnormalTypeList: [],
    abnormalStatusList: [],
    areaList: [],
  },
  effects: {
    *init(_, { call, put }) {
      const res = getResponse(yield call(queryMapIdpValue, {
        abnormalStatusList: 'HME.EXCEPTION_STATUS',
      }));
      const params = {
        tenantId,
      };
      const abnormalTypeList = getResponse(yield call(queryUnifyIdpValue, 'HME.EXCEPTION_TYPE', params));
      const areaList = getResponse(yield call(queryUnifyIdpValue, 'HME.AREA_NAME'));
      yield put({
        type: 'updateState',
        payload: {
          ...res,
          abnormalTypeList,
          areaList: isArray(areaList) ? areaList : [],
        },
      });
    },
    *fetchList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            list: res.content,
            pagination: createPagination(res),
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
