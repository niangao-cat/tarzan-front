/*
 * @Description: 不良情况说明
 * @Version: 0.0.1
 * @Autor: 张晨 <chen.zhang03@hand-china.com>
 * @Date: 2021-05-17 18:10:19
 */
import React, { PureComponent } from 'react';
import { Table } from 'hzero-ui';

export default class ProLineCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  getRowClassName = (record, index) => {
    let className = '';
    className = index % 2 === 0 ? "oddRow" : "evenRow";
    return className;
  }

  render() {
    const columns = [
      {
        title: '物料编码',
        dataIndex: 'materialCode',
        width: 60,
        align: 'center',
      },
      {
        title: '物料描述',
        dataIndex: 'materialName',
        width: 70,
        align: 'center',
      },
      {
        title: '工段',
        dataIndex: 'lineWorkcellName',
        width: 70,
        align: 'center',
      },
      {
        title: '派工数量',
        dataIndex: 'dispatchQty',
        width: 40,
        align: 'center',
      },
      {
        title: '实际投产',
        dataIndex: 'actualQty',
        width: 40,
        align: 'center',
      },
      {
        title: '在制',
        dataIndex: 'wipQty',
        width: 40,
        align: 'center',
      },
      {
        title: '实际交付',
        dataIndex: 'actualDeliverQty',
        width: 40,
        align: 'center',
      },
      {
        title: '达成率',
        dataIndex: 'planReachRate',
        width: 40,
        align: 'center',
      },
    ];

    const { dataSource } = this.props;
    return (
      <Table
        dataSource={dataSource}
        columns={columns}
        style={{ width: '100%', padding: '10px' }}
        rowClassName={this.getRowClassName}
        pagination={false}
      />
    );
  }
}
