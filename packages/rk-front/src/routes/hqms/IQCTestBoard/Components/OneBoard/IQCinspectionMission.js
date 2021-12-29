import React from 'react';
import {
  // Table,
  Row, Col, Divider,
} from 'hzero-ui';

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
      <div style={{ width: '100%' }}>
        {/* <Divider /> */}
        <Row>
          <Col span={4}>到货仓库</Col>
          {props.dataSource.map(item => (
            <Col span={Math.floor(20 / props.dataSource.length)}>{item.locatorName}</Col>
          ))}
        </Row>
        <Row style={{ height: '12pt' }}>
          <Col span={4}>待检任务批数/批</Col>
          {props.dataSource.map(item => (
            <Col span={Math.floor(20 / props.dataSource.length)}>{item.taskCount}</Col>
          ))}
        </Row>
        <Divider />
        <div className='scroll'>
          <Row style={{ height: '40px' }}>
            <Col span={2}>检验员</Col>
            {props.badinspectList.map(item => (
              <Col span={props.badinspectList.length < 12 ? Math.floor(22 / props.badinspectList.length) : 2}>{item.qcByName}</Col>
            ))}
          </Row>
          <Row style={{ height: '40px' }}>
            <Col span={2}>日检验批</Col>
            {props.badinspectList.map(item => (
              <Col span={props.badinspectList.length < 12 ? Math.floor(22 / props.badinspectList.length) : 2}><span style={{ color: '#FF0000', margin: 0 }}>{item.dayNgNum}</span>/{item.dayNum}</Col>
            ))}
          </Row>
          <Row style={{ height: '40px' }}>
            <Col span={2}>周检验批</Col>
            {props.badinspectList.map(item => (
              <Col span={props.badinspectList.length < 12 ? Math.floor(22 / props.badinspectList.length) : 2}><span style={{ color: '#FF0000', margin: 0 }}>{item.weekendNgNum}</span>/{item.weekendNum}</Col>
            ))}
          </Row>
          <Row style={{ height: '40px' }}>
            <Col span={2}>月检验批</Col>
            {props.badinspectList.map(item => (
              <Col span={props.badinspectList.length < 12 ? Math.floor(22 / props.badinspectList.length) : 2}><span style={{ color: '#FF0000', margin: 0 }}>{item.mouthNgNum}</span>/{item.mouthNum}</Col>
            ))}
          </Row>
        </div>
        {/* <div className='scroll'>
          <div>
            <span>检验员</span>
            {props.badinspectList.map(item => (
              <span>{item.qcByName}</span>
            ))}
          </div>
          <Row>
            <span>日检验批</span>
            {props.badinspectList.map(item => (
              <span><span style={{ color: '#FF0000', margin: 0 }}>{item.dayNgNum}</span>/{item.dayNum}</span>
            ))}
          </Row>
          <Row>
            <span>周检验批</span>
            {props.badinspectList.map(item => (
              <span><span style={{ color: '#FF0000', margin: 0 }}>{item.weekendNgNum}</span>/{item.weekendNum}</span>
            ))}
          </Row>
          <Row>
            <span>月检验批</span>
            {props.badinspectList.map(item => (
              <span><span style={{ color: '#FF0000', margin: 0 }}>{item.mouthNgNum}</span>/{item.mouthNum}</span>
            ))}
          </Row>
        </div> */}
      </div>
    </React.Fragment>
  );
});

export default DeliveryScheduleNissanLineTable;
