/*
 * @Description: 头数据
*  @Version: 0.0.1
 * @Autor: li.zhang13@hand-china.com
 * @Date: 2021-01-21 09:36:44
 */

import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import { tableScrollWidth } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';

@formatterCollections({ code: 'hwms.barcodeQuery' })
class ListTableHead extends Component {
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
      onSearch,
      pagination,
      selectedHeadKeys,
      onSelectHead,
      handleUpdateHeadData,
    } = this.props;
    const columns = [
      {
        title: '物料',
        dataIndex: 'materialCode',
        align: 'center',
        render: (text, record) => <a onClick={() => handleUpdateHeadData(record, true)}>{text}</a>,
      },
      {
        title: '产品代码',
        dataIndex: 'productCode',
        align: 'center',
      },
      {
        title: 'COS型号',
        dataIndex: 'cosModel',
        align: 'center',
      },
      {
        title: '芯片组合',
        dataIndex: 'chipCombination',
        align: 'center',
      },
      {
        title: '工艺编码',
        dataIndex: 'operationName',
        align: 'center',
      },
      {
        title: '工艺描述',
        dataIndex: 'description',
        align: 'center',
      },
      {
        title: '工序编码',
        dataIndex: 'workcellCode',
        align: 'center',
      },
      {
        title: '工序描述',
        dataIndex: 'workcellName',
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'statusMeaning',
        align: 'center',
      },
    ];
    return (
      <Table
        bordered
        rowKey="headerId"
        columns={columns}
        loading={loading}
        dataSource={dataSource}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns) }}
        onChange={page => onSearch(page)}
        rowSelection={{
          type: 'radio',
          selectedRowKeys: selectedHeadKeys,
          onChange: onSelectHead,
          width: 80,
        }}
      />
    );
  }
}
export default ListTableHead;
