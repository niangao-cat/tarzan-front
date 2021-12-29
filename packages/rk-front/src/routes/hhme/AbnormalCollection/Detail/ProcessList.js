import React, { Component, Fragment } from 'react';
import { Form, Button, Popconfirm, Input, Checkbox } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import { tableScrollWidth } from 'utils/utils';
import intl from 'utils/intl';
import EditTable from 'components/EditTable';
import Lov from 'components/Lov';
import { enableRender } from '../../../../utils/renderer';

const commonModelPrompt = 'tarzan.hmes.purchaseOrder';

export default class ProcessList extends Component {
  @Bind()
  handleCreate() {
    const { onCreate } = this.props;
    if (onCreate) {
      onCreate('processList', 'processPagination', 'headId');
    }
  }

  /**
   * 清除当前行
   *
   * @param {string} dataSourceName 数据源名称
   * @param {string} idName 主键id名称
   * @param {object} record 当前对象
   * @memberof FloorInfo
   */
  @Bind()
  handleCleanLine(record) {
    const { onCleanLine, onDelete } = this.props;
    if (record._status === 'create') {
      if (onCleanLine) {
        onCleanLine('processList', 'processPagination', 'headId', record);
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
      onEditLine('processList', 'headId', record, flag);
    }
  }

  render() {
    const {
      isEdit,
      loading,
      dataSource,
      tenantId,
      // onSearch,
    } = this.props;
    const columns = [
      {
        title: (
          <Button
            style={{ backgroundColor: '#548FFC', color: '#fff' }}
            icon="plus"
            shape="circle"
            size="small"
            disabled={!isEdit}
            onClick={() => this.handleCreate()}
          />
        ),
        align: 'center',
        width: 60,
        render: (val, record) =>
          !isEdit ? (
            <Button icon="minus" shape="circle" size="small" disabled />
          ) : (
            <Popconfirm
              title={intl.get(`hzero.common.message.confirm.delete`).d('是否确认删除?')}
              onConfirm={() => this.handleCleanLine(record)}
            >
              <Button icon="minus" shape="circle" size="small" />
            </Popconfirm>
          ),
      },
      {
        title: intl.get(`${commonModelPrompt}.serialNumber`).d('序号'),
        width: 120,
        dataIndex: 'serialNumber',
        render: (text, record, index) => {
          return index + 1;
        },
      },
      {
        title: intl.get(`${commonModelPrompt}.workcellCode`).d('工序编码'),
        width: 120,
        dataIndex: 'workcellId',
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Fragment>
              <Form.Item>
                {record.$form.getFieldDecorator('workcellId', {
                  initialValue: value,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${commonModelPrompt}.workcellCode`).d('工序编码'),
                      }),
                    },
                  ],
                })(
                  <Lov
                    code="HME.WORK_PROCESS"
                    queryParams={{ tenantId }}
                    textValue={record.workcellCode}
                    onChange={(val, dataList) => {
                      record.$form.setFieldsValue({
                        workcellCode: dataList.workcellCode,
                        workcellName: dataList.workcellName,
                      });
                    }}
                  />
                )}
              </Form.Item>
              <Form.Item style={{ display: 'none' }}>
                {record.$form.getFieldDecorator('workcellCode', {
                  initialValue: record.workcellCode,
                })(<span />)}
              </Form.Item>
            </Fragment>
          ) : (
            record.workcellCode
          ),
      },
      {
        title: intl.get(`${commonModelPrompt}.workcellName`).d('工序描述'),
        width: 120,
        dataIndex: 'workcellName',
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('workcellName', {
                initialValue: value,
              })(<Input disabled />)}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${commonModelPrompt}.enableFlag`).d('启用状态'),
        width: 120,
        dataIndex: 'enableFlag',
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('enableFlag', {
                initialValue: value !== 'N',
              })(<Checkbox />)}
            </Form.Item>
          ) : (
            enableRender(value)
          ),
      },
      {
        title: intl.get(`${commonModelPrompt}.createdUserName`).d('创建人'),
        width: 120,
        dataIndex: 'createdUserName',
      },
      {
        title: intl.get(`${commonModelPrompt}.creationDate`).d('创建时间'),
        width: 160,
        dataIndex: 'creationDate',
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdatedUserName`).d('修改人'),
        width: 160,
        dataIndex: 'lastUpdatedUserName',
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdateDate`).d('修改时间'),
        dataIndex: 'lastUpdateDate',
        width: 160,
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
        pagination={false}
        scroll={{ x: tableScrollWidth(columns), y: 180 }}
        loading={loading}
        rowKey="headId"
      />
    );
  }
}
