import React from 'react';
import { Form, Input, InputNumber, Select } from 'hzero-ui';

import intl from 'utils/intl';
import EditTable from 'components/EditTable';
import Lov from 'components/Lov';

import { tableScrollWidth } from 'utils/utils';

import { enableRender } from '@/utils/renderer';

const commonModelPrompt = 'tarzan.hmes.purchaseOrder';
const { Option } = Select;

const HeadList = (props) => {

  /**
   * 清除当前行
   *
   * @param {string} dataSourceName 数据源名称
   * @param {string} idName 主键id名称
   * @param {object} record 当前对象
   * @memberof FloorInfo
   */
  const handleCancelLine = (record) => {
    const { onCancelRecord } = props;
    if (onCancelRecord) {
      onCancelRecord('headList', 'headPagination', 'headerId', record);
    }
  };

  /**
   * 编辑当前行
   *
   * @param {string} dataSourceName 数据源名称
   * @param {string} idName 主键id名称
   * @param {object} record 当前行数据
   * @param {boolean} flag 编辑当前行 / 取消编辑
   * @memberof FloorInfo
   */
  const handleEditLine = (record, flag) => {
    const { onEditRecord } = props;
    if (onEditRecord) {
      onEditRecord('headList', 'headerId', record, flag);
    }
  };


  const handleSave = (record) => {
    const { onSave } = props;
    if (onSave) {
      onSave(record);
    }
  };

  const handleSearch = (page = {}) => {
    const { onSearch } = props;
    if (onSearch) {
      onSearch(page);
    }
  };

  const { loading, dataSource, pagination, testObjectList, testTypeList, rowSelection } = props;
  const columns = [
    {
      title: intl.get(`${commonModelPrompt}.cosType`).d('COS类型'),
      width: 120,
      dataIndex: 'cosType',
      render: (value, record) =>
        ['create'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator('cosType', {
              initialValue: value,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${commonModelPrompt}.materialCode`).d('COS类型'),
                  }),
                },
              ],
            })(
              <Lov code="HME.COS_TYPE" textValue={record.cosTypeMeaning} />
            )}
          </Form.Item>
        ) : (
          value
        ),
    },
    {
      title: intl.get(`${commonModelPrompt}.testObject`).d('测试对象'),
      width: 120,
      dataIndex: 'testObject',
      render: (value, record) =>
        ['create', 'update'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator('testObject', {
              initialValue: value,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${commonModelPrompt}.testObject`).d('测试对象'),
                  }),
                },
              ],
            })(
              <Select allowClear style={{ width: '100%' }}>
                {testObjectList.map(e => (
                  <Option key={e.value} value={e.value}>{e.meaning}</Option>
                ))}
              </Select>
            )}
          </Form.Item>
        ) : (
          record.testObjectMeaning
        ),
    },
    {
      title: intl.get(`${commonModelPrompt}.testType`).d('测试类型'),
      width: 120,
      dataIndex: 'testType',
      render: (value, record) =>
        ['create', 'update'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator('testType', {
              initialValue: value,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${commonModelPrompt}.testType`).d('测试类型'),
                  }),
                },
              ],
            })(
              <Select
                allowClear
                style={{ width: '100%' }}
                onChange={() => { record.$form.resetFields(['testQty']); }}
              >
                {testTypeList.map(e => (
                  <Option key={e.value} value={e.value}>{e.meaning}</Option>
                ))}
              </Select>
            )}
          </Form.Item>
        ) : (
          record.testTypeMeaning
        ),
    },
    {
      title: intl.get(`${commonModelPrompt}.testQty`).d('测试数量'),
      width: 100,
      dataIndex: 'testQty',
      render: (value, record) =>
        ['create', 'update'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator('testQty', {
              initialValue: value,
              rules: [
                {
                  required: record.$form.getFieldValue('testType') === 'PART',
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${commonModelPrompt}.testQty`).d('测试数量'),
                  }),
                },
              ],
            })(<InputNumber disabled={record.$form.getFieldValue('testType') === 'ALL'} precision={0} min={0} style={{ width: '100%' }} />)}
          </Form.Item>
        ) : (
          value
        ),
    },
    {
      title: intl.get(`${commonModelPrompt}.passRate`).d('良率'),
      width: 100,
      dataIndex: 'passRate',
      render: (value, record) =>
        ['create', 'update'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator('passRate', {
              initialValue: value,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${commonModelPrompt}.passRate`).d('良率'),
                  }),
                },
              ],
            })(
              <InputNumber
                precision={2}
                min={1}
                style={{ width: '100%' }}
                formatter={val => `${val}%`}
                parser={val => val.replace('%', '')}
              />
            )}
          </Form.Item>
        ) : (
          value
        ),
    },
    {
      title: intl.get(`${commonModelPrompt}.remark`).d('备注'),
      width: 100,
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
      title: intl.get(`${commonModelPrompt}.enableFlag`).d('是否有效'),
      width: 80,
      dataIndex: 'enableFlag',
      align: 'center',
      render: (value, record) =>
        ['create', 'update'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator('enableFlag', {
              initialValue: value !== 'N' ? 'Y' : 'N',
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${commonModelPrompt}.enableFlag`).d('是否有效'),
                  }),
                },
              ],
            })(
              <Select allowClear style={{ width: '100%' }}>
                <Option value="Y" key="Y">是</Option>
                <Option value="N" key="N">否</Option>
              </Select>
            )}
          </Form.Item>
        ) : (
          enableRender(value)
        ),
    },
    {
      title: intl.get('hzero.common.button.action').d('操作'),
      dataIndex: '',
      width: 100,
      render: (value, record) =>
        record._status === 'create' ? (
          <div className="action-link">
            <a onClick={() => handleCancelLine(record)}>
              {intl.get('hzero.common.button.clean').d('清除')}
            </a>
            <a onClick={() => handleSave(record)}>
              {intl.get('hzero.common.button.save').d('保存')}
            </a>
          </div>
        ) : record._status === 'update' ? (
          <div className="action-link">
            <a onClick={() => handleEditLine(record, false)}>
              {intl.get('hzero.common.button.cancel').d('取消')}
            </a>
            <a onClick={() => handleSave(record)}>
              {intl.get('hzero.common.button.save').d('保存')}
            </a>
          </div>
        ) : (
          <a onClick={() => handleEditLine(record, true)}>
            {intl.get('hzero.common.button.edit').d('编辑')}
          </a>
        ),
    },
  ];

  return (
    <EditTable
      bordered
      dataSource={dataSource}
      columns={columns}
      pagination={pagination}
      scroll={{ x: tableScrollWidth(columns) }}
      rowSelection={rowSelection}
      onChange={handleSearch}
      loading={loading}
      rowKey="headerId"
      bodyStyle={{ fontSize: '10px', lineHeight: '30px' }}
    />
  );
};

export default HeadList;
