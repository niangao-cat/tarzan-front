/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： COS筛选滞留表
 */

import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import { queryDataList } from '@/services/hwms/cosScreeningRetentionTableService';

export default {
  namespace: 'cosScreeningRetentionTable',
  state: {
    headList: [],
    headPagination: {},
    cosTypeMap: [],
    statusMap: [],
    enableMap: [], // 是否
    column: [],
  },
  effects: {
    // 查询报表信息
    *queryDataList({ payload }, { call, put }) {
      // 数据查询
      const res = yield call(queryDataList, payload);
      const list = getResponse(res);
      // // 成功时，更改状态
      // let columnMap = [];
      // // 判断标题是否已经有值 有则跳过
      // let titleList = [];
      // if (list) {
      //   if (list.content && list.content.length > 0) {
      //     for (let i = 0; i < list.content.length; i++) {
      //       // 判断数据是否有值
      //       if (list.content[i].listA02 !== null && list.content[i].listA02.length > 0) {
      //         for (let j = 0; j < list.content[i].listA02.length; j++) {
      //           if (
      //             !(
      //               titleList.length > 0 &&
      //               titleList.includes(`${list.content[i].listA02[j].current}A功率`)
      //             )
      //           ) {
      //             titleList = [...titleList, `${list.content[i].listA02[j].current}A功率`];
      //             list.content[i][`${list.content[i].listA02[j].current}a02`] =
      //               list.content[i].listA02[j].a02;
      //             columnMap = [
      //               ...columnMap,
      //               {
      //                 title: `${list.content[i].listA02[j].current}A功率`,
      //                 dataIndex: `${list.content[i].listA02[j].current}a02`,
      //                 align: 'center',
      //               },
      //             ];
      //           }
      //         }
      //       }
      //       // 判断数据是否有值
      //       if (list.content[i].listA06 !== null && list.content[i].listA06.length > 0) {
      //         for (let j = 0; j < list.content[i].listA06.length; j++) {
      //           if (
      //             !(
      //               titleList.length > 0 &&
      //               titleList.includes(`${list.content[i].listA02[j].current}A电压`)
      //             )
      //           ) {
      //             titleList = [...titleList, `${list.content[i].listA02[j].current}A电压`];
      //             list.content[i][`${list.content[i].listA06[j].current}a06`] =
      //             list.content[i].listA06[j].a06;
      //             columnMap = [
      //               ...columnMap,
      //               {
      //                 title: `${list.content[i].listA06[j].current}A电压`,
      //                 dataIndex: `${list.content[i].listA06[j].current}a06`,
      //                 align: 'center',
      //               },
      //             ];
      //           }
      //         }
      //       }
      //       // 判断数据是否有值
      //       if (list.content[i].listA04 !== null && list.content[i].listA04.length > 0) {
      //         for (let j = 0; j < list.content[i].listA04.length; j++) {
      //           if (
      //             !(
      //               titleList.length > 0 &&
      //               titleList.includes(`${list.content[i].listA02[j].current}A波长`)
      //             )
      //           ) {
      //             titleList = [...titleList, `${list.content[i].listA02[j].current}A波长`];
      //             list.content[i][`${list.content[i].listA04[j].current}a04`] =
      //             list.content[i].listA04[j].a04;
      //             columnMap = [
      //               ...columnMap,
      //               {
      //                 title: `${list.content[i].listA04[j].current}A波长`,
      //                 dataIndex: `${list.content[i].listA04[j].current}a04`,
      //                 align: 'center',
      //               },
      //             ];
      //           }
      //         }
      //       }
      //
      //       // 判断数据是否有值
      //       if (list.content[i].listA15 !== null && list.content[i].listA15.length > 0) {
      //         for (let j = 0; j < list.content[i].listA15.length; j++) {
      //           if (
      //             !(
      //               titleList.length > 0 &&
      //               titleList.includes(`${list.content[i].listA02[j].current}A偏振度`)
      //             )
      //           ) {
      //             titleList = [...titleList, `${list.content[i].listA02[j].current}A偏振度`];
      //             list.content[i][`${list.content[i].listA15[j].current}a15`] =
      //             list.content[i].listA15[j].a15;
      //             columnMap = [
      //               ...columnMap,
      //               {
      //                 title: `${list.content[i].listA15[j].current}A偏振度`,
      //                 dataIndex: `${list.content[i].listA15[j].current}a15`,
      //                 align: 'center',
      //               },
      //             ];
      //           }
      //         }
      //       }
      //     }
      //   }
      // }
      if(res) {
        yield put({
          type: 'updateState',
          payload: {
            headList: list.content ? list.content : [],
            headPagination: createPagination(list),
            // column: [...columnMap],
          },
        });
      }
      return res;
    },
    // // 导出
    // *handleExport({ payload }, { call }) {
    //   const result = getResponse(yield call(handleExport, payload));
    //   return result;
    // },
    // 批量查询独立值集
    *batchLovData(_, { call, put }) {
      const result = getResponse(
        yield call(queryMapIdpValue, {
          cosTypeMap: 'HME_COS_TYPE',
          statusMap: 'HME.SELECT_STATUS',
          enableMap: 'Z_MTLOT_ENABLE_FLAG',
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
