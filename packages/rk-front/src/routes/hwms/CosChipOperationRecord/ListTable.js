/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： COS芯片作业记录
 */

import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';

const commonModelPrompt = 'tarzan.hwms.cosChipOperationRecord';

export default class CosChipOperationRecord extends Component {

  render() {
    const {
      loading,
      dataSource,
      pagination,
      onSearch,
    } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.workOrderNum`).d('工单'),
        dataIndex: 'workOrderNum',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.productionVersion`).d('工单版本'),
        dataIndex: 'productionVersion',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.productionVersionDescription`).d('版本描述'),
        dataIndex: 'productionVersionDescription',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialCode`).d('产品编码'),
        dataIndex: 'materialCode',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialName`).d('产品描述'),
        dataIndex: 'materialName',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.loadJobTypeMeaning`).d('作业类型'),
        dataIndex: 'loadJobTypeMeaning',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.waferNum`).d('wafer'),
        dataIndex: 'waferNum',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.cosType`).d('cos类型'),
        dataIndex: 'cosType',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.labCode`).d('实验代码'),
        dataIndex: 'labCode',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialLotCode`).d('条码'),
        dataIndex: 'materialLotCode',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.position`).d('位置'),
        dataIndex: 'position',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.sourceMaterialLotCode`).d('来源条码'),
        dataIndex: 'sourceMaterialLotCode',
        align: 'left',
      },
      {
        title: intl.get(`${commonModelPrompt}.sourcePosition`).d('来源位置'),
        dataIndex: 'sourcePosition',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.hotSinkCode`).d('热沉编码'),
        dataIndex: 'hotSinkCode',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.operationDescription`).d('工艺描述'),
        dataIndex: 'operationDescription',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.workcellStationCode`).d('工位'),
        dataIndex: 'workcellStationCode',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.workcellStationName`).d('工位描述'),
        dataIndex: 'workcellStationName',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.workcellProcessName`).d('工序描述'),
        dataIndex: 'workcellProcessName',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.workcellLineName`).d('工段描述'),
        dataIndex: 'workcellLineName',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.prodLineName`).d('生产线描述'),
        dataIndex: 'prodLineName',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.bomMaterialCode`).d('物料编码'),
        dataIndex: 'bomMaterialCode',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.bomMaterialLotCode`).d('投料条码'),
        dataIndex: 'bomMaterialLotCode',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.supplierLot`).d('供应商批次'),
        dataIndex: 'supplierLot',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.supplierCode`).d('供应商编码'),
        dataIndex: 'supplierCode',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.supplierName`).d('供应商名称'),
        dataIndex: 'supplierName',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.ncCode`).d('不良代码'),
        dataIndex: 'ncCode',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.ncCodeDescription`).d('不良代码描述'),
        dataIndex: 'ncCodeDescription',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.statusMeaning`).d('状态'),
        dataIndex: 'statusMeaning',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.remark`).d('备注'),
        dataIndex: 'remark',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.equipment`).d('设备'),
        dataIndex: 'equipment',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.auSnRate`).d('金锡比'),
        dataIndex: 'auSnRate',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.machineCode`).d('贴片机台编码'),
        dataIndex: 'machineCode',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.createdByName`).d('创建人'),
        dataIndex: 'createdByName',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.equipment`).d('创建时间'),
        dataIndex: 'creationDate',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.equipment`).d('更新人'),
        dataIndex: 'lastUpdateByName',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.equipment`).d('更新时间'),
        dataIndex: 'lastUpdateDate',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.loadSequence`).d('装载行序列号'),
        dataIndex: 'loadSequence',
        align: 'center',
      },
    ];
    return (
      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        onChange={onSearch}
        loading={loading}
      />
    );
  }
}
