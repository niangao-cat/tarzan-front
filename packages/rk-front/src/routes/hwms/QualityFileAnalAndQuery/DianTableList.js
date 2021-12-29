/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 电学质量文件
 */
import React, { Component } from 'react';
import { Table } from 'hzero-ui';

class TableList extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const { colMap, loading, dataSource, pagination, onSearch } = this.props;
    // 设置显示数据
    const columns = [
      {
        title: '序号',
        dataIndex: 'orderSeq',
        width: 90,
        render: (val, record, index) => index + 1,
      },
      {
        title: '类型',
        dataIndex: 'qaTypeMeaning',
        width: 90,
      },
      {
        title: '工单',
        dataIndex: 'workOrderNum',
        width: 150,
      },
      {
        title: 'SN',
        dataIndex: 'materialLotCode',
        width: 150,
      },
      {
        title: '物料',
        dataIndex: 'materialCode',
        width: 90,
      },
      {
        title: '物料描述',
        dataIndex: 'materialName',
        width: 90,
      },
      {
        title: '数量',
        dataIndex: 'quantity',
        width: 90,
      },
      ...colMap.map((item, index)=>{
        return {
          title: item,
          dataIndex: `${(index)}`,
          width: 90,
        };
      }),
    ];
    return (
      <Table
        bordered
        columns={columns}
        loading={loading}
        dataSource={dataSource}
        pagination={pagination}
        onChange={page => onSearch(page)}
      />
    );
  }
}
export default TableList;
