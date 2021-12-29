import React, { Component } from 'react';
import { Table, Modal} from 'hzero-ui';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';

const modelPrompt = 'hwms.barcodeQuery.model.barcodeQuery';

export default class JournalQueryHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {
      loading,
      visible,
      onCancel,
      dataSource,
      pagination,
    } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.materialCode`).d('物料编码'),
        width: 150,
        dataIndex: 'materialCode',
        align: 'left',
        fixed: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.materialDesc`).d('物料描述'),
        width: 160,
        dataIndex: 'materialDesc',
        align: 'left',
        fixed: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.eventTime`).d('库存变化时间'),
        dataIndex: 'eventTime',
        width: 150,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.changeQuantity`).d('库存变化数量'),
        dataIndex: 'changeQuantity',
        width: 120,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.onhandQuantity`).d('库存变化后数量'),
        dataIndex: 'onhandQuantity',
        width: 130,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.warehouseCode`).d('仓库编码'),
        dataIndex: 'warehouseCode',
        width: 120,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.warehouseDesc`).d('仓库描述'),
        dataIndex: 'warehouseDesc',
        width: 160,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.locatorCode`).d('库位编码'),
        dataIndex: 'locatorCode',
        width: 120,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.locatorDesc`).d('库位描述'),
        dataIndex: 'locatorDesc',
        width: 160,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.lotCode`).d('批次号'),
        dataIndex: 'lotCode',
        width: 90,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.ownerType`).d('所有者类型'),
        dataIndex: 'ownerTypeDesc',
        width: 110,
        align: 'left',
        render: val => val || '自有',
      },
      {
        title: intl.get(`${modelPrompt}.ownerCode`).d('所有者编码'),
        dataIndex: 'ownerCode',
        width: 100,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.ownerDesc`).d('所有者描述'),
        dataIndex: 'ownerDesc',
        width: 160,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.eventType`).d('事件类型'),
        dataIndex: 'eventType',
        width: 150,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.eventTypeDesc`).d('事件类型描述'),
        dataIndex: 'eventTypeDesc',
        width: 120,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.eventId`).d('事件主键'),
        dataIndex: 'eventId',
        width: 90,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.eventByUserName`).d('操作人'),
        dataIndex: 'eventByUserName',
        width: 90,
        align: 'left',
      },
    ];
    return (
      <Modal
        destroyOnClose
        width={1360}
        title='明细'
        visible={visible}
        confirmLoading={loading}
        okText={intl.get('hzero.common.button.sure').d('确认')}
        cancelText={intl.get('hzero.common.button.cancel').d('取消')}
        onCancel={() => onCancel(false, {}, '')}
        // onOk={() => onCancel(false)}
        footer={null}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Table
          bordered
          rowKey="journalId"
          columns={columns}
          loading={loading}
          dataSource={dataSource}
          pagination={pagination}
          scroll={{ x: tableScrollWidth(columns) }}
          onChange={page => this.handleSearch(page)}
        />
      </Modal>
    );
  }
}
