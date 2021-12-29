/**
 * ListTable -  表格
 * @date: 2019-8-6
 * @author: jrq <ruiqi.jiang01@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Tree, Popconfirm, Spin } from 'hzero-ui';
import { isArray } from 'lodash';
import { Bind } from 'lodash-decorators';

import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import styles from './index.less';
import glassesSvg from '../../../assets/glassesSvg.svg';
import copySvg from '../../../assets/copySvg.svg';
import pasteSvg from '../../../assets/pasteSvg.svg';
import sortSvg from '../../../assets/sortSvg.svg';
import deleteSvg from '../../../assets/deleteSvg.svg';

const { TreeNode } = Tree;
const modelPrompt = 'tarzan.org.RelationMaintain.model.RelationMaintain';

/**
 * 表格
 * @extends {Component} - React.Component
 * @reactProps {Object} relationMaintain - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ relationMaintain, loading }) => ({
  relationMaintain,
  queryTreeDataLoading: loading.effects['relationMaintain/queryTreeData'],
  queryTreeChildredLoading: loading.effects['relationMaintain/queryTreeChildred'],
  querySearchTreeDataLoading: loading.effects['relationMaintain/querySearchTreeData'],
}))
@formatterCollections({
  code: ['tarzan.org.RelationMaintain'], // code 为 [服务].[功能]的字符串数组
})
export default class SelectTree extends React.Component {
  /**
   * 渲染树的子节点
   */
  renderTreeItems = nodes => {
    const { relationMaintain: { isSearchTreeData } } = this.props;
    return nodes.map(item => {
      if ((!isSearchTreeData && item.childrens) || (isSearchTreeData && isArray(item.childrenList)) ) {
        return (
          <TreeNode
            title={this.renderTitle(item)}
            key={`${item.type}-${item.id}-${item.parentType}-${item.parentId}-${item.topSiteId}`}
            id={item.id}
            type={item.type}
            parentId={item.parentId}
            parentType={item.parentType}
            topSiteId={item.topSiteId}
            dataRef={item}
          >
            {this.renderTreeItems(isSearchTreeData ? item.childrenList : item.childrens)}
          </TreeNode>
        );
      } else {
        return (
          <TreeNode
            title={this.renderTitle(item)}
            key={`${item.type}-${item.id}-${item.parentType}-${item.parentId}-${item.topSiteId}`}
            id={item.id}
            type={item.type}
            parentId={item.parentId}
            parentType={item.parentType}
            topSiteId={item.topSiteId}
            dataRef={item}
            isLeaf={!item.children}
          />
        );
      }
    });
  };

  // 异步加载树
  onLoadData = treeNode => {
    const { dispatch, relationMaintain: { isSearchTreeData, expandedKeys } } = this.props;
    if(!isSearchTreeData) {
      const { dataRef } = treeNode.props;
      const newExpandedKeys = [...expandedKeys, `${dataRef.type}-${dataRef.id}-${dataRef.parentType}-${dataRef.parentId}-${dataRef.topSiteId}`];
      return new Promise(resolve => {
        if (treeNode.props.childrens) {
          resolve();
          return;
        }
        dispatch({
          type: 'relationMaintain/queryTreeChildred',
          payload: {
            parentOrganizationId: treeNode.props.id,
            parentOrganizationType: treeNode.props.type,
            topSiteId: treeNode.props.topSiteId,
            expandedKeys: newExpandedKeys,
          },
        }).then(res => {
          if (res && res.success) {
            setTimeout(() => {
              /* eslint-disable */
              treeNode.props.dataRef.childrens = res.rows;
              /* eslint-enable */
              this.props.dispatch({
                type: 'relationMaintain/updateState',
                payload: {
                  orgTree: [...this.props.relationMaintain.orgTree],
                },
              });
              resolve();
            }, 500);
          }
        });
      });
    }
  };

  // 冒泡阻止下层点击事件
  // onOperate(e) {
  //   e.stopPropagation();
  // }

  // 渲染树节点名称
  renderTitle = item => {
    const {
      relationMaintain: { treeSelectedKeys = [], orgNodeCopy = {} },
    } = this.props;
    const title = `${item.name}-${item.text}`;
    return (
      <div className={styles.TreeNodeTitle}>
        <div className={styles.title}>{title}</div>
        <div
          className={
            treeSelectedKeys[0] ===
            `${item.type}-${item.id}-${item.parentType}-${item.parentId}-${item.topSiteId}`
              ? styles.selectedToolbar
              : styles.toolbarRelationMaintain
          }
          // onClick={this.onOperate}
        >
          <img
            className={styles.availableImg}
            src={glassesSvg}
            alt=""
            title={intl.get(`${modelPrompt}.seeDetails`).d('查看详情')}
            onClick={this.lookUpOrg.bind(this, item)}
          />
          {item.parentId && item.type !== 'SITE' ? (
            <img
              className={styles.availableImg}
              src={copySvg}
              alt=""
              onClick={this.copyOrg.bind(this, item)}
              title={intl.get(`${modelPrompt}.copy`).d('复制')}
            />
          ) : null}
          {item.type !== 'LOCATOR' ? (
            orgNodeCopy.id ? (
              <img
                className={styles.availableImg}
                src={pasteSvg}
                alt=""
                title={intl.get(`${modelPrompt}.paste`).d('粘贴')}
                onClick={this.pasteOrg.bind(this, item)}
              />
            ) : (
              <img
                className={styles.unAvailableImg}
                src={pasteSvg}
                alt=""
                title={intl.get(`${modelPrompt}.paste`).d('粘贴')}
              />
            )
          ) : null}
          {item.parentId && (item.type !== 'LOCATOR' || item.parentType !== 'LOCATOR') ? (
            <img
              className={styles.availableImg}
              src={sortSvg}
              alt=""
              title={intl.get(`${modelPrompt}.sameLevelSort`).d('同级排序')}
              onClick={this.orderOrg.bind(this, item)}
            />
          ) : null}
          {item.parentId ? (
            <Popconfirm
              placement="left"
              title={intl.get(`${modelPrompt}.confirmDeletion`).d('确认删除？')}
              okText={intl.get(`${modelPrompt}.sure`).d('确定')}
              cancelText={intl.get(`${modelPrompt}.cancel`).d('取消')}
              onConfirm={this.deleteOrg.bind(this, item)}
            >
              <img
                className={styles.availableImg}
                src={deleteSvg}
                alt=""
                title={intl.get(`${modelPrompt}.delete`).d('删除')}
              />
            </Popconfirm>
          ) : null}
        </div>
      </div>
    );
  };

  // 树节点点击事件
  selectedTreeNode = (selectedKeys, { selected: bool, selectedNodes }) => {
    const { dispatch } = this.props;
    let title = '';
    if(bool) {
      title = `${selectedNodes[0].props.dataRef.text}-${selectedNodes[0].props.dataRef.code}`;
      dispatch({
        type: 'relationMaintain/updateState',
        payload: {
          treeSelectedKeys: selectedKeys,
          treeSelectedNodes: selectedNodes[0].props.dataRef,
          orgItemDrawerVisible: false,
        },
      });
      dispatch({
        type: 'relationMaintain/fetchOrgType',
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

  // 复制组织节点
  copyOrg = item => {
    const { dispatch } = this.props;
    const title = `${item.name}-${item.text}`;
    notification.success({ message: `[${title}]已复制！` });
    dispatch({
      type: 'relationMaintain/updateState',
      payload: {
        orgNodeCopy: item,
      },
    });
  };

  // 粘贴到此组织节点下
  pasteOrg = item => {
    const {
      dispatch,
      relationMaintain: { orgNodeCopy = {}, orgTree = [], expandedKeys },
    } = this.props;
    dispatch({
      type: 'relationMaintain/pasteOrgNode',
      payload: {
        organizationId: orgNodeCopy.id,
        organizationType: orgNodeCopy.type,
        parentOrganizationId: orgNodeCopy.parentId,
        parentOrganizationType: orgNodeCopy.parentType,
        sequence: orgNodeCopy.sequence,
        targetOrganizationId: item.id,
        targetOrganizationType: item.type,
        targetSiteId: item.topSiteId,
        topSiteId: orgNodeCopy.topSiteId,
      },
    }).then(res => {
      if (res && res.success) {
        dispatch({
          type: 'relationMaintain/queryTreeChildred',
          payload: {
            parentOrganizationId: item.id,
            parentOrganizationType: item.type,
            topSiteId: item.topSiteId,
            expandedKeys,
          },
        }).then(res1 => {
          if (res1 && res1.success) {
            this.refreshTreeNode(orgTree, res1.rows, item);
            setTimeout(() => {
              dispatch({
                type: 'relationMaintain/updateState',
                payload: {
                  orgTree: JSON.parse(JSON.stringify(orgTree)),
                },
              });
            }, 500);
          }
        });
      }
    });
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

  // 删除组织节点
  deleteOrg = item => {
    const {
      dispatch,
      relationMaintain: { orgTree = [], expandedKeys },
    } = this.props;
    dispatch({
      type: 'relationMaintain/deleteOrgNode',
      payload: {
        organizationId: item.id,
        organizationType: item.type,
        parentOrganizationId: item.parentId,
        parentOrganizationType: item.parentType,
        topSiteId: item.topSiteId,
      },
    }).then(res => {
      if (res && res.success) {
        dispatch({
          type: 'relationMaintain/queryTreeChildred',
          payload: {
            parentOrganizationId: item.parentId,
            parentOrganizationType: item.parentType,
            topSiteId: item.topSiteId,
            expandedKeys,
          },
        }).then(res1 => {
          if (res1 && res1.success) {
            this.refreshTreeNode(orgTree, res1.rows, { id: item.parentId, type: item.parentType });
            setTimeout(() => {
              dispatch({
                type: 'relationMaintain/updateState',
                payload: {
                  orgTree: JSON.parse(JSON.stringify(orgTree)),
                },
              });
            }, 500);
          }
        });
        // this.props.dispatch({
        //   type: 'relationMaintain/fetchOrgTree',
        // });
      }
    });
  };

  @Bind()
  handleExpand(expandedKeys, { node, expanded }) {
    const { dispatch } = this.props;
    dispatch({
      type: 'relationMaintain/updateState',
      payload: {
        expandedKeys,
      },
    });
    if(expanded) {
      this.onLoadData(node);
    }
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      queryTreeDataLoading,
      queryTreeChildredLoading,
      querySearchTreeDataLoading,
      relationMaintain: { orgTree = [], treeSelectedKeys = [], expandedKeys = [], isSearchTreeData },
    } = this.props;
    return (
      <Spin spinning={queryTreeDataLoading || querySearchTreeDataLoading || queryTreeChildredLoading || false}>
        <Tree
          showLine
          loadData={!isSearchTreeData && this.onLoadData}
          onSelect={this.selectedTreeNode}
          selectedKeys={treeSelectedKeys}
          expandedKeys={expandedKeys}
          onExpand={this.handleExpand}
        >
          {this.renderTreeItems(orgTree)}
        </Tree>
      </Spin>
    );
  }
}
