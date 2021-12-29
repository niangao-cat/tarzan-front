/*
 * @Description: 投入盒子列表
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-11-03 10:04:53
 * @LastEditTime: 2020-11-30 16:07:01
 */

import React, { Component } from 'react';
import { Table } from 'hzero-ui';
// import { Table } from 'choerodon-ui';
import { Bind } from 'lodash-decorators';
import { tableScrollWidth } from 'utils/utils';
import styles from '../index.less';

export default class BoxList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: {},
    };
  }

  @Bind()
  handleClickRow(record) {
    const { selectedRows } = this.state;
    if (selectedRows.eoJobSnId === record.eoJobSnId) {
      return styles['data-click'];
    } else {
      return '';
    }
  }

  @Bind
  fetchNcList(record) {
    const { fetchNcList } = this.props;
    this.setState({
      selectedRows: record,
    }, () => fetchNcList(record));
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
      handleSelect,
    } = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'sequence',
        render: (value, record, index) => index + 1,
        width: 60,
        align: 'center',
      },
      {
        title: '条码',
        dataIndex: 'materialLotCode',
        width: 120,
        render: (val, record) => (
          <a className="action-link" onClick={() => this.fetchNcList(record)}>
            {val}
          </a>
        ),
      },
      {
        title: '数量',
        dataIndex: 'snQty',
        width: 60,
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 60,
        align: 'center',
      },
    ];
    return (
      <Table
        className={styles['box-list']}
        bordered
        rowKey="eoJobSnId"
        filterBar={false}
        columns={columns}
        loading={loading}
        dataSource={dataSource}
        resizable
        pagination={false}
        scroll={{ x: tableScrollWidth(columns), y: 300 }}
        rowClassName={this.handleClickRow}
        rowSelection={{
          selectedRowKeys,
          onChange: handleSelect,
          getCheckboxProps: record => ({
            disabled: record.statusFlag === 'Y',
          }),
        }}
      />
    );
  }
}
