import React, { Component } from 'react';
import { Button, Popconfirm, Form, Input } from 'hzero-ui';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import EditTable from 'components/EditTable';
import formatterCollections from 'utils/intl/formatterCollections';

@formatterCollections({ code: 'hwms.barcodeQuery' })
class ListTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * 页面渲染
   * @returns {*}
   */
  render() {
    const {
      loading,
      dataSource,
      pagination,
      onSearch,
      handleCreate,
      deleteData,
      handleEditLine,
      tenantId,
    } = this.props;
    const columns = [
      {
        title: (
          <Button
            style={{ backgroundColor: '#548FFC', color: '#fff' }}
            icon="plus"
            shape="circle"
            size="small"
            onClick={() => handleCreate()}
          />
        ),
        align: 'center',
        width: 60,
        render: (val, record, index) => (
          <Popconfirm
            title={intl.get(`hzero.common.message.confirm.delete`).d('是否确认删除?')}
            onConfirm={() => deleteData(record, index)}
          >
            <Button icon="minus" shape="circle" size="small" />
          </Popconfirm>
        ),
      },
      {
        title: '序号',
        dataIndex: 'sequence',
        width: 60,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`sequence`, {
                initialValue: val,
              })(
                <Input disabled />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '处置方法编码',
        dataIndex: 'dispositionFunction',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`dispositionFunctionId`, {
                initialValue: record.dispositionFunctionId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '处置方法编码',
                    }),
                  },
                ],
              })(
                <Lov
                  code="HME.DISPOSITION_FUNCTION"
                  queryParams={{ tenantId }}
                  textValue={record.dispositionFunction}
                  onChange={(value, item) => {
                    record.$form.setFieldsValue({
                      description: item.description,
                      functionType: item.functionTypeDescription,
                      functionTypeDescription: item.functionTypeDescription,
                      siteCode: item.siteCode,
                      siteId: item.siteId,
                      routerId: item.routerId,
                      routerName: item.routerName,
                      routerDescription: item.routerDescription,
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
        title: '处置方法描述',
        dataIndex: 'description',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`description`, {
              })(
                <Input disabled />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '方法类型',
        dataIndex: 'functionType',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <span>
              <Form.Item>
                {record.$form.getFieldDecorator(`functionType`, {
                  initialValue: record.functionType,
                })(
                  <Input disabled />
                )}
              </Form.Item>
              <Form.Item style={{ display: 'none' }}>
                {record.$form.getFieldDecorator(`functionTypeDescription`, {
                  initialValue: record.functionTypeDescription,
                })(
                  <Input disabled />
                )}
              </Form.Item>
            </span>
          ) : (
              val
            ),
      },
      {
        title: '站点',
        dataIndex: 'siteCode',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <span>
              <Form.Item>
                {record.$form.getFieldDecorator(`siteCode`, {
                  initialValue: record.siteCode,
                })(
                  <Input disabled />
                )}
              </Form.Item>
              <Form.Item style={{ display: 'none' }}>
                {record.$form.getFieldDecorator(`siteId`, {
                  initialValue: record.siteId,
                })(
                  <Input disabled />
                )}
              </Form.Item>
            </span>
          ) : (
              val
            ),
      },
      {
        title: '工艺路线编码',
        dataIndex: 'routerName',
        width: 110,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <span>
              <Form.Item>
                {record.$form.getFieldDecorator(`routerName`, {
                  initialValue: record.routerName,
                })(
                  <Input disabled />
                )}
              </Form.Item>
              <Form.Item style={{ display: 'none' }}>
                {record.$form.getFieldDecorator(`routerId`, {
                  initialValue: record.routerId,
                })(
                  <Input disabled />
                )}
              </Form.Item>
            </span>
          ) : (
              val
            ),
      },
      {
        title: '工艺路线描述',
        dataIndex: 'routerDescription',
        width: 110,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`routerDescription`, {
                initialValue: record.routerDescription,
              })(
                <Input disabled />
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
            <a onClick={() => handleEditLine(record, true)}>编辑</a>
              ),
      },
    ];
    return (
      <EditTable
        bordered
        rowKey="manageTagId"
        columns={columns}
        loading={loading}
        dataSource={dataSource}
        pagination={pagination}
        onChange={page => onSearch(page)}
      />
    );
  }
}
export default ListTable;
