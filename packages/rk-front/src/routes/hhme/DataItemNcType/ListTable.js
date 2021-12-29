/*
 * @Description: 行数据
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-09-21 09:40:49
 * @LastEditTime: 2020-09-25 15:48:43
 */

import React, { Component } from 'react';
import { Button, Popconfirm, Form, Input, Select } from 'hzero-ui';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import EditTable from 'components/EditTable';
import { connect } from 'dva';
import { tableScrollWidth } from 'utils/utils';
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
      handleCreate,
      deleteData,
      handleEditLine,
      deleteDataLoading,
      valueType,
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
            <Button loading={deleteDataLoading} icon="minus" shape="circle" size="small" />
          </Popconfirm>
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
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: '项目',
                      }),
                    },
                  ],
                })(
                  <Lov
                    code="HME.TAG_GROUP"
                    queryParams={{
                      tenantId,
                    }}
                    textValue={record.tagGroupCode}
                    allowClear
                    onChange={(value, item) => {
                      record.$form.setFieldsValue({
                        tagGroupDesc: item.tagGroupDesc,
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
        dataIndex: 'tagGroupDesc',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`tagGroupDesc`, {
                initialValue: record.tagGroupDesc,
              })(
                <Input disabled />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      // {
      //   title: '工艺编码',
      //   dataIndex: 'operationId',
      //   width: 120,
      //   align: 'center',
      //   render: (val, record) =>
      //     ['update', 'create'].includes(record._status) ? (
      //       <span>
      //         <Form.Item>
      //           {record.$form.getFieldDecorator(`operationId`, {
      //             initialValue: record.operationId,
      //             rules: [
      //               {
      //                 required: true,
      //                 message: intl.get('hzero.common.validation.notNull', {
      //                   name: '项目',
      //                 }),
      //               },
      //             ],
      //           })(
      //             <Lov
      //               code="MT.OPERATION"
      //               textValue={record.operationCode}
      //               queryParams={{ tenantId }}
      //               onChange={(value, item) => {
      //                 record.$form.setFieldsValue({
      //                   operationDesc: item.description,
      //                 });
      //               }}
      //             />
      //           )}
      //         </Form.Item>
      //       </span>
      //     ) : (
      //         val
      //       ),
      // },
      // {
      //   title: '工艺描述',
      //   dataIndex: 'operationDesc',
      //   width: 120,
      //   align: 'center',
      //   render: (val, record) =>
      //     ['update', 'create'].includes(record._status) ? (
      //       <Form.Item>
      //         {record.$form.getFieldDecorator(`operationDesc`, {
      //           initialValue: record.operationDesc,
      //         })(
      //           <Input disabled />
      //         )}
      //       </Form.Item>
      //     ) : (
      //         val
      //       ),
      // },
      {
        title: '数据项编码',
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
                        name: '数据项编码',
                      }),
                    },
                  ],
                })(
                  <Lov
                    code="MT.TAG"
                    textValue={record.tagCode}
                    queryParams={{ tenantId }}
                    onChange={(value, item) => {
                      record.$form.setFieldsValue({
                        tagDesc: item.tagDescription,
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
        dataIndex: 'tagDesc',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`tagDesc`, {
                initialValue: record.tagDesc,
              })(
                <Input disabled />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '数据类型',
        dataIndex: 'tagTypeMeaning',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <span>
              <Form.Item>
                {record.$form.getFieldDecorator(`tagType`, {
                  initialValue: record.tagType,
                })(
                  <Select allowClear style={{ width: '100%' }}>
                    {valueType.map(ele => (
                      <Select.Option value={ele.value} key={ele.value}>
                        {ele.meaning}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </span>
          ) : (
              val
            ),
      },
      {
        title: '最小值',
        dataIndex: 'minValue',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`minValue`, {
                initialValue: record.minValue,
                rules: [
                  {
                    validator: (rule, value, callback) => {
                      if (record.$form.getFieldValue('maxValue') < value) {
                        callback(
                          '最小值应小于最大值'
                        );
                      } else {
                        callback();
                      }
                    },
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
        title: '最大值',
        dataIndex: 'maxValue',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`maxValue`, {
                initialValue: record.maxValue,
                rules: [
                  {
                    validator: (rule, value, callback) => {
                      if (record.$form.getFieldValue('minValue') > value) {
                        callback(
                          '最大值应大于最小值'
                        );
                      } else {
                        callback();
                      }
                    },
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
        title: '判定优先级',
        dataIndex: 'priority',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`priority`, {
                initialValue: record.priority,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '判定优先级',
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
        title: '不良代码组',
        dataIndex: 'ncCodeGroupCode',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`ncCodeGroupId`, {
                initialValue: record.ncCodeGroupId,
              })(
                <Lov
                  code="MT.NC_GROUP"
                  queryParams={{ tenantId }}
                  textValue={record.ncCodeGroupCode}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '不良代码',
        dataIndex: 'ncCode',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`ncCodeId`, {
                initialValue: record.ncCodeId,
              })(
                <Lov
                  code="MT.NC_CODE"
                  queryParams={{ tenantId }}
                  textValue={record.ncCode}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '不良处置方式',
        dataIndex: 'ncDealWay',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`ncDealWay`, {
                initialValue: record.ncDealWay,
              })(
                <Input />
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
            <a onClick={() => handleEditLine(record, true)}>编辑</a>
              ),
      },
    ];
    return (
      <EditTable
        bordered
        rowKey="tagNcId"
        columns={columns}
        loading={loading}
        dataSource={dataSource}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns) }}
        onChange={page => onSearch(page)}
      />
    );
  }
}
export default ListTable;
