import React from 'react';
import { Form, Input, Select, Button } from 'hzero-ui';

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
      onCancelRecord('lineList', null, 'lineId', record);
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
      onEditRecord('lineList', 'lineId', record, flag);
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
      title: intl.get(`${commonModelPrompt}.exceptionType`).d('序号'),
      width: 60,
      dataIndex: 'exceptionType',
      render: (val, record, index) => {
        return index + 1;
      },
    },
    {
      title: intl.get(`${commonModelPrompt}.sourceWorkcellId`).d('来源工序'),
      width: 100,
      dataIndex: 'sourceWorkcellId',
      render: (value, record) =>
        ['create', 'update'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator('sourceWorkcellId', {
              initialValue: value,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${commonModelPrompt}.sourceWorkcellId`).d('来源工序'),
                  }),
                },
              ],
            })(
              <Lov
                code="HME.FINAL_PROCESS"
                queryParams={{ tenantId }}
                textValue={record.workcellName}
                onChange={() => { record.$form.resetFields(['tagId']); }}
              />
            )}
          </Form.Item>
        ) : (
          record.workcellName
        ),
    },
    {
      title: intl.get(`${commonModelPrompt}.tagId`).d('数据项'),
      width: 120,
      dataIndex: 'tagId',
      render: (value, record) =>
        ['create', 'update'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator('tagId', {
              initialValue: value,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${commonModelPrompt}.tagId`).d('数据项'),
                  }),
                },
              ],
            })(
              <Lov
                code="MT.TAG_CHECK"
                queryParams={{ tenantId, sourceWorkcellId: record.$form.getFieldValue('sourceWorkcellId') }}
                textValue={record.tagCode}
                lovOptions={{ valueField: 'tagId', displayField: 'tagCode' }}
                onChange={(val, data) => {
                  record.$form.setFieldsValue({
                    tagDescription: data.tagDescription,
                  });
                }}
              />
            )}
          </Form.Item>
        ) : (
          record.tagCode
        ),
    },
    {
      title: intl.get(`${commonModelPrompt}.ruleCode`).d('数据项描述'),
      width: 120,
      dataIndex: 'tagDescription',
      render: (value, record) =>
        ['create', 'update'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator('tagDescription', {
              initialValue: value,
            })(<Input disabled />)}
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
      rowKey="lineId"
      bodyStyle={{ fontSize: '10px', lineHeight: '30px' }}
    />
  );
};

export default LineList;
