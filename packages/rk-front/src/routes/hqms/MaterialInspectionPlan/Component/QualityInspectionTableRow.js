/*
 * @Description: 质检组选择界面-行
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-16 18:34:09
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-09-20 11:48:25
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import intl from 'utils/intl';
import { tableScrollWidth, getCurrentOrganizationId } from 'utils/utils';
import EditTable from 'components/EditTable';
import Lov from 'components/Lov';
import { Form, InputNumber, Select, Input } from 'hzero-ui';

@Form.create({ fieldNameProp: null })
export default class QualityInspectionTableRow extends Component {


  limitDecimals(value, record) {
    const { accuracy } = record;
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
    const commonModelPrompt = 'hwms.deliverQuery.model.deliverQuery';
    const { loading, pagination, onSearch, dataSource, defectLevel = [], collectionMethod=[] } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.sequence`).d('序号'),
        width: 70,
        dataIndex: 'sequence',
        align: 'center',
        render: (val, record, index) => index + 1,
      },
      {
        title: '排序码',
        width: 90,
        dataIndex: 'orderKey',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.inspection`).d('检验项目'),
        dataIndex: 'inspection',
        width: 90,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.inspectionDesc`).d('检验项目描述'),
        dataIndex: 'inspectionDesc',
        width: 110,
        align: 'center',
      },
      {
        title: '检验项目类别',
        dataIndex: 'inspectionTypeMeaning',
        width: 120,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.defectLevel`).d('缺陷等级'),
        width: 150,
        dataIndex: 'defectLevel',
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`defectLevel`, {
                rules: [
                  {
                    required: true,
                    message: '缺陷等级',
                  },
                ],
                initialValue: record.defectLevel,
              })(
                <Select style={{ width: '100%' }}>
                  {defectLevel.map(item => (
                    <Select.Option key={item.value}>{item.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: intl.get(`${commonModelPrompt}.standardTypeMeaning`).d('规格类型'),
        width: 100,
        align: 'center',
        dataIndex: 'standardTypeMeaning',
      },
      {
        title: '精度',
        dataIndex: 'accuracy',
        width: 80,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.standardFrom`).d('规格值从'),
        width: 110,
        dataIndex: 'standardFrom',
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`standardFrom`, {
                rules: [
                  {
                    required: record.standardType === 'VALUE',
                    message: '规格值从不能为空',
                  },
                ],
                initialValue: record.standardFrom,
              })(
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  formatter={value => this.limitDecimals(value, record)}
                  parser={value => this.limitDecimals(value, record)}
                  // formatter={value => `${value}`}
                  // eslint-disable-next-line no-useless-escape
                  // parser={value => value.replace(eval(/^(-)*(\d+)\.(\d{1,2}).*$/), '$1$2.$3')}
                  // eslint-disable-next-line no-restricted-properties
                  step={`${parseInt(Math.pow(0.1, record.accuracy) * Math.pow(10, record.accuracy) + 0.5, 10) / Math.pow(10, record.accuracy)}`}
                />)}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '规格值至',
        dataIndex: 'standardTo',
        width: 110,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`standardTo`, {
                rules: [
                  {
                    required: record.standardType === 'VALUE',
                    message: '规格至不能为空',
                  },
                ],
                initialValue: record.standardTo,
              })(
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  formatter={value => this.limitDecimals(value, record)}
                  parser={value => this.limitDecimals(value, record)}
                  // eslint-disable-next-line no-restricted-properties
                  step={`${parseInt(Math.pow(0.1, record.accuracy) * Math.pow(10, record.accuracy) + 0.5, 10) / Math.pow(10, record.accuracy)}`}
                />)}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '规格单位',
        dataIndex: 'standardUom',
        width: 90,
        align: 'center',
      },
      {
        title: '文本规格值',
        dataIndex: 'standardText',
        width: 100,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`standardText`, {
                rules: [
                  {
                    required: record.standardType === 'TEXT',
                    message: '文本规格值不能为空',
                  },
                ],
                initialValue: record.standardText,
              })(<Input style={{ width: '100%' }} />)}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '检验工具',
        dataIndex: 'inspectionToolMeaning',
        width: 140,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`inspectionTool`, {
                initialValue: record.inspectionTool,
              })(
                <Lov
                  queryParams={{
                    tenantId: getCurrentOrganizationId(),
                    lovCodeParam: 'QMS.INSPECTION_TOOL',
                  }}
                  code="QMS.INSPECTION"
                  textValue={record.inspectionToolMeaning}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '检验方法',
        dataIndex: 'inspectionMethodMeaning',
        width: 140,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`inspectionMethod`, {
                initialValue: record.inspectionMethod,
              })(
                <Select allowClear style={{width: '100%'}}>
                  {collectionMethod.map(ele => (
                    <Select.Option value={ele.value} key={ele.value}>{ele.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '抽样类型',
        dataIndex: 'sampleType',
        width: 140,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`sampleType`, {
                initialValue: record.sampleType,
              })(
                <Lov
                  queryParams={{
                    tenantId: getCurrentOrganizationId(),
                  }}
                  code="QMS.SAMPLE_PROGRAM"
                  textValue={record.sampleType}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '是否有效',
        dataIndex: 'enableFlag',
        width: 90,
        align: 'center',
        render: (text, record) => {
          if (record.enableFlag === 'Y') {
            return <span>是</span>;
          } else {
            return <span>否</span>;
          }
        },
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 90,
        align: 'center',
      },
    ];
    return (
      <EditTable
        style={{ marginTop: '10px' }}
        bordered
        rowKey="materialInspectionContentId"
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns) }}
        onChange={page => onSearch(page)}
      />
    );
  }
}
