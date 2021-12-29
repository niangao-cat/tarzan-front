/*
 * @Description: 扩展属性
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-11 09:45:07
 * @LastEditTime: 2020-10-07 15:52:17
 */

import React, { Component } from 'react';
import { Form, Input, Button, InputNumber, Popconfirm, Select } from 'hzero-ui';
import { connect } from 'dva';
import intl from 'utils/intl';
import EditTable from 'components/EditTable';
import Lov from 'components/Lov';
import { tableScrollWidth } from 'utils/utils';


@connect(({ containerType }) => ({ containerType }))
@Form.create()
export default class extendedAttributes extends Component {

  state = {
    cosTypeName: '',
  };

  changeCosType = (value) => {
    this.setState({ cosTypeName: value });
  }

  render() {
    const {
      dataSource,
      pagination,
      canEdit,
      handleCreate,
      tenantId,
      cosTagType,
      handleEditLine,
      deleteData,
      onSearch,
      loadingRules,
      containerTypeId,
    } = this.props;
    const { cosTypeName } = this.state;
    const columns = [
      {
        title: (
          <Button
            style={{ backgroundColor: '#548FFC', color: '#fff' }}
            icon="plus"
            shape="circle"
            size="small"
            disabled={containerTypeId==='create'}
            onClick={() => handleCreate()}
          />
        ),
        align: 'center',
        width: 60,
        render: (val, record, index) =>
          !canEdit ? (
            <Button icon="minus" shape="circle" size="small" />
          ) : (
            <Popconfirm
              title={intl.get(`hzero.common.message.confirm.delete`).d('是否确认删除?')}
              onConfirm={() => deleteData(record, index)}
            >
              <Button icon="minus" shape="circle" size="small" />
            </Popconfirm>
            ),
      },
      {
        title: '容器类型',
        dataIndex: 'containerTypeName',
        width: 120,
        align: 'center',
      },
      {
        title: '行数',
        dataIndex: 'lineNum',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`lineNum`, {
                initialValue: record.lineNum,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '行数',
                    }),
                  },
                ],
              })(
                <InputNumber
                  formatter={value => `${value}`}
                  parser={value => value.replace(/\D|^-/g, '')}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '列数',
        dataIndex: 'columnNum',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`columnNum`, {
                initialValue: record.columnNum,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '列数',
                    }),
                  },
                ],
              })(
                <InputNumber
                  formatter={value => `${value}`}
                  parser={value => value.replace(/\D|^-/g, '')}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '工艺编码',
        dataIndex: 'operationName',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`operationId`, {
                initialValue: record.operationId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '工艺编码不能为空',
                    }),
                  },
                ],
              })(
                <Lov
                  allowClear
                  code="MT.OPERATION"
                  queryParams={{
                    tenantId,
                  }}
                  onChange={(value, item) => {
                    record.$form.setFieldsValue({
                      operationDesc: item.description,
                    });
                  }}
                  textValue={record.operationName}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '工艺描述',
        dataIndex: 'operationDesc',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`operationDesc`, {
                initialValue: record.operationDesc,
              })(
                <Input disabled />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: 'COS类型',
        dataIndex: 'cosType',
        width: 110,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`cosType`, {
                initialValue: record.cosType,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: 'COS类型',
                    }),
                  },
                ],
              })(
                <Select style={{ width: '100%' }} onChange={value => this.changeCosType(value)}>
                  {cosTagType.map(item => (
                    <Select.Option key={item.value} value={item.value}>{item.value}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: 'COS描述',
        dataIndex: 'cosTypeName',
        width: 110,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`cosTypeName`, {
                initialValue: cosTypeName || record.cosTypeName,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: 'COS类型',
                    }),
                  },
                ],
              })(
                <Select style={{ width: '100%' }} disabled>
                  {cosTagType.map(item => (
                    <Select.Option key={item.value} value={item.value}>{item.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '单元格芯片数',
        dataIndex: 'capacity',
        width: 110,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`capacity`, {
                initialValue: record.capacity,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '芯片数',
                    }),
                  },
                ],
              })(
                <InputNumber
                  formatter={value => `${value}`}
                  parser={value => value.replace(/\D|^-/g, '')}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '装载规则',
        dataIndex: 'rulesName',
        width: 110,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`attribute1`, {
                initialValue: record.attribute1,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '装载规则',
                    }),
                  },
                ],
              })(
                <Select style={{ width: '100%' }}>
                  {loadingRules.map(item => (
                    <Select.Option key={item.value} value={item.value}>{item.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 120,
        align: 'center',
        render: (val, record, index) =>
          record._status === 'create' ? (
            <span>
              <a onClick={() => deleteData(record, index)}>清除</a>&nbsp;&nbsp;
            </span>
          ) : record._status === 'update' ? (
            <span>
              <a onClick={() => handleEditLine(record, false)}>取消</a>&nbsp;&nbsp;
            </span>
          ) : (
            <a disabled={!canEdit} onClick={() => handleEditLine(record, true)}>编辑</a>
              ),
      },
    ];
    return (
      <EditTable
        bordered
        rowKey="containerTypeId"
        columns={columns}
        scroll={{ x: tableScrollWidth(columns) }}
        dataSource={dataSource}
        pagination={pagination}
        onChange={page => onSearch(page)}
      />
    );
  }
}
