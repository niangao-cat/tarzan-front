/**
 * @date 2019-12-3
 * @author HDY <deying.huang@hand-china.com>
 */
import { get as chainget } from 'lodash';
import { getResponse, createPagination } from 'utils/utils';
import { ergodicData } from '@/utils/utils';

import {
  fetchWorkingList,
  fetchSelectList,
  fetchShiftList,
  saveWorking,
  initCalendar,
  fetchShiftTypeList,
  fetchCalendarShiftList,
  copyShift,
  deleteShift,
  saveShift,
  fetchCalendarOrgList,
  fetchSiteList,
  saveSite,
  deleteSite,
  fetchAreaList,
  saveArea,
  deleteArea,
  fetchProlineList,
  saveProline,
  deleteProline,
  fetchWorkcellList,
  saveWorkcell,
  deleteWorkcell,
  fetchTreeList,
  saveOrgRel,
  deleteOrgRel,
  fetchCalendarShiftNoPageList,
  copyShiftCheck,
  fetchDetailList,
} from '@/services/calendar/workingService';

export default {
  namespace: 'working',
  state: {
    workingList: [], // 显示工作日历表格数据
    shiftList: [], // 日历班次列表数据
    workingPagination: {}, // 工作日历表格分页
    displayList: {}, // 单行详细数据表单
    calendarTypeList: [], // 日历类型下拉框数据
    orgTypeList: [], // 组织类型下拉框数据
    capacityUnitList: [], // 能力单位下拉框数据
    shiftTypeList: [], // 排班策略下拉框数据
    weekList: [], // 星期下拉框数据
    calendarShiftList: [], // 某一日期下的所有排班信息
    calendarShiftNoPageList: [], // 某一日期下的所有排班信息,没有分页
    calendarShiftPagination: {}, // 某一日期下的所有排班信息分页
    shiftFormList: {}, // 具体班次信息form表单信息
    calendarShiftId: '', // 日历班次信息主键
    calendarShiftIdList: '', // 日历班次信息主键list
    initWorkShiftData: {}, // 班次列表初始数据
    calendarOrgList: [], // 组织所属日历list
    calendarOrgPagination: {}, // 组织所属日历分页
    siteList: [], // 站点表格数据源list
    areaList: [], // 区域表格数据源list
    prolineList: [], // 生产线表格数据源list
    workcellList: [], // 工作单元表格数据源list
    treeList: [], // 组织树数据源list
    loadedKeysArray: [], // 组织树已查询子节点Id Array
    checkedKeys: [], // 组织树选中行id数组
    checkedInfo: {}, // 组织树选中行信息
    siteDeleteList: [], // 站点表格选中删除数据
    areaDeleteList: [], // 区域表格选中删除数据
    prolineDeleteList: [], // 生产线表格选中删除数据
    workcellDeleteList: [], // 工作单元表格选中删除数据
    siteDeleteKeys: [], // 站点表格选中删除数据Keys
    areaDeleteKeys: [], // 区域表格选中删除数据Keys
    prolineDeleteKeys: [], // 生产线表格选中删除数据Keys
    workcellDeleteKeys: [], // 工作单元表格选中删除数据Keys
  },
  effects: {
    // 获取数据源列表数据
    *fetchWorkingList({ payload }, { call, put }) {
      const res = yield call(fetchWorkingList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            workingList: chainget(list, 'rows.content', []),
            workingPagination: createPagination(list.rows),
          },
        });
        return list;
      }
    },

    // 获取日历班次列表
    *fetchShiftList({ payload }, { call, put }) {
      const res = yield call(fetchShiftList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            shiftList: chainget(list, 'rows', []),
          },
        });
      }
    },

    // 获取日历班次详细信息
    *fetchDetailList({ payload }, { call, put }) {
      const res = yield call(fetchDetailList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            displayList: chainget(list, 'rows', {}),
          },
        });
      }
    },

    // 获取工作日历类型下拉框数据
    *fetchWorkingTypeList({ payload }, { call, put }) {
      const res = yield call(fetchSelectList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            calendarTypeList: chainget(list, 'rows', []),
          },
        });
      }
    },

    // 获取工作日历类型下拉框数据
    *fetchOrgTypeList({ payload }, { call, put }) {
      const res = yield call(fetchSelectList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            orgTypeList: chainget(list, 'rows', []),
          },
        });
      }
    },

    // 获取能力单位下拉框数据
    *fetchCapacityUnitList({ payload }, { call, put }) {
      const res = yield call(fetchSelectList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            capacityUnitList: chainget(list, 'rows', []),
          },
        });
      }
    },

    // 获取能力单位下拉框数据
    *fetchWeekList({ payload }, { call, put }) {
      const res = yield call(fetchSelectList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            weekList: chainget(list, 'rows', []),
          },
        });
      }
    },

    // 获取排班策略下拉框数据
    *fetchShiftTypeList({ payload }, { call, put }) {
      const res = yield call(fetchShiftTypeList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            shiftTypeList: chainget(list, 'rows', []),
          },
        });
      }
    },

    // 查询某一日期下的所有排班信息
    *fetchCalendarShiftList({ payload }, { call, put }) {
      const res = yield call(fetchCalendarShiftList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            calendarShiftList: chainget(list, 'rows.content', []),
            calendarShiftPagination: createPagination(list.rows),
          },
        });
      }
    },
    // 查询某一日期下的所有排班信息,没有分页
    *fetchCalendarShiftNoPageList({ payload }, { call, put }) {
      const res = yield call(fetchCalendarShiftNoPageList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            calendarShiftNoPageList: chainget(list, 'rows', []),
          },
        });
      }
    },

    // 查询组织所属日历
    *fetchCalendarOrgList({ payload }, { call, put }) {
      const res = yield call(fetchCalendarOrgList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            calendarOrgList: chainget(list, 'rows.content', []),
            calendarOrgPagination: createPagination(list.rows),
          },
        });
      }
    },

    // 查询树根节点数据
    *fetchTreeList({ payload }, { call, put }) {
      const res = yield call(fetchTreeList, payload);
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            treeList: chainget(res, 'rows', []),
            loadedKeysArray: [], //  再次查询树，需要把已一般查询的树节点ID清空
          },
        });
        return res;
      }
    },

    // 查询树子节点数据
    *fetchSubTreeList({ payload }, { call }) {
      const res = yield call(fetchTreeList, payload);
      return res;
    },

    // 查询站点表格数据
    *fetchSiteList({ payload }, { call, put }) {
      const res = yield call(fetchSiteList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            siteList: chainget(list, 'rows.content', []),
          },
        });
      }
    },

    // 查询区域表格数据
    *fetchAreaList({ payload }, { call, put }) {
      const res = yield call(fetchAreaList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            areaList: chainget(list, 'rows.content', []),
          },
        });
      }
    },

    // 查询生产线表格数据
    *fetchProlineList({ payload }, { call, put }) {
      const res = yield call(fetchProlineList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            prolineList: chainget(list, 'rows.content', []),
          },
        });
      }
    },

    // 查询工作单元表格数据
    *fetchWorkcellList({ payload }, { call, put }) {
      const res = yield call(fetchWorkcellList, payload);
      const list = getResponse(res);
      if (list) {
        yield put({
          type: 'updateState',
          payload: {
            workcellList: chainget(list, 'rows.content', []),
          },
        });
      }
    },

    // 保存所有数据
    *saveWorking({ payload }, { call }) {
      const result = yield call(saveWorking, ergodicData(payload));
      return getResponse(result);
    },

    // 日历初始化
    *initCalendar({ payload }, { call }) {
      const result = yield call(initCalendar, ergodicData(payload));
      return getResponse(result);
    },

    // 复制日历班次
    *copyShift({ payload }, { call }) {
      const result = yield call(copyShift, ergodicData(payload));
      return getResponse(result);
    },

    // 复制日历班次校验
    *copyShiftCheck({ payload }, { call }) {
      const result = yield call(copyShiftCheck, ergodicData(payload));
      return getResponse(result);
    },

    // 删除日历班次信息
    *deleteShift({ payload }, { call }) {
      const result = yield call(deleteShift, payload);
      return getResponse(result);
    },

    // 保存日历班次信息
    *saveShift({ payload }, { call }) {
      const result = yield call(saveShift, payload);
      return getResponse(result);
    },

    // 保存站点
    *saveSite({ payload }, { call }) {
      const result = yield call(saveSite, payload);
      return getResponse(result);
    },

    // 删除站点
    *deleteSite({ payload }, { call }) {
      const result = yield call(deleteSite, payload);
      return getResponse(result);
    },

    // 保存区域
    *saveArea({ payload }, { call }) {
      const result = yield call(saveArea, payload);
      return getResponse(result);
    },

    // 删除区域
    *deleteArea({ payload }, { call }) {
      const result = yield call(deleteArea, payload);
      return getResponse(result);
    },

    // 保存生产线
    *saveProline({ payload }, { call }) {
      const result = yield call(saveProline, payload);
      return getResponse(result);
    },

    // 删除生产线
    *deleteProline({ payload }, { call }) {
      const result = yield call(deleteProline, payload);
      return getResponse(result);
    },

    // 保存工作单元
    *saveWorkcell({ payload }, { call }) {
      const result = yield call(saveWorkcell, payload);
      return getResponse(result);
    },

    // 删除工作单元
    *deleteWorkcell({ payload }, { call }) {
      const result = yield call(deleteWorkcell, payload);
      return getResponse(result);
    },

    // 保存组织关系
    *saveOrgRel({ payload }, { call }) {
      const result = yield call(saveOrgRel, payload);
      return getResponse(result);
    },

    // 删除组织关系
    *deleteOrgRel({ payload }, { call }) {
      const result = yield call(deleteOrgRel, payload);
      return getResponse(result);
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
