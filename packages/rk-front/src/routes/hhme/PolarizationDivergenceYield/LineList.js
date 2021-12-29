import React from 'react';
import { Form, Input, InputNumber, Button } from 'hzero-ui';
// import { min, max } from 'lodash';

import intl from 'utils/intl';
import EditTable from 'components/EditTable';

import { tableScrollWidth } from 'utils/utils';


const commonModelPrompt = 'tarzan.hmes.purchaseOrder';

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

  // const handleValidateTestSum = (rule, value, callback, record) => {
  //   const { selectedRows, dataSource } = props;
  //   const maxTestSumList = dataSource.filter(e => e.lineId !== record.lineId).map(e => e.testSumQty);
  //   const minTestSum = min(maxTestSumList);
  //   if (value <= minTestSum) {
  //     callback('当前优先级需大于已存在的优先级');
  //   }
  //   if (dataSource.length === 1 && dataSource[0]._status === 'create' && value <= selectedRows[0].testQty) {
  //     callback('测试总量需要大于测试数量');
  //   }
  //   callback();
  // };

  // const handleValidatePriority = (rule, value, callback) => {
  //   const { dataSource } = props;
  //   const maxPriorityList = dataSource.map(e => e.priority);
  //   const minPriority = max(maxPriorityList);
  //   if (value <= minPriority) {
  //     callback('当前优先级需大于已存在的优先级');
  //   }
  //   callback();
  // };

  const { loading, dataSource, rowSelection, canEdit, pagination } = props;
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
      title: intl.get(`${commonModelPrompt}.addPassRate`).d('目标良率'),
      width: 100,
      dataIndex: 'addPassRate',
      render: (value, record) =>
        ['create', 'update'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator('addPassRate', {
              initialValue: value,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${commonModelPrompt}.addPassRate`).d('目标良率'),
                  }),
                },
              ],
            })(
              <InputNumber
                precision={2}
                min={0}
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
      title: intl.get(`${commonModelPrompt}.testSumQty`).d('测试总量'),
      width: 120,
      dataIndex: 'testSumQty',
      render: (value, record) =>
        ['create', 'update'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator('testSumQty', {
              initialValue: value,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${commonModelPrompt}.testSumQty`).d('测试总量'),
                  }),
                },
                // {
                //   validator: (rule, val, callback) => handleValidateTestSum(rule, val, callback, record),
                // },
              ],
            })(<InputNumber min={0} style={{ width: '100%' }} />)}
          </Form.Item>
        ) : (
          value
        ),
    },
    {
      title: intl.get(`${commonModelPrompt}.priority`).d('优先级'),
      width: 120,
      dataIndex: 'priority',
      render: (value, record) =>
        ['create', 'update'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator('priority', {
              initialValue: value,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${commonModelPrompt}.priority`).d('优先级'),
                  }),
                },
                // {
                //   validator: handleValidatePriority,
                // },
              ],
            })(
              <InputNumber
                precision={0}
                min={0}
                style={{ width: '100%' }}
              />)}
          </Form.Item>
        ) : (
          value
        ),
    },
    {
      title: intl.get(`${commonModelPrompt}.remark`).d('备注'),
      width: 120,
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
