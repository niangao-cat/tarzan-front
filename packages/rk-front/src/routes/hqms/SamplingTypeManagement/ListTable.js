/*
 * @Description: 抽样类型管理
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-05-07 11:48:55
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-05-13 16:04:12
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
    const { loading, dataSource, onSearch, handleUpdateData, pagination } = this.props;
    const columns = [
      {
        title: '抽样方式编码',
        dataIndex: 'sampleTypeCode',
        width: 200,
        align: 'center',
        render: (text, record) => <a onClick={() => handleUpdateData(record)}>{text}</a>,
      },
      {
        title: '抽样方式描述',
        dataIndex: 'sampleTypeDesc',
        width: 150,
        align: 'center',
      },
      {
        title: '抽样类型',
        dataIndex: 'sampleTypeMeaning',
        width: 200,
        align: 'center',
      },
      {
        title: '参数值',
        dataIndex: 'parameters',
        width: 150,
        align: 'center',
      },
      {
        title: '抽样标准',
        dataIndex: 'sampleStandardMeaning',
        width: 150,
        align: 'center',
      },
      {
        title: 'AQL',
        dataIndex: 'acceptanceQuantityLimit',
        width: 150,
        align: 'center',
      },
      {
        title: '检验水平',
        dataIndex: 'inspectionLevelsMeaning',
        width: 100,
        align: 'center',
      },
      {
        title: '有效性',
        dataIndex: 'enableFlag',
        width: 100,
        align: 'center',
        render: (val, record) => {
          if (record.enableFlag === 'Y') {
            return <span>是</span>;
          } else {
            return <span>否</span>;
          }
        },
      },
    ];
    return (
      <Table
        bordered
        rowKey="cid"
        columns={columns}
        loading={loading}
        dataSource={dataSource}
        pagination={pagination}
        onChange={page => onSearch(page)}
        // onRow={record => {
        //   return {
        //     onClick: () => handleUpdateData(record), // 点击行
        //   };
        // }}
      />
    );
  }
}
export default ListTable;
