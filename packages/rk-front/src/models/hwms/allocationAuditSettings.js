/**
 * 库存调拨审核设置
 *@date：2019/10/18
 *@version：0.0.1
 */
import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import { queryList, saveData, deleteData } from '../../services/hwms/allocationAuditSettingsService';

export default {
  namespace: 'allocationAuditSettings',
  state: {
    dataList: [],
    pagination: {},
    detail: {},
    approveSettingMap: [],
  },
  effects: {
    // 查询列表
    *queryList({ payload }, { call, put }) {
      const res = getResponse(yield call(queryList, payload));
      if (res) {
        yield put({
          type: 'updateState',
          payload: {
            dataList: res.content,
            pagination: createPagination(res),
          },
        });
      }
      return res;
    },
    // 获取下拉框的值
    *init(_, { call, put }) {
      // 调用状态接口
      const result = getResponse(
        yield call(queryMapIdpValue, {
          approveSettingMap: 'WMS.APPRO_SETTING',
        })
      );
      if (result) {
        // 返回成功状态赋值
        yield put({
          type: 'updateState',
          payload: {
            ...result,
          },
        });
      }
    },
    // 保存数据
    *saveData({ payload }, { call }) {
      return getResponse(yield call(saveData, payload));
    },

    // 删除数据
    *deleteData({ payload }, { call }) {
      return getResponse(yield call(deleteData, payload));
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
