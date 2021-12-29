/*
 * @Description: 不良处理平台
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-06-07 18:10:19
 */
import { getResponse, createPagination, parseParameters } from 'utils/utils';
import {
  enterBarCodeHead,
  enterBarCodeLine,
  handleSearch,
  processBadCommit,
  materialBadCommit,
  saveHeadBarCode,
  saveLineBarCode,
  fetchMaterialList,
  fetchProcessBadType,
  fetchOtherStation,
  fetchMaterialBadType,
  fetchBadRecord,
  scanningMaterialLotCode,
  fetchComments,
  deleteBarcode,
  handleCheckBarCode,
  handleFetchCosInfo,
  queryWorkcellId,
} from '@/services/hmes/badHandlingService';
import uuid from 'uuid/v4';

export default {
  namespace: 'badHandling',
  state: {
    otherProcessData: {
      workCellId: -1,
    }, // 选中的其他工序数据
    processBadTypeData: {
      ncCodeId: -1,
    }, // 工序不良-不良类型
    materialBadTypeData: {
      ncCodeId: -1,
    }, // 材料不良-不良类型
    barCodeRecord: {}, // 条码明细
    badChecklist: [], // 材料不良-新增不良清单
    badChecklistPagination: {}, // 不良清单分页
    processTags: [], // 工序不良-不良类型
    materialList: [], // 材料不良-材料清单
    materialListPagination: {},
    badList: [], // 不良清单
    initData: {}, // 初始化数据-对应主查询必输字端
    moreBadTypeList: [], // 不良类型-更多
    moreBadTypeListPagination: {},
    otherStationList: [], // 其他工位
    otherStationListPagination: {},
    mainSearchData: {}, // 主查询数据
    prodMaterialInfo: {},
    routerParam: {}, // 路径数据
    comments: '',
    applyList: [], // 点击的物料行
    selectInfo: [],
    customizelocation: [],
    cosInfo: {},
  },
  effects: {
    // 主查询
    *handleSearch({ payload }, { call, put }) {
      const result = getResponse(yield call(handleSearch, parseParameters(payload)));
      if (result) {
        const parapms = [];
        result.materialData.forEach(ele => {
          parapms.push({
            ...ele,
            rowkeyUuid: uuid(),
            _status: 'update',
          });
        });
        yield put({
          type: 'updateState',
          payload: {
            mainSearchData: result,
            materialList: parapms,
            badList: result.hmeNcDisposePlatformDTO2List,
          },
        });
      }
      return result;
    },
    // 工序不良提交
    *processBadCommit({ payload }, { call }) {
      const result = getResponse(yield call(processBadCommit, payload));
      return result;
    },
    // 工位查询
    *queryWorkcellId({ payload }, { call, put }) {
      const result = getResponse(yield call(queryWorkcellId, payload));
      if(result){
        yield put({
          type: 'updateState',
          payload: {
            workcellId: result,
          },
        });
      }
      return result;
    },
    // 材料不良提交
    *materialBadCommit({ payload }, { call }) {
      const result = getResponse(yield call(materialBadCommit, payload));
      return result;
    },
    // 条码扫描-行扫描
    *enterBarCodeLine({ payload }, { call }) {
      const result = getResponse(yield call(enterBarCodeLine, payload));
      return result;
    },
    *enterBarCodeHead({ payload }, { call }) {
      const result = getResponse(yield call(enterBarCodeHead, payload));
      return result;
    },
    // 查询物料清单-缓存表查询
    *fetchMaterialList({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchMaterialList, parseParameters(payload)));
      if (result) {
        const parapms = [];
        result.forEach(ele => {
          parapms.push({
            ...ele,
            rowkeyUuid: uuid(),
            _status: 'update',
          });
        });
        yield put({
          type: 'updateState',
          payload: {
            materialList: parapms,
          },
        });
      }
      return result;
    },
    // 工序-不良类型更多
    *fetchProcessBadType({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchProcessBadType, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            moreBadTypeList: result.content,
            moreBadTypeListPagination: createPagination(result),
          },
        });
      }
      return result;
    },
    // 查询物料不良类型
    *fetchMaterialBadType({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchMaterialBadType, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            moreBadTypeList: result.content,
            moreBadTypeListPagination: createPagination(result),
          },
        });
      }
      return result;
    },
    // 其他工位
    *fetchOtherStation({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchOtherStation, parseParameters(payload)));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            otherStationList: result.content,
            otherStationListPagination: createPagination(result),
          },
        });
      }
      return result;
    },
    // 不良代码记录单独查询
    *fetchBadRecord({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchBadRecord, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            badList: result,
          },
        });
      }
      return result;
    },
    *scanningMaterialLotCode({ payload }, { call, put }) {
      const result = getResponse(yield call(scanningMaterialLotCode, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            prodMaterialInfo: result,
          },
        });
      }
      return result;
    },
    // 自动查询备注
    *fetchComments({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchComments, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            comments: result.comments,
          },
        });
      }
      return result;
    },
    // 删除已扫的条码
    *deleteBarcode({ payload }, { call }) {
      const result = getResponse(yield call(deleteBarcode, payload));
      return result;
    },
    *saveHeadBarCode({ payload }, { call }) {
      const result = getResponse(yield call(saveHeadBarCode, payload));
      return result;
    },
    *saveLineBarCode({ payload }, { call }) {
      const result = getResponse(yield call(saveLineBarCode, payload));
      return result;
    },
    // 校验条码是不是cos的
    *handleCheckBarCode({ payload }, { call }) {
      const result = getResponse(yield call(handleCheckBarCode, payload));
      return result;
    },
    // 查询cos信息
    *handleFetchCosInfo({ payload }, { call, put }) {
      const result = getResponse(yield call(handleFetchCosInfo, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            cosInfo: result,
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
