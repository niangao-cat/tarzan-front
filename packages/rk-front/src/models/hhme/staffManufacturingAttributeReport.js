import { getResponse, createPagination, getCurrentOrganizationId } from 'utils/utils';
import { queryMapIdpValue, queryUnifyIdpValue } from 'services/api';
import { isArray } from 'lodash';
import {
  fetchList,
} from '../../services/hhme/staffManufacturingAttributeReportService';

const tenantId = getCurrentOrganizationId();
export default {
  namespace: 'staffManufacturingAttributeReport',
  state: {
    list: [],
    pagination: {},
    qualityType: [],
    proficiency: [],
  },

  effects: {
     // 批量查询独立值集
     *batchLovData(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          qualityType: 'HME.QUALITY_TYPE', // 资质类型
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
    // 获取值集
    * fetchEnum(_, { call, put }) {
    const res = yield call(queryMapIdpValue, {
      //employeeStatus: 'HPFM.EMPLOYEE_STATUS',
      qualityType: 'HME.QUALITY_TYPE', // 资质类型
      proficiency: 'HME.PROFICIENCY', // 熟练程度
    });
    const safeRes = getResponse(res);
    if (safeRes) {
      yield put({
        type: 'updateState',
        payload: {
          qualityType: safeRes.qualityType,
          proficiency: safeRes.proficiency,
        },
      });
    }
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
      console.log("render state  和 action");
      console.log(state);
      console.log(action.payload);
      return {
        ...state,
        ...action.payload,
      };
    },
  },
}
