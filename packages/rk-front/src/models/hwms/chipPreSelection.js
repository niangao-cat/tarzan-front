// 预挑选
import { getResponse, createPagination } from 'utils/utils';
import { queryUnifyIdpValue, queryMapIdpValue } from 'services/api';

import {
  enterSite,
  getSiteList,
  queryLeftTopData,
  queryRightTopData,
  queryLeftButtomData,
  queryCenterButtomData,
  queryCenterButtomDetailData,
  queryRightButtomData,
  confirmData,
  doInBox,
  queryPreBarcode,
  queryPreBarcodeByContainer,
  checkBarcode,
  reQueryBarcode,
  queryDataByLot,
  doInBoxNew,
  queryNoHavingData,
  fetchSurplusChipNum,
  handleLocationMove,
  doWithdraw,
  queryDataByWithdraw,
} from '@/services/hwms/chipPreSelectionService';

export default {
  namespace: 'chipPreSelection',
  state: {
    workcellInfo: {}, // 工位信息
    defaultSite: {},
    leftTopList: [],
    pagination: {},
    rightTopList: [],
    leftButtomList: [],
    centerButtomList: [],
    centerButtomPagination: {},
    centerWithdrawList: [],
    centerWithdrawPagination: {},
    centerButtomDetailList: [],
    rightButtomList: [],
    chooseMap: [],
    productMap: [],
    materialLotCodeListPre: [],
    materialLotCodeList: [],
    paginationMap: [],
    surplusChipNum: null,
  },
  effects: {
    // 查询独立值集
    *init(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          productMap: 'HME_PRODUCT_TYPE',
          paginationMap: 'HME.COS_SELECT_PAGING',
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
    // 查询数据
    *queryChoosMap({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          chooseMap: [],
          rightTopList: [],
        },
      });
      // 调用接口
      const result = getResponse(yield call(queryUnifyIdpValue, 'HME.PRE_SELECTION_RULE', payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            chooseMap: result,
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
    // 输入工位
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

    // 查询左侧上部信息
    *queryLeftTopData({ payload }, { call, put }) {
      const result = getResponse(yield call(queryLeftTopData, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            leftTopList: result.content,
            pagination: createPagination(result),
          },
        });
      }
      return result;
    },

    // 查询右侧上部信息
    *queryRightTopData({ payload }, { call, put }) {
      const result = getResponse(yield call(queryRightTopData, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            rightTopList: result,
          },
        });
      }
      return result;
    },

    // 查询要装入的盒子
    *queryPreBarcode({ payload }, { call, put }) {
      const result = getResponse(yield call(queryPreBarcode, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            materialLotCodeListPre: result,
          },
        });
      }
      return result;
    },

    // 查询要装入的盒子
    *queryPreBarcodeByContainer({ payload }, { call, put }) {
      const result = getResponse(yield call(queryPreBarcodeByContainer, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            materialLotCodeList: result,
          },
        });
      }
      return result;
    },

    // 查询左侧下部信息
    *queryLeftButtomData({ payload }, { call, put }) {
      const result = getResponse(yield call(queryLeftButtomData, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            leftButtomList: result,
          },
        });
      }
      return result;
    },

    // 查询中侧下部信息
    *queryCenterButtomData({ payload }, { call, put }) {
      const result = getResponse(yield call(queryCenterButtomData, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            centerButtomList: result,
          },
        });
      }
      return result;
    },

    // 查询中侧下部信息/明细信息
    *queryCenterButtomDetailData({ payload }, { call, put }) {
      const result = getResponse(yield call(queryCenterButtomDetailData, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            centerButtomDetailList: result,
          },
        });
      }
      return result;
    },

    // 查询右侧上部信息
    *queryRightButtomData({ payload }, { call, put }) {
      const result = getResponse(yield call(queryRightButtomData, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            rightButtomList: result,
          },
        });
      }
      return result;
    },

    // 确认生成规则
    *confirmData({ payload }, { call }) {
      const res = getResponse(yield call(confirmData, payload));
      return res;
    },

    // 校验扫描的条码
    *checkBarcode({ payload }, { call }) {
      const res = getResponse(yield call(checkBarcode, payload));
      return res;
    },

    // 校验扫描的条码
    *reQueryBarcode({ payload }, { call }) {
      const res = getResponse(yield call(reQueryBarcode, payload));
      return res;
    },

    // 确认装入数据
    *doInBox({ payload }, { call }) {
      const res = getResponse(yield call(doInBox, payload));
      return res;
    },

    // 确认装入数据
    *doInBoxNew({ payload }, { call }) {
      const res = getResponse(yield call(doInBoxNew, payload));
      return res;
    },

    // 数据撤回数据
    *doWithdraw({ payload }, { call }) {
      const res = getResponse(yield call(doWithdraw, payload));
      return res;
    },

    // 查询批次对应的信息
    *queryDataByLot({ payload }, { call, put }) {
      const result = getResponse(yield call(queryDataByLot, payload));
      if (result) {
        // 设置行变色
        for(let i=0; i<result.content.length; i++){
          if(i===0){
            result.content[i].changeBackColor = false;
          }else if(result.content[i].virtualNum!==result.content[i-1].virtualNum){
              result.content[i].changeBackColor = !result.content[i-1].changeBackColor;
            }else{
              result.content[i].changeBackColor = result.content[i-1].changeBackColor;
            }

            // 新增显示字段
            for(let j=0; j<result.content[i].functionList.length; j++){
              result.content[i][`a${j}`] = result.content[i].functionList[j].function;
            }
        }
        yield put({
          type: 'updateState',
          payload: {
            centerButtomList: result.content,
            centerButtomPagination: createPagination(result),
          },
        });
      }
      return result;
    },

    // 查询右侧上部信息
    *queryNoHavingData({ payload }, { call, put }) {
      const result = getResponse(yield call(queryNoHavingData, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            rightButtomList: result,
          },
        });
      }
      return result;
    },
    // 查询剩余芯片数
    *fetchSurplusChipNum({ payload }, { call, put }) {
      const result = getResponse(yield call(fetchSurplusChipNum, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            surplusChipNum: result,
          },
        });
      }
      return result;
    },
    *handleLocationMove({ payload }, { call }) {
      const res = getResponse(yield call(handleLocationMove, payload));
      return res;
    },
    *queryDataByWithdraw({ payload }, { call, put }) {
      const result = getResponse(yield call(queryDataByWithdraw, payload));
      if (result) {
        // 设置行变色
        for(let i=0; i<result.content.length; i++){
          if(i===0){
            result.content[i].changeBackColor = false;
          }else if(result.content[i].virtualNum!==result.content[i-1].virtualNum){
              result.content[i].changeBackColor = !result.content[i-1].changeBackColor;
            }else{
              result.content[i].changeBackColor = result.content[i-1].changeBackColor;
            }
        }
        yield put({
          type: 'updateState',
          payload: {
            centerWithdrawList: result.content,
            centerWithdrawPagination: createPagination(result),
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
