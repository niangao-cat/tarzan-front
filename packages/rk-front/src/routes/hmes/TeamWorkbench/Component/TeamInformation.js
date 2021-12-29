/*
 * @Description: 班组信息列表
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-09 17:56:29
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-08-04 22:47:55
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Form, Table, Row, Col } from 'hzero-ui';
import { tableScrollWidth } from 'utils/utils';
import styles from '../index.less';
import secondTitleImg from '@/assets/JXblue.png';

@Form.create({ fieldNameProp: null })
export default class TeamInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {

  }

  render() {
    const { shiftInfo = {}, groupLeaderList=[] } = this.props;
    // const {groupLeaderList=[]} = shiftInfo;
    const columns = [
      {
        title: '工位',
        dataIndex: 'workcellName',
        width: 60,
        align: 'center',
      },
      {
        title: '员工',
        dataIndex: 'empolyeeName',
        width: 60,
        align: 'center',
      },
      {
        title: '上岗时间',
        dataIndex: 'mountGuardDate',
        width: 90,
        align: 'center',
      },
      {
        title: '下岗时间',
        dataIndex: 'laidOffDate',
        width: 90,
        align: 'center',
      },
      {
        title: '产量',
        dataIndex: 'production',
        width: 60,
        align: 'center',
      },
      {
        title: '不良量',
        dataIndex: 'ncNumber',
        width: 60,
        align: 'center',
      },
      {
        title: '合格率',
        dataIndex: 'passPercent',
        width: 100,
        align: 'center',
      },
      {
        title: '返修数',
        dataIndex: 'repairNumber',
        width: 90,
        align: 'center',
      },
    ];
    return (
      <div className={styles.TeamInformation}>
        <div style={{ fontSize: '14px' }}>
          <img src={secondTitleImg} alt="" style={{ marginTop: '-3PX', marginRight: '5px' }} />
          <span style={{ fontSize: '14px', lineHeight: '19px', color: 'rgba(51,51,51,1)' }}>班组信息</span>
        </div>
        <Form>
          <Row>
            <Col span={12} style={{ height: '30px' }}>
              <Form.Item labelCol={{ span: 9 }} wrapperCol={{ span: 12 }} label="班组">
                <span>{shiftInfo.unitName}</span>
              </Form.Item>
            </Col>
            <Col span={12} style={{ height: '30px' }}>
              <Form.Item labelCol={{ span: 9 }} wrapperCol={{ span: 12 }} label="组长">
                <span> {groupLeaderList}</span>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12} style={{ height: '30px' }}>
              <Form.Item labelCol={{ span: 9 }} wrapperCol={{ span: 12 }} label="计划出勤">
                <span>{shiftInfo.planAttendance}人</span>
              </Form.Item>
            </Col>
            <Col span={12} style={{ height: '30px' }}>
              <Form.Item labelCol={{ span: 9 }} wrapperCol={{ span: 12 }} label="实际出勤">
                <span>{shiftInfo.actualAttendance}人</span>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Table
          columns={columns}
          scroll={{ x: tableScrollWidth(columns), y: 430 }}
          rowKey="workOrderId"
          bordered
          dataSource={shiftInfo.shiftDataList}
          pagination={false}
        />
      </div>
    );
  }
}
