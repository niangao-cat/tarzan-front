// OQC检验平台
import { getResponse } from 'utils/utils';
import uuid from 'uuid/v4';
import { fetchList, createData, saveData, submitData } from '../../services/hwms/oqcInspectPlatService';
import { queryMapIdpValue } from '../../services/api';

export default {
  namespace: 'oqcInspectPlat',
  state: {
    headList: {},
    headListOld: {},
    statusMap: [],
    versionMap: [],
  },
  effects: {
    // 查询下拉框数据
    *init(_, { call, put }) {
      const result = yield call(queryMapIdpValue, {
        resultMap: 'QMS.INSPECTION_RESULT',
        versionList: 'HCM.MATERIAL_VERSION',
      });
      yield put({
        type: 'updateState',
        payload: {
         ...result,
        },
      });
    },

    // 查询头/行/明细信息
    *fetchList({ payload }, { call, put }) {
      // 清空民明细
      yield put({
        type: 'updateState',
        payload: {
          headList: {},
        },
      });

      // 调用接口
      const result = getResponse(yield call(fetchList, payload));
      if (result) {
        // 分配对应的行
        for (let i = 0; i < result.lineList.length; i++) {
            // 设置对应的行是否能被修改
            if(result.inspectionStatus==="NEW")
            {
                result.lineList[i]._status = 'update';
            }

            if (result.lineList[i].attachmentUuid) {
              result.lineList[i].attachmentUuid = result.lineList[i].attachmentUuid;
            } else {
              result.lineList[i].attachmentUuid = uuid();
            }

            if (result.lineList[i].detailList!==undefined&&result.lineList[i].detailList.length > 0) {
              // 明细下对应的主键设置为唯一数据
              for (let j = 0; j <= result.lineList[i].detailList.length - 1; j++) {
                // 设置对应的明细是否能被修改
                if(result.inspectionStatus==="NEW")
                {
                    result.lineList[i].detailList[j]._status = 'update';
                }
                result.lineList[i].detailList[j].detailId = `${result.lineList[i].oqcLineId}-${result.lineList[i].detailList[j].number}`;
                result.lineList[i].detailList[j].$form= {};
              }
            }else{
              // 默认填写一行数据
              result.lineList[i].detailList = [{ detailId: `${result.lineList[i].oqcLineId}-10`, number: 10}];
              if(result.inspectionStatus==="NEW"){
                result.lineList[i].detailList = [{ detailId: `${result.lineList[i].oqcLineId}-10`, number: 10, _status: 'create'}];
                result.lineList[i].detailList[0].$form= {};
              }
            }
            result.lineList[i].$form= {};
          }

          yield put({
            type: 'updateState',
            payload: {
              headList: result,
              headListOld: JSON.parse(JSON.stringify(result)),
            },
          });
      }
      return result;
    },

    *createData({ payload }, { call }) {
      // 调用seivice层接口 触发数据
      const res = yield call(createData, payload);
      return getResponse(res);
    },

    *saveData({ payload }, { call }) {
      // 调用seivice层接口 触发数据
      const res = yield call(saveData, payload);
      return getResponse(res);
    },
    *submitData({ payload }, { call }) {
      // 调用seivice层接口 触发数据
      const res = yield call(submitData, payload);
      return getResponse(res);
    },
    // 页面关闭时清空model
    *cleanModel(_, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          headList: {},
          headListOld: {},
          statusMap: [],
          versionMap: [],
        },
      });
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
