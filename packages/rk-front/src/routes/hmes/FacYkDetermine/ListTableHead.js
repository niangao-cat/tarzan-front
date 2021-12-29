/*
 * @Description: 头数据
*  @Version: 0.0.1
 * @Autor: li.zhang13@hand-china.com
 * @Date: 2021-02-01 10:45:11
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
        title: '物料编码',
        dataIndex: 'materialCode',
        width: 100,
        align: 'center',
        render: (text, record) => <a onClick={() => handleUpdateHeadData(record, true)}>{text}</a>,
      },
      {
        title: '物料描述',
        dataIndex: 'materialName',
        width: 100,
        align: 'center',
      },
      {
        title: '芯片类型',
        dataIndex: 'cosType',
        width: 100,
        align: 'center',
      },
      {
        title: 'FAC物料编码',
        dataIndex: 'facMaterialCode',
        width: 100,
        align: 'center',
      },
      {
        title: 'FAC物料描述',
        dataIndex: 'facMaterialName',
        width: 100,
        align: 'center',
      },
      {
        title: '工位编码',
        dataIndex: 'workcellCode',
        width: 100,
        align: 'center',
      },
      {
        title: '工位描述',
        dataIndex: 'description',
        width: 100,
        align: 'center',
      },
      {
        title: '标准值',
        dataIndex: 'standardValue',
        width: 100,
        align: 'center',
      },
      {
        title: '允差',
        dataIndex: 'allowDiffer',
        width: 100,
        align: 'center',
      },
    ];
    return (
      <Table
        bordered
        rowKey="facYkId"
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
          width: 60,
        }}
      />
    );
  }
}
export default ListTableHead;
