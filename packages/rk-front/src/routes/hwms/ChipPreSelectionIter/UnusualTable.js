import React, { Component } from 'react';
import { Table, Tooltip } from 'hzero-ui';
import intl from 'utils/intl';


export default class UnusualTable extends Component {
  // 直接渲染
  render() {
    const commonModelPrompt = 'tarzan.hmes.chipPreSelection';
    const {
      loading,
      dataSource,
      rowClick,
      changeBackColor,
      getUnusualTableByPanigation,
      pagination,
    } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.name`).d('序号'),
        dataIndex: 'serial',
        align: 'center',
        width: 70,
        render: (val, record, index) => index + 1,
      },
      {
        title: intl.get(`${commonModelPrompt}.position`).d('生产订单'),
        dataIndex: 'workOrderNum',
        align: 'center',
        width: 100,
      },
      {
        title: intl.get(`${commonModelPrompt}.doTime`).d('SAP料号'),
        dataIndex: 'materialCode',
        align: 'center',
        width: 100,
      },
      {
        title: intl.get(`${commonModelPrompt}.stopTime`).d('产品类型'),
        dataIndex: 'productType',
        align: 'center',
        width: 100,
      },
      {
        title: intl.get(`${commonModelPrompt}.stopTime`).d('芯片版本'),
        dataIndex: 'd',
        align: 'center',
        width: 100,
      },
      {
        title: intl.get(`${commonModelPrompt}.stopTime`).d('物料描述'),
        dataIndex: 'materialName',
        align: 'center',
        width: 100,
        render: (val) => (
          <Tooltip placement="topLeft" title={val}>{val}</Tooltip>
        ),
      },
      {
        title: intl.get(`${commonModelPrompt}.stopTime`).d('芯片个数'),
        dataIndex: 'cosqty',
        align: 'center',
        width: 100,
      },
      {
        title: intl.get(`${commonModelPrompt}.qty`).d('工单需求数量'),
        dataIndex: 'qty',
        align: 'center',
        width: 100,
      },
      {
        title: intl.get(`${commonModelPrompt}.stopTime`).d('已挑选数量'),
        dataIndex: 'h',
        align: 'center',
        width: 100,
      },
      {
        title: intl.get(`${commonModelPrompt}.stopTime`).d('工单备注'),
        dataIndex: 'remark',
        align: 'center',
        width: 100,
        render: (val) => (
          <Tooltip placement="topLeft" title={val}>{val}</Tooltip>
        ),
      },
      {
        title: intl.get(`${commonModelPrompt}.stopTime`).d('计划交付时间'),
        dataIndex: 'planEndTime',
        align: 'center',
        width: 130,
      },
    ];
    return (
      <Table
        bordered
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        onRow={record => {
          return {
            onClick: () => {
              rowClick(record);
            },
          };
        }}
        pagination={pagination}
        onChange={page => getUnusualTableByPanigation(page)}
        rowClassName={changeBackColor}
      />
    );
  }
}
