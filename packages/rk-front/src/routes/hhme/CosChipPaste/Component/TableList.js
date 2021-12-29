import React, { Component } from 'react';
import { connect } from 'dva';
import EditTable from 'components/EditTable';
import { tableScrollWidth } from 'utils/utils';


@connect(({ incomingMaterialEntry }) => ({
  incomingMaterialEntry,
}))
export default class TableList extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  HandoverMatterForm;

  componentDidMount() {

  }

  render() {
    const { dataSource, rowClick, handleClickRow} = this.props;
    const columns = [
      {
        title: '工单号',
        dataIndex: 'workOrderNum',
        width: 100,
      },
      {
        title: '工单芯片数',
        dataIndex: 'cosNum',
        width: 100,
      },
      {
        title: '盒子编号',
        dataIndex: 'materialLotCode',
        width: 100,
      },
      {
        title: 'Cos数量',
        dataIndex: 'primaryUomQty',
        width: 100,
      },
      {
        title: 'wafer',
        dataIndex: 'wafer',
        width: 100,
      },
      {
        title: '录入批次',
        dataIndex: 'attrValue',
        width: 100,
      },
      {
        title: '芯片总数',
        dataIndex: 'qty',
        width: 100,
      },
      {
        title: '产品编码',
        dataIndex: 'materialCode',
        width: 100,
      },
      {
        title: '产品描述',
        dataIndex: 'materialName',
        width: 100,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 100,
      },
    ];
    return (
      <EditTable
        bordered
        rowKey="jobId"
        columns={columns}
        scroll={{ x: tableScrollWidth(columns), y: 190 }}
        dataSource={dataSource}
        pagination={{pageSize: 9999999}}
        onRow={record => {
          return {
            onClick: () => rowClick(record, true), // 点击行
          };
        }}
        rowClassName={handleClickRow}
      />
    );
  }
}
