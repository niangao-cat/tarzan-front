/*
 * @Description: 物料
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @Date: 2020-07-14 10:15:44
 * @LastEditTime: 2020-10-10 15:09:53
 */

import React, { Component } from 'react';
import { Table, Row, Button, Col } from 'hzero-ui';

import Title from './Title';
import styles from '../index.less';

export default class ItemList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { dataSource = [], loading } = this.props;
    const titleProps = {
      titleValue: '物料',
    };
    const columns = [
      {
        title: '序号',
        width: 30,
        dataIndex: 'lineNum',
        align: 'center',
      },
      {
        title: '物料名称',
        width: 50,
        dataIndex: 'materialName',
        align: 'center',
      },
      {
        title: '物料编码',
        width: 40,
        dataIndex: 'materialCode',
        align: 'center',
      },
      {
        title: 'SN/Lot Num',
        width: 50,
        dataIndex: 'materialLotCode',
        align: 'center',
      },
      {
        title: '数量',
        width: 50,
        dataIndex: 'releaseQty',
        align: 'center',
      },
      {
        title: '供应商批次',
        width: 50,
        dataIndex: 'supplierLot',
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
              <Button disabled>IQC检验</Button>
              <Button style={{ marginRight: '10px' }} disabled>采购信息</Button>
            </div>
          </Col>
        </Row>
        <Table
          bordered
          loading={loading}
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          scroll={{ y: 250 }}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}
