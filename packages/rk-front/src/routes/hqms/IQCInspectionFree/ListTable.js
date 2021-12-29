/*
 * @Description: IQC免检
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-29 10:06:59
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-05-13 16:04:24
 * @Copyright: Copyright (c) 2019 Hand
 */
import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import formatterCollections from 'utils/intl/formatterCollections';

@formatterCollections({ code: 'hwms.barcodeQuery' })
class ListTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * 页面渲染
   * @returns {*}
   */
  render() {
    const {
      loading,
      dataSource,
      selectedRowKeys,
      onSelectRow,
      onSearch,
      handleAddFreeData,
      pagination,
    } = this.props;
    const columns = [
      {
        title: '工厂',
        dataIndex: 'siteName',
        width: 200,
      },
      {
        title: '类型',
        dataIndex: 'exemptionTypeName',
        width: 200,
      },
      {
        title: '物料编码',
        dataIndex: 'materialCode',
        width: 150,
        render: (text, record) => <a onClick={() => handleAddFreeData(record)}>{text}</a>,
      },
      {
        title: '物料描述',
        dataIndex: 'materialName',
        width: 200,
      },
      {
        title: '供应商编码',
        dataIndex: 'supplierCode',
        width: 150,
      },
      {
        title: '供应商描述',
        dataIndex: 'supplierName',
        width: 150,
      },
      {
        title: '供应商地址',
        dataIndex: 'supplierName',
        width: 150,
      },
      {
        title: '是否免检',
        dataIndex: 'exemptionFlagMeaning',
        width: 100,
        align: 'center',
      },
      {
        title: '是否有效',
        dataIndex: 'enableFlagMeaning',
        width: 100,
        align: 'center',
      },
    ];
    return (
      <Table
        bordered
        rowKey="materialLotId"
        columns={columns}
        loading={loading}
        dataSource={dataSource}
        pagination={pagination}
        rowSelection={{
          fixed: true,
          selectedRowKeys,
          onChange: onSelectRow,
        }}
        onChange={page => onSearch(page)}
        // onRow={record => {
        //   return {
        //     onClick: () => handleAddFreeData(record), // 点击行
        //   };
        // }}
      />
    );
  }
}
export default ListTable;
