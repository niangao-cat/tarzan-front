/**
 * author: ywj
 * des:不良代码指定工艺路线维护-历史
 */

import React, { Component } from 'react';
import { Modal, Form, Table } from 'hzero-ui';

@Form.create({ fieldNameProp: null })
export default class HistoryDrawer extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const { visible, hideHistory, onSearch, dataSource, pagination, loading, flagMap= [] } = this.props;
    const columns = [
      {
        title: '不良代码组编码',
        dataIndex: 'ncGroupCode',
      },
      {
        title: '不良代码组描述',
        dataIndex: 'ncGroupDescription',
      },
      {
        title: '不良代码编码',
        dataIndex: 'ncCode',
      },
      {
        title: '不良代码描述',
        dataIndex: 'ncCodeDescription',
      },
      {
        title: '产线编码',
        dataIndex: 'prodLineCode',
      },
      {
        title: '产线描述',
        dataIndex: 'prodLineDescription',
      },
      {
        title: '器件类型',
        dataIndex: 'deviceType',
      },
      {
        title: '芯片类型',
        dataIndex: 'chipType',
      },
      {
        title: '工艺路线编码',
        dataIndex: 'operationName',
      },
      {
        title: '最后正常工艺',
        dataIndex: 'routerName',
      },
      {
        title: '是否启用',
        dataIndex: 'enableFlag',
        render: val => (flagMap.filter(ele => ele.value === val)[0] || {}).meaning,
      },
      {
        title: '事件时间',
        dataIndex: 'creationDate',
      },
      {
        title: '事件创建人',
        dataIndex: 'loginName',
      },
    ];

    return (
      <Modal
        confirmLoading={false}
        width={1500}
        visible={visible}
        onCancel={() => hideHistory()}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        footer={null}
      >
        <br />
        <Table
          loading={loading}
          dataSource={dataSource}
          columns={columns}
          pagination={pagination}
          onChange={page => onSearch(page)}
          footer={null}
          bordered
        />
      </Modal>
    );
  }
}
