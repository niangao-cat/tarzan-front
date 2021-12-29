import React from 'react';
import { Form, Button, Popconfirm, Input } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import { tableScrollWidth } from 'utils/utils';
import intl from 'utils/intl';
import EditTable from 'components/EditTable';
import Lov from 'components/Lov';

const commonModelPrompt = 'tarzan.hmes.purchaseOrder';

export default class AbnormalResponse extends React.Component {
  @Bind()
  handleCreate() {
    const { onCreate } = this.props;
    if (onCreate) {
      onCreate();
    }
  }

  @Bind()
  handleCleanLine(record) {
    const { onCleanLine, onDelete } = this.props;
    if (record._status === 'create') {
      if (onCleanLine) {
        onCleanLine('dataItemList', 'dataItemPagination', 'opTagRelId', record);
      }
    } else if (onDelete) {
      onDelete(record);
    }
  }

  /**
   * 编辑当前行
   *
   * @param {string} dataSourceName 数据源名称
   * @param {string} idName 主键id名称
   * @param {object} record 当前行数据
   * @param {boolean} flag 编辑当前行 / 取消编辑
   * @memberof FloorInfo
   */
  @Bind()
  handleEditLine(record, flag) {
    const { onEditLine } = this.props;
    if (onEditLine) {
      onEditLine('dataItemList', 'opTagRelId', record, flag);
    }
  }

  render() {
    const { loading, dataSource, onSearch, isEdit, operationId, tenantId, pagination } = this.props;
    const columns = [
      {
        title: (
          <Button
            style={{ backgroundColor: '#548FFC', color: '#fff' }}
            icon="plus"
            shape="circle"
            size="small"
            disabled={!isEdit}
            onClick={this.handleCreate}
          />
        ),
        align: 'center',
        width: 60,
        render: (val, record) =>
          isEdit ? (
            <Popconfirm
              title={intl.get(`hzero.common.message.confirm.delete`).d('是否确认删除?')}
              onConfirm={() => this.handleCleanLine(record)}
            >
              <Button icon="minus" shape="circle" size="small" />
            </Popconfirm>
          ) : (
            <Button icon="minus" shape="circle" size="small" disabled />
            ),
      },
      {
        title: '数据项',
        dataIndex: 'tagCode',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`tagId`, {
                initialValue: record.tagId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonModelPrompt}.tagCode`).d('数据项'),
                    }),
                  },
                ],
              })(
                <Lov
                  code="MT.TAG"
                  textValue={record.tagCode}
                  queryParams={{ tenantId }}
                  onChange={(_val, data) => {
                    record.$form.setFieldsValue({
                      tagName: data.tagDescription,
                    });
                  }}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '数据项描述',
        dataIndex: 'tagName',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`tagName`, {
                initialValue: record.tagName,
              })(
                <Input disabled />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
    ];

    if (isEdit) {
      const newColumn = {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: '',
        width: 60,
        render: (value, record) =>
          record._status === 'create' ? (
            <a onClick={() => this.handleCleanLine(record)}>
              {intl.get('hzero.common.button.clean').d('清除')}
            </a>
          ) : record._status === 'update' ? (
            <a onClick={() => this.handleEditLine(record, false)}>
              {intl.get('hzero.common.button.cancel').d('取消')}
            </a>
          ) : (
            <a onClick={() => this.handleEditLine(record, true)}>
              {intl.get('hzero.common.button.edit').d('编辑')}
            </a>
              ),
      };
      columns.push(newColumn);
    }

    return (
      <EditTable
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns, 50), y: 180 }}
        onChange={page => onSearch(operationId, page)}
        loading={loading}
        rowKey="opTagRelId"
        bodyStyle={{ fontSize: '10px', lineHeight: '30px' }}
      />
    );
  }
}
