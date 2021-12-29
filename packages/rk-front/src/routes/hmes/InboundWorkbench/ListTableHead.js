/*
 * @Description: 入库单头明细
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-13 16:30:50
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-04-14 12:07:08
 * @Copyright: Copyright (c) 2019 Hand
 */
import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';

class ListTableHead extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 1,
    };
  }

  render() {
    const commonModelPrompt = '';
    const {
      loading,
      dataSource,
      pagination,
      selectedHeadKeys,
      onSelectHead,
      onSearch,
    } = this.props;
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
        title: '入库单号',
        align: 'center',
        width: 120,
        dataIndex: 'instructionDocNum',
      },
      {
        title: intl.get(`${commonModelPrompt}.status`).d('状态'),
        width: 70,
        dataIndex: 'status',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.siteName`).d('工厂'),
        width: 100,
        dataIndex: 'siteName',
        align: 'center',
      },
      {
        title: '事业部',
        width: 100,
        dataIndex: 'departmentName',
        align: 'center',
      },
      {
        title: '车间',
        width: 100,
        dataIndex: 'workshop',
        align: 'center',
      },
      {
        title: '创建人',
        width: 90,
        dataIndex: 'createBy',
        align: 'center',
      },
      {
        title: '创建时间',
        width: 100,
        dataIndex: 'createDate',
        align: 'center',
      },
      {
        title: '修改人',
        width: 90,
        dataIndex: 'lastUpdatedByName',
        align: 'center',
      },
      {
        title: '修改时间',
        width: 100,
        dataIndex: 'lastUpdateDate',
        align: 'center',
      },
    ];
    return (
      <Table
        bordered
        rowKey="instructionDocId"
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns, 50), y: 250 }}
        rowSelection={{
          selectedHeadKeys,
          type: 'radio', // 单选
          onChange: onSelectHead,
        }}
        onChange={page => onSearch(page)}
      />
    );
  }
}

export default ListTableHead;
