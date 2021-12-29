/*
 * @Description: 头数据
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-09-11 09:08:34
 * @LastEditTime: 2020-12-02 09:28:07
 */
import React from 'react';
import { Table, Spin } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { tableScrollWidth } from 'utils/utils';
import styles from './index.less';

export default class HeadTable extends React.Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      selectedRows: {},
    };
  }


  @Bind()
  handleClickRow(record) {
    const { selectedRows } = this.state;
    if (selectedRows.instructionDocId === record.instructionDocId) {
      return styles['inbound-order-query-head-data-click'];
    } else {
      return '';
    }
  }

  @Bind()
  handleClickSelectedRows(record) {
    const { handleFetchLineList } = this.props;
    return {
      onClick: () => {
        this.setState({ selectedRows: record });
        handleFetchLineList({}, record);
      },
    };
  }

  render() {
    const {
      loading,
      dataSource,
      pagination,
      onSearch,
      fetchHeadPrintLoading,
      rowHeadSelection,
    } = this.props;
    const { selectedRows = {} } = this.state;
    const columns = [
      {
        title: '工厂',
        width: 100,
        dataIndex: 'siteName',
      },
      {
        title: '入库单号',
        width: 100,
        dataIndex: 'receiptDocNum',
      },
      {
        title: '单据状态',
        width: 100,
        dataIndex: 'docStatusMeaning',
      },
      {
        title: '创建时间',
        width: 130,
        dataIndex: 'creationDate',
      },
      {
        title: '创建人',
        width: 100,
        dataIndex: 'createdByName',
      },
      {
        title: '备注',
        width: 120,
        dataIndex: 'remark',
      },
      // {
      //   title: '操作',
      //   dataIndex: 'operator',
      //   width: 80,
      //   align: 'center',
      //   render: (val, record, index) => (
      //     <span className="action-link">
      //       <a onClick={() => headPrint(record, index)}>
      //         {"打印"}
      //       </a>
      //     </span>
      //   ),
      // },
    ];
    return (
      <Spin spinning={fetchHeadPrintLoading ||false}>
        <Table
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={pagination}
          // scroll={{ x: tableScrollWidth(columns), y: 250 }}
          // scroll={{ y: 250 }}
          scroll={{ x: tableScrollWidth(columns), y: 250}}
          rowSelection={rowHeadSelection}
          onChange={page => onSearch(page, selectedRows)}
          loading={loading}
          rowClassName={this.handleClickRow}
          onRow={this.handleClickSelectedRows}
          rowKey="instructionDocId"
        />
      </Spin>
    );
  }
}
