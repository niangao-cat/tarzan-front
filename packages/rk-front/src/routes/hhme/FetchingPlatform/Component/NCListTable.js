/*
 * @Description: 不良明细列表
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-11-03 10:08:19
 * @LastEditTime: 2020-11-03 17:03:13
 */

import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import styles from '../index.less';

export default class NCListTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * nc页面渲染
   * @returns {*}
   */
  render() {
    const {
      loading,
      dataSource,
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
        title: '位置',
        dataIndex: 'position',
        width: 70,
      },
      {
        title: '不良代码',
        dataIndex: 'ncCode',
        width: 90,
      },
      {
        title: '不良描述',
        dataIndex: 'description',
        width: 90,
      },
    ];
    return (
      <Table
        className={styles['fetching-platform-bottom-left-nctable']}
        bordered
        rowKey="materialLotId"
        columns={columns}
        loading={loading}
        dataSource={dataSource}
        pagination={false}
        scroll={{ y: 300 }}
      />
    );
  }
}
