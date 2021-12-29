import React from 'react';
import { Form, Input } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import EditTable from 'components/EditTable';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';


export default class HeadList extends React.Component {

  @Bind()
  handleEdit(record, flag) {
    const { onEdit } = this.props;
    if (onEdit) {
      onEdit('dataList', 'stocktakeId', record, flag);
    }
  }

  @Bind
  handleSave(record) {
    const { onSave } = this.props;
    if (onSave) {
      onSave(record);
    }
  }

  render() {
    const { loading, pagination, dataSource, rowsSelection, onSearch } = this.props;
    // 设置显示数据
    const columns = [
      {
        title: '盘点单号',
        dataIndex: 'stocktakeNum',
        align: 'center',
      },
      {
        title: '单据状态',
        dataIndex: 'stocktakeStatusMeaning',
        align: 'center',
      },
      {
        title: '盘点类型',
        dataIndex: 'stocktakeTypeMeaning',
        align: 'center',
      },
      {
        title: '盘点范围',
        dataIndex: 'stocktakeRange',
        align: 'center',
      },
      {
        title: '台账类别',
        dataIndex: 'ledgerTypeMeaning',
        align: 'center',
      },
      {
        title: '保管部门',
        dataIndex: 'businessName',
        align: 'center',
      },
      {
        title: '入账日期从',
        dataIndex: 'postingDateFrom',
        align: 'center',
      },
      {
        title: '入账日期至',
        dataIndex: 'postingDateTo',
        align: 'center',
      },
      {
        title: '创建日期',
        dataIndex: 'creationDate',
        align: 'center',
      },
      {
        title: intl.get(`remark`).d('单据备注'),
        dataIndex: 'remark',
        width: 100,
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`remark`, {
                initialValue: val,
              })(<Input />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        align: 'center',
        fixed: 'right',
        width: 100,
        render: (val, record) =>
          record._status === 'update' ? (
            <span>
              <a onClick={() => this.handleEdit(record, false)}>取消</a>&nbsp;&nbsp;
              <a onClick={() => this.handleSave(record)}>保存</a>
            </span>
          ) : (
            <a onClick={() => this.handleEdit(record, true)}>编辑</a>
          ),
      },
    ];

    return (
      <EditTable
        bordered
        dataSource={dataSource}
        rowKey="stocktakeId"
        columns={columns}
        rowSelection={rowsSelection}
        pagination={pagination}
        onChange={onSearch}
        loading={loading}
        scroll={{ x: tableScrollWidth(columns) }}
      />
    );
  }
}
