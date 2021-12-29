
import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';

class TableList extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    const commonModelPrompt = 'tarzan.hwms.wmsSummaryOfCosBarcodeProcessing';
    const {
      loading,
      dataSource,
      pagination,
      onSearch,
    } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.parentLocatorCode`).d('仓库'),
        dataIndex: 'parentLocatorCode',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.locatorCode`).d('货位'),
        dataIndex: 'locatorCode',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.workOrderNum`).d('工单号'),
        dataIndex: 'workOrderNum',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialCode`).d('产品编码'),
        dataIndex: 'materialCode',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialName`).d('产品描述'),
        dataIndex: 'materialName',
        width: '150',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.cosType`).d('COS类型'),
        dataIndex: 'cosType',
        width: '80',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialLotCode`).d('条码'),
        dataIndex: 'materialLotCode',
        width: '150',
        align: 'left',
      },
      {
        title: intl.get(`${commonModelPrompt}.position`).d('位置'),
        dataIndex: 'position',
        width: '80',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.wafer`).d('WAFER'),
        dataIndex: 'wafer',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.selectionStatusMeaning`).d('筛选状态'),
        dataIndex: 'selectionStatusMeaning',
        width: '80',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.hotSinkCode`).d('热沉编码'),
        dataIndex: 'hotSinkCode',
        width: '80',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.labCode`).d('实验代码'),
        dataIndex: 'labCode',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.selectedMaterialLotCode`).d('挑选来源条码'),
        dataIndex: 'selectedMaterialLotCode',
        width: '80',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.selectedPosition`).d('挑选来源位置'),
        dataIndex: 'selectedPosition',
        width: '80',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.virtualNum`).d('虚拟号'),
        dataIndex: 'virtualNum',
        width: '80',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.attribute2`).d('路数'),
        dataIndex: 'attribute2',
        width: '120',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.identification`).d('器件序列号'),
        dataIndex: 'identification',
        width: '150',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.deviceMaterialCode`).d('器件物料编码'),
        dataIndex: 'deviceMaterialCode',
        width: '150',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.deviceMaterialName`).d('器件物料描述'),
        dataIndex: 'deviceMaterialName',
        width: '150',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.preSelectionLot`).d('筛选批次'),
        dataIndex: 'preSelectionLot',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.selectionRuleCode`).d('筛选规则编码'),
        dataIndex: 'selectionRuleCode',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.bindFlagMeaning`).d('是否绑定工单号'),
        dataIndex: 'bindFlagMeaning',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.releaseWorkOrderNum`).d('投料工单'),
        dataIndex: 'releaseWorkOrderNum',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.a04`).d('5A波长'),
        dataIndex: 'a04',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.a04Avg`).d('平均波长'),
        dataIndex: 'a04Avg',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.power`).d('功率'),
        dataIndex: 'power',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.powerSum`).d('功率和'),
        dataIndex: 'powerSum',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.voltage`).d('电压'),
        dataIndex: 'voltage',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.voltageSum`).d('电压和'),
        dataIndex: 'voltageSum',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.hotSinkMaterialLotCode`).d('热沉条码'),
        dataIndex: 'hotSinkMaterialLotCode',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.hotSinkSupplierLot`).d('热沉供应商批次号'),
        dataIndex: 'hotSinkSupplierLot',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.hotSinkAuSnRate`).d('热沉焊料金锡比'),
        dataIndex: 'hotSinkAuSnRate',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.goldMaterialLotCode`).d('金线条码'),
        dataIndex: 'goldMaterialLotCode',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.goldSupplierLot`).d('金线供应商批次'),
        dataIndex: 'goldSupplierLot',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.preSelectionOperatorName`).d('预筛选操作人'),
        dataIndex: 'preSelectionOperatorName',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.preSelectionDate`).d('预筛选时间'),
        dataIndex: 'preSelectionDate',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.preSelectionAssetEncoding`).d('筛选设备编码'),
        dataIndex: 'preSelectionAssetEncoding',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.loadOperatorName`).d('装箱操作人'),
        dataIndex: 'loadOperatorName',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.loadDate`).d('装箱时间'),
        dataIndex: 'loadDate',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.freezeFlagMeaning`).d('是否冻结'),
        dataIndex: 'freezeFlagMeaning',
        align: 'center',
      },
      // ...column,
    ];
    return (
      <Table
        bordered
        columns={columns}
        loading={loading}
        dataSource={dataSource}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns) }}
        onChange={page => onSearch(page)}
      />
    );
  }
}
export default TableList;
