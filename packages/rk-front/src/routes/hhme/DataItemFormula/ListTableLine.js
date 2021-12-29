/*
 * @Description: 行数据
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-09-21 09:40:49
 * @LastEditTime: 2020-09-25 14:40:50
 */

import React, { Component } from 'react';
import { Button, Popconfirm, Form, Input } from 'hzero-ui';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import EditTable from 'components/EditTable';
import { connect } from 'dva';
import formatterCollections from 'utils/intl/formatterCollections';

@connect(({ equipmentInspectionMaintenance }) => ({
  equipmentInspectionMaintenance,
}))
@formatterCollections({ code: 'hwms.barcodeQuery' })
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
      tenantId,
      loading,
      dataSource,
      onSearch,
      pagination,
      canEdit,
      handleCreate,
      deleteData,
      handleEditLine,
      lineEditor,
      deleteLineDataLoading,
      selectedHeadKeys,
    } = this.props;
    const columns = [
      {
        title: (
          <Button
            style={{ backgroundColor: '#548FFC', color: '#fff' }}
            icon="plus"
            shape="circle"
            size="small"
            disabled={selectedHeadKeys.length === 0}
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
              <Button loading={deleteLineDataLoading} icon="minus" shape="circle" size="small" />
            </Popconfirm>
            ),
      },
      {
        title: '参数代码',
        dataIndex: 'parameterCode',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`parameterCode`, {
                initialValue: record.parameterCode,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '数据类型',
                    }),
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
        title: '数据项',
        dataIndex: 'tagCode',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <span>
              <Form.Item>
                {record.$form.getFieldDecorator(`tagId`, {
                  initialValue: record.tagId,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: '数据项',
                      }),
                    },
                  ],
                })(
                  <Lov
                    code="MT.TAG_LINE"
                    queryParams={{ tenantId }}
                    textValue={record.tagCode}
                    disabled={lineEditor}
                    onChange={(value, vals) => {
                      record.$form.setFieldsValue({
                        tagDesc: vals.tagDescription,
                      });
                    }}
                  />
                )}
              </Form.Item>
            </span>
          ) : (
              val
            ),
      },
      {
        title: '数据项描述',
        dataIndex: 'tagDescription',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`tagDesc`, {
                initialValue: record.tagDescription,
              })(
                <Input disabled />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '数据组编码',
        dataIndex: 'tagGroupCode',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <span>
              <Form.Item>
                {record.$form.getFieldDecorator(`tagGroupId`, {
                  initialValue: record.tagGroupId,
                })(
                  <Lov
                    code="HME.TAG_GROUP"
                    queryParams={{
                      tenantId,
                    }}
                    allowClear
                    textValue={record.tagGroupCode}
                    onChange={(value, vals) => {
                      record.$form.setFieldsValue({
                        tagGroupDesc: vals.tagGroupDescription,
                      });
                    }}
                  />
                )}
              </Form.Item>
            </span>
          ) : (
              val
            ),
      },
      {
        title: '数据组描述',
        dataIndex: 'tagGroupDescription',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`tagGroupDesc`, {
                initialValue: record.tagGroupDescription,
              })(
                <Input disabled />
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
            <span>
              <Form.Item>
                {record.$form.getFieldDecorator(`operationId`, {
                  initialValue: record.operationId,
                })(
                  <Lov
                    code="MT.OPERATION"
                    queryParams={{ tenantId }}
                    textValue={record.operationName}
                    onChange={(value, item) => {
                      record.$form.setFieldsValue({
                        operationDesc: item.description,
                      });
                    }}
                  />
                )}
              </Form.Item>
            </span>
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
        rowKey="tagFormulaLineId"
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
