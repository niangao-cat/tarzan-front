/**
 * @date 2019-8-8
 * @author HDY <deying.huang@hand-china.com>
 */

import { get as chainget, isArray } from 'lodash';
import notification from 'utils/notification';
import { getResponse, createPagination } from 'utils/utils';
import { ergodicData } from '@/utils/utils';
import { queryMapIdpValue } from 'services/api';

import {
  fetchOrgTree,
  fetchTreeOrgType,
  fetchOrgType,
  assignOrg,
  pasteOrgNode,
  deleteOrgNode,
  fetchAdjustOrderList,
  saveAdjustOrderList,
  queryTreeData,
  fetchDefaultSite,
  querySearchTreeData,
} from '../../services/org/relationMaintainService';


export default {
  namespace: 'relationMaintain',
  state: {
    orgTree: [], // 目录树
    treeOrgTypeList: [], // 树渲染title所用的组织类型
    treeSelectedKeys: [], // 选中树节点ID
    treeSelectedNodes: {}, // 选中树节点信息
    orgNodeCopy: {}, // 复制的组织节点信息

    DistribOrgDisableFlag: true, // 点击分配组织按钮，是否可编辑的disableFlag

    relationPlace: '', // 分配位置
    orgTypeList: [], // 组织类型下拉框选项数据
    orgType: '', // 分配组织类型
    ToBeDistribOrg: {}, // 待分配组织Lov选中信息

    orgItemId: 'create', // 新增/编辑组织项目的id
    orgItemType: 'WorkCellBlock', // 新增/编辑组织项目的type
    orgItemDrawerVisible: false, // 新增/编辑组织项目Drawer的visible

    adjustOrderList: [], // 调整顺序表格列表数据
    adjustOrderListPagination: {}, // 调整顺序表格列表数据分页
    adjustOrderDrawerVisible: false, // 调整顺序Drawer的visible

    organizationTypeList: [], // 组织分类
    siteInfo: {}, // 默认站点信息
    isSearchTreeData: false, // 是否为查询条件查询树结构
  },
  effects: {
    // 异步获取树节点
    *queryTreeData({ payload }, { call, put }) {
      const { expandedKeys, ...params } = payload;
      const res = yield call(queryTreeData, params);
      const list = getResponse(res);
      if (list && list.success) {
        yield put({
          type: 'updateState',
          payload: {
            // 使用<Tree/>组件，需要插入数组对象，而这里返回的是JSON对象
            orgTree: list.rows,
            expandedKeys,
            isSearchTreeData: false,
          },
        });
      } else if (list && !list.success) {
        notification.error({ message: list.message });
      }
    },

    // 查询树展开节点下层
    *queryTreeChildred({ payload }, { call, put }) {
      const { expandedKeys, ...params } = payload;
      const res = yield call(queryTreeData, params);
      // const list = getResponse(res);
      if(res) {
        yield put({
          type: 'updateState',
          payload: {
            expandedKeys,
          },
        });
      }
      return getResponse(res);
      // if (list && list.success) {
      //   yield put({
      //     type: 'updateState',
      //     payload: {
      //       // 使用<Tree/>组件，需要插入数组对象，而这里返回的是JSON对象
      //       orgTreeChildren: list.rows,
      //     },
      //   });
      // } else if (list && !list.success) {
      //   notification.error({ message: list.message });
      // }
    },

    // 获取各下拉框内容
    *queryInitInfo({ payload }, { call, put }) {
      const treeOrgType = yield call(fetchTreeOrgType, payload);
      if (getResponse(treeOrgType) && treeOrgType.success) {
        yield put({
          type: 'updateState',
          payload: {
            treeOrgTypeList: treeOrgType.rows,
          },
        });
        // const orgTree = yield call(fetchOrgTree, payload);
        // yield put({
        //   type: 'updateState',
        //   payload: {
        //     // 使用<Tree/>组件，需要插入数组对象，而这里返回的是JSON对象
        //     orgTree: [chainget(orgTree, 'rows', {})], // [orgTree.rows],
        //   },
        // });
      } else if (treeOrgType && !treeOrgType.success) {
        notification.error({ message: treeOrgType.message });
      }
    },

    // 获取组织类型下拉框选项数据
    *fetchOrgType({ payload }, { call, put }) {
      const orgType = yield call(fetchOrgType, payload);
      if (getResponse(orgType) && orgType.success) {
        yield put({
          type: 'updateState',
          payload: {
            orgTypeList: orgType.rows,
            relationPlace: payload.relationPlace,
            orgType: payload.orgType,
            ToBeDistribOrg: payload.ToBeDistribOrg,
            DistribOrgDisableFlag: payload.DistribOrgDisableFlag,
          },
        });
      } else if (orgType && !orgType.success) {
        notification.error({ message: orgType.message });
      }
    },

    // 获取组织关系树
    *fetchOrgTree({ payload }, { call, put }) {
      const res = yield call(fetchOrgTree, payload);
      const list = getResponse(res);
      if (list && list.success) {
        yield put({
          type: 'updateState',
          payload: {
            // 使用<Tree/>组件，需要插入数组对象，而这里返回的是JSON对象
            orgTree: [list.rows],
          },
        });
      } else if (list && !list.success) {
        notification.error({ message: list.message });
      }
    },

    // 获取调整顺序表格的数据
    *fetchAdjustOrderList({ payload }, { call, put }) {
      const res = yield call(fetchAdjustOrderList, payload);
      const list = getResponse(res);
      if (list && list.success) {
        yield put({
          type: 'updateState',
          payload: {
            adjustOrderList: chainget(list, 'rows.content', []),
            adjustOrderListPagination: createPagination(list.rows),
            adjustOrderDrawerVisible: true,
          },
        });
      } else if (list && !list.success) {
        notification.error({ message: list.message });
      }
    },

    // 保存调整顺序表格的数据
    *saveAdjustOrderList({ payload }, { call }) {
      const result = yield call(saveAdjustOrderList, ergodicData(payload));
      return getResponse(result);
    },

    // 粘贴组织关系树节点(组织节点)
    *pasteOrgNode({ payload }, { call }) {
      const res = yield call(pasteOrgNode, ergodicData(payload));
      const list = getResponse(res);
      if (list && list.success) {
        notification.success();
        return list;
      } else if (list && !list.success) {
        notification.error({ message: list.message });
      }
    },

    // 删除组织关系树节点(组织节点)
    *deleteOrgNode({ payload }, { call }) {
      const res = yield call(deleteOrgNode, ergodicData(payload));
      const list = getResponse(res);
      if (list && list.success) {
        notification.success();
        return list;
      } else if (list && !list.success) {
        notification.error({ message: list.message });
      }
    },

    // 分配组织保存
    *assignOrg({ payload }, { call }) {
      const result = yield call(assignOrg, ergodicData(payload));
      if (result && result.success) {
        notification.success();
        return getResponse(result);
      } else if (result && !result.success) {
        notification.error({ message: result.message });
      }
    },

    *init(_, { call, put }) {
      const res = yield call(queryMapIdpValue, {
        organizationTypeList: 'MT.ORGANIZATION_TYPE',
      });
      const siteInfo = yield call(fetchDefaultSite);
      yield put({
        type: 'updateState',
        payload: {
          ...res,
          siteInfo,
        },
      });
    },

    *querySearchTreeData({ payload }, { call, put }) {
      const res = getResponse(yield call (querySearchTreeData, payload));
      const expandedKeys = [];
      const getTreeKeys = (list) => {
        if(isArray(list)) {
          list.forEach(e => {
            expandedKeys.push(`${e.type}-${e.id}-${e.parentType}-${e.parentId}-${e.topSiteId}`);
            if(e.children) {
              getTreeKeys(e.childrenList);
            }
          });
        }
      };
      getTreeKeys(res.rows);
      if(res) {
        yield put({
          type: 'updateState',
          payload: {
            orgTree: res.rows,
            expandedKeys,
            isSearchTreeData: true,
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
