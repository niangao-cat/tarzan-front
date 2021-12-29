/**
 * 计划外投料
 * @date: 2020/07/15 19:25:36
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component, Fragment } from 'react';
import { Modal, Table } from 'hzero-ui';

export default class SnDataModal extends Component {


  render() {
    const { dataSource = [], loading, visible, onCancel } = this.props;
    const columns = [
      {
        title: '来源工序',
        width: 50,
        dataIndex: 'sourceProcessName',
      },
      {
        title: '数据项',
        width: 50,
        dataIndex: 'tagDescription',
      },
      {
        title: '下限',
        width: 50,
        dataIndex: 'minimumValue',
      },
      {
        title: '上限',
        dataIndex: 'maximalValue',
        width: 50,
      },
      {
        title: '结果',
        dataIndex: 'result',
        width: 50,
      },
      {
        title: '单位',
        dataIndex: 'uomName',
        width: 50,
      },
    ];
    return (
      <Fragment>
        <Modal
          width={1100}
          title='当前SN数据'
          visible={visible}
          onCancel={onCancel}
          footer={null}
        >
          <Table
            bordered
            loading={loading}
            rowKey="eoId"
            dataSource={dataSource}
            columns={columns}
            pagination={false}
          />
        </Modal>
      </Fragment>
    );
  }
}
