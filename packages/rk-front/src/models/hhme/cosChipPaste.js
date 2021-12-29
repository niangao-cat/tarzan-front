/*
 * @Description: 芯片不良
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-21 13:51:22
 * @LastEditTime: 2020-08-29 10:27:14
 */
import { isArray } from 'lodash';
import { getResponse } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import { upperCaseChars } from '@/utils/utils';

import {
  enterSite,
  getSiteList,
  getEquipmentList,
  checkMaterialCode,
  scaneMaterialCode,
  queryLineData,
  saveLineData,
  saveData,
  fetchDefaultSite,
  changeEq,
  deleteEq,
  bindingEq,
  fetchEqInfo,
  changeEqConfirm,
  bindingEqConfirm,
} from '@/services/hhme/cosChipPasteService';

export default {
  namespace: 'cosChipPaste',
  state: {
    workcellInfo: {}, // 工位信息
    defaultSite: {},
    equipmentList: [], // 设备列表
    equipmentInfo: {},
    errorEquipmentCodes: "",
    exceptionEquipmentCodes: "",
    containerlist: [], // 容器列表信息
    lineList: [], // 根据容器切割数据
    siteId: '',
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
    // 查询设备
    *getEquipmentList({ payload }, { call, put }) {
      const result = getResponse(yield call(getEquipmentList, payload));
      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            equipmentList: isArray(result.hmeWkcEquSwitchVOS) ? result.hmeWkcEquSwitchVOS : [],
            equipmentInfo: result.hmeWkcEquSwitchVO3,
            errorEquipmentCodes: result.errorEquipmentCodes,
            exceptionEquipmentCodes: result.exceptionEquipmentCodes,
          },
        });
      }
      return result;
    },

    // 扫描条码
    *checkMaterialCode({ payload }, { call }) {
      const res = getResponse(yield call(checkMaterialCode, payload));
      return res;
    },

    // 扫描条码
    *scaneMaterialCode({ payload }, { call, put }) {
      // 清空对应的行数据
      yield put({
        type: 'updateState',
        payload: {
          lineList: [],
        },
      });
      const res = getResponse(yield call(scaneMaterialCode, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            containerlist: res,
          },
        });
      }
      return res;
    },

    // 查询对应的设备信息
    *queryLineData({ payload }, { call, put }) {
      const res = getResponse(yield call(queryLineData, payload));
      // 清空对应的行数据
      yield put({
        type: 'updateState',
        payload: {
          lineList: [],
        },
      });
      if (res) {

        // 判断数据有多少行 ， 多少列
        if(res.length>0){
          let row = 0; // 行数
          let col = 0; // 列数
          res.forEach(item => {
            // 查找最大行
            if(item.loadRow>row){
              row = item.loadRow;
            }

            // 查找最大列
            if(item.loadColumn>col){
              col = item.loadColumn;
            }
          });

          // 通过列 分割成每一个小的table
          let lineList = [];
          for(let i=1; i<=col; i++){
            // 暂存每个小table对应的数据
            const data = { col: i, list: []};
            for(let j=0; j<res.length; j++){
              if(i===res[j].loadColumn){
                data.list = [ ...data.list, {_status: 'update', ...res[j]}];
              }
            }
            lineList = [ ...lineList, data];
          }

          // 对每一个小table 进行排序
          let index=0;
          for(let i=0; i<lineList.length; i++){
            lineList[i].list.sort((a, b)=>a.loadRow<=b.loadRow);
            // 为每一个小table赋值 序号
            for(let j=0; j<lineList[i].list.length;j++){
              // lineList[i].list[j].worker = upperCaseChars()[Number(lineList[i].col)-1]+ (Number(j+1));
              lineList[i].list[j].worker = upperCaseChars()[lineList[i].list[j].loadRow - 1] + (Number(lineList[i].col));
              lineList[i].list[j].index = index;
              index++;
            }
          }
          yield put({
            type: 'updateState',
            payload: {
              lineList,
            },
          });

        }
      }
      return res;
    },

    *saveLineData({ payload }, { call }) {
      const res = getResponse(yield call(saveLineData, payload));
      return res;
    },

    *saveData({ payload }, { call }) {
      const res = getResponse(yield call(saveData, payload));
      return res;
    },
    *fetchDefaultSite(_, { call, put }) {
      const res = getResponse(yield call(fetchDefaultSite));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            siteId: res.siteId,
          },
        });
        return res;
      }
    },
    *changeEq({ payload }, { call }) {
      const res = yield call(changeEq, payload);
      return res;
    },

    *deleteEq({ payload }, { call }) {
      const res = getResponse(yield call(deleteEq, payload));
      return res;
    },

    *bindingEq({ payload }, { call }) {
      const res = yield call(bindingEq, payload);
      return res;
    },

    *fetchEqInfo({ payload }, { call }) {
      const res = getResponse(yield call(fetchEqInfo, payload ));
      return res;
    },

    *bindingEqConfirm({ payload }, { call }) {
      const res = getResponse(yield call(bindingEqConfirm, payload ));
      return res;
    },

    *changeEqConfirm({ payload }, { call }) {
      const res = getResponse(yield call(changeEqConfirm, payload ));
      return res;
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
