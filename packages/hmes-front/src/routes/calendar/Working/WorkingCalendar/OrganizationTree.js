/**
 * OrganizationTree 分配组织抽屉左边组织树
 * @date: 2019-12-10
 * @author: hdy <deying.huang@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Tree, Tooltip, Icon } from 'hzero-ui';
import intl from 'utils/intl';

const { TreeNode } = Tree;

@connect(({ working }) => ({
  working,
}))
export default class OrganizationTree extends React.Component {
  /**
   * 渲染树的子节点
   */
  renderTreeItems = nodes => {
    return nodes.map(item => {
      if (item.childrens) {
        return (
          <TreeNode
            title={
              <div>
                {item.text}-{item.code}
                <Tooltip
                  title={intl
                    .get('tarzan.calendar.working.info.organization')
                    .d('该组织已分配同类型日历!')}
                >
                  <Icon
                    style={{
                      fontSize: '14px',
                      color: '#999999',
                      marginLeft: '15px',
                      display: item.sameTypeCalDef ? '' : 'none',
                    }}
                    type="exclamation-circle"
                  />
                </Tooltip>
              </div>
            }
            key={item.id}
            id={item.id}
            type={item.type}
            parentId={item.parentId}
            parentType={item.parentType}
            topSiteId={item.topSiteId}
            dataRef={item}
            disabled={item.alreadyDefined || item.sameTypeCalDef}
          >
            {this.renderTreeItems(item.childrens)}
          </TreeNode>
        );
      } else {
        return (
          <TreeNode
            // title={`${item.text}-${item.code}`}
            title={
              <div>
                {item.text}-{item.code}
                <Tooltip
                  defaultVisible={false}
                  title={intl
                    .get('tarzan.calendar.working.info.organization')
                    .d('该组织已分配同类型日历!')}
                >
                  <Icon
                    style={{
                      fontSize: '14px',
                      color: '#999999',
                      marginLeft: '15px',
                      display: item.sameTypeCalDef ? '' : 'none',
                    }}
                    type="exclamation-circle"
                  />
                </Tooltip>
              </div>
            }
            key={item.id}
            id={item.id}
            type={item.type}
            parentId={item.parentId}
            parentType={item.parentType}
            topSiteId={item.topSiteId}
            dataRef={item}
            isLeaf={!item.children}
            disabled={item.alreadyDefined || item.sameTypeCalDef}
          />
        );
      }
    });
  };

  // 异步加载树
  onLoadData = treeNode => {
    const { dispatch, calendarId, calendarType } = this.props;
    return new Promise(resolve => {
      if (treeNode.props.childrens) {
        resolve();
        return;
      }
      dispatch({
        type: 'working/fetchSubTreeList',
        payload: {
          parentOrganizationId: treeNode.props.id,
          parentOrganizationType: treeNode.props.type,
          topSiteId: treeNode.props.topSiteId,
          calendarId,
          calendarType,
        },
      }).then(res => {
        if (res && res.success) {
          setTimeout(() => {
            /* eslint-disable */
            treeNode.props.dataRef.childrens = res.rows;
            /* eslint-enable */
            this.props.dispatch({
              type: 'working/updateState',
              payload: {
                treeList: [...this.props.working.treeList],
                loadedKeysArray: [...this.props.working.loadedKeysArray, treeNode.props.dataRef.id],
              },
            });
            resolve();
          }, 500);
        }
      });
    });
  };

  onCheck = (checkedKeys, info) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'working/updateState',
      payload: {
        checkedKeys,
        checkedInfo: info,
      },
    });
  };

  render() {
    const {
      working: { treeList = [], loadedKeysArray = [], checkedKeys = [] },
    } = this.props;
    return (
      <Tree
        // showLine
        checkable
        loadData={this.onLoadData}
        onCheck={this.onCheck}
        checkedKeys={checkedKeys}
        checkStrictly
        loadedKeys={loadedKeysArray}
        // onSelect={this.selectedTreeNode}
        // selectedKeys={treeSelectedKeys}
      >
        {treeList.length > 0 ? this.renderTreeItems(treeList) : null}
      </Tree>
    );
  }
}
