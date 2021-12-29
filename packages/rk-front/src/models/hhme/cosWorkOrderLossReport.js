/**
 * cosWorkOrderLossReport - 过账平台models
 * @date: 2021/08/22 19:53:47
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';

import {
	fetchList,
	fetchDefaultSite,
} from '../../services/hhme/cosWorkOrderLossReportService';

export default {
	namespace: 'cosWorkOrderLossReport',
	state: {
		list: [],
		pagination: {},
		statusList: [],
		siteInfo: {},
	},
	effects: {
		*init(_, { call, put }) {
			const res = yield call(queryMapIdpValue, {
				statusList: 'MT.WO_STATUS',
			});
			const siteInfo = getResponse(yield call(fetchDefaultSite));
			yield put({
				type: 'updateState',
				payload: {
				...res,
				siteInfo,
				},
			});
		},

	*fetchList({ payload }, { call, put }) {
    const res = getResponse(yield call(fetchList, payload));
    if(res) {
        yield put({
        type: 'updateState',
        payload: {
            list: res.content,
            pagination: createPagination(res),
        },
        });
    	}
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
