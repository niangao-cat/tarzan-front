import React from 'react';
import { Form, Button, Popconfirm, Checkbox, InputNumber } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import { tableScrollWidth } from 'utils/utils';
import intl from 'utils/intl';
import EditTable from 'components/EditTable';
import Lov from 'components/Lov';

const commonModelPrompt = 'tarzan.hmes.purchaseOrder';

export default class LineList extends React.Component {
  @Bind()
  handleCreate() {
    const { onCreate } = this.props;
    if (onCreate) {
      onCreate('lineList', 'linePagination', 'exceptionGroupRouterId');
    }
  }

  @Bind()
  handleCleanLine(record) {
    const { onCleanLine, onDeleteLine } = this.props;
    if (record._status === 'create') {
      if (onCleanLine) {
        onCleanLine('lineList', 'linePagination', 'exceptionGroupRouterId', record);
      }
    } else if (onDeleteLine) {
      onDeleteLine(record, 'lineList', 'deleteLineList');
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
      onEditLine('lineList', 'exceptionGroupRouterId', record, flag);
    }
  }

  render() {
    const { loading, dataSource, pagination, onSearch, isEdit, tenantId } = this.props;
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
        title: intl.get(`${commonModelPrompt}.exceptionLevel`).d('异常等级'),
        width: 100,
        dataIndex: 'exceptionLevel',
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('exceptionLevel', {
                initialValue: value,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonModelPrompt}.exceptionLevel`).d('异常等级'),
                    }),
                  },
                ],
              })(<InputNumber style={{ width: '100%' }} min={1} precision={0} />)}
            </Form.Item>
          ) : (
            record.exceptionLevel
          ),
      },
      {
        title: intl.get(`${commonModelPrompt}.respondPositionName`).d('反馈岗位'),
        width: 100,
        dataIndex: 'respondPositionName',
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('respondPositionId', {
                initialValue: record.respondPositionId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonModelPrompt}.respondPositionName`).d('反馈岗位'),
                    }),
                  },
                ],
              })(<Lov code="HPFM.HR_POSITION" queryParams={{ tenantId }} textValue={value} />)}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${commonModelPrompt}.upgradeTime`).d('升级时长/min'),
        width: 100,
        dataIndex: 'upgradeTime',
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('upgradeTime', {
                initialValue: value,
                rules: [
                  {
                    required: !record.$form.getFieldValue('isTop'),
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonModelPrompt}.upgradeTime`).d('升级时长/min'),
                    }),
                  },
                ],
              })(
                <InputNumber
                  min={1}
                  precision={0}
                  disabled={record.$form.getFieldValue('isTop')}
                  onChange={e => {
                    if (e) {
                      record.$form.setFieldsValue({
                        isTop: false,
                      });
                    }
                  }}
                />
              )}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${commonModelPrompt}.isTop`).d('是否最高级异常'),
        width: 100,
        dataIndex: 'isTop',
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('isTop', {
                initialValue: value !== 'N',
              })(
                <Checkbox
                  onChange={e => {
                    if (e.target.checked) {
                      record.$form.setFieldsValue({ upgradeTime: undefined });
                    }
                  }}
                />
              )}
            </Form.Item>
          ) : (
            <Checkbox checked={value === 'Y'} />
          ),
      },
      {
        title: intl.get(`${commonModelPrompt}.createdUserName`).d('创建人'),
        width: 80,
        dataIndex: 'createdUserName',
      },
      {
        title: intl.get(`${commonModelPrompt}.creationDate`).d('创建时间'),
        width: 120,
        dataIndex: 'creationDate',
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdatedUserName`).d('修改人'),
        width: 80,
        dataIndex: 'lastUpdatedUserName',
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdateDate`).d('修改时间'),
        dataIndex: 'lastUpdateDate',
        width: 120,
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
        scroll={{ x: tableScrollWidth(columns), y: 180 }}
        onChange={page => onSearch(page)}
        loading={loading}
        rowKey="exceptionGroupRouterId"
        bodyStyle={{ fontSize: '10px', lineHeight: '30px' }}
      />
    );
  }
}
