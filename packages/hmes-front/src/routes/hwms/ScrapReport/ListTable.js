import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';
import { isEmpty } from 'lodash';

class ListTable extends Component {
  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const modelPrompt = 'hwms.requisitionAndReturn.model.requisitionAndReturn';
    const modelPrompt2 = 'hwms.scrapReport.model.scrapReport';
    const modelPrompt3 = 'hwms.barcodeQuery.model.barcodeQuery';
    const { loading, dataSource, pagination, selectedRowKeys, onSelectRow, onSearch } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt2}.scrapNum`).d('报废申请单号'),
        dataIndex: 'instructionDocNum',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.docStatus`).d('单据状态'),
        dataIndex: 'instructionDocStatus',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.materialLotCode`).d('实物条码'),
        dataIndex: 'materialLotCode',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt3}.containerCode`).d('容器条码'),
        dataIndex: 'containerCode',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.materialCode`).d('物料编码'),
        dataIndex: 'materialCode',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.materialName`).d('物料描述'),
        dataIndex: 'materialName',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.lot`).d('批次'),
        dataIndex: 'lot',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt2}.qty`).d('数量'),
        dataIndex: 'primaryUomQty',
        width: 120,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.uom`).d('单位'),
        dataIndex: 'uomCode',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt2}.receiptDate`).d('接收日期'),
        dataIndex: 'receiptDate',
        width: 160,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt2}.productDate`).d('生产日期'),
        dataIndex: 'productDate',
        width: 150,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt2}.overdueDays`).d('超期天数'),
        dataIndex: 'overdueDays',
        width: 150,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt2}.scrapReason`).d('报废原因'),
        dataIndex: 'scrapReason',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt2}.approvalResult`).d('审批结果'),
        dataIndex: 'approvalResult',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt2}.approvalOpinion`).d('审批意见'),
        dataIndex: 'approvalOpinion',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt2}.costCenterCode`).d('成本中心编码'),
        dataIndex: 'costCenterCode',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt2}.costCenterDesc`).d('成本中心描述'),
        dataIndex: 'costCenterDescription',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.materialLotStatus`).d('条码状态'),
        dataIndex: 'materialLotStatus',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt2}.qualityStatus`).d('质量状态'),
        dataIndex: 'qualityStatus',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt2}.warehouse`).d('仓库'),
        dataIndex: 'warehouse',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.locatorCode`).d('货位'),
        dataIndex: 'locatorCode',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt2}.enteringDate`).d('转入日期'),
        dataIndex: 'enterDate',
        width: 200,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt2}.enteredBy`).d('转入人'),
        dataIndex: 'enterBy',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.creationDate`).d('创建日期'),
        dataIndex: 'creationDate',
        width: 200,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt3}.createBy`).d('创建人'),
        dataIndex: 'creationBy',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt3}.lastUpdateDate`).d('最后更新日期'),
        dataIndex: 'lastUpdateDate',
        width: 200,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt3}.lastUpdateBy`).d('最后更新人'),
        dataIndex: 'lastUpdatedBy',
      },
    ];
    return (
      <Table
        bordered
        rowKey="materialLotId"
        columns={columns}
        loading={loading}
        dataSource={dataSource}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns, 50) }}
        rowSelection={{
          fixed: true,
          columnWidth: 50,
          selectedRowKeys,
          onChange: onSelectRow,
          getCheckboxProps: record => ({
            disabled: !isEmpty(record.instructionDocNum),
            instructionDocNum: record.instructionDocNum,
          }),
        }}
        onChange={page => onSearch(page)}
      />
    );
  }
}
export default ListTable;
