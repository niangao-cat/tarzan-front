import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Modal, Form, Button, Spin } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import Lov from 'components/Lov';
import formatterCollections from 'utils/intl/formatterCollections';
import EditTable from 'components/EditTable';
import { addItemToPagination } from 'utils/utils';
import uuid from 'uuid/v4';
import intl from 'utils/intl';

const modelPrompt = 'tarzan.hmes.status.model.status';
/**
 * 关联表展示
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {String} anchor - 模态框弹出方向
 * @return React.element
 */
@connect(({ generalStatus, loading }) => ({
  generalStatus,
  loading: {
    query: loading.effects['generalStatus/fetchTableList'],
  },
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({ code: 'tarzan.org.proline' })
export default class TableDrawer extends PureComponent {
  /**
   * 新建行
   */
  @Bind()
  handleCreate() {
    const {
      dispatch,
      generalStatus: { tableList = [], tablePagination = {} },
    } = this.props;
    if (tableList.length === 0 || (tableList.length > 0 && tableList[0]._status !== 'create')) {
      dispatch({
        type: 'generalStatus/updateState',
        payload: {
          tableList: [
            {
              genStatusId: uuid(),
              relationTable: '',
              _status: 'create',
            },
            ...tableList,
          ],
          tablePagination: addItemToPagination(tableList.length, tablePagination),
        },
      });
    }
  }

  /**
   * 编辑关联表
   */
  @Bind()
  handleEdit(record, flag) {
    const {
      dispatch,
      generalStatus: { tableList },
    } = this.props;
    const newList = tableList.map(item => {
      if (record.genStatusId === item.genStatusId) {
        return { ...item, _status: flag ? 'update' : '' };
      } else {
        return item;
      }
    });
    dispatch({
      type: 'generalStatus/updateState',
      payload: { tableList: newList },
    });
  }

  // 取消编辑关联表
  @Bind()
  handleCleanLine(record) {
    const {
      dispatch,
      generalStatus: { tableList },
    } = this.props;
    const newList = tableList.filter(item => item.genStatusId !== record.genStatusId);
    dispatch({
      type: 'generalStatus/updateState',
      payload: { tableList: newList },
    });
  }

  // 保存关联表
  @Bind()
  handleSave(record) {
    const { dispatch } = this.props;
    dispatch({
      type: 'generalStatus/saveTable',
      payload: { ...record },
    });
  }

  render() {
    const {
      visible,
      onCancel,
      generalStatus: { tableList = [], tablePagination = {} },
    } = this.props;
    const columns = [
      {
        title: (
          <Button
            style={{ backgroundColor: '#548FFC', color: '#fff' }}
            icon="plus"
            shape="circle"
            size="small"
            onClick={this.handleCreate}
          />
        ),
        align: 'center',
        width: 60,
        render: () => <Button disabled icon="minus" shape="circle" size="small" />,
      },
      {
        title: intl.get(`${modelPrompt}.relationTable`).d('关联表'),
        dataIndex: 'relationTable',
        width: 200,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`relationTable`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.relationTable`).d('关联表'),
                    }),
                  },
                ],
                initialValue: record.relationTable,
              })(<Lov code="HPFM.DATASOURCE.SERVICE" />)}
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
        render: (val, record) => (
          <span className="action-link">
            {record._status === 'update' && (
              <Fragment>
                <a onClick={() => this.handleEdit(record, false)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.handleSave(record)}>
                  {intl.get('hzero.common.button.save').d('保存')}
                </a>
              </Fragment>
            )}
            {!(record._status === 'create') && !(record._status === 'update') && (
              <a onClick={() => this.handleEdit(record, true)}>
                {intl.get('hzero.common.button.edit').d('编辑')}
              </a>
            )}
            {record._status === 'create' && (
              <Fragment>
                <a onClick={() => this.handleCleanLine(record)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.handleSave(record)}>
                  {intl.get('hzero.common.button.save').d('保存')}
                </a>
              </Fragment>
            )}
          </span>
        ),
      },
    ];
    return (
      <Modal
        destroyOnClose
        width={720}
        title={intl.get(`${modelPrompt}.title.table`).d('关联表维护')}
        visible={visible}
        onCancel={onCancel}
        onOk={onCancel}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Spin spinning={false}>
          <div style={{ width: '100%' }}>
            <EditTable
              bordered
              rowKey="genStatusId"
              columns={columns}
              dataSource={tableList}
              pagination={tablePagination}
              onChange={this.handleTableChange}
            />
          </div>
        </Spin>
      </Modal>
    );
  }
}
