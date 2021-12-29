/*
 * @Description: 入库物料行明细
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-13 16:30:50
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-04-14 15:47:42
 * @Copyright: Copyright (c) 2019 Hand
 */
import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';

class ListTableRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 1,
    };
  }

  render() {
    const commonModelPrompt = '';
    const { loading, dataSource, pagination, selectedRowKeys, onSelectRow, onSearch } = this.props;
    const columns = [
      {
        title: '序号',
        width: 60,
        align: 'center',
        dataIndex: 'orderSeq',
        render: (text, record, index) => (
          <span>{(this.state.currentIndex - 1) * 10 + (index + 1)}</span>
        ),
      },
      {
        title: '物料编码',
        width: 150,
        align: 'center',
        dataIndex: 'materialCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialName`).d('物料描述'),
        dataIndex: 'materialName',
        width: 150,
        align: 'center',
      },
      {
        title: '目标库位',
        dataIndex: 'targetLocator',
        width: 150,
        align: 'center',
      },
      {
        title: '入库数量',
        dataIndex: 'inLocatorQuantity',
        width: 90,
        align: 'center',
      },
    ];
    return (
      <Table
        bordered
        rowKey="instructionId"
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns, 50), y: 250 }}
        rowSelection={{
          selectedRowKeys,
          type: 'radio', // 单选
          onChange: onSelectRow,
        }}
        onChange={page => onSearch(page)}
      />
    );
  }
}

export default ListTableRow;
