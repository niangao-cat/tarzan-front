import React, { Component } from 'react';
import { Form, Input } from 'hzero-ui';
import intl from 'utils/intl';
import EditTable from 'components/EditTable';

class ListTable extends Component {
  render() {
    const {
      loading,
      dataSource,
      pagination,
      onCancelLine,
      onEditLine,
      onDeleteLine,
      selectedRowKeys,
      onSelectRow,
      onSearch,
    } = this.props;
    const prefix = 'hwms.inspectionMaintain.model.inspectionMaintain';
    const columns = [
      {
        title: intl.get(`${prefix}.inspectionItem`).d('检查项目'),
        dataIndex: 'inspectionItem',
        width: 200,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('inspectionItem', {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${prefix}.inspectionItem`).d('检查项目'),
                    }),
                  },
                ],
              })(<Input trim />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${prefix}.inspectionStandard`).d('检查标准'),
        dataIndex: 'inspectionStandard',
        width: 200,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('inspectionStandard', {
                initialValue: value,
              })(<Input trim />)}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${prefix}.inspectionMethod`).d('检查方法'),
        dataIndex: 'inspectionMethod',
        width: 200,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('inspectionMethod', {
                initialValue: value,
              })(<Input trim />)}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        width: 150,
        align: 'center',
        render: (val, record) =>
          record._status === 'create' ? (
            <a onClick={() => onCancelLine(record)}>
              {intl.get('hzero.common.button.clean').d('清除')}
            </a>
          ) : record._status === 'update' ? (
            <span className="action-link">
              <a onClick={() => onEditLine(record, false)}>
                {intl.get('hzero.common.button.cancel').d('取消')}
              </a>
              <a onClick={() => onDeleteLine(record)}>
                {intl.get(`hzero.common.button.delete`).d('删除')}
              </a>
            </span>
          ) : (
            <span className="action-link">
              <a onClick={() => onEditLine(record, true)}>
                {intl.get('hzero.common.button.edit').d('编辑')}
              </a>
              <a onClick={() => onDeleteLine(record)}>
                {intl.get(`hzero.common.button.delete`).d('删除')}
              </a>
            </span>
          ),
      },
    ];
    return (
      <EditTable
        bordered
        rowKey="inspectionId"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectRow,
        }}
        onChange={page => onSearch(page)}
      />
    );
  }
}
export default ListTable;
