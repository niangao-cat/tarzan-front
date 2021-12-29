/**
 * ListTable -  表格
 * @date: 2019-8-6
 * @author: jrq <ruiqi.jiang01@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Tree } from 'hzero-ui';
import formatterCollections from 'utils/intl/formatterCollections';
import styles from './index.less';

const { TreeNode } = Tree;

/**
 * 表格
 * @extends {Component} - React.Component
 * @reactProps {Object} relationMaintain - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ productTraceability }) => ({
  productTraceability,
}))
@formatterCollections({
  code: ['tarzan.org.RelationMaintain'], // code 为 [服务].[功能]的字符串数组
})
export default class SelectTree extends React.Component {

  /**
   * 渲染树的子节点
   */
  renderTreeItems = nodes => {
    return nodes.map(item => {
      if (item.childrens) {
        return (
          <TreeNode
            title={this.renderTitle(item)}
            key={`${item.jobMaterialId}-${item.materialCode}-${item.materialLotCode}`}
            id={item.jobMaterialId}
            // parentId={item.parentId}
            dataRef={item}
          >
            {this.renderTreeItems(item.childrens)}
          </TreeNode>
        );
      } else {
        return (
          <TreeNode
            title={this.renderTitle(item)}
            key={`${item.jobMaterialId}-${item.materialCode}-${item.materialLotCode}`}
            id={item.jobMaterialId}
            // parentId={item.parentId}
            dataRef={item}
            isLeaf={!item.children}
          />
        );
      }
    });
  };

  // 异步加载树
  onLoadData = treeNode => {
    const { dispatch, saveloadedKeys } = this.props;
    saveloadedKeys(treeNode.props.eventKey);
    return new Promise(resolve => {
      if (treeNode.props.childrens) {
        resolve();
        return;
      }
      dispatch({
        type: 'productTraceability/queryTreeChildred',
        payload: {
          parentType: 'N',
          materialLotCode: treeNode.props.dataRef.materialLotCode,
        },
      }).then(res => {
        if (res) {
          setTimeout(() => {
            /* eslint-disable */
            treeNode.props.dataRef.childrens = res;
            /* eslint-enable */
            this.props.dispatch({
              type: 'productTraceability/updateState',
              payload: {
                productComponentList: [...this.props.productTraceability.productComponentList],
              },
            });
            resolve();
          }, 500);
        }
      });
    });
  };

  // 渲染树节点名称
  renderTitle = item => {
    const title = `${item.itemGroupDescription}-${item.materialLotCode}-${item.releaseQty}`;
    return (
      <div className={styles.TreeNodeTitle}>
        <div className={styles.title}>{title}</div>
      </div>
    );
  };

  // 树节点点击事件
  selectedTreeNode = (selectedKeys, { selected: bool, selectedNodes }) => {
    const { dispatch, showDetailData } = this.props;
    // eslint-disable-next-line no-unused-vars
    let title = '';
    if (bool) {
      showDetailData(selectedNodes[0].props.dataRef.materialLotCode);
      title = `${selectedNodes[0].props.dataRef.text}-${selectedNodes[0].props.dataRef.code}`;
      dispatch({
        type: 'productTraceability/updateState',
        payload: {
          treeSelectedKeys: selectedKeys,
          treeSelectedNodes: selectedNodes[0].props.dataRef,
          orgItemDrawerVisible: false,
        },
      });
      dispatch({
        type: 'productTraceability/fetchOrgType',
        payload: {
          relationPlace: title,
          typeGroup: this.getTypeGroup(selectedNodes[0].props.dataRef.type),
          orgType: '',
          ToBeDistribOrg: {},
          DistribOrgDisableFlag: true,
        },
      });
    }
  };

  getTypeGroup = value => {
    switch (value) {
      case 'AREA':
        return 'AREA_ASSIGNABLE';
      case 'PROD_LINE':
        return 'PROD_LINE_ASSIGNABLE';
      case 'SITE':
        return 'SITE_ASSIGNABLE';
      case 'ENTERPRISE':
        return 'ENTERPRISE_ASSIGNABLE';
      case 'LOCATOR':
        return 'LOCATOR_ASSIGNABLE';
      case 'WORKCELL':
        return 'WORKCELL_ASSIGNABLE';
      default:
        return '';
    }
  };

  // 查看组织节点
  lookUpOrg = item => {
    const {
      dispatch,
      relationMaintain: { orgItemDrawerVisible },
    } = this.props;
    if (orgItemDrawerVisible) {
      dispatch({
        type: 'relationMaintain/updateState',
        payload: {
          orgItemId: '',
          orgItemType: '',
          orgItemDrawerVisible: false,
        },
      });
    }
    setTimeout(() => {
      dispatch({
        type: 'relationMaintain/updateState',
        payload: {
          orgItemId: item.id,
          orgItemType: item.type,
          orgItemDrawerVisible: true,
        },
      });
    }, 100);
  };

  /* eslint-disable */
  refreshTreeNode(orgTree, data, item) {
    orgTree.forEach(it => {
      if (it.id === item.id && it.type === item.type) {
        it.children = true;
        it.childrens = data;
      } else if (it.childrens) {
        this.refreshTreeNode(it.childrens, data, item);
      }
    });
  }
  /* eslint-enable */

  // 排序
  orderOrg = item => {
    const { dispatch } = this.props;
    dispatch({
      type: 'relationMaintain/fetchAdjustOrderList',
      payload: {
        topSiteId: item.topSiteId,
        parentOrganizationId: item.parentId,
        parentOrganizationType: item.parentType,
        organizationId: item.id,
        organizationType: item.type,
      },
    });
  };

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      productTraceability: {
        productComponentList = [],
      },
      loadedKeys,
      expandedKeysProps,
      saveExpandedKeys,
    } = this.props;
    return (
      <Tree
        loadData={this.onLoadData}
        loadedKeys={loadedKeys}
        expandedKeys={expandedKeysProps}
        onExpand={expandedKeys=>{
          saveExpandedKeys(expandedKeys);
        }}
        onSelect={this.selectedTreeNode}
        showLine
      >
        {this.renderTreeItems(productComponentList)}
      </Tree>
    );
  }
}
