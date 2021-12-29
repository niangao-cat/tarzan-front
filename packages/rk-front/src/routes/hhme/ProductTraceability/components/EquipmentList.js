/*
 * @Description: 设备
 * @Version: 0.0.1
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-07-14 10:15:44
 * @LastEditTime: 2020-07-17 11:43:16
 */

import React, { Component } from 'react';
import { Table, Row, Button, Col } from 'hzero-ui';

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
      titleValue: '设备',
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
        title: '设备名称',
        width: 50,
        dataIndex: 'equipmentnName',
        align: 'center',
      },
      {
        title: '设备代码',
        width: 50,
        dataIndex: 'equipmentCode',
        align: 'center',
      },
      {
        title: '状态',
        width: 30,
        dataIndex: 'equipmentStatusMeaning',
        align: 'center',
      },
    ];
    return (
      <div className={styles['data-content-product-traceability']}>
        <Row>
          <Col span={12}>
            <Title {...titleProps} />
          </Col>
          <Col span={12}>
            <div className={styles['data-button']}>
              <Button disabled>履历</Button>
              <Button style={{ marginRight: '10px' }} disabled>点检</Button>
            </div>
          </Col>
        </Row>
        <Table
          loading={loading}
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          onChange={this.handleTableChange}
          bordered
          scroll={{ y: 250 }}
        />
      </div>
    );
  }
}
