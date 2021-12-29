/*
 * @Description: 未进站返修sn列表
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-24 14:01:30
 * @LastEditTime: 2021-02-24 15:51:59
 */

import React, { PureComponent } from 'react';
import { Modal, Table } from 'hzero-ui';
import intl from 'utils/intl';

export default class SnListModal extends PureComponent {

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      visible,
      dataSource = [],
      // pagination,
      loading,
      onOk,
      onCancel,
    } = this.props;
    const columns = [
      {
        title: '设备编码',
        dataIndex: 'assetEncoding',
        width: 140,
      },
      {
        title: 'SN编码',
        dataIndex: 'snNum',
        width: 140,
      },
      {
        title: '返修标识',
        dataIndex: 'reworkFlag',
        width: 90,
        render: (val) => {
          if (val === 'Y') {
            return <span>是</span>;
          } else {
            return <span>否</span>;
          }
        },
      },
      {
        title: '指定返修标识',
        dataIndex: 'designedReworkFlag',
        width: 90,
        render: (val) => {
          if (val === 'Y') {
            return <span>是</span>;
          } else {
            return <span>否</span>;
          }
        },
      },
    ];
    return (
      <Modal
        destroyOnClose
        title='未进站返修SN列表'
        visible={visible}
        onOk={onOk}
        onCancel={() => onCancel(false)}
        okText={intl.get('hzero.common.button.save').d('保存')}
        cancelText={intl.get('hzero.common.button.cancel').d('取消')}
        width={700}
        footer={null}
      >
        <Table
          bordered
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          scroll={{ y: 400 }}
          onChange={page => this.handleSearch(page)}
        />
      </Modal>
    );
  }
}
