/**
 * @Description: IQC检验平台
 * @author: ywj
 * @date 2020/5/15 9:44
 * @version 1.0
 */

// 引入必要
import { getResponse, createPagination } from 'utils/utils';
import { queryMapIdpValue } from 'services/api';
import { queryBaseData } from '@/services/hqms/IqcInspectionPlatformService';

// 输出状态
export default {
  // 命名空间
  namespace: 'iqcInspectionPlatform',
  // 静态状态
  state: {
    dataList: [], // 日期
    pagination: {}, // 分页
    dealStatusMap: [], // 处理状态
    isStatusMap: [], // 是否加急
  },
  // 调用接口
  effects: {
    // 获取下拉框的值
    *init(_, { call, put }) {
      // 调用状态接口
      const result = getResponse(
        yield call(queryMapIdpValue, {
          dealStatusMap: 'HIAM.PERMISSION_CHECK.HANDLE_STATUS',
          isStatusMap: 'HPFM.ENABLED_FLAG',
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
    // 查询数据
    *queryBaseData({ payload }, { call, put }) {
      // 调用接口
      const result = getResponse(yield call(queryBaseData, payload));

      if (result) {
        yield put({
          type: 'updateState',
          payload: {
            lineList: result.content,
            linePaginationList: createPagination(result.rows),
          },
        });
      }
    },
  },
  // 更改状态
  reducers: {
    // 更新状态
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
