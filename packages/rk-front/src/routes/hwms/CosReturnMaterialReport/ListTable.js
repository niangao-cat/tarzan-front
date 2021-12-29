import React from 'react';
import { Table } from 'hzero-ui';

import intl from 'utils/intl';

import { tableScrollWidth } from 'utils/utils';



const commonModelPrompt = 'tarzan.hmes.purchaseOrder';

const HeadList = (props) => {

  const handleSearch = (page = {}) => {
    const { onSearch } = props;
    if (onSearch) {
      onSearch(page);
    }
  };

  const { loading, dataSource, pagination } = props;

  const columns = [
    {
      title: intl.get(`${commonModelPrompt}.prodLineCode`).d('退料产线'),
      width: 150,
      dataIndex: 'prodLineCode',
    },
    {
      title: intl.get(`${commonModelPrompt}.workOrderNum`).d('工单号'),
      width: 120,
      dataIndex: 'workOrderNum',
    },
    {
      title: intl.get(`${commonModelPrompt}.materialCode`).d('产品编码'),
      width: 130,
      dataIndex: 'materialCode',
    },
    {
      title: intl.get(`${commonModelPrompt}.materialName`).d('产品描述'),
      width: 120,
      dataIndex: 'materialName',
    },
    {
      title: intl.get(`${commonModelPrompt}.waferNum`).d('WAFER'),
      width: 120,
      dataIndex: 'waferNum',
    },
    {
      title: intl.get(`${commonModelPrompt}.cosType`).d('COS类型'),
      width: 120,
      dataIndex: 'cosType',
    },
    {
      title: intl.get(`${commonModelPrompt}.returnMaterialLotCode`).d('退料条码'),
      width: 120,
      dataIndex: 'returnMaterialLotCode',
    },
    {
      title: intl.get(`${commonModelPrompt}.primaryUomQty`).d('条码数量'),
      width: 120,
      dataIndex: 'primaryUomQty',
    },
    {
      title: intl.get(`${commonModelPrompt}.componentMaterialCode`).d('组件物料编码'),
      width: 120,
      dataIndex: 'componentMaterialCode',
    },
    {
      title: intl.get(`${commonModelPrompt}.componentMaterialName`).d('组件物料描述'),
      width: 120,
      dataIndex: 'componentMaterialName',
    },
    {
      title: intl.get(`${commonModelPrompt}.returnTypeMeaning`).d('处理方式'),
      width: 120,
      dataIndex: 'returnTypeMeaning',
    },
    {
      title: intl.get(`${commonModelPrompt}.uomCode`).d('单位'),
      width: 120,
      dataIndex: 'uomCode',
    },
    {
      title: intl.get(`${commonModelPrompt}.usageQty`).d('单位用量'),
      width: 120,
      dataIndex: 'usageQty',
    },
    {
      title: intl.get(`${commonModelPrompt}.targetMaterialLotCode`).d('目标条码'),
      width: 120,
      dataIndex: 'targetMaterialLotCode',
    },
    {
      title: intl.get(`${commonModelPrompt}.returnQty`).d('数量'),
      width: 120,
      dataIndex: 'returnQty',
    },
    {
      title: intl.get(`${commonModelPrompt}.supplierName`).d('供应商'),
      width: 120,
      dataIndex: 'supplierName',
    },
    {
      title: intl.get(`${commonModelPrompt}.supplierLot`).d('供应商批次'),
      width: 150,
      dataIndex: 'supplierLot',
    },
    {
      title: intl.get(`${commonModelPrompt}.lot`).d('库存批次'),
      width: 120,
      dataIndex: 'lot',
    },
    {
      title: intl.get(`${commonModelPrompt}.ncDescription`).d('不良代码描述'),
      width: 120,
      dataIndex: 'ncDescription',
    },
    {
      title: intl.get(`${commonModelPrompt}.realName`).d('操作人'),
      width: 150,
      dataIndex: 'realName',
    },
    {
      title: intl.get(`${commonModelPrompt}.creationDate`).d('操作时间'),
      width: 120,
      dataIndex: 'creationDate',
    },
    {
      title: intl.get(`${commonModelPrompt}.workcellCode`).d('操作工位编码'),
      width: 150,
      dataIndex: 'workcellCode',
    },
    {
      title: intl.get(`${commonModelPrompt}.workcellName`).d('退料工位描述'),
      width: 150,
      dataIndex: 'workcellName',
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

export default HeadList;
