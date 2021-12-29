import React from 'react';
import { Form, Input, Select, InputNumber } from 'hzero-ui';

import intl from 'utils/intl';
import EditTable from 'components/EditTable';

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
      onCancelRecord('headList', 'headPagination', 'nameplateHeaderId', record);
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
      onEditRecord('headList', 'nameplateHeaderId', record, flag);
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

  const { loading, dataSource, pagination, rowSelection, typeList } = props;
  const columns = [
    {
      title: intl.get(`${commonModelPrompt}.nameplateOrder`).d('序列'),
      width: 80,
      dataIndex: 'nameplateOrder',
      render: (value, record) =>
        ['create', 'update'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator('nameplateOrder', {
              initialValue: value,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${commonModelPrompt}.nameplateOrder`).d('序列'),
                  }),
                },
              ],
            })(
              <InputNumber min={1} precision={0} />
            )}
          </Form.Item>
        ) : (
          value
        ),

    },
    {
      title: intl.get(`${commonModelPrompt}.type`).d('类型'),
      width: 120,
      dataIndex: 'type',
      render: (value, record) =>
        ['create', 'update'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator('type', {
              initialValue: value,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${commonModelPrompt}.type`).d('类型'),
                  }),
                },
              ],
            })(
              <Select
                style={{ width: '100%' }}
                allowClear
              >
                {typeList.map(e => (
                  <Select.Option key={e.value} value={e.value}>
                    {e.meaning}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
        ) : (
          record.typeMeaning
        ),
    },
    {
      title: intl.get(`${commonModelPrompt}.identifyingCode`).d('内部识别码'),
      width: 120,
      dataIndex: 'identifyingCode',
      render: (value, record) =>
        ['create', 'update'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator('identifyingCode', {
              initialValue: value,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${commonModelPrompt}.identifyingCode`).d('内部识别码'),
                  }),
                },
              ],
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
      rowKey="nameplateHeaderId"
      bodyStyle={{ fontSize: '10px', lineHeight: '30px' }}
    />
  );
};

export default HeadList;
