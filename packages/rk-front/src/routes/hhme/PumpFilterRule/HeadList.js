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
      onCancelRecord('headList', 'headPagination', 'ruleHeadId', record);
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
      onEditRecord('headList', 'ruleHeadId', record, flag);
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

  const { loading, dataSource, pagination, tenantId, rowSelection } = props;
  const columns = [
    {
      title: intl.get(`${commonModelPrompt}.exceptionType`).d('序号'),
      width: 80,
      dataIndex: 'orderSeq',
      render: (val, record, index) => {
        const { pageSize, current } = pagination;
        return pageSize * (current - 1) + index + 1;
      },

    },
    {
      title: intl.get(`${commonModelPrompt}.materialCode`).d('物料编码'),
      width: 120,
      dataIndex: 'materialId',
      render: (value, record) =>
        ['create', 'update'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator('materialId', {
              initialValue: value,
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
                code="HME.SITE_MATERIAL"
                queryParams={{ tenantId }}
                textValue={record.materialCode}
                onChange={(val, data) => {
                  record.$form.setFieldsValue({
                    materialName: data.materialName,
                  });
                }}
              />
            )}
          </Form.Item>
        ) : (
          record.materialCode
        ),
    },
    {
      title: intl.get(`${commonModelPrompt}.materialName`).d('物料描述'),
      width: 120,
      dataIndex: 'materialName',
      render: (value, record) =>
        ['create', 'update'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator('materialName', {
              initialValue: value,
            })(<Input disabled />)}
          </Form.Item>
        ) : (
          value
        ),
    },
    {
      title: intl.get(`${commonModelPrompt}.ruleCode`).d('规则编码'),
      width: 120,
      dataIndex: 'ruleCode',
      render: (value, record) =>
        ['create', 'update'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator('ruleCode', {
              initialValue: value,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${commonModelPrompt}.ruleCode`).d('规则编码'),
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
      title: intl.get(`${commonModelPrompt}.qty`).d('泵浦源个数'),
      width: 100,
      dataIndex: 'qty',
      render: (value, record) =>
        ['create', 'update'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator('qty', {
              initialValue: value,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${commonModelPrompt}.qty`).d('泵浦源个数'),
                  }),
                },
              ],
            })(<InputNumber precision={0} min={0} style={{ width: '100%' }} />)}
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
      rowKey="ruleHeadId"
      bodyStyle={{ fontSize: '10px', lineHeight: '30px' }}
    />
  );
};

export default HeadList;