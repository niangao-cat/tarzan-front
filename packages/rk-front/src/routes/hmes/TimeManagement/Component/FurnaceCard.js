/*
 * @Description: 炉信息卡片
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-07 18:27:21
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-11-11 10:56:41
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Form, Row, Col, Tooltip } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import styles from '../index.less';

@Form.create({ fieldNameProp: null })
export default class FurnaceCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hour: 0,
      minute: 0,
      second: 0,
      className: '',
      // eslint-disable-next-line react/no-unused-state
      key: props.key, // 用来控制子组件刷新的
    };
  }

  componentDidMount() {
    const { furnaceInfo, standardReqdTimeInProcess } = this.props;
    const res = this.getMinutesDiff(furnaceInfo.siteInDate, Date.parse(new Date()));
    if (res > standardReqdTimeInProcess) {
      // 当前时间超过标准时常
      this.getTime(furnaceInfo.siteInDate, standardReqdTimeInProcess);
    } else {
      const inTime = new Date(furnaceInfo.siteInDate).getTime();
      const end = inTime + (standardReqdTimeInProcess * 60000);
      this.countFun(end);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.key !== this.props.key) {
      const { furnaceInfo, standardReqdTimeInProcess } = nextProps;
      const res = this.getMinutesDiff(furnaceInfo.siteInDate, Date.parse(new Date()));
      if (res > standardReqdTimeInProcess) {
        // 当前时间超过标准时常
        this.getTime(furnaceInfo.siteInDate, standardReqdTimeInProcess);
      } else {
        const inTime = new Date(furnaceInfo.siteInDate).getTime();
        const end = inTime + (standardReqdTimeInProcess * 60000);
        this.countFun(end);
      }
    }
  }

  // 卸载组件取消倒计时
  componentWillUnmount() {
    this.setState({
      hour: 0,
      minute: 0,
      second: 0,
      className: '',
      // eslint-disable-next-line react/no-unused-state
      key: '', // 用来控制子组件刷新的
    });
  }

  /**
   * @description: 计算时间差
   * @param {String} stime 开始时间-对应入炉时间
   * @param {String} etime 结束时间-对应当前时间
   * @return: minutes
   */
  @Bind()
  getMinutesDiff(stime, etime) {
    const st = new Date(stime).getTime();
    const et = new Date(etime).getTime();
    const minutes = (et - st) / (60 * 1000); // 两个时间戳相差的分钟数
    return minutes;
  }

  // 倒计时
  countFun = (end) => {
    const nowTime = Date.parse(new Date());
    let remaining = end - nowTime;
    this.setState({ className: 'inTime' });
    if (remaining > 1000) {
      remaining -= 1000;
      const hour = Math.floor((remaining / 1000 / 3600) % 24);
      const minute = Math.floor((remaining / 1000 / 60) % 60);
      const second = Math.floor(remaining / 1000 % 60);
      // 判断剩余时间是否低于20分钟
      if (hour === 0 && minute <= 20) {
        this.setState({ className: 'twTime' });
      } else {
        this.setState({ className: 'inTime' });
      }
      this.setState({
        hour: hour < 10 ? `0${hour}` : hour,
        minute: minute < 10 ? `0${minute}` : minute,
        second: second < 10 ? `0${second}` : second,
      });
    } else {
      const { furnaceInfo, standardReqdTimeInProcess } = this.props;
      this.getTime(furnaceInfo.siteInDate, standardReqdTimeInProcess);
    }
  }

  /**
   * @description: 正计时
   * @param {String} inFurnaceTime 入炉时间
   * @param {String} standardTime 标准时长
   * @return: null
   */
  getTime = (inFurnaceTime, standardReqdTimeInProcess) => {
    const nowTime = Date.parse(new Date());
    // const inTime = new Date(inFurnaceTime).getTime();
    const inTime = new Date(inFurnaceTime).getTime();
    let remaining = nowTime - (inTime + (standardReqdTimeInProcess * 60 * 1000));
    this.setState({ className: 'outTime' });
    remaining += 1000;
    const hour = Math.floor((remaining / 1000 / 3600));
    const minute = Math.floor(((remaining - (hour * 60 * 60 * 1000)) / 1000 / 60) % 60);
    const second = Math.floor((remaining - (minute * 60 * 1000)) / 1000 % 60);

    this.setState({
      hour: hour < 10 ? `0${hour}` : hour,
      minute: minute < 10 ? `0${minute}` : minute,
      second: second < 10 ? `0${second}` : second,
    });
  }

  render() {
    const { furnaceInfo, number, scanningOutFurnaceCode } = this.props;
    return (
      <div
        className={styles[this.state.className]}
        onClick={() => scanningOutFurnaceCode({ snNum: furnaceInfo.materialLotCode })}
        style={{ cursor: 'pointer' }}
      >
        <Row className={styles.furnaceCardRowOut}>
          <Col className={styles.furnaceCardCloLefOut} span={6}>
            {number + 1}
          </Col>
          <Col className={styles.furnaceCardCloRigOut} span={18}>
            {this.state.className === 'outTime' && '+'}{this.state.hour}:{this.state.minute}:{this.state.second}
          </Col>
        </Row>
        <Form style={{ height: '110px', padding: '5px' }}>
          <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="条码">
            <span>{furnaceInfo.materialLotCode}</span>
          </Form.Item>
          <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="物料">
            <Tooltip title={furnaceInfo.materialName}>
              <div
                style={{
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {furnaceInfo.materialName}
              </div>
            </Tooltip>
          </Form.Item>
          <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="数量">
            <span>{furnaceInfo.sumEoQty}</span>
          </Form.Item>
          <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="进炉时间">
            <span>{furnaceInfo.siteInDate}</span>
          </Form.Item>
          <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="进炉操作">
            <span>{furnaceInfo.siteInByName}</span>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
