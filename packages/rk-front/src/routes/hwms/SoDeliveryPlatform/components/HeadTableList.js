/*
 * @Description: 头数据
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-12-09 13:45:36
 * @LastEditTime: 2020-12-14 20:56:57
 */
import React from "react";
import { Table } from 'hzero-ui';

export default class HeadTableList extends React.PureComponent {

  render() {
    const {
      loading,
      dataSource,
      pagination,
      selectedHeadKeys,
      onSelectHead,
      onSearch,
      handleCreate,
      handleHeadCancel,
    } = this.props;
    const columns = [
      {
        title: '工厂',
        dataIndex: 'siteCode',
        width: 70,
        align: 'center',
      },
      {
        title: '出货单号',
        dataIndex: 'instructionDocNum',
        width: 100,
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'instructionDocStatusMeaning',
        width: 100,
        align: 'center',
      },
      {
        title: '客户编码',
        dataIndex: 'customerCode',
        width: 100,
        align: 'center',
      },
      {
        title: '客户名称',
        dataIndex: 'customerName',
        width: 100,
        align: 'center',
      },
      {
        title: '计划发货日期',
        dataIndex: 'demandTime',
        width: 130,
        align: 'center',
      },
      {
        title: '送货地址',
        dataIndex: 'deliveryAddress',
        width: 100,
        align: 'center',
      },
      {
        title: '请求交货日期',
        dataIndex: 'expectedArrivalTime',
        width: 130,
        align: 'center',
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 100,
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'operator',
        width: 120,
        align: 'center',
        render: (val, record) => (
          <span className="action-link">
            <a onClick={() => handleCreate(record)}>
              打印
            </a>
            {record.instructionDocType === 'NO_SO_DELIVERY' && record.instructionDocStatus === 'NEW' && (
              <a onClick={() => handleCreate(record.instructionDocId)}>
                编辑
              </a>
            )}
            {record.instructionDocType === 'NO_SO_DELIVERY' && record.instructionDocStatus === 'NEW' && (
              <a onClick={() => handleHeadCancel(record)} disabled={record.instructionDocStatus === 'CANCEL'}>
              取消
              </a>
            )}
          </span>
        ),
      },
    ];
    return (
      <Table
        bordered
        rowKey="inspectionSchemeId"
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        rowSelection={{
          selectedRowKeys: selectedHeadKeys,
          type: 'radio', // 单选
          width: 50,
          onChange: onSelectHead,
        }}
        onChange={page => onSearch(page)}
      />
    );
  }

}