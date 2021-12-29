import React from 'react';
import { Form, Input, Select, Button, InputNumber } from 'hzero-ui';

import intl from 'utils/intl';
import EditTable from 'components/EditTable';
import Lov from 'components/Lov';

import { tableScrollWidth } from 'utils/utils';

import { enableRender } from '@/utils/renderer';

const commonModelPrompt = 'tarzan.hmes.purchaseOrder';
const { Option } = Select;

const LineList = (props) => {

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
      onCancelRecord('lineList', null, 'nameplateLineId', record);
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
      onEditRecord('lineList', 'nameplateLineId', record, flag);
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

  const handleCreate = () => {
    const { onCreate } = props;
    if (onCreate) {
      onCreate();
    }
  };

  const { loading, dataSource, tenantId, rowSelection, canEdit, pagination } = props;
  const columns = [
    {
      title: (
        <Button
          style={{ backgroundColor: '#548FFC', color: '#fff' }}
          icon="plus"
          shape="circle"
          size="small"
          disabled={!canEdit}
          onClick={handleCreate}
        />
      ),
      align: 'center',
      width: 60,
    },
    {
      title: intl.get(`${commonModelPrompt}.code`).d('编码'),
      width: 60,
      dataIndex: 'code',
      render: (value, record) =>
        ['create'].includes(record._status) && dataSource.length === 1 ? (
          <Form.Item>
            {record.$form.getFieldDecorator('code', {
              initialValue: value,
              rules: [
                {
                  required: dataSource.length === 1,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${commonModelPrompt}.code`).d('编码'),
                  }),
                },
              ],
            })(
              <Input />
            )}
          </Form.Item>
        ) : (
          value
        ),
    },
    {
      title: intl.get(`${commonModelPrompt}.tagId`).d('物料编码'),
      width: 120,
      dataIndex: 'materialCode',
      render: (value, record) =>
        ['create', 'update'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator('materialCode', {
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
                lovOptions={{ valueField: 'materialCode', displayField: 'materialCode' }}
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
      title: intl.get(`${commonModelPrompt}.qty`).d('数量'),
      width: 120,
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
                    name: intl.get(`${commonModelPrompt}.qty`).d('数量'),
                  }),
                },
              ],
            })(
              <InputNumber />
            )}
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
      rowKey="nameplateLineId"
      bodyStyle={{ fontSize: '10px', lineHeight: '30px' }}
    />
  );
};

export default LineList;
