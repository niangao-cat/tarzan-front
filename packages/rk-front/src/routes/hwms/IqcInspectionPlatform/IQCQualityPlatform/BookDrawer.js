/**
 * ywj
 */

import React, { Component } from 'react';
import { Modal, Form, Table } from 'hzero-ui';
import {
} from 'utils/constants';
@Form.create({ fieldNameProp: null })
export default class UpdateCodeDrawer extends Component {

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const {
      visible,
      onClose,
      loading,
      dataSource,
      onShowBookDetail,
    } = this.props;
    // 获取表单的字段属性
    const columns = [
      {
        title: '序号',
        dataIndex: 'orderSeq',
        render: (val, record, index) => index + 1,
      },
      {
        title: '文件地址',
        dataIndex: 'fileUrl',
        render: (val, record) =>
        (<a onClick={() => onShowBookDetail(record)}>{val}</a>),
      },
    ];
    // 获取表单的字段属性
    return (
      <Modal
        destroyOnClose
        width={500}
        onCancel={() => onClose()}
        visible={visible}
        footer={null}
        title="文件地址"
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Table
          rowKey="materialLotId"
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          bordered
        />
      </Modal>
    );
  }
}
