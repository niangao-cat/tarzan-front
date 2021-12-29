
import React, { Component } from 'react';
import { Form, Table, Modal } from 'hzero-ui';


@Form.create({ fieldNameProp: null })
export default class TableList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      expandDrawer,
      detailList,
      onCancel,
    } = this.props;
    const columns = [
      {
        title: 'SN',
        width: 150,
        dataIndex: 'identification',
        align: 'center',
      },
      {
        title: '发现工位',
        width: 90,
        dataIndex: 'foundWorkcellName',
        align: 'center',
      },
      {
        title: '责任工位',
        width: 90,
        dataIndex: 'responsedWorkcellName',
        align: 'center',
      },
      {
        title: '不良分类',
        width: 90,
        dataIndex: 'ncTypeMeaning',
        align: 'center',
      },
      {
        title: '不良类型',
        width: 90,
        dataIndex: 'description',
        align: 'center',
      },
      {
        title: '不良代码',
        width: 90,
        dataIndex: 'ncCode',
        align: 'center',
      },
      {
        title: '不良状态',
        width: 90,
        dataIndex: 'ncStatusMeaning',
        align: 'center',
      },
      {
        title: '不良物料条码',
        width: 110,
        dataIndex: 'materialLotCode',
        align: 'center',
      },
      {
        title: '不良物料编码',
        width: 110,
        dataIndex: 'materialName',
        align: 'center',
      },
      {
        title: '备注',
        width: 80,
        dataIndex: 'comments',
        align: 'center',
      },
      {
        title: '处理意见',
        width: 90,
        dataIndex: 'disposeOpinion',
        align: 'center',
      },
      {
        title: '记录人',
        width: 80,
        dataIndex: 'userName',
        align: 'center',
      },
      {
        title: '记录时间',
        width: 90,
        dataIndex: 'dateTime',
        align: 'center',
      },
      {
        title: '处理人',
        width: 80,
        dataIndex: 'closedUserName',
        align: 'center',
      },
      {
        title: '处理时间',
        width: 90,
        dataIndex: 'closedDateTime',
        align: 'center',
      },
    ];
    return (
      <Modal
        confirmLoading={false}
        width={1200}
        visible={expandDrawer}
        onCancel={onCancel}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        footer={null}
      >
        <br />
        <Table
          dataSource={detailList}
          columns={columns}
        />
      </Modal>
    );
  }
}
