import React, { Component } from 'react';
import { Form, Input, Badge, Select } from 'hzero-ui';
import Lov from 'components/Lov';
import EditTable from 'components/EditTable';
import intl from 'utils/intl';
import { tableScrollWidth, getCurrentOrganizationId } from 'utils/utils';

const { Option } = Select;
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
      dataList,
      fetchLoading,
      pagination,
      onSearch,
      handleCleanLine,
      handleEditLine,
    } = this.props;
    const columns = [
      {
        title: '组织',
        dataIndex: 'siteName',
        width: 130,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <span>
              <Form.Item>
                {record.$form.getFieldDecorator(`siteName`, {
                  initialValue: record.siteName,
                })(
                  <Input disabled />
                )}
              </Form.Item>
              <Form.Item style={{display: 'none'}}>
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
        title: '资产编码',
        dataIndex: 'assetEncoding',
        width: 130,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <span>
              <Form.Item>
                {record.$form.getFieldDecorator(`assetEncoding`, {
                  rules: [
                    {
                      required: true,
                      message: '资产编码',
                    },
                  ],
                  initialValue: record.assetEncoding,
                })(
                  <Lov
                    code="HME.ASSET"
                    allowClear
                    queryParams={{
                      tenantId: getCurrentOrganizationId(),
                    }}
                    textValue={record.assetEncoding}
                    onChange={(value, item) => {
                      record.$form.setFieldsValue({
                        descriptions: item.descriptions,
                        equipmentId: item.equipmentId,
                      });
                    }}
                  />
                )}
              </Form.Item>
              <Form.Item style={{ display: 'none' }}>
                {record.$form.getFieldDecorator(`equipmentId`, {
                  initialValue: record.equipmentId,
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
        title: '设备描述',
        dataIndex: 'assetDesc',
        width: 130,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`descriptions`, {
                initialValue: record.assetDesc,
              })(
                <Input disabled />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '工位',
        dataIndex: 'stationWorkcellName',
        width: 130,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`stationId`, {
                initialValue: record.stationId,
                rules: [
                  {
                    required: !record.$form.getFieldValue('businessId')&&!record.$form.getFieldValue('workShopId')
                    &&!record.$form.getFieldValue('prodLineId')&&!record.$form.getFieldValue('processId')
                    &&!record.$form.getFieldValue('lineId'),
                    message: '工位不能为空',
                  },
                ],
              })(
                <Lov
                  code="HME.WORKCELL"
                  allowClear
                  textValue={record.stationWorkcellName}
                  // disabled={!record.$form.getFieldValue('processId')}
                  queryParams={{
                    typeFlag: 'STATION',
                    processId: record.$form.getFieldValue('processId'),
                    tenantId: getCurrentOrganizationId(),
                  }}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '部门',
        dataIndex: 'businessDesc',
        width: 130,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`businessId`, {
                rules: [
                  {
                    required: false,
                    message: '部门',
                  },
                ],
                initialValue: record.businessId,
              })(
                <Lov
                  code="HME.BUSINESS_AREA "
                  allowClear
                  textValue={record.businessDesc}
                  queryParams={{
                    tenantId: getCurrentOrganizationId(),
                  }}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '车间',
        dataIndex: 'workShopDesc',
        width: 130,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`workShopId`, {
                rules: [
                  {
                    required: false,
                    message: '车间',
                  },
                ],
                initialValue: record.workShopId,
              })(
                <Lov
                  code="HME_WORK_SHOP"
                  allowClear
                  textValue={record.workShopDesc}
                  // disabled={!record.$form.getFieldValue('businessId')}
                  queryParams={{
                    parentOrganizationId: record.$form.getFieldValue('businessId'),
                    tenantId: getCurrentOrganizationId(),
                  }}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '产线',
        dataIndex: 'proLineDesc',
        width: 130,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`prodLineId`, {
                rules: [
                  {
                    required: false,
                    message: '产线',
                  },
                ],
                initialValue: record.prodLineId,
              })(
                <Lov
                  code="Z.PRODLINE"
                  allowClear
                  textValue={record.proLineDesc}
                  // disabled={!record.$form.getFieldValue('workShopId')}
                  queryParams={{
                    tenantId: getCurrentOrganizationId(),
                    workShopId: record.$form.getFieldValue('workShopId'),
                  }}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '工段',
        dataIndex: 'lineWorkcellName',
        width: 130,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`lineId`, {
                initialValue: record.lineId,
                rules: [
                  {
                    required: false,
                    message: '工段',
                  },
                ],
              })(
                <Lov
                  code="HME.WORKCELL"
                  allowClear
                  textValue={record.lineWorkcellName}
                  // disabled={!record.$form.getFieldValue('prodLineId')}
                  queryParams={{
                    prodLineId: record.$form.getFieldValue('prodLineId'),
                    typeFlag: 'LINE',
                    tenantId: getCurrentOrganizationId(),
                  }}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '工序',
        dataIndex: 'processWorkcellName',
        width: 130,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`processId`, {
                initialValue: record.processId,
                rules: [
                  {
                    required: false,
                    message: '工序',
                  },
                ],
              })(
                <Lov
                  code="HME.WORKCELL"
                  allowClear
                  textValue={record.processWorkcellName}
                  // disabled={!record.$form.getFieldValue('lineId')}
                  queryParams={{
                    lineId: record.$form.getFieldValue('lineId'),
                    tenantId: getCurrentOrganizationId(),
                    typeFlag: 'PROCESS',
                  }}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '启用状态',
        dataIndex: 'enableFlagMeaning',
        width: 110,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`enableFlag`, {
                initialValue: record.enableFlag,
              })(
                <Select style={{ width: '100%' }}>
                  <Option value='Y' key='Y'>启用</Option>
                  <Option value="N" key='N'>禁用</Option>
                </Select>
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
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 120,
        align: 'center',
        fixed: 'right',
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
        rowKey="equipmentWkcRelId"
        columns={columns}
        loading={fetchLoading}
        dataSource={dataList}
        scroll={{ x: tableScrollWidth(columns) }}
        pagination={pagination}
        onChange={page => onSearch(page)}
      />
    );
  }
}
export default ListTable;
