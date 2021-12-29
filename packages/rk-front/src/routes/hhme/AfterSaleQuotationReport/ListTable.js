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
      title: intl.get(`${commonModelPrompt}.creationDate`).d('创建日期'),
      width: 150,
      dataIndex: 'creationDate',
    },
    {
      title: intl.get(`${commonModelPrompt}.model`).d('型号'),
      width: 120,
      dataIndex: 'model',
    },
    {
      title: intl.get(`${commonModelPrompt}.serialNumber`).d('序列号'),
      width: 130,
      dataIndex: 'serialNumber',
    },
    {
      title: intl.get(`${commonModelPrompt}.productCode`).d('产品编码'),
      width: 120,
      dataIndex: 'productCode',
    },
    {
      title: intl.get(`${commonModelPrompt}.productDescription`).d('产品描述'),
      width: 120,
      dataIndex: 'productDescription',
    },
    {
      title: intl.get(`${commonModelPrompt}.snStatus`).d('SN状态'),
      width: 120,
      dataIndex: 'snStatusMeaning',
    },
    {
      title: intl.get(`${commonModelPrompt}.workOrderNo`).d('工单号'),
      width: 120,
      dataIndex: 'workOrderNo',
    },
    {
      title: intl.get(`${commonModelPrompt}.sellerTo`).d('售达方'),
      width: 120,
      dataIndex: 'sellerTo',
    },
    {
      title: intl.get(`${commonModelPrompt}.servedBy`).d('送达方'),
      width: 120,
      dataIndex: 'servedBy',
    },
    {
      title: intl.get(`${commonModelPrompt}.replacementMaterialNo`).d('更换物料'),
      width: 120,
      dataIndex: 'replacementMaterialNo',
    },
    {
      title: intl.get(`${commonModelPrompt}.replacementMaterialDescription`).d('更换物料描述'),
      width: 120,
      dataIndex: 'replacementMaterialDescription',
    },
    {
      title: intl.get(`${commonModelPrompt}.quantity`).d('数量'),
      width: 120,
      dataIndex: 'quantity',
    },
    {
      title: intl.get(`${commonModelPrompt}.remark`).d('备注'),
      width: 120,
      dataIndex: 'remarks',
    },
    {
      title: intl.get(`${commonModelPrompt}.quotationStatus`).d('报价单状态'),
      width: 120,
      dataIndex: 'quotationStatusMeaning',
    },
    {
      title: intl.get(`${commonModelPrompt}.sapQuotationN`).d('SAP报价单号'),
      width: 120,
      dataIndex: 'sapQuotationNo',
    },
    {
      title: intl.get(`${commonModelPrompt}.returnType`).d('返回类型'),
      width: 120,
      dataIndex: 'returnTypeMeaning',
    },
    {
      title: intl.get(`${commonModelPrompt}.theDateOfIssuance`).d('发货日期'),
      width: 150,
      dataIndex: 'theDateOfIssuance',
    },
    {
      title: intl.get(`${commonModelPrompt}.creatorName`).d('创建人'),
      width: 120,
      dataIndex: 'creatorName',
    },
    {
      title: intl.get(`${commonModelPrompt}.updaterName`).d('更新人'),
      width: 120,
      dataIndex: 'updaterName',
    },
    {
      title: intl.get(`${commonModelPrompt}.creationDate`).d('更新时间'),
      width: 150,
      dataIndex: 'updateTime',
    },
    {
      title: intl.get(`${commonModelPrompt}.submitterName`).d('提交人'),
      width: 120,
      dataIndex: 'submitterName',
    },
    {
      title: intl.get(`${commonModelPrompt}.submissionTime`).d('提交时间'),
      width: 150,
      dataIndex: 'submissionTime',
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
