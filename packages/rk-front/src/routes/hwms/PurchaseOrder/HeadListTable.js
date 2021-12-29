// 引入依赖
import React from 'react';
import { Table } from 'hzero-ui';
import { tableScrollWidth } from 'utils/utils';
import intl from 'utils/intl';

const commonModelPrompt = 'tarzan.hmes.purchaseOrder';

export default class HeadListTable extends React.Component {
  // 直接渲染
  render() {
    // 护球上文参数
    const {
      codeMap,
      loading,
      dataSource,
      pagination,
      selectedHeadKeys,
      onSelectHead,
      onSearch,
    } = this.props;

    // 列展示

    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.instructionDocNum`).d('采购订单号'),
        width: 140,
        dataIndex: 'instructionDocNum',
      },
      {
        title: intl.get(`${commonModelPrompt}.siteName`).d('工厂'),
        width: 140,
        dataIndex: 'siteName',
      },
      {
        title: intl.get(`${commonModelPrompt}.instructionDocStatus`).d('单据状态'),
        width: 80,
        dataIndex: 'instructionDocStatus',
        render: val => (codeMap.filter(ele => ele.value === val)[0] || {}).meaning,
      },
      {
        title: intl.get(`${commonModelPrompt}.instructionDocTypeMeaning`).d('单据类型'),
        width: 120,
        dataIndex: 'instructionDocTypeMeaning',
      },
      {
        title: intl.get(`${commonModelPrompt}.supplierCode`).d('供应商编码'),
        width: 120,
        dataIndex: 'supplierCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.supplierName`).d('供应商描述'),
        width: 120,
        dataIndex: 'supplierName',
      },
      {
        title: intl.get(`${commonModelPrompt}.address`).d('收货地址'),
        width: 120,
        dataIndex: 'address',
      },
      {
        title: intl.get(`${commonModelPrompt}.creationDate`).d('创建时间'),
        width: 160,
        dataIndex: 'creationDate',
      },
      {
        title: intl.get(`${commonModelPrompt}.demandTime`).d('计划到货时间'),
        width: 160,
        dataIndex: 'demandTime',
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdatedBy`).d('操作者'),
        dataIndex: 'lastUpdatedBy',
        width: 100,
      },
      {
        title: intl.get(`${commonModelPrompt}.remark`).d('备注'),
        dataIndex: 'remark',
        width: 200,
      },
    ];

    return (
      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns, 50), y: 180 }}
        rowSelection={{
          selectedRowKeys: selectedHeadKeys,
          type: 'radio', // 单选
          columnWidth: 50,
          onChange: onSelectHead,
        }}
        onChange={page => onSearch(page)}
        loading={loading}
        bodyStyle={{ fontSize: '10px', lineHeight: '30px' }}
      />
    );
  }
}
