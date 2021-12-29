import React from 'react';
import { Table } from 'hzero-ui';

import { tableScrollWidth } from 'utils/utils';

export default class AbnormalResponse extends React.Component {


  render() {
    const { loading, dataSource, pagination, onSearch } = this.props;
    const columns = [
      {
        title: 'WAFER',
        width: 100,
        dataIndex: 'wafer',
      },
      {
        title: '容器类型',
        width: 100,
        dataIndex: 'containerType',
      },
      {
        title: 'LOTNO',
        width: 100,
        dataIndex: 'lotno',
      },
      {
        title: 'Avg(nm)',
        width: 100,
        dataIndex: 'avgWavelenght',
      },
      {
        title: 'TYPE',
        width: 100,
        dataIndex: 'type',
      },
      {
        title: '备注',
        width: 100,
        dataIndex: 'remark',
      },
      {
        title: '位置',
        dataIndex: 'position',
        width: 80,
      },
      {
        title: '合格芯片数',
        dataIndex: 'qty',
        width: 110,
      },
      {
        title: '电流',
        dataIndex: 'current',
        width: 70,
      },
      {
        title: '热沉类型',
        dataIndex: 'attribute1',
        width: 90,
      },
      {
        title: '热沉供应商批次',
        dataIndex: 'attribute2',
        width: 130,
      },
      // {
      //   title: '金线供应商批次',
      //   dataIndex: 'attribute3',
      //   width: 130,
      // },
      {
        title: '功率等级',
        dataIndex: 'a01',
        width: 90,
      },
      {
        title: '功率',
        dataIndex: 'a02',
        width: 70,
      },
      {
        title: '波长等级',
        dataIndex: 'a03',
        width: 100,
      },
      {
        title: '波长',
        dataIndex: 'a04',
        width: 70,
      },
      {
        title: '波长差',
        dataIndex: 'a05',
        width: 100,
      },
      {
        title: '电压等级',
        dataIndex: 'attribute5',
        width: 90,
      },
      {
        title: '电压',
        dataIndex: 'a06',
        width: 70,
      },
      {
        title: '光谱宽度',
        dataIndex: 'a07',
        width: 100,
      },
      {
        title: '设备',
        dataIndex: 'a08',
        width: 100,
      },
      {
        title: '测试模式',
        dataIndex: 'a09',
        width: 100,
      },
      {
        title: '测试时间',
        dataIndex: 'attribute4',
        width: 100,
      },
      {
        title: '阈值电流',
        dataIndex: 'a010',
        width: 100,
      },
      {
        title: '阈值电压',
        dataIndex: 'a011',
        width: 100,
      },
      {
        title: 'SE',
        dataIndex: 'a012',
        width: 100,
      },
      // {
      //   title: '线宽',
      //   dataIndex: 'a013',
      //   width: 100,
      // },
      {
        title: '光电能转换效率',
        dataIndex: 'a014',
        width: 120,
      },
      {
        title: '偏振度',
        dataIndex: 'a15',
        width: 100,
      },
      {
        title: 'X半宽高',
        dataIndex: 'a16',
        width: 100,
      },
      {
        title: 'Y半宽高',
        dataIndex: 'a17',
        width: 100,
      },
      {
        title: 'X86能量宽',
        dataIndex: 'a18',
        width: 100,
      },
      {
        title: 'Y86能量宽',
        dataIndex: 'a19',
        width: 100,
      },
      {
        title: 'X95能量宽',
        dataIndex: 'a20',
        width: 100,
      },
      {
        title: 'Y95能量宽',
        dataIndex: 'a21',
        width: 100,
      },
      {
        title: '透镜功率',
        dataIndex: 'a22',
        width: 100,
      },
      {
        title: 'PBS功率',
        dataIndex: 'a23',
        width: 100,
      },
      {
        title: '不良代码',
        dataIndex: 'a24',
        width: 100,
      },
      {
        title: '测试备注',
        dataIndex: 'a26',
        width: 100,
      },
    ];

    return (
      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns, 50), y: 180 }}
        onChange={page => onSearch(page)}
        loading={loading}
        rowKey="exceptionRouterId"
        bodyStyle={{ fontSize: '10px', lineHeight: '30px' }}
      />
    );
  }
}
