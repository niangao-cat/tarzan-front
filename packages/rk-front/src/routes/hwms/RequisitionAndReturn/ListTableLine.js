import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';

class ListTableLine extends Component {
  /**
   * render
   * @returns React.element
   */
  render() {
    const commonModelPrompt = 'hwms.requisitionAndReturn.model.requisitionAndReturn';
    const { loading, dataSource, pagination, onSearch, onSelectRow } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.instructionLineNum`).d('行号'),
        dataIndex: 'instructionLineNum',
        width: 70,
        align: 'center',
        render: (text, record) => <a onClick={() => onSelectRow(record)}>{text}</a>,
      },
      {
        title: intl.get(`${commonModelPrompt}.materialCode`).d('物料'),
        dataIndex: 'materialCode',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.materialName`).d('物料描述'),
        dataIndex: 'materialName',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.materialVersion`).d('版本'),
        dataIndex: 'materialVersion',
        width: 70,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.instructionStatusMeaning`).d('状态'),
        dataIndex: 'instructionStatusMeaning',
        width: 70,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.quantity`).d('需求数量'),
        dataIndex: 'quantity',
        width: 90,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.actualQty`).d('执行数量'),
        dataIndex: 'executeQty',
        align: 'center',
        width: 90,
      },
      {
        title: intl.get(`${commonModelPrompt}.uomCode`).d('单位'),
        dataIndex: 'uomCode',
        width: 60,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.toStorageCode`).d('目标仓库'),
        dataIndex: 'toStorageCode',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.toLocatorCode`).d('目标货位'),
        dataIndex: 'toLocatorCode',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdatedUserName`).d('执行人'),
        dataIndex: 'lastUpdatedUserName',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdateDate`).d('执行时间'),
        dataIndex: 'lastUpdateDate',
        width: 150,
      },
      {
        title: intl.get(`${commonModelPrompt}.excessSettingMeaning`).d('超发设置'),
        dataIndex: 'excessSettingMeaning',
        width: 150,
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdateDate`).d('超发值'),
        dataIndex: 'excessValue',
        width: 150,
      },
      {
        title: intl.get(`${commonModelPrompt}.remark`).d('备注'),
        dataIndex: 'remark',
        width: 200,
      },
      // {
      //   title: intl.get('hzero.common.button.action').d('操作'),
      //   dataIndex: 'operator',
      //   width: 130,
      //   fixed: 'right',
      //   align: 'center',
      //   render: (val, record) => (
      //     <span className="action-link">
      //       <a onClick={() => printBarCode(record)}>条码打印</a>
      //       {/* <a onClick={() => barcodeCreate(record)}>条码创建</a> */}
      //     </span>
      //   ),
      // },
    ];
    return (
      <Table
        bordered
        rowKey="instructionId"
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns), y: 200 }}
        onChange={page => onSearch(page)}
      />
    );
  }
}

export default ListTableLine;
