/**
 * AdjustOrderDrawer - 调整顺序抽屉
 * @date 2019-8-23
 * @author: jrq <ruiqi.jiang01@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Modal, Form, InputNumber } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import EditTable from 'components/EditTable';
import { changeTableRowEditState, getEditRecord, updateTableRowData } from '@/utils/utils';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { isArray } from 'lodash';

const modelPrompt = 'tarzan.org.RelationMaintain.model.RelationMaintain';

/**
 * 修改历史展示
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {String} anchor - 模态框弹出方向
 * @return React.element
 */
@connect(({ relationMaintain, loading }) => ({
  relationMaintain,
  tabLoading: loading.effects['relationMaintain/fetchAdjustOrderList'],
}))
@formatterCollections({
  code: ['tarzan.org.RelationMaintain'], // code 为 [服务].[功能]的字符串数组
})
@Form.create({ fieldNameProp: null })
export default class AdjustOrderDrawer extends PureComponent {
  onCancel = () => {
    this.props.dispatch({
      type: 'relationMaintain/updateState',
      payload: {
        adjustOrderDrawerVisible: false,
      },
    });
  };

  onOk = () => {

    const {
      dispatch,
      relationMaintain: { orgTree = [], treeSelectedNodes = {}, loadedKeysArray = [], expandedKeysArray = [] },
    } = this.props;
    dispatch({
      type: 'relationMaintain/updateState',
      payload: {
        adjustOrderDrawerVisible: false,
      },
    });
    //  获取同层级顺序调整后的数据
    dispatch({
      type: 'relationMaintain/queryTreeChildred',
      payload: {
        parentOrganizationId: treeSelectedNodes.parentId,
        parentOrganizationType: treeSelectedNodes.parentType,
        topSiteId: treeSelectedNodes.topSiteId,
      },
    }).then(res => {
      if (res && res.success) {
        //  获取排序层级的已展开树节点
        const alreadyLoadedKeys = [];
        const getCurrentTreeNode = (chapterTree) => {
          if (isArray(chapterTree) && chapterTree.length > 0) {
            chapterTree.forEach(item => {
              if ((item.id === treeSelectedNodes.parentId) && (item.type === treeSelectedNodes.parentType)) {
                item.childrens.forEach(ele => {
                  alreadyLoadedKeys.push(`${ele.type}-${ele.id}-${ele.parentType}-${ele.parentId}-${ele.topSiteId}`);
                });
              } else if (item.childrens && isArray(item.childrens) && (item.childrens.length > 0)) {
                return getCurrentTreeNode(item.childrens);
              }
            });
          }
        };
        getCurrentTreeNode(orgTree);

        //  获取新的树
        const getNewTreeList = (newTree, firstLevel) =>
          newTree.map(item => {
            if (firstLevel && treeSelectedNodes.type === 'SITE') {
              return {
                ...item,
                childrens: res.rows,
              };
            } else if (
              (item.type === treeSelectedNodes.parentType) &&
              (item.id === treeSelectedNodes.parentId) &&
              (item.topSiteId === treeSelectedNodes.topSiteId)
            ) {
              return {
                ...item,
                childrens: res.rows,
              };
            } else if (item.childrens && isArray(item.childrens) && (item.childrens.length > 0)) {
              return {
                ...item,
                childrens: getNewTreeList(item.childrens, false),
              };
            } else {
              return item;
            }
          });
        const newTreeHere = getNewTreeList(orgTree, true);
        const difLoadedKeys = loadedKeysArray.concat(alreadyLoadedKeys).filter(v => loadedKeysArray.includes(v) && !alreadyLoadedKeys.includes(v));
        const difExpandedKeys = expandedKeysArray.concat(alreadyLoadedKeys).filter(v => expandedKeysArray.includes(v) && !alreadyLoadedKeys.includes(v));
        dispatch({
          type: 'relationMaintain/updateState',
          payload: {
            orgTree: newTreeHere,
            expandedKeysArray: difExpandedKeys, //  已展开的树节点ID
            loadedKeysArray: difLoadedKeys, // 已进行异步查询树节点ID
          },
        });
      }
    });
  };

