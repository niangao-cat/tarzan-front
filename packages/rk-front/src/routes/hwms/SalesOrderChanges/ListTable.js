/*
 * @Description: IQC免检
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-29 10:06:59
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-09-21 22:17:54
 * @Copyright: Copyright (c) 2019 Hand
 */
import React, { Component } from 'react';
import { Form, Input } from 'hzero-ui';
import EditTable from 'components/EditTable';
import { tableScrollWidth } from 'utils/utils';

@Form.create({ fieldNameProp: null })
class ListTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  limit = value => {
    return value.replace(/^(0+)|[^\d]+/g, '');
  };

  /**
   * 页面渲染
   * @returns {*}
   */
  render() {
    const {
      dataSource,
      fetchLoading,
      pagination,
      onSearch,
      selectedRowKeys,
      handleSelect,
      handleEditLine,
    } = this.props;
    const columns = [
      {
        title: '实物条码',
        dataIndex: 'materialLotCode',
        fixed: 'left',
        width: 150,
        align: 'center',
      },
      {
        title: '物料编码',
        dataIndex: 'materialCode',
        width: 100,
        align: 'center',
      },
      {
        title: '物料描述',
        dataIndex: 'materialName',
        width: 100,
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'statusMeaning',
        width: 80,
        align: 'center',
      },
      {
        title: '数量',
        dataIndex: 'qty',
        width: 80,
        align: 'center',
      },
      {
        title: '单位',
        dataIndex: 'uomCode',
        width: 80,
        align: 'center',
      },
      {
        title: '批次',
        dataIndex: 'lot',
        width: 80,
        align: 'center',
      },
      {
        title: '质量状态',
        dataIndex: 'qualityStatusMeaning',
        width: 100,
        align: 'center',
      },
      {
        title: '工厂',
        dataIndex: 'siteName',
        width: 100,
        align: 'center',
      },
      {
        title: '仓库',
        dataIndex: 'warehouseCode',
        width: 100,
        align: 'center',
      },
      {
        title: '货位',
        dataIndex: 'locatorCode',
        width: 100,
        align: 'center',
      },
      {
        title: '销售订单号',
        dataIndex: 'soNum',
        width: 130,
        align: 'center',
      },
      {
        title: '销售订单行号',
        dataIndex: 'soLineNum',
        width: 130,
        align: 'center',
      },
      {
        title: '目标销售订单号',
        dataIndex: 'transferSoNum',
        width: 130,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`transferSoNum`, {
                rules: [
                  {
                    required: true,
                    message: '目标销售订单号不能为空',
                  },
                ],
                initialValue: record.transferSoNum,
              })(
                <Input />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '目标销售订单行号',
        dataIndex: 'transferSoLineNum',
        width: 130,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`transferSoLineNum`, {
                rules: [
                  {
                    required: true,
                    message: '目标销售订单行号不能为空',
                  },
                ],
                initialValue: record.transferSoLineNum,
              })(
                <Input />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '操作',
        dataIndex: 'operator',
        width: 100,
        align: 'center',
        fixed: 'right',
        render: (val, record) => (
          <span className="action-link">
            {record._status === 'update' && (
              <a onClick={() => handleEditLine(record, false)}>
                取消
              </a>
            )}
            {!(record._status === 'create') && !(record._status === 'update') && (
              <a onClick={() => handleEditLine(record, true)}>
                编辑
              </a>
            )}
          </span>
        ),
      },
    ];
    return (
      <EditTable
        bordered
        rowKey="materialLotCode"
        columns={columns}
        loading={fetchLoading}
        dataSource={dataSource}
        scroll={{ x: tableScrollWidth(columns) }}
        pagination={pagination}
        onChange={page => onSearch(page)}
        rowSelection={{
          selectedRowKey: selectedRowKeys,
          onChange: handleSelect,
        }}
      />
    );
  }
}
export default ListTable;
