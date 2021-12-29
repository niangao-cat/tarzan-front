import React from 'react';
import { Form, Button, Popconfirm, Checkbox, Input } from 'hzero-ui';
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
      onCreate('equipmentList', 'equipmentPagination', 'opEqRelId');
    }
  }

  @Bind()
  handleCleanLine(record) {
    const { onCleanLine, onDelete } = this.props;
    if (record._status === 'create') {
      if (onCleanLine) {
        onCleanLine('equipmentList', 'equipmentPagination', 'opEqRelId', record);
      }
    } else if (onDelete) {
      onDelete(record, 'equipmentList', 'deleteLineList');
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
      onEditLine('equipmentList', 'opEqRelId', record, flag);
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
            disabled={!isEdit||operationId==='create'}
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
        title: intl.get(`${commonModelPrompt}.exceptionLevel`).d('顺序'),
        width: 100,
        dataIndex: 'exceptionLevel',
        render: (text, record, index) => {
          const { pageSize, current } = pagination;
          return pageSize * (current - 1) + index + 1;
        },
      },
      {
        title: intl.get(`${commonModelPrompt}.equipmentCategory`).d('设备类编码'),
        width: 100,
        dataIndex: 'equipmentCategory',
        render: (value, record) =>
          ['create', 'update'].includes(record._status) && isEdit ? (
            <Form.Item>
              {record.$form.getFieldDecorator('equipmentCategory', {
                initialValue: record.equipmentCategory,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonModelPrompt}.equipmentCategory`).d('设备类编码'),
                    }),
                  },
                ],
              })(
                <Lov
                  code="HME.EQUIPMENT_CATEGORY"
                  queryParams={{ tenantId }}
                  lovOptions={{ valueField: 'equipmentCategory', displayField: 'equipmentCategory' }}
                  textValue={value}
                  onChange={(val, data) => {
                    record.$form.setFieldsValue({
                      equipmentCategoryDesc: data.equipmentCategoryDesc,
                    });
                  }}
                />
              )}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${commonModelPrompt}.equipmentCategoryDesc`).d('设备描述'),
        width: 100,
        dataIndex: 'equipmentCategoryDesc',
        render: (value, record) =>
          ['create', 'update'].includes(record._status) && isEdit ? (
            <Form.Item>
              {record.$form.getFieldDecorator('equipmentCategoryDesc', {
                initialValue: value,
              })(<Input disabled />)}
            </Form.Item>
          ) : (
            record.equipmentCategoryDesc
          ),
      },
      {
        title: intl.get(`${commonModelPrompt}.enableFlag`).d('有效性'),
        width: 100,
        dataIndex: 'enableFlag',
        render: (value, record) =>
          ['create', 'update'].includes(record._status) && isEdit ? (
            <Form.Item>
              {record.$form.getFieldDecorator('enableFlag', {
                initialValue: value !== 'N',
              })(
                <Checkbox />
              )}
            </Form.Item>
          ) : (
            <Checkbox checked={value === 'Y'} />
          ),
      },
      {
        title: intl.get(`${commonModelPrompt}.attribute1`).d('是否强校验'),
        width: 100,
        dataIndex: 'attribute1',
        render: (value, record) =>
          ['create', 'update'].includes(record._status) && isEdit ? (
            <Form.Item>
              {record.$form.getFieldDecorator('attribute1', {
                initialValue: value !== 'N',
              })(
                <Checkbox />
              )}
            </Form.Item>
          ) : (
            <Checkbox checked={value === 'Y'} />
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
        rowKey="opEqRelId"
        bodyStyle={{ fontSize: '10px', lineHeight: '30px' }}
      />
    );
  }
}