  /**
   * 编辑关联表
   */
  @Bind()
  handleEdit(record) {
    const {
      dispatch,
      relationMaintain: { adjustOrderList },
    } = this.props;
    dispatch({
      type: 'relationMaintain/updateState',
      payload: { adjustOrderList: changeTableRowEditState(record, adjustOrderList, 'uiId') },
    });
  }

  // 保存关联表
  @Bind()
  handleSave(record) {
    const {
      dispatch,
      relationMaintain: { adjustOrderList = [] },
    } = this.props;
    record.$form.validateFields(err => {
      if (!err) {
        const params = getEditRecord(record, adjustOrderList, 'uiId');
        params.sequence = params.sequence ? params.sequence : null;
        dispatch({
          type: 'relationMaintain/saveAdjustOrderList',
          payload: {
            ...params,
          },
        }).then(res => {
          if (res && res.success) {
            notification.success();
            dispatch({
              type: 'relationMaintain/updateState',
              payload: { adjustOrderList: updateTableRowData(params, adjustOrderList, 'uiId') },
            });
          } else {
            notification.error({ message: res.message });
          }
        });
      }
    });
  }

  /**
   * 分页变化后触发方法
   * @param {object} pagination 分页信息
   */
  @Bind()
  handleTableChange(pagination) {
    const {
      relationMaintain: { objectTypePagination = {} },
    } = this.props;
    const pager = { ...objectTypePagination };
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.fetchQueryList(pager);
  }

  /**
   * 查询数据
   * @param {object} page 页面基本信息数据
   */
  @Bind()
  fetchQueryList(objectTypePagination) {
    const {
      dispatch,
      relationMaintain: { treeSelectedNodes = {} },
    } = this.props;
    dispatch({
      type: 'relationMaintain/fetchAdjustOrderList',
      payload: {
        topSiteId: treeSelectedNodes.topSiteId,
        parentOrganizationId: treeSelectedNodes.parentId,
        parentOrganizationType: treeSelectedNodes.parentType,
        organizationId: treeSelectedNodes.id,
        organizationType: treeSelectedNodes.type,
        page: objectTypePagination,
      },
    });
  }

  render() {
    const {
      tabLoading,
      relationMaintain: { adjustOrderList, adjustOrderListPagination, adjustOrderDrawerVisible },
    } = this.props;

    const columns = [
      {
        title: intl.get(`${modelPrompt}.organizationCode`).d('组织编码'),
        dataIndex: 'organizationCode',
        width: 180,
      },
      {
        title: intl.get(`${modelPrompt}.organizationName`).d('组织描述'),
        dataIndex: 'organizationName',
        width: 180,
      },
      {
        title: intl.get(`${modelPrompt}.sequence`).d('组织顺序'),
        dataIndex: 'sequence',
        width: 110,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`sequence`, {
                initialValue: record.sequence,
              })(<InputNumber />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 100,
        align: 'center',
        render: (_, record) => (
          <span className="action-link">
            {record._status === 'update' && (
              <Fragment>
                <a onClick={() => this.handleEdit(record)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.handleSave(record)}>
                  {intl.get('tarzan.org.RelationMaintain.button.save').d('保存')}
                </a>
              </Fragment>
            )}
            {!['create', 'update'].includes(record._status) && (
              <a onClick={() => this.handleEdit(record)}>
                {intl.get('tarzan.org.RelationMaintain.button.edit').d('编辑')}
              </a>
            )}
          </span>
        ),
      },
    ];
    return (
      <Modal
        destroyOnClose
        width={720}
        title={intl.get('tarzan.org.RelationMaintain.title.Rearrange').d('调整顺序')}
        visible={adjustOrderDrawerVisible}
        onCancel={this.onCancel}
        onOk={this.onOk}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <div style={{ width: '100%' }}>
          <EditTable
            bordered
            loading={tabLoading}
            rowKey="uiId"
            dataSource={adjustOrderList}
            columns={columns}
            pagination={adjustOrderListPagination || {}}
            onChange={this.handleTableChange}
          />
        </div>
      </Modal>
    );
  }
}
