import React, { Component } from 'react';
import { Form, Switch, Select, Input, Badge } from 'hzero-ui';
import intl from 'utils/intl';
import EditTable from 'components/EditTable';

@Form.create({ fieldNameProp: null })
class ListTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  limit = value => {
    return value.replace(/^(0+)|[^\d]+/g, '');
  };

  /**
   * 页面渲染
   * @returns {*}
   */
  render() {
    const {
      qualificationList,
      fetchLoading,
      pagination,
      onSearch,
      handleEditLine,
      handleCleanLine,
      qualityType = [],
    } = this.props;
    const columns = [
      {
        title: '资质类型',
        dataIndex: 'qualityTypeMeaning',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`qualityType`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '资质类型',
                    }),
                  },
                ],
                initialValue: record.qualityType,
              })(
                <Select allowClear style={{ width: '100%' }}>
                  {qualityType.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '资质编码',
        dataIndex: 'qualityCode',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`qualityCode`, {
                initialValue: record.qualityCode,
                rules: [
                  {
                    required: true,
                    message: '资质编码不能为空',
                  },
                ],
              })(
                <Input />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '资质名称',
        dataIndex: 'qualityName',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`qualityName`, {
                initialValue: record.qualityName,
                rules: [
                  {
                    required: true,
                    message: '资质名称不能为空',
                  },
                ],
              })(
                <Input />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '启用状态',
        dataIndex: 'enableFlagMeaning',
        width: 90,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`enableFlag`, {
                initialValue: record.enableFlag === 'Y',
                rules: [
                  {
                    required: true,
                    message: '是否有效',
                  },
                ],
              })(
                <Switch
                  checkedChildren="启用"
                  unCheckedChildren="禁用"
                />
              )}
            </Form.Item>
          ) : (
            <Badge
              status={record.enableFlag === 'Y' ? 'success' : 'error'}
              text={
                  record.enableFlag === 'Y'
                    ? '启用'
                    : '禁用'
                }
            />
            ),
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`remark`, {
                initialValue: record.remark,
              })(
                <Input />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '创建人',
        dataIndex: 'createUserName',
        width: 90,
        align: 'center',
      },
      {
        title: '创建时间',
        dataIndex: 'creationDate',
        width: 100,
        align: 'center',
      },
      {
        title: '修改人',
        dataIndex: 'updateUserName',
        width: 90,
        align: 'center',
      },
      {
        title: '修改时间',
        dataIndex: 'lastUpdateDate',
        width: 100,
        align: 'center',
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 110,
        align: 'center',
        render: (val, record) =>
          record._status === 'create' ? (
            <span>
              <a onClick={() => handleCleanLine(record)}>清除</a>&nbsp;&nbsp;
            </span>
          ) : record._status === 'update' ? (
            <span>
              <a onClick={() => handleEditLine(record, false)}>取消</a>&nbsp;&nbsp;
            </span>
          ) : (
            <a onClick={() => handleEditLine(record, true)}>编辑</a>
              ),
      },
    ];
    return (
      <EditTable
        bordered
        rowKey="qualityId"
        columns={columns}
        loading={fetchLoading}
        dataSource={qualificationList}
        pagination={pagination}
        onChange={page => onSearch(page)}
      />
    );
  }
}
export default ListTable;
