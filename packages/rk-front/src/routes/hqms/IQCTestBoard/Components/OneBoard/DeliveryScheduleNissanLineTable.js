import React from 'react';
// import { Table } from 'hzero-ui';

const DeliveryScheduleNissanLineTable = React.memo(props => {
  // const columns = [
  //   {
  //     title: '单据号',
  //     width: 60,
  //     dataIndex: 'lineName',
  //   },
  //   {
  //     title: '物料',
  //     width: 60,
  //     dataIndex: 'new',
  //   },
  //   {
  //     title: '物料描述',
  //     width: 60,
  //     dataIndex: 'release',
  //   },
  //   {
  //     title: '供应商编码',
  //     width: 60,
  //     dataIndex: 'beiLiaoZhong',
  //   },
  //   {
  //     title: '送检数量',
  //     width: 60,
  //     dataIndex: 'beiLiaoComplete',
  //   },
  //   {
  //     title: '不良明显',
  //     width: 60,
  //     dataIndex: 'materialCode',
  //   },
  // ];
  return (
    <React.Fragment>
      {/* <Table
        bordered
        dataSource={props.dataSource}
        columns={columns}
        pagination={false}
        size="small"
      /> */}
      <table border="3" width='100%'>
        <thead>
          <tr style={{ height: '30pt', backgroundColor: '#0099FF' }}>
            <th style={{ width: '100pt' }}>单据号</th>
            <th style={{ width: '100pt' }}>物料</th>
            <th style={{ width: '100pt' }}>物料描述</th>
            <th style={{ width: '100pt' }}>供应商编码</th>
            <th style={{ width: '100pt' }}>送检数量</th>
            <th style={{ width: '100pt' }}>不良明细</th>
          </tr>
        </thead>
        <tbody>
          {props.dataSource.map(item => (
            <tr style={{ height: '30pt', backgroundColor: '#FFFFFF' }}>
              <td style={{ width: '100pt' }}>{item.iqcNumber}</td>
              <td style={{ width: '100pt' }}>{item.materialCode}</td>
              <td style={{ width: '100pt' }}>{item.materialName}</td>
              <td style={{ width: '100pt' }}>{item.supplierName}</td>
              <td style={{ width: '100pt' }}>{item.quantity}</td>
              <td style={{ width: '100pt' }}>{item.materialCode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </React.Fragment>
  );
});

export default DeliveryScheduleNissanLineTable;
