import React, { Fragment } from 'react';
import { Form, Input, Checkbox, Button, InputNumber } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';

import { tableScrollWidth } from 'utils/utils';
import intl from 'utils/intl';
import EditTable from 'components/EditTable';
import Lov from 'components/Lov';
import { enableRender } from '../../../../utils/renderer';

const commonModelPrompt = 'tarzan.hmes.purchaseOrder';

export default class HeadList extends React.Component {
  @Bind()
  handleCreate() {
    const { onCreate } = this.props;
    if (onCreate) {
      onCreate('headList', 'headPagination', 'headId');
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
    const { onCleanLine } = this.props;
    if (onCleanLine) {
      onCleanLine('headList', 'headPagination', 'headId', record);
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
      onEditLine('headList', 'headId', record, flag);
    }
  }

  @Bind()
  handleFetchOldLineList(record = {}) {
    const { onFetchOldLineList } = this.props;
    if (onFetchOldLineList) {
      onFetchOldLineList({}, record);
    }
  }

  @Bind()
  handleChangeSelectedRows(selectedRowKeys, selectedRows) {
    const { onChangeSelectedRows } = this.props;
    if (onChangeSelectedRows) {
      onChangeSelectedRows(selectedRowKeys, selectedRows);
    }
  }

  render() {
    const { isEdit, tenantId, loading, dataSource, selectedRows } = this.props;
    const rowSelection = {
      selectedRowKeys: selectedRows.map(e => e.headId),
      type: 'radio', // 单选
      columnWidth: 50,
      onChange: this.handleChangeSelectedRows,
    };
    const createList = dataSource.filter(e => e._status === 'create');
    const columns = [
      {
        title: (
          <Button
            style={{ backgroundColor: '#548FFC', color: '#fff' }}
            icon="plus"
            shape="circle"
            size="small"
            disabled={!isEdit || !isEmpty(createList)}
            onClick={() => this.handleCreate()}
          />
        ),
        align: 'center',
        width: 60,
      },
      {
        title: intl.get(`${commonModelPrompt}.serialNumber`).d('序号'),
        width: 100,
        dataIndex: 'serialNumber',
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('serialNumber', {
                initialValue: value,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonModelPrompt}.serialNumber`).d('序号'),
                    }),
                  },
                ],
              })(<InputNumber min={1} precision={0} />)}
            </Form.Item>
          ) : (
            record.serialNumber
          ),
      },
      {
        title: intl.get(`${commonModelPrompt}.exceptionCode`).d('异常项编码'),
        width: 100,
        dataIndex: 'exceptionId',
        render: (value, record) =>
          ['create', 'update'].includes(record._status) && isEdit ? (
            <Fragment>
              <Form.Item>
                {record.$form.getFieldDecorator('exceptionId', {
                  initialValue: value,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${commonModelPrompt}.exceptionCode`).d('异常项编码'),
                      }),
                    },
                  ],
                })(
                  <Lov
                    code="HME.EXCEPTION_ITEM"
                    lovOptions={{ valueField: 'exceptionId', displayField: 'exceptionCode' }}
                    queryParams={{ tenantId }}
                    textValue={record.exceptionCode}
                    onChange={(val, dataList) => {
                      record.$form.setFieldsValue({
                        exceptionCode: dataList.exceptionCode,
                        exceptionName: dataList.exceptionName,
                        exceptionTypeName: dataList.exceptionTypeName,
                        exceptionType: dataList.exceptionType,
                      });
                    }}
                    onOk={data => {
                      if (!isEmpty(data)) {
                        this.handleFetchOldLineList(data);
                      }
                    }}
                  />
                )}
              </Form.Item>
              <Form.Item style={{ display: 'none' }}>
                {record.$form.getFieldDecorator('exceptionCode', {
                  initialValue: record.exceptionCode,
                })(<span />)}
              </Form.Item>
            </Fragment>
          ) : (
            record.exceptionCode
          ),
      },
      {
        title: intl.get(`${commonModelPrompt}.exceptionName`).d('异常描述'),
        width: 100,
        dataIndex: 'exceptionName',
        render: (value, record) =>
          ['create', 'update'].includes(record._status) && isEdit ? (
            <Form.Item>
              {record.$form.getFieldDecorator('exceptionName', {
                initialValue: value,
              })(<Input disabled />)}
            </Form.Item>
          ) : (
            value
          ),
      },
      {
        title: intl.get(`${commonModelPrompt}.enableFlag`).d('启用状态'),
        width: 70,
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
        title: intl.get(`${commonModelPrompt}.exceptionType`).d('异常类型'),
        width: 100,
        dataIndex: 'exceptionType',
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Fragment>
              <Form.Item>
                {record.$form.getFieldDecorator('exceptionTypeName', {
                  initialValue: record.exceptionTypeName,
                })(<Input disabled />)}
              </Form.Item>
              <Form.Item style={{ display: 'none' }}>
                {record.$form.getFieldDecorator('exceptionType', {
                  initialValue: value,
                })(<Input disabled />)}
              </Form.Item>
            </Fragment>
          ) : (
            record.exceptionTypeName
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
        pagination={false}
        scroll={{ x: tableScrollWidth(columns), y: 180 }}
        rowSelection={rowSelection}
        loading={loading}
        rowKey="headId"
      />
    );
  }
}
