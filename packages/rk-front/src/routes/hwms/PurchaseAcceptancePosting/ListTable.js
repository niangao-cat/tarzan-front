import React from 'react';
import { Table } from 'hzero-ui';

import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';

const commonModelPrompt = 'tarzan.hmes.purchaseOrder';

export default class ListTable extends React.Component {

  @Bind()
  handleOpenDrawer(record, index, type) {
    const { onOpenModal, pagination } = this.props;
    const { pageSize, current } = pagination;
    const orderSeq = pageSize * (current - 1) + index + 1;
    if(onOpenModal) {
      onOpenModal({
        ...record,
        orderSeq,
      }, type);
    }
  }


  render() {
    const { loading, dataSource, pagination, onSearch, rowSelection } = this.props;
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
        title: intl.get(`${commonModelPrompt}.instructionDocNum`).d('送货单号'),
        width: 120,
        dataIndex: 'instructionDocNum',
        render: (val, data, index) => (
          <a onClick={() => this.handleOpenDrawer(data, index, 'INSTRUCTION')}>
            {`${val}-${data.instructionLineNum}`}
          </a>
        ),
      },
      {
        title: intl.get(`${commonModelPrompt}.instructionDocStatus`).d('送货单状态'),
        width: 100,
        dataIndex: 'instructionDocStatusMeaning',
      },
      {
        title: intl.get(`${commonModelPrompt}.instructionStatus`).d('行状态'),
        width: 100,
        dataIndex: 'instructionStatusMeaning',
      },
      {
        title: intl.get(`${commonModelPrompt}.iqcNumber`).d('检验单'),
        width: 150,
        dataIndex: 'iqcNumber',
      },
      {
        title: intl.get(`${commonModelPrompt}.inspectionStatusMeaning`).d('检验状态'),
        width: 80,
        dataIndex: 'inspectionStatusMeaning',
      },
      {
        title: intl.get(`${commonModelPrompt}.inspectionResultMeaning`).d('检验结果'),
        width: 120,
        dataIndex: 'inspectionResultMeaning',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialCode`).d('物料'),
        width: 100,
        dataIndex: 'materialCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialName`).d('物料描述'),
        width: 120,
        dataIndex: 'materialName',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialVersion`).d('版本'),
        dataIndex: 'materialVersion',
        width: 60,
      },
      {
        title: intl.get(`${commonModelPrompt}.quantity`).d('制单数量'),
        width: 90,
        dataIndex: 'quantity',
      },
      {
        title: intl.get(`${commonModelPrompt}.actualReceiveQty`).d('接收数量'),
        width: 90,
        dataIndex: 'actualReceiveQty',
      },
      {
        title: intl.get(`${commonModelPrompt}.exchangeQty`).d('料废调换数量'),
        width: 120,
        dataIndex: 'exchangeQty',
      },
      {
        title: '接收料废调换数量',
        width: 150,
        dataIndex: 'exchangedQty',
      },
      {
        title: '采购订单',
        width: 150,
        dataIndex: 'poNumber',
        render: (val, data, index) => (
          <a onClick={() => this.handleOpenDrawer(data, index, 'PO')}>
            {val}
          </a>
        ),
      },
      {
        title: '单位',
        width: 80,
        dataIndex: 'uomCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.lot`).d('接收批次'),
        width: 120,
        dataIndex: 'lot',
      },
      {
        title: intl.get(`${commonModelPrompt}.demandTime`).d('接收仓库'),
        width: 90,
        dataIndex: 'warehouseCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.supplierName`).d('供应商'),
        dataIndex: 'supplierName',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.actualReceivedDate`).d('接收完成时间'),
        width: 120,
        dataIndex: 'actualReceivedDate',
      },
      {
        title: intl.get(`${commonModelPrompt}.exemptionFlag`).d('是否免检'),
        width: 100,
        dataIndex: 'exemptionFlag',
        render: (val) => val === 'Y' ? '是' : '否',
      },
      {
        title: intl.get(`${commonModelPrompt}.inspectionTypeMeaning`).d('检验单类型'),
        width: 110,
        dataIndex: 'inspectionTypeMeaning',
      },
      {
        title: intl.get(`${commonModelPrompt}.finalDecisionMeaning`).d('审核结果'),
        width: 90,
        dataIndex: 'finalDecisionMeaning',
      },
      {
        title: intl.get(`${commonModelPrompt}.inspectionFinishDate`).d('检验完成时间'),
        dataIndex: 'inspectionFinishDate',
        width: 200,
      },
    ];

    return (
      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        rowSelection={rowSelection}
        onChange={page => onSearch(page)}
        loading={loading}
        rowKey="instructionId"
      />
    );
  }
}
