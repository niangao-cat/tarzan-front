import React, { Component } from 'react';
import { InputNumber, Button, Popconfirm, Form, Input, Select, Badge } from 'hzero-ui';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import EditTable from 'components/EditTable';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
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

  @Bind()
  clearData(val, record) {
    if (val === 'VALUE') {
      // record.$form.resetFields(['falseValue', 'trueValue']);
      record.$form.resetFields(['trueValue', 'falseValue']);
    }
    if (val === 'DECISION_VALUE') {
      record.$form.resetFields(['accuracy', 'minimumValue', 'standardValue', 'maximalValue', 'uomId']);
    }
    if (val === 'TEXT' || val === 'ATTACHMENTS') {
      record.$form.resetFields(['accuracy', 'minimumValue', 'standardValue', 'maximalValue', 'uomId', 'trueValue', 'falseValue']);
    }
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
      operationId,
      handleCreate,
      deleteData,
      // maintainLeadtime = [],
      dataTypeList = [],
      collectionMethodList = [],
      handleEditLine,
      lineEditor,
      equipemntManageCycle = [],
      deleteLineDataLoading,
    } = this.props;
    const columns = [
      {
        title: (
          <Button
            style={{ backgroundColor: '#548FFC', color: '#fff' }}
            icon="plus"
            shape="circle"
            size="small"
            disabled={!canEdit || !operationId === 'create'}
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
        title: '排序',
        dataIndex: 'serialNumber',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`serialNumber`, {
                initialValue: record.serialNumber,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '排序',
                    }),
                  },
                ],
              })(
                <InputNumber
                  disabled={lineEditor}
                  min={0}
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
        title: '项目',
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
                        name: '项目',
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
                        ...vals,
                        tagDescriptions: vals.tagDescription,
                        valueType: vals.valueType,
                        accuracy: vals.accuracy,
                        minimumValue: vals.minimumValue,
                        collectionMethod: vals.collectionMethod,
                        standardValue: vals.standardValue,
                        maximalValue: vals.maximalValue,
                        trueValue: vals.trueValue,
                        falseValue: vals.falseValue,
                        remark: vals.remark,
                        enableFlag: vals.enableFlag,
                        tagCode: vals.tagCode,
                        _status: 'update',
                      });
                    }}
                  />
                )}
              </Form.Item>
              <Form.Item style={{ display: 'none' }}>
                {record.$form.getFieldDecorator(`tagCode`, {
                  initialValue: record.tagCode,
                })(
                  <Input />
                )}
              </Form.Item>
            </span>
          ) : (
              val
            ),
      },
      {
        title: '项目描述',
        dataIndex: 'tagDescriptions',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`tagDescriptions`, {
                initialValue: record.tagDescriptions,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '项目描述',
                    }),
                  },
                ],
              })(
                <Input disabled={lineEditor} />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '数据类型',
        dataIndex: 'valueTypeMeaning',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`valueType`, {
                initialValue: record.valueType,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '数据类型',
                    }),
                  },
                ],
              })(
                <Select style={{ width: '100%' }} disabled={lineEditor} onChange={item => this.clearData(item, record)}>
                  {dataTypeList.map(item => (
                    <Select.Option key={item.typeCode} value={item.typeCode}>{item.description}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '收集方式',
        dataIndex: 'collectionMethodMeaning',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`collectionMethod`, {
                initialValue: record.collectionMethod,
              })(
                <Select style={{ width: '100%' }} disabled={lineEditor}>
                  {collectionMethodList.map(item => (
                    <Select.Option key={item.typeCode} value={item.typeCode}>{item.description}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '周期',
        dataIndex: 'manageCycleMeaning',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`manageCycle`, {
                initialValue: record.manageCycle,
              })(
                <Select style={{ width: '100%' }} disabled={lineEditor}>
                  {equipemntManageCycle.map(item => (
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
        title: '精度',
        dataIndex: 'accuracy',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`accuracy`, {
                initialValue: record.$form.getFieldValue('valueType') === 'VALUE' ? record.accuracy : null,
              })(
                <InputNumber
                  disabled={!(record.$form.getFieldValue('valueType') === 'VALUE')}
                  min={0}
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
        title: '最小值',
        dataIndex: 'minimumValue',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`minimumValue`, {
                initialValue: record.$form.getFieldValue('valueType') === 'VALUE' ? record.minimumValue : null,
              })(
                <InputNumber
                  disabled={!(record.$form.getFieldValue('valueType') === 'VALUE')}
                  // formatter={value => this.limitDecimals(value, record.$form.getFieldValue('accuracy'))}
                  formatter={value => `${value}`}
                  parser={value => this.limitDecimals(value, record.$form.getFieldValue('accuracy'))}
                  // eslint-disable-next-line no-restricted-properties
                  step={`${parseInt(Math.pow(0.1, record.$form.getFieldValue('accuracy')) * Math.pow(10, record.$form.getFieldValue('accuracy')) + 0.5, 10) / Math.pow(10, record.$form.getFieldValue('accuracy'))}`}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '标准值',
        dataIndex: 'standardValue',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`standardValue`, {
                initialValue: record.$form.getFieldValue('valueType') === 'VALUE' ? record.standardValue : null,
              })(
                <InputNumber
                  disabled={!(record.$form.getFieldValue('valueType') === 'VALUE')}
                  // formatter={value => this.limitDecimals(value, record.$form.getFieldValue('accuracy'))}
                  formatter={value => `${value}`}
                  parser={value => this.limitDecimals(value, record.$form.getFieldValue('accuracy'))}
                  // eslint-disable-next-line no-restricted-properties
                  step={`${parseInt(Math.pow(0.1, record.$form.getFieldValue('accuracy')) * Math.pow(10, record.$form.getFieldValue('accuracy')) + 0.5, 10) / Math.pow(10, record.$form.getFieldValue('accuracy'))}`}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '最大值',
        dataIndex: 'maximalValue',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`maximalValue`, {
                initialValue: record.$form.getFieldValue('valueType') === 'VALUE' ? record.maximalValue : null,
              })(
                <InputNumber
                  min={record.$form.getFieldValue('minimumValue')}
                  disabled={!(record.$form.getFieldValue('valueType') === 'VALUE')}
                  // formatter={value => this.limitDecimals(value, record.$form.getFieldValue('accuracy'))}
                  formatter={value => `${value}`}
                  parser={value => this.limitDecimals(value, record)}
                  // eslint-disable-next-line no-restricted-properties
                  step={`${parseInt(Math.pow(0.1, record.$form.getFieldValue('accuracy')) * Math.pow(10, record.$form.getFieldValue('accuracy')) + 0.5, 10) / Math.pow(10, record.$form.getFieldValue('accuracy'))}`}
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
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`uomId`, {
                initialValue: record.$form.getFieldValue('valueType') === 'VALUE' ? record.uomId : null,
              })(
                <Lov
                  code="MT.UOM"
                  queryParams={{ tenantId }}
                  textValue={record.uomCode}
                  disabled={!(record.$form.getFieldValue('valueType') === 'VALUE')}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '符合值',
        dataIndex: 'trueValue',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`trueValue`, {
                initialValue: record.$form.getFieldValue('valueType') === 'DECISION_VALUE' ? record.trueValue : null,
              })(
                <Input disabled={!(record.$form.getFieldValue('valueType') === 'DECISION_VALUE')} />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '不符合值',
        dataIndex: 'falseValue',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`falseValue`, {
                initialValue: record.$form.getFieldValue('valueType') === 'DECISION_VALUE' ? record.falseValue : null,
              })(
                <Input disabled={!(record.$form.getFieldValue('valueType') === 'DECISION_VALUE')} />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      // {
      //   title: '保养提前提醒期',
      //   dataIndex: 'maintainLeadtimeMeaning',
      //   width: 130,
      //   align: 'center',
      //   render: (val, record) =>
      //     ['update', 'create'].includes(record._status) ? (
      //       <Form.Item>
      //         {record.$form.getFieldDecorator(`maintainLeadtime`, {
      //           initialValue: record.maintainLeadtime,
      //         })(
      //           <Select style={{ width: '100%' }}>
      //             {maintainLeadtime.map(item => (
      //               <Select.Option key={item.value}>{item.meaning}</Select.Option>
      //             ))}
      //           </Select>
      //         )}
      //       </Form.Item>
      //     ) : (
      //         val
      //       ),
      // },
      // {
      //   title: '责任人',
      //   dataIndex: 'responsible',
      //   width: 110,
      //   align: 'center',
      //   render: (val, record) =>
      //     ['update', 'create'].includes(record._status) ? (
      //       <Form.Item>
      //         {record.$form.getFieldDecorator(`responsible`, {
      //           initialValue: record.responsible,
      //         })(
      //           <Lov />
      //         )}
      //       </Form.Item>
      //     ) : (
      //         val
      //       ),
      // },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 110,
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
        title: '有效性',
        dataIndex: 'enableFlag',
        width: 110,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`enableFlag`, {
                initialValue: record.enableFlag,
              })(
                <Select allowClear>
                  <Select.Option key='Y' value='Y'>
                    是
                  </Select.Option>
                  <Select.Option key='N' value='N'>
                    否
                  </Select.Option>
                </Select>
              )}
            </Form.Item>
          ) : (
            <Badge
              status={record.enableFlag === 'Y' ? 'success' : 'error'}
              text={
                record.enableFlag === 'Y'
                  ? intl.get(`hzero.common.view.yes`).d('是')
                  : intl.get(`hzero.common.view.no`).d('否')
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
