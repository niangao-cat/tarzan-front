// 导入必要工具包
import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';

// 导出表格显示数据
class ListTable extends Component {
  // 直接渲染
  render() {
    const commonModelPrompt = 'tarzan.hmes.purchaseOrder';
    const { loading, dataSource, inspectTypeMap, pagination, onSearch, selectedRowKey, handleSelect, handleOnOpenBoard, handleOpenDrawerFlag } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.instructionDocNum`).d('来源单号'),
        dataIndex: 'instructionDocNum',
        render: (value, record) => {
          return (<a onClick={() => handleOpenDrawerFlag(true, record)}>{record.instructionDocNum}</a>);
        },
      },
      {
        title: intl.get(`${commonModelPrompt}.iqcNumber`).d('检验单'),
        dataIndex: 'iqcNumber',
        render: (value, record) => {
          return (<a onClick={() => handleOnOpenBoard(record)}>{record.iqcNumber}</a>);
        },
      },
      {
        title: intl.get(`${commonModelPrompt}.inspectionStatusMeaning`).d('处理状态'),
        width: 90,
        dataIndex: 'inspectionStatusMeaning',
      },
      {
        title: intl.get(`${commonModelPrompt}.inspectionStatusMeaning`).d('检验结果'),
        width: 90,
        dataIndex: 'inspectionResultMeaning',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialCode`).d('物料编码'),
        width: 100,
        dataIndex: 'materialCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialName`).d('物料描述'),
        dataIndex: 'materialName',
        width: 150,
      },
      {
        title: intl.get(`${commonModelPrompt}.quantity`).d('来料数量'),
        width: 90,
        align: 'center',
        dataIndex: 'quantity',
      },
      {
        title: intl.get(`${commonModelPrompt}.locatorCode`).d('仓库'),
        width: 90,
        align: 'center',
        dataIndex: 'locatorCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.grade`).d('等级汇总'),
        width: 100,
        align: 'center',
        dataIndex: 'grade',
      },
      {
        title: intl.get(`${commonModelPrompt}.supplierName`).d('供应商名称'),
        width: 150,
        align: 'center',
        dataIndex: 'supplierName',
      },
      {
        title: intl.get(`${commonModelPrompt}.createdDate`).d('供应商批次'),
        width: 150,
        align: 'center',
        dataIndex: 'supplierLot',
      },
      {
        title: intl.get(`${commonModelPrompt}.createdDate`).d('到货日期'),
        width: 150,
        align: 'center',
        dataIndex: 'createdDate',
      },
      {
        title: intl.get(`${commonModelPrompt}.receiptLot`).d('接收批次'),
        width: 150,
        align: 'center',
        dataIndex: 'receiptLot',
      },
      {
        title: intl.get(`${commonModelPrompt}.receiptLot`).d('样品标识'),
        width: 150,
        align: 'center',
        dataIndex: 'sampleFlag',
      },
      // {
      //   title: intl.get(`${commonModelPrompt}.inspectionType`).d('检验类型'),
      //   width: 150,
      //   align: 'center',
      //   dataIndex: 'inspectionType',
      //   render: (val) =>
      //     (
      //       (inspectTypeMap.filter(ele => ele.value === val)[0] || {}).meaning
      //     ),
      // },
      {
        title: intl.get(`${commonModelPrompt}.inspectionFinishDate`).d('判断不合格日期'),
        width: 150,
        align: 'center',
        dataIndex: 'inspectionFinishDate',
      },
      {
        title: intl.get(`${commonModelPrompt}.remark`).d('备注'),
        width: 240,
        dataIndex: 'remark',
      },
      {
        title: intl.get(`${commonModelPrompt}.auditOpinion`).d('审核意见'),
        width: 160,
        dataIndex: 'auditOpinion',
      },
      {
        title: intl.get(`${commonModelPrompt}.receiptBy`).d('检验员'),
        width: 160,
        dataIndex: 'realName',
      },
      {
        title: intl.get(`${commonModelPrompt}.receiptBy`).d('接收人'),
        width: 160,
        dataIndex: 'receiptBy',
      },
      {
        title: intl.get(`${commonModelPrompt}.identificationMeaning`).d('是否加急'),
        dataIndex: 'identificationMeaning',
        width: 100,
      },
      {
        title: intl.get(`${commonModelPrompt}.materialVersion`).d('物料等级'),
        width: 120,
        dataIndex: 'materialVersion',
      },
      {
        title: intl.get(`${commonModelPrompt}.iqcVersion`).d('物料版本'),
        width: 100,
        dataIndex: 'iqcVersion',
      },
      {
        title: intl.get(`${commonModelPrompt}.tagGroupCode`).d('检验组编码'),
        width: 100,
        dataIndex: 'tagGroupCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.tagGroupDescription`).d('检验组描述'),
        width: 100,
        dataIndex: 'tagGroupDescription',
      },
    ];
    return (
      <Table
        bordered
        rowKey="instructionId"
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        rowSelection={{
          selectedRowKey,
          onSelect: handleSelect,
          type: 'radio', // 单选
          columnWidth: 50,
          fixed: true,
        }}
        onChange={page => onSearch(page)}
      />
    );
  }
}

export default ListTable;
