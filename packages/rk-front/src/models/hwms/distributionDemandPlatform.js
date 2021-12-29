/*
 * @Description: 配送需求平台
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-03 09:35:08
 * @LastEditTime: 2020-11-19 15:49:32
 */

import moment from 'moment';
import {
  queryList,
  fetchRelease,
  querySyncDemandAndSupply,
  batchAdjustSupplier,
  doPlanSuggest,
  createDeliveryNote,
  fetchDemandsDetail,
  saveDemandsDetail,
  handleDeleteRecord,
  getSiteList,
  handleExport,
  checkGenerateOrder,
} from '@/services/hwms/distributionDemandPlatformService';
import { getResponse, createPagination, parseParameters } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import { isEmpty } from 'lodash';


export default {
  namespace: 'distributionDemandPlatform',
  state: {
    listData: [],
    checkedKeys: [],
    columns: [],
    customDatas: [], // 全部分组数据
    pages: 0,
    currentPage: 1,
    list: [],
    dynamicDataSource: [],
    pagination: {},
    replaceList: [], // 替代料维护抽屉
    replaceListPagination: {},
    colData: [],
    materialInfo: {},
    materialShift: {},
    selectedRows: [],
    selectAllflag: false,
    defaultSite: {},
    backFlushFlag: 'N', // 校验生成配送单
    withColData: [], // 配送班次明天的数据
    colDataSelectRows: [], // 配送班次选中数据
  },
  effects: {
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
    // 批量查询独立值集
    *batchLovData(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          wmsDistribution: 'WMS.DISTRIBUTION', // 配送策略
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
    //
    *fetchList({ payload }, { call, put }) {
      const { selectAllflag, selectedRows = [] } = payload;
      const result = getResponse(yield call(queryList, parseParameters(payload)));
      if (result) {
        const list = result.content;
        const dataSource = [];
        for (let index = 0; index < list.length; index++) {
          if (list.length > 0) {
            for (let i = 0; i < 4; i++) {
              const value = {};
              // eslint-disable-next-line no-loop-func
              if (!isEmpty(list[index].shiftQtyList)) {
                list[index].shiftQtyList.forEach(item => {
                  if (i === 0) {
                    value[`${moment(item.shiftDate).format('YYYYMMDD') + item.shiftCode}`] = item.requestQty;
                  }
                  if (i === 1) {
                    value[`${moment(item.shiftDate).format('YYYYMMDD') + item.shiftCode}`] = item.distributionQty;
                  }
                  if (i === 2) {
                    value[`${moment(item.shiftDate).format('YYYYMMDD') + item.shiftCode}`] = item.deliveredQty;
                  }
                  if (i === 3) {
                    value[`${moment(item.shiftDate).format('YYYYMMDD') + item.shiftCode}`] = item.remainQty;
                  }
                });
              }
              dataSource.push({
                ...list[index],
                calendarShift: i === 0 && '总需求数量' || i === 1 && '配送单数量' || i === 2 && '已配送数量' || i === 3 && '剩余配送数量',
                baseInfoName: i === 0 && '工厂' || i === 1 && '产线' || i === 2 && '版本' || i === 3 && '配送策略',
                baseInfoValue: i === 0 && list[index].siteName || i === 1 && list[index].prodLineName || i === 2 && list[index].materialVersion || i === 3 && list[index].distributionTypeMeaning,
                dataDemandName: i === 0 && '销售订单号' || i === 1 && '销售订单行号' || i === 2 && '替代班次' || i === 3 && '替代数量',
                dataDemandValue: i === 0 && list[index].soNum || i === 1 && list[index].soLineNum || i === 2 && list[index].substituteShift || i === 3 && list[index].substituteQty,
                // TODO
                deliveryName: i === 0 && '最小包装' || i === 1 && '配送比例' || i === 2 && '库存水位' || i === 3 && '单次配送量',
                deliveryValue: i === 0 && list[index].minPackage || i === 1 && list[index].proportion || i === 2 && list[index].inventoryLevel || i === 3 && list[index].oneQty,
                inventoryName: i === 0 && '仓库库存' || i === 1 && '配送工段' || i === 2 && '配送货位' || i === 3 && '工段库存',
                inventoryValue: i === 0 && list[index].inventoryQty || i === 1 && list[index].workcellName || i === 2 && list[index].distributionLocator || i === 3 && list[index].workcellQty,
                ...value,
              });
            }
          }
        }
        const newPage = {
          ...result,
          numberOfElements: result.numberOfElements * 4,
          totalElements: result.totalElements * 4,
          size: result.size * 4,
        };
        const pagination = createPagination(newPage);
        const dateList = [];
        if (!isEmpty(result.content[0])) {
          const dateShiftDateList = result.content[0].shiftQtyList.map(e => moment(e.shiftDate).format('YYYYMMDD'));
          dateShiftDateList.forEach(e => {
            if (!dateList.includes(e)) {
              dateList.push(e);
            }
          });
        }
        // 给班次加自定义id，以方便有唯一键值勾选
        const shiftQtyList = isEmpty(result.content[0]) ? [] : result.content[0].shiftQtyList;
        shiftQtyList.forEach((item, index) => {
          item.calendarShiftIdCopy = moment(item.shiftDate).unix() + '' + index;
        });
        // 过滤出搜索班次第二天的班次数据
        const { startDate } = parseParameters(payload);
        const tomorrow = moment(new Date((new Date(startDate)/1000+86400)*1000)).format('YYYY-MM-DD HH:mm:ss');
        const withColData = shiftQtyList.filter(item => item.shiftDate === tomorrow);
        yield put({
          type: 'updateState',
          payload: {
            list: dataSource,
            selectedRows: selectAllflag ? selectedRows.concat(dataSource) : selectedRows,
            dateList,
            colData: shiftQtyList,
            withColData,
            pagination,
          },
        });
      }
      return result;
    },
    // 处理勾选
    *handleSelect({ payload }, { put }) {
      const { checkedKeys } = payload;
      yield put({
        type: 'updateState',
        payload: {
          checkedKeys,
        },
      });
    },
    // 发布
    *fetchRelease({ payload }, { call }) {
      const res = yield call(fetchRelease, payload);
      return getResponse(res);
    },
    // 同步需求/供应
    *fetchSyncDemandAndSupply({ payload }, { call }) {
      const res = yield call(querySyncDemandAndSupply, payload);
      return getResponse(res);
    },
    // 批量调整供应商
    *batchAdjustSupplier({ payload }, { call }) {
      const res = yield call(batchAdjustSupplier, payload);
      return getResponse(res);
    },
    // 批量调整供应商
    *doPlanSuggest({ payload }, { call }) {
      const res = yield call(doPlanSuggest, payload);
      return getResponse(res);
    },
    *createDeliveryNote({ payload }, { call }) {
      const res = yield call(createDeliveryNote, payload);
      return res;
    },
    *fetchDemandsDetail({ payload }, { call, put }) {
      const { materialInfo, materialShift, ...info } = payload;
      const res = getResponse(yield call(fetchDemandsDetail, info));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            replaceList: res,
            materialInfo,
            materialShift,
          },
        });
      }
      return res;
    },
    *saveDemandsDetail({ payload }, { call }) {
      const res = yield call(saveDemandsDetail, payload);
      return res;
    },
    // 配送明细行删除
    *handleDeleteRecord({ payload }, { call }) {
      const res = yield call(handleDeleteRecord, payload);
      return res;
    },
    *handleExport({ payload }, { call }) {
      const res = yield call(handleExport, payload);
      return res;
    },

    // 校验生成配送单
    *checkGenerateOrder({ payload }, { call, put }) {
      const res = getResponse(yield call(checkGenerateOrder, payload));
      yield put({
        type: 'updateState',
        payload: {
          backFlushFlag: res ? res.flag : 'N',
        },
      });
      return res;
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
