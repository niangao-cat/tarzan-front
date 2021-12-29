/*
 * @Description: 工单管理
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-07-10 13:54:53
 * @LastEditTime: 2020-10-20 11:52:49
 */

import { getResponse, createPagination, parseParameters } from 'utils/utils';
import {
  handleGetTicketList,
  updateRemarkAndDeliveryDate,
  buttonSend,
  buttonStop,
  buttonBack,
  buttonClose,
  fetchLine,
  saveProdLine,
  checkTichet,
  fetchDepartment,
  ticketRelease,
  fetchComponentMeaterial,
} from '@/services/hhme/ticketManagementService';
import moment from 'moment';
import { queryMapIdpValue } from 'services/api';

export default {
  namespace: 'ticketManagement',
  state: {
    ticketDataList: [], // 工单列表
    ticketPagination: {}, // 工单列表分页
    woStatus: [], // 工单状态
    woType: [], // 工单类型
    woShop: [], // 车间
    departmentList: [], // 事业部
    lineDataList: [], // 产线数据
    lineDataPagination: {},
    pageMoreSearch: {}, // page  页数 显示
    componentMeaterialListPagination: {},
    componentMeaterialList: [],
    dynamicColumns: [],
  },
  effects: {
    // 批量查询独立值集
    *batchLovData(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          woStatus: 'MT.WO_STATUS',
          woType: 'MT.WO_TYPE',
          woShop: 'MT.SHOP',
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
    *handleGetTicketList({ payload }, { put, call }) {
      const res = yield call(handleGetTicketList, parseParameters(payload));
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            ticketDataList: list.content,
            ticketPagination: createPagination(list),
          },
        });
      }
      return list;
    },
    // 修改备注及交期
    *updateRemarkAndDeliveryDate({ payload }, { call }) {
      const res = yield call(updateRemarkAndDeliveryDate, payload);
      return getResponse(res);
    },
    // 工单下达
    *buttonSend({ payload }, { call }) {
      const res = yield call(buttonSend, payload);
      return getResponse(res);
    },
    // 工单暂停
    *buttonStop({ payload }, { call }) {
      const res = yield call(buttonStop, payload);
      return getResponse(res);
    },
    // 工单撤销
    *buttonBack({ payload }, { call }) {
      const res = yield call(buttonBack, payload);
      return getResponse(res);
    },
    // 工单关闭
    *buttonClose({ payload }, { call }) {
      const res = yield call(buttonClose, payload);
      return getResponse(res);
    },
    // 校验当前勾选工单是否可以分配产线
    *checkTichet({ payload }, { call }) {
      const res = yield call(checkTichet, payload);
      return getResponse(res);
    },
    // 查询产线
    *fetchLine({ payload }, { put, call }) {
      const res = yield call(fetchLine, parseParameters(payload));
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            lineDataList: list.content,
            lineDataPagination: createPagination(list),
          },
        });
      }
      return list;
    },
    // 保存产线数据
    *saveProdLine({ payload }, { call }) {
      const res = yield call(saveProdLine, payload);
      return getResponse(res);
    },
    *fetchDepartment({ payload }, { put, call }) {
      const res = yield call(fetchDepartment, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            departmentList: list,
          },
        });
      }
      return list;
    },
    // 工单下达
    *ticketRelease({ payload }, { call }) {
      const res = yield call(ticketRelease, payload);
      return getResponse(res);
    },
    // 组件需求
    *fetchComponentMeaterial({ payload }, { put, call }) {
      const res = yield call(fetchComponentMeaterial, parseParameters(payload));
      const list = getResponse(res);
      if (list) {
        const dynamicColumns = [];
        const dataSource = [];
        if (list.content.length > 0) {
          list.content[0].requirementList.forEach(ele => {
            dynamicColumns.push({
              title: `${moment(ele.requirementDate).format('MM-DD')}`,
              dataIndex: `${ele.requirementDate}`,
              width: 50,
              align: 'center',
            });
          });
          list.content.forEach(item=>{
            const value = {};
            item.requirementList.forEach(ele=>{
              value[ele.requirementDate] = ele.requirementQty;
            });
            dataSource.push({
              ...item,
              ...value,
            });
          });
        }
        yield put({
          type: 'updateState',
          payload: {
            componentMeaterialList: dataSource,
            dynamicColumns,
            componentMeaterialListPagination: createPagination(list),
          },
        });
      }
      return list;
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
