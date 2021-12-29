import React, { Component } from 'react';
import { Button, Popconfirm, Form, Input, Switch } from 'hzero-ui';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import EditTable from 'components/EditTable';

class ListTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  /**
   * 页面渲染
   * @returns {*}
   */
  render() {
    const {
      defaultSite,
      loading,
      dataSource,
      onSearch,
      pagination,
      canEdit,
      organizationId,
      handleCreate,
      deleteData,
      deleteLineDataLoading,
      editStatus,
      handleEditLine,
    } = this.props;
    const columns = [
      {
        title: (
          <Button
            style={{ backgroundColor: '#548FFC', color: '#fff' }}
            icon="plus"
            shape="circle"
            size="small"
            disabled={editStatus}
            onClick={() => handleCreate()}
          />
        ),
        align: 'center',
        fixed: 'left',
        width: 60,
        render: (val, record, index) =>
          !canEdit ? (
            <Button icon="minus" shape="circle" size="small" />
          ) : (
            <Popconfirm
              title={intl.get(`hzero.common.message.confirm.delete`).d('是否确认删除?')}
              onConfirm={() => deleteData(record, index)}
              disabled={!record._status || editStatus}
            >
              <Button disabled={editStatus} loading={deleteLineDataLoading} icon="minus" shape="circle" size="small" />
            </Popconfirm>
            ),
      },
      {
        title: '排序',
        dataIndex: 'serialNumber',
        width: 80,
        align: 'center',
        render: (value, record, index) => index + 1,
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
                      name: '工艺编码',
                    }),
                  },
                ],
              })(
                <Lov
                  code="MT.OPERATION"
                  queryParams={{ tenantId: organizationId }}
                  textValue={record.operationName}
                  onChange={(value, vals) => {
                    record.$form.setFieldsValue({
                      operationDes: vals.description,
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
        title: '工艺描述',
        dataIndex: 'operationDes',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`operationDes`, {
                initialValue: record.operationDes,
              })(
                <Input disabled />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '物料编码',
        dataIndex: 'materialCode',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`materialId`, {
                initialValue: record.materialId,
                rules: [
                  {
                    required: false,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '物料编码',
                    }),
                  },
                ],
              })(
                <Lov
                  code="MT.MATERIAL"
                  queryParams={{ tenantId: organizationId }}
                  textValue={record.materialCode}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '物料版本',
        dataIndex: 'materialVersion',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`materialVersionId`, {
                initialValue: record.materialVersionId,
              })(
                <Lov
                  code="HME.MATERIAL_VERSION"
                  disabled={!record.$form.getFieldValue('materialId')}
                  queryParams={{
                    tenantId: organizationId,
                    siteId: defaultSite.siteId,
                    materialId: record.$form.getFieldValue('materialId'),
                  }}
                  textValue={record.materialVersion}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '物料类别',
        dataIndex: 'materialCategoryCode',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`materialCategoryId`, {
                initialValue: record.materialCategoryId,
                rules: [
                  {
                    required: false,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '物料类别',
                    }),
                  },
                ],
              })(
                <Lov
                  code="WMS.ITEM_GROUP"
                  queryParams={{
                    tenantId: organizationId,
                  }}
                  textValue={record.materialCategoryCode}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '是否启用',
        dataIndex: 'enableFlag',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`enableFlag`, {
                initialValue: record.enableFlag,
              })(
                <Switch
                  checkedValue="Y"
                  unCheckedValue="N"
                  checkedChildren="启用"
                  unCheckedChildren="禁用"
                />
              )}
            </Form.Item>
          ) : (
              val === 'Y' ? '启用' : '禁用'
            ),
      },
      {
        title: '创建人',
        dataIndex: 'createdByName',
        width: 120,
        align: 'center',
      },
      {
        title: '创建时间',
        dataIndex: 'creationDate',
        width: 120,
        align: 'center',
      },
      {
        title: '最后更新人',
        dataIndex: 'lastUpdatedByName',
        width: 120,
        align: 'center',
      },
      {
        title: '更新时间',
        dataIndex: 'lastUpdateDate',
        width: 120,
        align: 'center',
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 120,
        align: 'center',
        fixed: 'right',
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
            <a disabled={editStatus} onClick={() => handleEditLine(record, true)}>编辑</a>
              ),
      },
    ];
    return (
      <EditTable
        bordered
        rowKey="operationInsId"
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
