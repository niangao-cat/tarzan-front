/*
 * @Description: 出炉
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-07 10:00:07
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2021-03-11 09:25:59
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Form, Table, Input, Button, Divider, Row, Col, Tooltip } from 'hzero-ui';
import { isFunction } from 'lodash';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';
import { tableScrollWidth } from 'utils/utils';
import styles from '../index.less';

@Form.create({ fieldNameProp: null })
export default class OutFurnace extends Component {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {
      hour: 0,
      minute: 0,
      second: 0,
    };
  }

  componentDidMount() {
    this.props.onTimeRef(this);
  }

  // 卸载组件取消倒计时
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  /**
   * @description: 暂停计时
   * @param {type} params
   */
  @Bind()
  clearIntervalChild() {
    this.setState({ hour: 0, minute: 0, second: 0 });
    clearInterval(this.timer);
  }

  @Bind()
  time(waitOutFurnace = {}) {
    if (waitOutFurnace) {
      if (waitOutFurnace.snType === 'CONTAINER') {
        this.getTime(waitOutFurnace.siteInDate);
      }
      if (waitOutFurnace.snType === 'MATERIAL_LOT') {
        this.getTime(waitOutFurnace.lineList[0].siteInDate);
      }
    }
  }


  /**
   * @description: 正计时
   * @param {String} inFurnaceTime 入炉时间
   * @return: null
   */
  getTime = (inFurnaceTime) => {
    const nowTime = Date.parse(new Date());
    const inTime = new Date(inFurnaceTime).getTime();
    let remaining = nowTime - inTime;
    this.timer = setInterval(() => {
      remaining += 1000;
      const hour = Math.floor((remaining / 1000 / 3600));
      const minute = Math.floor(((remaining - (hour * 60 * 60 * 1000)) / 1000 / 60) % 60);
      const second = Math.floor((remaining - (minute * 60 * 1000)) / 1000 % 60);
      this.setState({
        hour: hour < 10 ? `0${hour}` : hour,
        minute: minute < 10 ? `0${minute}` : minute,
        second: second < 10 ? `0${second}` : second,
      });
    }, 1000);
  }

  // 扫描条码
  @Bind()
  scanningOutFurnaceCode() {
    const { scanningOutFurnaceCode, form } = this.props;
    if (scanningOutFurnaceCode) {
      form.validateFields((err, values) => {
        if (!err && values.snNum) {
          // 如果验证成功,则执行onSearch
          scanningOutFurnaceCode(values);
        } else {
          notification.error({
            message: '请扫描条码！',
          });
        }
      });
    }
  }

  // 出炉
  @Bind()
  addOutFurnace() {
    const { addOutFurnace, form } = this.props;
    if (addOutFurnace) {
      form.validateFields((err, values) => {
        if (!err && values.snNum) {
          // 如果验证成功,则执行onSearch
          addOutFurnace(values);
        } else {
          notification.error({
            message: '请扫描条码！',
          });
        }
      });
    }
  }

  @Bind()
  handleContinueRework() {
    const { handleContinueRework, form } = this.props;
    if (handleContinueRework) {
      form.validateFields((err, values) => {
        if (!err && values.snNum) {
          // 如果验证成功,则执行onSearch
          handleContinueRework(values);
        } else {
          notification.error({
            message: '请扫描条码！',
          });
        }
      });
    }
  }

  render() {
    const {
      form,
      waitOutFurnace,
      addOutFurnaceLoading,
      handleContinueReworkLoading,
      isRecordLabCodeList,
      routerStepRemarkList,
    } = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'number',
        align: 'center',
        width: 50,
        render: (value, record, index) => index + 1,
      },
      {
        title: '序列号',
        dataIndex: 'materialLotCode',
        width: 120,
      },
      {
        title: '物料描述',
        dataIndex: 'materialName',
        width: 100,
      },
    ];
    return (
      <React.Fragment>
        <Form>
          <Row>
            <Col span={17}>
              <Form.Item>
                {form.getFieldDecorator('snNum', {})(
                  <Input placeholder="请扫描条码" style={{ height: '45px' }} />
                )}
              </Form.Item>
            </Col>
            <Col span={7} style={{ textAlign: 'end' }}>
              <Form.Item>
                <Button
                  style={{
                    display: 'none',
                  }}
                  htmlType="submit"
                  onClick={() => this.scanningOutFurnaceCode()}
                />
                <Button
                  style={{
                    backgroundColor: waitOutFurnace.isClickProcessComplete === 'N' ? '#f5f5f5' : '#536BD7',
                    color: waitOutFurnace.isClickProcessComplete === 'N' ? 'rgba(0, 0, 0, 0.25)' : '#fff',
                    fontSize: '16px',
                    height: '45px',
                  }}
                  disabled={waitOutFurnace.isClickProcessComplete === 'N'}
                  htmlType="submit"
                  onClick={() => this.addOutFurnace()}
                  loading={addOutFurnaceLoading}
                >
                  出炉
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Row>
          <Col span={18}>
            <Form style={{ marginTop: '15px' }} className={styles.outFurnace}>
              <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="数量">
                <span>{waitOutFurnace.sumEoCount}</span>
              </Form.Item>
              <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="下工序">
                <span>{ }</span>
              </Form.Item>
              <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="进炉时间">
                <Tooltip title={waitOutFurnace.snType === 'MATERIAL_LOT' ? waitOutFurnace.lineList[0].siteInDate : waitOutFurnace.siteInDate}>
                  <div
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {waitOutFurnace.snType === 'MATERIAL_LOT' ? waitOutFurnace.lineList[0].siteInDate : waitOutFurnace.siteInDate}
                  </div>
                </Tooltip>
              </Form.Item>
              <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="进炉操作">
                <span>{waitOutFurnace.snType === 'MATERIAL_LOT' ? waitOutFurnace.lineList[0].siteInByName : waitOutFurnace.siteInByName}</span>
              </Form.Item>
              <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="出炉时间">
                <span>{ }</span>
              </Form.Item>
              <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="出炉操作">
                <span>{waitOutFurnace.siteOutByName}</span>
              </Form.Item>
              <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="加工时长">
                <span>{this.state.hour}:{this.state.minute}:{this.state.second}</span>
              </Form.Item>
              <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="不良发起">
                <span>{waitOutFurnace.ncRecordWorkcellName}</span>
              </Form.Item>
              <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="实验备注">
                <Tooltip title={routerStepRemarkList}>
                  <div
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {routerStepRemarkList}
                  </div>
                </Tooltip>
              </Form.Item>
              <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="实验代码">
                {form.getFieldDecorator('labCode', {
                  initialValue: isRecordLabCodeList.toString(),
                })(
                  <Input
                    disabled={isRecordLabCodeList.length > 0}
                  />
                )}
              </Form.Item>
            </Form>
          </Col>
          <Col span={6} style={{ textAlign: 'end' }}>
            <Button
              style={{
                fontSize: '16px',
                height: '45px',
                marginTop: '15px',
              }}
              type="primary"
              disabled={waitOutFurnace.reworkFlag === 'N' || waitOutFurnace.prohibitClickContinueReworkFlag === 'Y'}
              onClick={() => this.handleContinueRework()}
              loading={handleContinueReworkLoading}
            >
              返修
            </Button>
          </Col>
        </Row>
        <Divider dashed style={{ backgroundColor: '#8BACFF' }} />
        <Table
          columns={columns}
          bordered
          dataSource={waitOutFurnace.lineList}
          pagination={false}
          scroll={{ x: tableScrollWidth(columns), y: 327 }}
        />
      </React.Fragment>
    );
  }
}
