/*
 * @Description: 异常信息
 * @Version: 0.0.1
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-06-07 18:10:19
 * @LastEditTime: 2020-07-16 15:49:52
 */
import React, { Component } from 'react';
import { Table } from 'hzero-ui';

import Title from './Title';
import styles from '../index.less';

export default class ErrorInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { dataSource = [], loading } = this.props;
    const titleProps = {
      titleValue: '异常信息',
    };
    const columns = [
      {
        title: '序号',
        width: 30,
        dataIndex: 'orderSeq',
        align: 'center',
        render: (value, record, index) => index + 1,
      },
      {
        title: '异常事项',
        width: 30,
        dataIndex: 'equipmentnName',
        align: 'center',
      },
      {
        title: '异常描述',
        width: 100,
        dataIndex: 'errorDes',
        align: 'center',
      },
      {
        title: '发生时间',
        width: 50,
        dataIndex: 'occurrenceTime',
        align: 'center',
      },
      {
        title: '完成时间',
        width: 50,
        dataIndex: 'completedTime',
        align: 'center',
      },
      {
        title: '申报人',
        width: 30,
        dataIndex: 'notifierName',
        align: 'center',
      },
      {
        title: '处理人',
        width: 30,
        dataIndex: 'handlerName',
        align: 'center',
      },
    ];
    return (
      <div className={styles['data-content-product-traceability']}>
        <Title {...titleProps} />
        <Table
          loading={loading}
          rowKey="id"
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}
