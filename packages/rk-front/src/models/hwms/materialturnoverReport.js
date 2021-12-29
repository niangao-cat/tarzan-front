/*
 * @Description: 物料周转报表
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-01 17:41:20
 * @LastEditTime: 2021-02-02 10:01:08
 */

import { getResponse, createPagination } from 'utils/utils';
import {
    handleFetchList,
    getSiteList,
    fetchSiteList,
} from '@/services/hwms/materialturnoverReportService';
import { queryMapIdpValue } from 'services/api';

export default {
    namespace: 'materialturnoverReport',
    state: {
        siteMap: [],
        list: [],
        listPagination: {},
    },
    effects: {
        *batchLovData(_, { call, put }) {
            const siteList = getResponse(yield call(fetchSiteList));
            const res = getResponse(
                yield call(queryMapIdpValue, {
                    ncIncidentStatus: 'HME.NC_INCIDENT_STATUS',
                    ncProcessMethod: 'HME.NC_PROCESS_METHOD',
                })
            );
            if (res) {
                yield put({
                    type: 'updateState',
                    payload: {
                        ...res,
                    },
                });
            }
            if (siteList) {
                yield put({
                    type: 'updateState',
                    payload: {
                        siteList,
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
                        siteMap: result,
                    },
                });
            }
            return result;
        },
        *handleFetchList({ payload }, { call, put }) {
            // 先清空数据
            yield put({
                type: 'updateState',
                payload: {
                    list: [],
                },
            });
            const res = getResponse(yield call(handleFetchList, payload));
            if (res) {
                yield put({
                    type: 'updateState',
                    payload: {
                        list: res.content,
                        listPagination: createPagination(res),
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
