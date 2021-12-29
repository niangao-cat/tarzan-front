
import React, { PureComponent } from 'react';
// import { connect } from 'dva';
import { Modal, Table } from 'hzero-ui';
import intl from 'utils/intl';

const commonModelPrompt = 'tarzan.common.components.model.components';

export default class AttributeDrawer extends PureComponent {

  render() {
    const { visible = false, onCancel, pagination, dataSource, loading, handleSearch } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.orderSeq`).d('序号'),
        width: 60,
        dataIndex: 'orderSeq',
        render: (text, data, index) => {
          const { pageSize, current } = pagination;
          return pageSize * (current - 1) + index + 1;
        },
      },
      {
        title: '条码',
        width: 120,
        dataIndex: 'materialLotCode',
      },
      {
        title: '状态',
        width: 80,
        dataIndex: 'materialLotStatusMeaning',
      },
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
        title: '数量',
        width: 90,
        dataIndex: 'primaryUomQty',
      },
      {
        title: '批次',
        width: 120,
        dataIndex: 'lot',
      },
      {
        title: '供应商批次',
        width: 120,
        dataIndex: 'supplierLot',
      },
      {
        title: '仓库',
        dataIndex: 'warehouseCode',
        width: 100,
      },
      {
        title: '货位',
        width: 100,
        dataIndex: 'materialLotLocatorCode',
      },
      {
        title: '有效性',
        width: 90,
        dataIndex: 'enableFlagMeaning',
      },
      {
        title: '实际存储货位',
        width: 120,
        dataIndex: 'actualLocatorCode',
      },
    ];

    return (
      <Modal
        destroyOnClose
        width={1000}
        title='明细'
        visible={visible}
        onCancel={() => onCancel(false, {})}
        footer={null}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        placement="right"
        maskClosable
      >
        <Table
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={pagination}
          onChange={page => handleSearch(page)}
          loading={loading}
          rowKey="instructionId"
        />
      </Modal>
    );
  }
}
