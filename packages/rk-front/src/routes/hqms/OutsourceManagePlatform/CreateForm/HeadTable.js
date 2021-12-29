/**
 * @author:ywj
 * @email:wenjie.yang01@hand-china.com
 * @description: 外协管理平台 视图层（创建表）
 */
// 引入依赖
import React from 'react';
import EditTable from 'components/EditTable';
import { Form, Input, InputNumber, Button, Popconfirm } from 'hzero-ui';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import { getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

// 默认输出
export default class HeadListTable extends React.Component {
    // 直接渲染
    render() {
        // 护球上文参数
        const {
            dataSource,
            handleCreate,
            handleCleanLine,
            changeCreateDataByMaterial,
            changeCreateDataByLocator,
            loading,
        } = this.props;

        // 列展示

        const columns = [
            {
                title: (
                  <Button
                    style={{ backgroundColor: '#548FFC', color: '#fff' }}
                    icon="plus"
                    shape="circle"
                    size="small"
                    onClick={handleCreate}
                  />
                ),
                align: 'center',
                width: 60,
                render: (val, record, index) =>
                    (
                      <Popconfirm
                        title={intl.get(`hzero.common.message.confirm.delete`).d('是否确认删除?')}
                        onConfirm={() => handleCleanLine(index)}
                      >
                        <Button icon="minus" shape="circle" size="small" />
                      </Popconfirm>
                    ),
            },
            {
                title: intl.get(`instructionLineNum`).d('行号'),
                dataIndex: 'instructionLineNum',
            },
            {
                title: intl.get(`materialCode`).d('物料编码'),
                dataIndex: 'materialCode',
                render: (val, record, index) =>
                    ['create', 'update'].includes(record._status) ? (
                      <Form.Item>
                        {record.$form.getFieldDecorator(`materialId`, {
                                rules: [
                                    {
                                        required: true,
                                        message: intl.get('hzero.common.validation.notNull', {
                                            name: intl.get(`materialCode`).d('物料编码'),
                                        }),
                                    },
                                ],
                                initialValue: record.materialId,
                            })(
                              <Lov
                                code="QMS.MATERIAL"
                                textValue={val}
                                queryParams={{ tenantId }}
                                onChange={(value, records) => changeCreateDataByMaterial(index, records)}
                              />
                            )}
                      </Form.Item>
                    ) : (
                            val
                        ),
            },
            {
                title: intl.get(`materialName`).d('物料描述'),
                dataIndex: 'materialName',
                render: (val, record) =>
                    ['create', 'update'].includes(record._status) ? (
                      <Form.Item>
                        {record.$form.getFieldDecorator(`materialName`, {
                          initialValue: val,
                        })(<Input disabled />)}
                      </Form.Item>
                    ) : (
                            val
                        ),
            },
            {
                title: intl.get(`materialVersion`).d('物料版本'),
                dataIndex: 'materialVersion',
                render: (val, record) =>
                    ['create', 'update'].includes(record._status) ? (
                      <Form.Item>
                        {record.$form.getFieldDecorator(`materialVersion`, {
                                initialValue: val,
                            })(
                              <Input />
                            )}
                      </Form.Item>
                    ) : (
                            record.materialVersion
                        ),
            },
            {
                title: intl.get(`createdBy`).d('制单数量'),
                dataIndex: 'quantity',
                render: (val, record) =>
                    ['create', 'update'].includes(record._status) ? (
                      <Form.Item>
                        {record.$form.getFieldDecorator(`quantity`, {
                                rules: [
                                    {
                                        required: true,
                                        message: intl.get('hzero.common.validation.notNull', {
                                            name: intl.get(`quantity`).d('制单数量'),
                                        }),
                                    },
                                ],
                                initialValue: val,
                            })(
                              <InputNumber
                                min={0}
                                style={{ width: '100%' }}
                              />
                            )}
                      </Form.Item>
                    ) : (
                            val
                        ),
            },
            {
                title: '单位',
                dataIndex: 'uomCode',
                align: 'center',
                render: (val, record) =>
                    ['create', 'update'].includes(record._status) ? (
                      <Form.Item>
                        {record.$form.getFieldDecorator(`uomCode`, {
                                initialValue: record.uomCode,
                            })(
                              <Input disabled />
                            )}
                      </Form.Item>
                    ) : (
                            val
                        ),
            },
            {
              title: intl.get(`toLocatorId`).d('收货仓库'),
              dataIndex: 'locatorCode',
              render: (val, record, index) =>
                  ['create', 'update'].includes(record._status) ? (
                    <Form.Item>
                      {record.$form.getFieldDecorator(`toLocatorId`, {
                              rules: [
                                  {
                                      required: true,
                                      message: intl.get('hzero.common.validation.notNull', {
                                          name: intl.get(`toLocatorId`).d('收货仓库'),
                                      }),
                                  },
                              ],
                              initialValue: record.toLocatorId,
                          })(
                            <Lov
                              code="WMS.WAREHOUSE_LOV"
                              textValue={val}
                              queryParams={{ tenantId }}
                              onChange={(value, records) => changeCreateDataByLocator(index, records)}
                            />
                          )}
                    </Form.Item>
                  ) : (
                          val
                      ),
          },
        ];

        return (
          <EditTable
            bordered
            dataSource={dataSource}
            pagination={false}
            loading={loading}
            columns={columns}
          />
        );
    }
}
