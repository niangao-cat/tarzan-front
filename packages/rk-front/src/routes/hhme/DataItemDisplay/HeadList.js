import React from 'react';
import { Form, Input, Select } from 'hzero-ui';

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

  const handleChangeType = (record) => {
    record.$form.resetFields(['itemGroupId', 'itemGroupCode', 'workcellId']);
  };

  const { loading, dataSource, pagination, areaList, rowSelection, departmentInfo, tenantId, typeList } = props;
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
      title: intl.get(`${commonModelPrompt}.materialCode`).d('应用事业部'),
      width: 120,
      dataIndex: 'businessId',
      render: (value, record) =>
        ['create', 'update'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator('businessId', {
              initialValue: value || departmentInfo.areaId,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${commonModelPrompt}.materialCode`).d('物料编码'),
                  }),
                },
              ],
            })(
              <Select
                style={{ width: '100%' }}
                allowClear
              >
                {areaList.map(e => (
                  <Select.Option key={e.areaId} value={e.areaId}>
                    {e.areaName}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
        ) : (
          record.areaName
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
      title: intl.get(`${commonModelPrompt}.ruleDescription`).d('规则描述'),
      width: 120,
      dataIndex: 'ruleDescription',
      render: (value, record) =>
        ['create', 'update'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator('ruleDescription', {
              initialValue: value,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${commonModelPrompt}.ruleDescription`).d('规则描述'),
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
              <Select allowClear style={{ width: '100%' }} onChange={() => handleChangeType(record)}>
                {typeList.map(e => (
                  <Option key={e.value} value={e.value}>{e.meaning}</Option>
                ))}
              </Select>
            )}
          </Form.Item>
        ) : (
          record.typeMeaning
        ),
    },
    {
      title: intl.get(`${commonModelPrompt}.itemGroupId`).d('物料组编码'),
      width: 120,
      dataIndex: 'itemGroupId',
      render: (value, record) =>
        ['create', 'update'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator('itemGroupId', {
              initialValue: value,
              rules: [
                {
                  required: record.$form.getFieldValue('type') === 'COMPONENT_DATA',
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${commonModelPrompt}.itemGroupId`).d('物料组编码'),
                  }),
                },
              ],
            })(
              <Lov
                code="WMS.ITEM_GROUP"
                queryParams={{ tenantId }}
                textValue={record.itemGroupCode}
                disabled={record.$form.getFieldValue('type') === 'SN_DATA'}
                onChange={(val, data) => {
                  record.$form.setFieldsValue({ itemGroupDescription: data.itemGroupDescription });
                }}
              />
            )}
          </Form.Item>
        ) : (
          record.itemGroupCode
        ),
    },
    {
      title: intl.get(`${commonModelPrompt}.itemGroupCode`).d('物料组描述'),
      width: 120,
      dataIndex: 'itemGroupDescription',
      render: (value, record) =>
        ['create', 'update'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator('itemGroupDescription', {
              initialValue: value,
            })(<Input disabled />)}
          </Form.Item>
        ) : (
          value
        ),
    },
    {
      title: intl.get(`${commonModelPrompt}.workcellId`).d('当前工序'),
      width: 120,
      dataIndex: 'workcellId',
      render: (value, record) =>
        ['create', 'update'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator('workcellId', {
              initialValue: value,
              rules: [
                {
                  required: record.$form.getFieldValue('type') === 'SN_DATA',
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${commonModelPrompt}.type`).d('当前工序'),
                  }),
                },
              ],
            })(
              <Lov
                code="HME.FINAL_PROCESS"
                queryParams={{ tenantId }}
                textValue={record.workcellName}
                lovOptions={{ displayField: 'workcellName', valueField: 'workcellId' }}
              />
            )}
          </Form.Item>
        ) : (
          record.workcellName
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
