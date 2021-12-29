/*
 * @Description: 头数据
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-09-21 09:40:49
 * @LastEditTime: 2020-09-25 14:29:52
 */

import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import { tableScrollWidth } from 'utils/utils';
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
      onSearch,
      pagination,
      selectedHeadKeys,
      onSelectHead,
      handleUpdateHeadData,
    } = this.props;
    const columns = [
      {
        title: '数据项',
        dataIndex: 'tagCode',
        width: 100,
        align: 'center',
        render: (text, record) => <a onClick={() => handleUpdateHeadData(record, true)}>{text}</a>,
      },
      {
        title: '数据项描述',
        dataIndex: 'tagDesc',
        width: 100,
        align: 'center',
      },
      {
        title: '数据组编码',
        dataIndex: 'tagGroupCode',
        width: 100,
        align: 'center',
      },
      {
        title: '数据组描述',
        dataIndex: 'tagGroupDesc',
        width: 100,
        align: 'center',
      },
      {
        title: '工艺编码',
        dataIndex: 'operationCode',
        width: 100,
        align: 'center',
      },
      {
        title: '工艺描述',
        dataIndex: 'operationDesc',
        width: 100,
        align: 'center',
      },
      // {
      //   title: '公式类型',
      //   dataIndex: 'formulaType',
      //   width: 100,
      //   align: 'center',
      // },
      {
        title: '公式',
        dataIndex: 'formula',
        width: 100,
        align: 'center',
      },
    ];
    return (
      <Table
        bordered
        rowKey="tagFormulaHeadId"
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
        }}
      />
    );
  }
}
export default ListTable;
