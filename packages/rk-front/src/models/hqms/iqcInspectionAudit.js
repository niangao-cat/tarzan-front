/*
 * @Description: IQC检验审核
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-05-19 09:48:01
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-07-06 17:04:21
 * @Copyright: Copyright (c) 2019 Hand
 */
import { queryMapIdpValue } from 'services/api';
import { getResponse, createPagination, parseParameters } from 'utils/utils';
import {
  fetchAuditist,
  fetchiqcLine,
  handleSearchRowDetail,
  auditis,
} from '@/services/hqms/iqcInspectionAuditService';

export default {
  namespace: 'iqcInspectionAudit',
  state: {
    iqcauditist: [], // 检验审核数据
    auditistListPagination: {}, // 检验审核数据分页
    iqcHeader: [], // 检验单头部数据
    iqcLine: [], // 检验单行数据
    iqcLinePagination: {}, // 检验单行数据分页
    rowDetailList: [], // 质检单明细数据
    rowDetailListPagination: {}, // 质检单明细数据分页
    search: {}, // 暂存显示数据
  },
  effects: {
    // 批量查询独立值集
    *batchLovData(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          iqcDocStatus: 'QMS.INSPECTION_DOC_STATUS',
          iqcinspetionResult: 'QMS.INSPECTION_RESULT',
          finalDecision: 'QMS.FINAL_DECISION',
          docIdentification: 'QMS.IDENTIFICATION',
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
    // 获取iqc检验审核数据
    *fetchAuditist({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchAuditist, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            iqcauditist: result.content,
            auditistListPagination: createPagination(result),
          },
        });
      }
      return result;
    },
    // 查询头明细
    *fetchAuditistDetail({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchAuditist, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            iqcHeader: result.content,
          },
        });
      }
      return result;
    },
    // 获取检验单行数据
    *fetchiqcLine({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchiqcLine, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            iqcLine: result.content,
            iqcLinePagination: createPagination(result),
          },
        });
      }
      return result;
    },
    // 查询质检单明细数据
    *handleSearchRowDetail({ payload }, { call, put }) {
      const result = getResponse(yield call(handleSearchRowDetail, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            rowDetailList: result.content,
            rowDetailListPagination: createPagination(result),
          },
        });
      }
      return result;
    },
    // 让步、挑选、退货
    *auditis({ payload }, { call }) {
      const result = getResponse(yield call(auditis, payload));
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
