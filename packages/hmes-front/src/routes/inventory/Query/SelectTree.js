/**
 * ListTable - 层级树
 * @date: 2019-8-6
 * @author: jrq <ruiqi.jiang01@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Tree, Spin } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';

const modelPrompt = 'tarzan.inventory.query.model.query';

const { TreeNode } = Tree;

@formatterCollections({
  code: ['tarzan.inventory.query'], // code 为 [服务].[功能]的字符串数组
})
/**
 * 层级树
 * @extends {Component} - React.Component
 * @reactProps {Object} query - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ query, loading }) => ({
  query,
  fetchLoading: loading.effects['query/queryTreeData'],
}))
export default class SelectTree extends React.Component {
  /**
   * 渲染树的子节点
   */
  @Bind()
  renderTreeItems(nodes) {
    return nodes.map(item => {
      if (item && item.children) {
        return (
          <TreeNode
            title={this.renderTitle(item)}
            key={`${item.id}-${item.type}-${item.parentId}-${item.parentType}`}
            id={item.id}
            type={item.type}
            dataRef={item}
          >
            {this.renderTreeItems(item.children)}
          </TreeNode>
        );
      } else {
        return (
          <TreeNode
            title={this.renderTitle(item)}
            key={`${item.id}-${item.type}-${item.parentId}`}
            id={item.id}
            type={item.type}
            dataRef={item}
          />
        );
      }
    });
  }

  // 渲染树节点名称
  @Bind()
  renderTitle(obj) {
    let title = '';
    if (!obj || !obj.type) {
      return;
    }
    this.props.query.orgTypeList.forEach(item => {
      if (item.typeCode === obj.type) {
        title = `${item.description}-${obj.code}`;
      }
    });
    const returnValue = title || `${intl.get(`${modelPrompt}.siteCode`).d('站点')}-${obj.code}`;
    return returnValue;
  }

  // 选中树节点
  @Bind()
  onCheck = (checkedKeys, { checkedNodes }) => {
    const {
      dispatch,
      query: { queryCriteria },
    } = this.props;
    const list = [];
    checkedNodes.forEach(item => {
      list.push({
        orgId: item.props.id,
        orgType: item.props.type,
      });
    });
    dispatch({
      type: 'query/updateState',
      payload: {
        checkedKeys,
        checkedNodesInfoList: list,
      },
    });
    dispatch({
      type: 'query/queryBillList',
      payload: {
        ...queryCriteria,
        orgList: list,
      },
    });
  };

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      query: { treeJSON = [], checkedKeys = [] },
      fetchLoading,
    } = this.props;
    return (
      <Spin spinning={fetchLoading || false}>
        <Tree checkable onCheck={this.onCheck} checkedKeys={checkedKeys}>
          {this.renderTreeItems(treeJSON)}
        </Tree>
      </Spin>
    );
  }
}
