import React from 'react';
import { Table } from 'hzero-ui';

import intl from 'utils/intl';

import { tableScrollWidth } from 'utils/utils';


const commonModelPrompt = 'tarzan.hmes.purchaseOrder';

const ListTable = (props) => {

  const handleSearch = (page = {}) => {
    const { onSearch } = props;
    if (onSearch) {
      onSearch(page);
    }
  };

  const { loading, dataSource, pagination } = props;
  const columns = [
    {
      title: intl.get(`${commonModelPrompt}.combMaterialCode`).d('组合物料编码'),
      width: 100,
      dataIndex: 'combMaterialCode',
    },
    {
      title: intl.get(`${commonModelPrompt}.combMaterialName`).d('组合物料描述'),
      width: 100,
      dataIndex: 'combMaterialName',
    },
    {
      title: intl.get(`${commonModelPrompt}.revision`).d('BOM版本号'),
      width: 90,
      dataIndex: 'revision',
    },
    {
      title: intl.get(`${commonModelPrompt}.selectionLot`).d('筛选批次'),
      width: 120,
      dataIndex: 'selectionLot',
    },
    {
      title: intl.get(`${commonModelPrompt}.ruleCode`).d('筛选规则编码'),
      width: 100,
      dataIndex: 'ruleCode',
    },
    {
      title: intl.get(`${commonModelPrompt}.setsNumber`).d('套数'),
      width: 80,
      dataIndex: 'setsNumber',
    },
    {
      title: intl.get(`${commonModelPrompt}.oldContainerCode`).d('原容器号'),
      width: 100,
      dataIndex: 'oldContainerCode',
    },
    {
      title: intl.get(`${commonModelPrompt}.newContainerCode`).d('目标容器'),
      width: 100,
      dataIndex: 'newContainerCode',
    },
    {
      title: intl.get(`${commonModelPrompt}.materialLotCode`).d('泵浦源SN'),
      width: 120,
      dataIndex: 'materialLotCode',
    },
    {
      title: intl.get(`${commonModelPrompt}.labCode`).d('实验代码'),
      width: 80,
      dataIndex: 'labCode',
    },
    {
      title: intl.get(`${commonModelPrompt}.materialCode`).d('物料编号'),
      width: 100,
      dataIndex: 'materialCode',
    },
    {
      title: intl.get(`${commonModelPrompt}.materialName`).d('物料描述'),
      width: 100,
      dataIndex: 'materialName',
    },
    {
      title: intl.get(`${commonModelPrompt}.warehouseCode`).d('仓库'),
      width: 80,
      dataIndex: 'warehouseCode',
    },
    {
      title: intl.get(`${commonModelPrompt}.locatorCode`).d('货位'),
      width: 80,
      dataIndex: 'locatorCode',
    },
    {
      title: intl.get(`${commonModelPrompt}.workOrderNum`).d('工单号'),
      width: 100,
      dataIndex: 'workOrderNum',
    },
    {
      title: intl.get(`${commonModelPrompt}.statusMeaning`).d('筛选状态'),
      width: 80,
      dataIndex: 'statusMeaning',
    },
    {
      title: intl.get(`${commonModelPrompt}.releaseWorkOrderNum`).d('投料工单'),
      width: 80,
      dataIndex: 'releaseWorkOrderNum',
    },
    {
      title: intl.get(`${commonModelPrompt}.combMaterialLotCode`).d('组合件SN'),
      width: 80,
      dataIndex: 'combMaterialLotCode',
    },
    {
      title: intl.get(`${commonModelPrompt}.createdByName`).d('预筛选操作人'),
      width: 100,
      dataIndex: 'createdByName',
    },
    {
      title: intl.get(`${commonModelPrompt}.creationDate`).d('预筛选时间'),
      width: 150,
      dataIndex: 'creationDate',
    },
    {
      title: intl.get(`${commonModelPrompt}.workcellCode`).d('筛选工位编码'),
      width: 100,
      dataIndex: 'workcellCode',
    },
    {
      title: intl.get(`${commonModelPrompt}.workcellName`).d('筛选工位描述'),
      width: 100,
      dataIndex: 'workcellName',
    },
    {
      title: intl.get(`${commonModelPrompt}.prodLineCode`).d('筛选产线编码'),
      width: 100,
      dataIndex: 'prodLineCode',
    },
    {
      title: intl.get(`${commonModelPrompt}.prodLineName`).d('筛选产线描述'),
      width: 80,
      dataIndex: 'prodLineName',
    },
    {
      title: intl.get(`${commonModelPrompt}.packedByName`).d('装箱操作人'),
      width: 80,
      dataIndex: 'packedByName',
    },
    {
      title: intl.get(`${commonModelPrompt}.packedDate`).d('装箱时间'),
      width: 150,
      dataIndex: 'packedDate',
    },
    {
      title: intl.get(`${commonModelPrompt}.freezeFlagMeaning`).d('是否冻结'),
      width: 80,
      dataIndex: 'freezeFlagMeaning',
    },
  ];

  return (
    <Table
      bordered
      dataSource={dataSource}
      columns={columns}
      pagination={pagination}
      scroll={{ x: tableScrollWidth(columns) }}
      onChange={handleSearch}
      loading={loading}
      bodyStyle={{ fontSize: '10px', lineHeight: '30px' }}
    />
  );
};

export default ListTable;