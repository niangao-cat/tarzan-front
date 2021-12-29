/*
 * @Description: 芯片不良
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-21 13:51:22
 * @LastEditTime: 2021-03-09 16:54:52
 */

import { getResponse } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import {
  enterSite,
  getSiteList,
  scanMaterialCode,
  confirm,
  chipScrapped,
  checkMaterialCode,
} from '@/services/hhme/chipLabCodeInputService';

export default {
  namespace: 'chipLabCodeInput',
  state: {
    workcellInfo: {}, // 工位信息
    defaultSite: {},
    containerInfo: {}, // 容器信息
    selectInfo: [], // 选中单元格的信息
  },
  effects: {
    // 批量查询独立值集
    *batchLovData(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          containerType: 'HME_COS_CONTAINER_TYPE', // 容器类型
        })
      );
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            lovData: {
              ...result,
            },
          },
        });
      }
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
    *enterSite({ payload }, { call, put }) {
      const result = getResponse(yield call(enterSite, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            workcellInfo: {
              ...result,
              operationId: result.operationIdList[0],
            },
          },
        });
      }
      return result;
    },

    // 扫描条码
    *scanMaterialCode({ payload }, { call, put }) {
      const res = getResponse(yield call(scanMaterialCode, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            containerInfo: res,
          },
        });
      }
      return res;
    },

    // 出站
    *confirm({ payload }, { call, put }) {
      const res = yield call(confirm, payload);
      if (!(res && res.failed)) {
        yield put({
          type: 'updateState',
          payload: {
            containerInfo: {}, // 容器信息
            selectInfo: [], // 选中单元格的信息
            selectChipInfo: {},
          },
        });
      }
      return res;
    },

    // 芯片报废
    *chipScrapped({ payload }, { call }) {
      const res = getResponse(yield call(chipScrapped, payload));
      return res;
    },

    *checkMaterialCode({ payload }, { call }) {
      const result = getResponse(yield call(checkMaterialCode, payload));
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
