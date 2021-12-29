/**
 * @date 2019-12-3
 * @author JRQ <ruiqi.jiang01@hand-china.com>
 */
import { get as chainget } from 'lodash';
import Cookies from 'universal-cookie';
import { createPagination } from 'utils/utils';
import notification from 'utils/notification';

import {
  fetchUsersProLineOptions,
  fetchUsersOperationOptions,
  fetchTableInfo,
  fetchSubTableInfo,
  fetchWKCRangeList,
  fetchWKCChartsList,
  confirmOperation,
  fetchOneChartInfo,
  fetchScheduledSubTableList,
  scheduledSubTableListReorder,
  revoke,
  release,
  fetchShiftCodeList,
  dispatchConfirm,
} from '../../services/workshop/dispatchPlatform';
import { fetchDefaultSite } from '@/services/api';
// import { ergodicData } from '@/utils/utils';

const cookies = new Cookies();
// import { fetchAttributeList, saveAttribute } from '../../services/api';

export default {
  namespace: 'dispatchPlatform',
  state: {
    showDispatchScopeFlag: true, //  是否显示调度范围页面的flag
    tabsActiveKey: 'dispatchInfo', //  tabs选中tab的key
    defaultSiteId: '', //  用户默认站点ID，有站点才能进行操作
    usersProLineOptions: [], //  用户有权限的生产线选项
    selectedProLineId: '', //  用户选中的生产线ID，选择生产线后，才允许选择工艺
    selectedProLineName: '', //  选中的生产线Name
    operationOptions: [], //  生产线下的工艺选项
    selectedOperationId: '', //  选中的工艺ID
    selectedOperationName: '', //  选中的工艺Name
    tableList: [], //  父表格数据
    expandedRowKeysArray: [], //  展开行Id集合
    selectedRowId: '', //  选中行ID
    selectedRowRecord: {}, //  选中行数据
    tablePagination: {}, //  父表格页脚
    WKCRangeList: [], //  图表表格的WKC范围
    chartTableList: [], //  图表表格的数据源
    selectedChartId: '', //  选中图表Id
    selectedChartDetail: {}, //  选中图表的数据
    revokeRow: {}, //  选中行数据
    selectedRowKeys: [], //  选中行rowKey
    scheduledSubTableList: [], //  选中图表下数据表格List
    shiftCodeList: [], //  调度抽屉班次下拉List
  },
  effects: {
    // 获取用户权限数据
    *fetchDefaultSite({ payload }, { call, put }) {
      const res = yield call(fetchDefaultSite, payload);
      if (res && res.success && res.rows) {
        yield put({
          type: 'updateState',
          payload: {
            defaultSiteId: chainget(res, 'rows.siteId', ''),
            defaultSiteCode: chainget(res, 'rows.siteCode', ''),
          },
        });
        cookies.set('defaultSiteId', res.rows.siteId);
        cookies.set('defaultSiteCode', res.rows.siteCode);
      }

      return res;
    },
    // 获取用户有权限的生产线
    *fetchUsersProLineOptions({ payload }, { call, put }) {
      const res = yield call(fetchUsersProLineOptions, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            usersProLineOptions: chainget(res, 'rows', []),
          },
        });
      }
    },

    // 获取选中生产线下的工艺
    *fetchUsersOperationOptions({ payload }, { call, put }) {
      const res = yield call(fetchUsersOperationOptions, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            operationOptions: chainget(res, 'rows', []),
          },
        });
      }
    },

    // 获取父表格数据
    *fetchTableInfo({ payload }, { call, put }) {
      const res = yield call(fetchTableInfo, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            tableList: chainget(res, 'rows.content', []),
            tablePagination: createPagination(chainget(res, 'rows', {})),
          },
        });
      }
    },

    //  获取子表格数据
    *fetchSubTableInfo({ payload }, { call }) {
      const res = yield call(fetchSubTableInfo, payload);
      return res;
    },

    //  获取WKC范围
    *fetchWKCRangeList({ payload }, { call, put }) {
      const res = yield call(fetchWKCRangeList, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            WKCRangeList: chainget(res, 'rows', []),
          },
        });
      }
      return res;
    },

    //  获取WKC行表格数据
    *fetchWKCChartsList({ payload }, { call, put, select }) {
      const WKCRangeList = yield select(state => {
        return state.dispatchPlatform.WKCRangeList;
      });
      const todayRes = yield call(fetchWKCChartsList, { ...payload, shiftDate: payload.today });
      const tomorrowRes = yield call(fetchWKCChartsList, {
        ...payload,
        shiftDate: payload.tomorrow,
      });
      const todayFLag = todayRes && todayRes.success;
      const tomorrowFlag = tomorrowRes && tomorrowRes.success;
      const chartTableList = WKCRangeList.map(item => {
        let todayChartsArray = [];
        let tomorrowChartsArray = [];
        if (todayFLag) {
          todayChartsArray = todayRes.rows.filter(ele => ele.workcellId === item.workcellId);
        }
        if (tomorrowFlag) {
          tomorrowChartsArray = tomorrowRes.rows.filter(ele => ele.workcellId === item.workcellId);
        }
        return {
          ...item,
          todayChartsArray,
          tomorrowChartsArray,
        };
      });
      yield put({
        type: 'updateState',
        payload: {
          chartTableList: [],
        },
      });
      yield put({
        type: 'updateState',
        payload: {
          chartTableList,
        },
      });
    },

    //  调度平台(执行调度逻辑)
    *confirmOperation({ payload }, { call }) {
      const res = yield call(confirmOperation, payload);
      return res;
    },

    //  获取一个图形的数据
    *fetchOneChartInfo({ payload }, { call, put, select }) {
      const chartTableList = yield select(state => {
        return state.dispatchPlatform.chartTableList;
      });
      const res = yield call(fetchOneChartInfo, payload);
      if (res && res.success) {
        chartTableList.forEach((item, index) => {
          if (item.workcellId === res.rows.workcellId) {
            item.todayChartsArray.forEach((ele, eleIndex) => {
              if (ele.shiftDate === res.rows.shiftDate && ele.shiftCode === res.rows.shiftCode) {
                chartTableList[index].todayChartsArray[eleIndex] = { ...res.rows };
              }
            });
            item.tomorrowChartsArray.forEach((ele, eleIndex) => {
              if (ele.shiftDate === res.rows.shiftDate && ele.shiftCode === res.rows.shiftCode) {
                chartTableList[index].tomorrowChartsArray[eleIndex] = { ...res.rows };
              }
            });
          }
        });
        yield put({
          type: 'updateState',
          payload: {
            chartTableList,
          },
        });
      }
    },
    //  获取选中图表的数据表格
    *fetchScheduledSubTableList({ payload }, { call, put }) {
      const res = yield call(fetchScheduledSubTableList, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            scheduledSubTableList: chainget(res, 'rows', []),
          },
        });
      }
      return res;
    },

    //  表格拖拽排序
    *scheduledSubTableListReorder({ payload }, { call, put }) {
      const list = payload.scheduledSubTableList.map((item, index) => {
        return {
          ...item,
          sequence: index,
        };
      });
      const res = yield call(scheduledSubTableListReorder, list);
      if (res) {
        if (res.success) {
          yield put({
            type: 'updateState',
            payload,
          });
        } else {
          notification.error({ message: res.message });
        }
      }
      return res;
    },

    //  撤销
    *revoke({ payload }, { call }) {
      const res = yield call(revoke, payload);
      if (res) {
        if (res.success) {
          notification.success();
        } else {
          notification.error({ message: res.message });
        }
      }
      return res;
    },

    //  发布
    *release({ payload }, { call }) {
      const res = yield call(release, payload);
      if (res) {
        if (res.success) {
          notification.success();
        } else {
          notification.error({ message: res.message });
        }
      }
      return res;
    },

    //  获取调度抽屉班次下拉列表
    *fetchShiftCodeList({ payload }, { call, put }) {
      const res = yield call(fetchShiftCodeList, payload);
      if (res) {
        if (res.success) {
          yield put({
            type: 'updateState',
            payload: {
              shiftCodeList: res.rows,
            },
          });
        } else {
          notification.error({ message: res.message });
        }
      }
    },

    //  调度抽屉进行调度
    *dispatchConfirm({ payload }, { call }) {
      const res = yield call(dispatchConfirm, payload);
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
    clear(state) {
      return {
        ...state,
        showDispatchScopeFlag: true, //  是否显示调度范围页面的flag
        tabsActiveKey: 'dispatchInfo', //  tabs选中tab的key
        usersProLineOptions: [], //  用户有权限的生产线选项
        selectedProLineId: '', //  用户选中的生产线ID，选择生产线后，才允许选择工艺
        selectedProLineName: '', //  选中的生产线Name
        operationOptions: [], //  生产线下的工艺选项
        selectedOperationId: '', //  选中的工艺ID
        selectedOperationName: '', //  选中的工艺Name
        tableList: [], //  父表格数据
        selectedRowId: '', //  选中行ID
        selectedRowRecord: {}, //  选中行数据
        tablePagination: {}, //  父表格页脚
        WKCRangeList: [], //  图表表格的WKC范围
        chartTableList: [], //  图表表格的数据源
        selectedChartId: '', //  选中图表Id
        selectedChartDetail: {}, //  选中图表的数据
        revokeRow: {}, //  选中行数据
        selectedRowKeys: [], //  选中行rowKey
        scheduledSubTableList: [], //  选中图表下数据表格List
        shiftCodeList: [], //  调度抽屉班次下拉List
      };
    },
  },
};
