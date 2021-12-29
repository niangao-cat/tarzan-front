/**
 * @author:ywj
 * @email:wenjie.yang01@hand-china.com
 * @description: 外协管理平台 连接层
 */

// 引入必要依赖包
import { getResponse, createPagination } from 'utils/utils';
import {
    queryHeadData,
    queryLineData,
    queryReturnLineData,
    createOutSourceData,
    fetchLineDetail,
    printData,
    queryCreateReturn,
    createOutReturnSourceData,
    closeOutData,
    queryHavingQty,
} from '@/services/hqms/outsourceManagePlatformService';
import { querySiteList } from '@/services/hwms/inventoryAllocationService';
import { queryMapIdpValue } from 'services/api';

// 默认导出
export default {
    namespace: 'outsourceManagePlatform', // 命名空间
    state: {
        headList: [], // 头信息
        headPagination: {}, // 头分页
        lineList: [], // 行信息
        linePagination: {}, // 行分页
        headForCreateData: {}, // 创建头信息
        lineForCreateList: [], // 行信息
        docTypeMap: [], // 单据类型
        docStatusMap: [], // 单据状态
        siteMap: [], // 工厂数据
        materialVersionMap: [], // 物料版本
        lineDetailList: [],
        lineDetailPagination: {},
        createReturnList: [],
        createReturnHead: {},
        reasonMap: [], // 退料原因
    }, // 全局暂存信息
    effects: {
        // 查询独立值集
        *init(_, { call, put }) {
            const { docTypeMap, docStatusMap, materialVersionMap, reasonMap } = getResponse(
                yield call(queryMapIdpValue, {
                    docTypeMap: 'WMS.OUTSOURCING_DOC_TYPE',
                    docStatusMap: 'WMS.OUTSOURCING_DOC_STATUS',
                    materialVersionMap: 'HCM.MATERIAL_VERSION',
                    reasonMap: 'WMS.OUTSOURCING_RETURN_REASON',
                })
            );
            yield put({
                type: 'updateState',
                payload: {
                    docTypeMap,
                    docStatusMap,
                    materialVersionMap,
                    reasonMap,
                },
            });
        },

        // 查询工厂下拉框
        *querySiteList(_, { call, put }) {
            const res = getResponse(yield call(querySiteList));
            if (res) {
                yield put({
                    type: 'updateState',
                    payload: {
                        siteMap: res,
                    },
                });
            }
        },

        // 查询需要创建的行信息
        *queryCreateReturn({ payload }, { call, put }) {
            const res = yield call(queryCreateReturn, payload);
            if (res) {
                if(res.lineVOList!==undefined&&res.lineVOList.length>0){
                    for(let i=0; i< res.lineVOList.length; i++){
                        res.lineVOList[i]._status = 'update';
                    }
                }
                yield put({
                    type: 'updateState',
                    payload: {
                        createReturnList: res.lineVOList,
                        createReturnHead: res.qmsInvoiceHeadReturnDTO,
                    },
                });
            }
        },

        // 查询头信息
        *queryHeadData({ payload }, { call, put }) {

            // 清空行信息
            yield put({
                type: 'updateState',
                payload: {
                    lineList: [],
                    linePagination: {},
                },
            });

            const res = yield call(queryHeadData, payload);
            const list = getResponse(res);
            // 成功时，更改状态
            if (list) {
                yield put({
                    type: 'updateState',
                    payload: {
                        headList: list.content,
                        headPagination: createPagination(list),
                    },
                });
            }
        },

        // 查询行信息
        *queryLineData({ payload }, { call, put }) {
            const res = yield call(queryLineData, payload);
            const list = getResponse(res);
            // 成功时，更改状态
            if (list) {
                yield put({
                    type: 'updateState',
                    payload: {
                        lineList: list.content,
                        linePagination: createPagination(list),
                    },
                });
            }
        },

        // 查询创建行信息
        *queryReturnLineData({ payload }, { call, put }) {
            const res = yield call(queryReturnLineData, payload);
            const list = getResponse(res);
            // 成功时，更改状态
            if (list) {
                yield put({
                    type: 'updateState',
                    payload: {
                        lineForCreateList: [],
                        headForCreateData: list,
                    },
                });
            }
        },

        // 创建发货单
        *createOutSourceData({ payload }, { call }) {
            const result = getResponse(yield call(createOutSourceData, payload));
            return result;
        },

         // 创建补料单信息
         *createOutReturnSourceData({ payload }, { call }) {
            const result = getResponse(yield call(createOutReturnSourceData, payload));
            return result;
        },

         // 关闭接口
         *closeOutData({ payload }, { call }) {
            const result = getResponse(yield call(closeOutData, payload));
            return result;
        },
        // 查询明细界面
        *fetchLineDetail({ payload }, { call, put }) {
            const res = yield call(fetchLineDetail, payload);
            const list = getResponse(res);
            // 成功时，更改状态
            if (list) {
                yield put({
                    type: 'updateState',
                    payload: {
                        lineDetailList: list.content,
                        lineDetailPagination: createPagination(list),
                    },
                });
            }
        },
        *printData({ payload }, { call }) {
            const result = getResponse(yield call(printData, payload));
            return result;
        },

        // 查询剩余库存
        *queryHavingQty({ payload }, { call }) {
            const res = yield call(queryHavingQty, payload);
            const data = getResponse(res);
            return data;
        },

    }, // 视图和接口的缓冲方法

    // 封装更改状态的方法
    reducers: {
        updateState(state, action) {
            return {
                ...state,
                ...action.payload,
            };
        },
    },
};
