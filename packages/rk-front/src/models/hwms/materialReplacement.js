/**
 * model - 料废调换查询
 * @date: 2020/05/18 18:25:14
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import { getResponse, createPagination} from 'utils/utils';
import { ergodicData } from '@/utils/utils';
import { fetchHeadList, fetchLineList, saveLine, getSiteList} from '../../services/hwms/materialReplacementService';
import { queryMapIdpValue } from '../../services/api';

export default {
  namespace: 'materialReplacement',
  state: {
    headList: [],
    pagination: {},
    lineList: [],
    linePagination: {},
    selectedRecord: {},
    statusList: [],
    versionList: [],
    siteInfo: {}, // 用户默认站点
  },
  effects: {
    *init(_, { call, put }) {
      const lovBatchRes = yield call(queryMapIdpValue, {
        statusList: 'WMS.SUPPLIER_EXCHANGE_DOC.STATUS',
        versionList: 'HCM.MATERIAL_VERSION',
      });
      const lovBatch = getResponse(lovBatchRes);
      yield put({
        type: 'updateState',
        payload: {
          statusList: lovBatch.statusList,
          versionList: lovBatch.versionList,
        },
      });
    },
    *fetchHeadList({ payload }, { call, put }) {
      const res = getResponse(yield call(fetchHeadList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            headList: res.content,
            pagination: createPagination(res),
          },
        });
      }
      return res;
    },
    *fetchLineList({ payload }, { call, put }) {
      const { selectedRecord, page } = payload;
      const res = getResponse(
        yield call(fetchLineList, { instructionDocId: selectedRecord.instructionDocId, page })
      );
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            lineList: res.content,
            selectedRecord,
            linePagination: createPagination(res),
          },
        });
      }
      return res;
    },
    *saveLine({ payload }, { call }) {
      const result = yield call(saveLine, ergodicData(payload));
      return getResponse(result);
    },
    // 获取默认工厂
    *getSiteList({ payload }, { call, put }) {
      const result = getResponse(yield call(getSiteList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            siteInfo: result,
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
