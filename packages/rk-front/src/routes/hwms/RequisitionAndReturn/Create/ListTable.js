import React, { Component } from 'react';
import { Form, Input, InputNumber, Select } from 'hzero-ui';
import Lov from 'components/Lov';
import EditTable from 'components/EditTable';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';
import { getSiteId } from '@/utils/utils';

class ListTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  limitDecimals(value, accuracy) {
    // eslint-disable-next-line no-useless-escape
    const str = `/^(-)*(\\d+)\\.(\\d{1,${accuracy}}).*$/`;
    // eslint-disable-next-line no-eval
    const reg = eval(str);
    if (typeof value === 'string') {
      return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : '';
    } else if (typeof value === 'number') {
      return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : '';
    } else {
      return '';
    }
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const commonModelPrompt = 'hwms.requisitionAndReturn.model.requisitionAndReturn';
    const {
      loading,
      tenantId,
      dataSource,
      onSearch,
      onEditLine,
      onCancelLine,
      // selectedRowKeys,
      // onSelectRow,
      status = [],
      executeMap = [],
      allSiteId,
      onDeleteLine,
      clearLocatorVAlue,
      changeExesetting,
      updateMaterial,
      updateLocator,
    } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.instructionLineNum`).d('行号'),
        dataIndex: 'instructionLineNum',
        width: 60,
        align: 'center',
        render: (val) => val,
      },
      {
        title: intl.get(`${commonModelPrompt}.materialCode`).d('物料'),
        dataIndex: 'materialCode',
        width: 120,
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`materialId`, {
                initialValue: record.materialId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonModelPrompt}.materialCode`).d('物料编码'),
                    }),
                  },
                ],
              })(
                <Lov
                  code="QMS.MATERIAL"
                  textValue={record.materialCode}
                  queryParams={{
                    tenantId,
                  }}
                  onChange={(value, records) => {
                    updateMaterial(records, index);
                    record.$form.setFieldsValue({
                      materialName: records.materialName,
                      uomId: records.uomId,
                      uomCode: records.uomCode,
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
        title: intl.get(`${commonModelPrompt}.materialName`).d('物料描述'),
        dataIndex: 'materialName',
        width: 120,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('materialName', {
                initialValue: val,
              })(<Input disabled />)}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: intl.get(`${commonModelPrompt}.materialVersion`).d('版本'),
        dataIndex: 'materialVersion',
        width: 120,
        align: 'center',
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('materialVersion', {
                initialValue: value,
              })(<Input />)}
            </Form.Item>
          ) : (
              value
            ),
      },
      {
        title: intl.get(`${commonModelPrompt}.quantity`).d('需求数量'),
        dataIndex: 'quantity',
        width: 130,
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('quantity', {
                initialValue: value,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonModelPrompt}.quantity`).d('需求数量'),
                    }),
                  },
                ],
              })(<InputNumber
                min={0.000001}
                formatter={value2 => `${value2}`}
                parser={value2 => this.limitDecimals(value2, 6)}
                style={{ width: '100%' }}
              />)}
            </Form.Item>
          ) : (
              value
            ),
      },
      {
        title: intl.get(`${commonModelPrompt}.uom`).d('单位'),
        dataIndex: 'uomCode',
        width: 80,
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('uomCode', {
                initialValue: val,
              })(<Input disabled />)}
              {record.$form.getFieldDecorator(`uomId`)}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: intl.get(`${commonModelPrompt}.instructionStatusMeaning`).d('状态'),
        dataIndex: 'instructionStatusMeaning',
        width: 100,
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('instructionStatus', {
                initialValue: record.instructionStatus,
              })(
                <Select allowClear style={{ width: '100%' }} disabled>
                  {status.map(item => (
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
        title: intl.get(`${commonModelPrompt}.toStorageId`).d('目标仓库'),
        dataIndex: 'toStorageCode',
        width: 150,
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`toStorageId`, {
                initialValue: record.toStorageId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonModelPrompt}.toStorageId`).d('目标仓库'),
                    }),
                  },
                ],
              })(
                <Lov
                  code="WMS.WAREHOUSE"
                  onChange={(_, records) => clearLocatorVAlue(records, index)}
                  queryParams={{
                    tenantId,
                    siteId: allSiteId || getSiteId(),
                  }}
                  textValue={record.toStorageCode}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: intl.get(`${commonModelPrompt}.toLocatorId`).d('目标货位'),
        dataIndex: 'toLocatorCode',
        width: 150,
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`toLocatorId`, {
                initialValue: record.toLocatorId,
              })(
                <Lov
                  code="WMS.LOCATOR"
                  queryParams={{
                    tenantId,
                    parentLocatorId: record.$form.getFieldValue('toStorageId'),
                  }}
                  onChange={(_, records) => updateLocator(records, index)}
                  textValue={record.toLocatorCode}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: intl.get(`${commonModelPrompt}.toLocatorId`).d('库存量'),
        dataIndex: 'onhandQuantity',
        width: 150,
      },
      {
        title: intl.get(`${commonModelPrompt}.excessSetting`).d('超发设置'),
        dataIndex: 'excessSetting',
        width: 100,
        align: 'center',
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('excessSetting', {
                initialValue: record.excessSetting,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonModelPrompt}.excessSetting`).d('超发设置'),
                    }),
                  },
                ],
              })(
                <Select onChange={vals=>changeExesetting(vals, index)} allowClear style={{ width: '100%' }}>
                  {executeMap.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            (executeMap.filter(ele => ele.value === val)[0] || {}).meaning
            ),
      },
      {
        title: intl.get(`${commonModelPrompt}.excessValue`).d('超发值'),
        dataIndex: 'excessValue',
        width: 100,
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('excessValue', {
                initialValue: val,
              })(<InputNumber disabled={record.excessSetting==="N"||record.excessSetting==="M"} />)}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: intl.get(`${commonModelPrompt}.remark`).d('备注'),
        dataIndex: 'remark',
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('remark', {
                initialValue: value,
              })(<Input />)}
            </Form.Item>
          ) : (
              value
            ),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        width: 180,
        align: 'center',
        fixed: 'right',
        render: (val, record) =>
          record._status === 'create' ? (
            <a onClick={() => onCancelLine(record)}>
              {intl.get('hzero.common.button.clean').d('清除')}
            </a>
          ) : record._status === 'update' ? (
            <span className="action-link">
              <a onClick={() => onEditLine(record, false)}>
                {intl.get('hzero.common.button.cancel').d('取消')}
              </a>
            </span>
          ) : (
            <span className="action-link">
              {/* <a onClick={() => printBarCode(record)}>条码打印</a> */}
              {/* <a onClick={() => onEditLine(record, true)}>
                {intl.get('hzero.common.button.edit').d('编辑')}
              </a> */}
              <a onClick={() => onDeleteLine(record)}>
                {intl.get('hzero.common.button.delete').d('删除')}
              </a>
            </span>
              ),
      },
    ];
    return (
      <EditTable
        rowKey="instructionId"
        bordered
        loading={loading}
        dataSource={dataSource}
        scroll={{ x: tableScrollWidth(columns) }}
        columns={columns}
        pagination={{pageSize: 9999999}}
        onChange={page => onSearch(page)}
        // rowSelection={{
        //   fixed: true,
        //   selectedRowKeys,
        //   onChange: onSelectRow,
        // }}
      />
    );
  }
}

export default ListTable;
