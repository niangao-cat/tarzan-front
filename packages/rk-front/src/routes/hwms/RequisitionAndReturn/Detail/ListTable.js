/*
 * @Description: 行信息
 * @version: 0.0.1
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-05-22 09:01:34
 */
import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';

class ListTable extends Component {
  /**
   * render
   * @returns React.element
   */
  render() {
    const commonModelPrompt = 'hwms.requisitionAndReturn.model.requisitionAndReturn';
    const { loading, dataSource, pagination, onSearch } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.docLineNum`).d('行号'),
        dataIndex: 'instructionLineNum',
        width: 80,
        align: 'center',
        render: (val, record, index) => index + 1,
      },
      {
        title: intl.get(`${commonModelPrompt}.materialLotCode`).d('条码号'),
        dataIndex: 'materialLotCode',
        width: 180,
      },
      {
        title: intl.get(`${commonModelPrompt}.materialLotStatusMeaning`).d('条码状态'),
        dataIndex: 'materialLotStatusMeaning',
        width: 100,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialCode`).d('物料编码'),
        dataIndex: 'materialCode',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.materialName`).d('物料描述'),
        dataIndex: 'materialName',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.actualQty`).d('条码数量'),
        dataIndex: 'actualQty',
        width: 120,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.lot`).d('批次'),
        dataIndex: 'lot',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.storageCode`).d('仓库'),
        dataIndex: 'storageCode',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.locatorCode`).d('货位'),
        dataIndex: 'locatorCode',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.enableFlag`).d('有效性'),
        dataIndex: 'enableFlag',
        width: 80,
        render: (val, record) => {
          if (record.enableFlag === 'Y') {
            return <span>是</span>;
          } else {
            return <span>否</span>;
          }
        },
      },
      {
        title: intl.get(`${commonModelPrompt}.locatorCode`).d('最后更新人'),
        dataIndex: 'lastUpdatedByName',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.locatorCode`).d('最后更新时间'),
        dataIndex: 'lastUpdateDate',
        width: 150,
      },
    ];
    return (
      <Table
        bordered
        rowKey="materialLotId"
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns) }}
        onChange={page => onSearch(page)}
      />
    );
  }
}

export default ListTable;
