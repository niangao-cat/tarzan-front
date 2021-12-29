/*
 * @Description: 组件物料
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-09-23 10:36:27
 * @LastEditTime: 2020-09-23 14:53:40
 */

import React, { Component } from 'react';
import { Modal, Form, Table } from 'hzero-ui';
import { connect } from 'dva';
import styles from '../index.less';

@connect(({ incomingMaterialEntry }) => ({
  incomingMaterialEntry,
}))
@Form.create({ fieldNameProp: null })
export default class MainMaterialModal extends Component {
  constructor(props) {
    super(props);
    const { onRef } = props;
    if (onRef) onRef(this);
  }

  componentDidMount() {
  }

  render() {
    const {
      visible,
      onCancel,
      dataSource,
      loading,
      onSearch,
    } = this.props;
    const columns = [
      {
        title: '物料编码',
        width: 100,
        dataIndex: 'materialCode',
      },
      {
        title: '物料描述',
        width: 100,
        dataIndex: 'materialName',
      },
      {
        title: '组件数量',
        width: 90,
        dataIndex: 'qty',
      },
    ];
    return (
      <Modal
        destroyOnClose
        width={600}
        title='组件物料'
        visible={visible}
        onCancel={() => onCancel({}, false)}
        // onOk={this.handleOK}
        footer={null}
        wrapClassName={styles['enter-modal']}
      >
        <Table
          bordered
          rowKey="instructionId"
          loading={loading}
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          onChange={page => onSearch(page)}
        />
      </Modal>
    );
  }
}
