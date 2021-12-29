/**
 * 员工出勤报表
 * @date: 2021/03/08 10:53:47
 * @author: junfeng.chen@hand-china.com
 */

 import { getResponse, createPagination, getCurrentOrganizationId } from 'utils/utils';
 import { queryMapIdpValue, queryUnifyIdpValue } from 'services/api';
 import { isArray } from 'lodash';
 import {
   fetchList,
 } from '../../services/hhme/signInOutService';

 const tenantId = getCurrentOrganizationId();

 export default {
   namespace: 'signInOut',
   state: {
     list: [],
     colData: [],
     pagination: {},
     abnormalTypeList: [],
     abnormalStatusList: [],
     areaList: [],
   },
   effects: {
     *init(_, { call, put }) {
       const res = getResponse(yield call(queryMapIdpValue, {
         abnormalStatusList: 'HME.EXCEPTION_STATUS',
       }));
       const params = {
         tenantId,
       };
       const abnormalTypeList = getResponse(yield call(queryUnifyIdpValue, 'HME.EXCEPTION_TYPE', params));
       const areaList = getResponse(yield call(queryUnifyIdpValue, 'HME.AREA_NAME'));
       yield put({
         type: 'updateState',
         payload: {
           ...res,
           abnormalTypeList,
           areaList: isArray(areaList) ? areaList : [],
         },
       });
     },

     // 查询报表信息
     *fetchList({ payload }, { call, put }) {
         // 先清空数据
         yield put({
           type: 'updateState',
           payload: {
             list: [],
             colData: [],
           },
         });
         const res = getResponse(yield call(fetchList, payload));
         let colData = [];
         if (res&&res.content) {
           for (let i = 0; i < res.content.length; i++) {
             if (res.content[i].hmeSignInOutRecordVO2List.length > 0) {
               for (let j = 0; j < res.content[i].hmeSignInOutRecordVO2List.length; j++) {
                  // 获取动态数据
                 colData = colData.filter(item=>item===res.content[i].hmeSignInOutRecordVO2List[j].dateString).length>0?colData: [...colData, res.content[i].hmeSignInOutRecordVO2List[j].dateString];
                 res.content[i][
                   `${res.content[i].hmeSignInOutRecordVO2List[j].dateString}onTime`
                 ] = res.content[i].hmeSignInOutRecordVO2List[j].onTime;
                 res.content[i][
                   `${res.content[i].hmeSignInOutRecordVO2List[j].dateString}downTime`
                 ] = res.content[i].hmeSignInOutRecordVO2List[j].downTime;
                 res.content[i][
                   `${res.content[i].hmeSignInOutRecordVO2List[j].dateString}stopTime`
                 ] = res.content[i].hmeSignInOutRecordVO2List[j].stopTime;
                 res.content[i][
                     `${res.content[i].hmeSignInOutRecordVO2List[j].dateString}reasonMeaning`
                 ] = res.content[i].hmeSignInOutRecordVO2List[j].reasonMeaning;
                 res.content[i][
                   `${res.content[i].hmeSignInOutRecordVO2List[j].dateString}shiftCode`
               ] = res.content[i].hmeSignInOutRecordVO2List[j].shiftCode;
               }
             }
           }
           yield put({
             type: 'updateState',
             payload: {
               list: [ ...res.content ],
               colData: colData.sort(),
               pagination: createPagination(res),
             },
           });
         }else{
           yield put({
             type: 'updateState',
             payload: {
               headList: [],
               colData: [],
             },
           });
         }
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
