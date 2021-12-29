/*
 * @Description: 安全
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-10 19:32:27
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-08-05 16:33:41
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Form, Row, Col } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import moment from 'moment';
import styles from '../index.less';
import Days from './Days';

@Form.create({ fieldNameProp: null })
export default class MidInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      days: 0, // 当前月份天数
      dayNow: 0, // 当前属于几号
      // eslint-disable-next-line react/no-unused-state
      exceptionDays: 0, // 异常天数
    };
  }

  /**
   * 组件挂载后执行方法
   */
  componentDidMount() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const d = new Date(year, month, 0);
    this.setState({ days: d.getDate(), dayNow: date.getDate() });
  }

  componentWillReceiveProps(nextProps) {
    const { employeeSecurity = [] } = nextProps;
    if (employeeSecurity.length > 0) {
      let exceptionDays = 0;
      if (employeeSecurity.length > 0) { // 判断是否进行了查询，要是不查询就不循环每天的信息
        for (let i = 0; i < new Date().getDate(); i++) {
          if (employeeSecurity[i].exceptionNumber > 0) {
            exceptionDays += 1;
          }
        }
      }
      // eslint-disable-next-line react/no-unused-state
      this.setState({ exceptionDays });
    }
  }

  // 循环展示天数
  @Bind()
  renderRow(number, param, day, dayNow, padding, employeeSecurity) {
    const cols = [];
    for (let i = 0; i <= number - 1;) {
      const element = [];
      for (let j = 0; j < param && i <= number - 1; j++, i++) {
        const dayNowParam = day + i <= dayNow; // 当前日期前有背景色
        const dayInfo = employeeSecurity[i]; // 当前日期的安全信息
        if (dayInfo) {
          element.push(
            <Col span={3} style={{ width: '20px', marginRight: '6px' }}>
              <Days
                dayNowParam={dayNowParam}
                clickDay={this.clickDay}
                daySecurity={dayInfo}
              >
                {day + i < 10 ? `0${day + i}` : day + i}
              </Days>
            </Col>
          );
        }
      }
      cols.push(<Row style={{ marginTop: '3px', padding }}>{element}</Row>);
    }
    return cols;
  }

  clickDay(val) {
    // eslint-disable-next-line no-console
    console.log(val);
  }

  @Bind()
  renderDays(employeeSecurity) {
    const { days, dayNow } = this.state;
    return (
      <React.Fragment>
        {this.renderRow(6, 3, 1, dayNow, '0px 62px', employeeSecurity)}
        {this.renderRow(21, 7, 7, dayNow, '0px 10px', employeeSecurity)}
        {this.renderRow(days - 27, 3, 28, dayNow, '0px 62px', employeeSecurity)}
      </React.Fragment>
    );
  }

  render() {
    const { employeeSecurity = [] } = this.props;
    return (
      <React.Fragment>
        <div className={styles.title}>
          <div className={styles.colorDiv} />
          <span>人员安全</span>
          <div style={{ float: 'right' }}>日期：{moment().format("YYYY-MM-DD")}</div>
        </div>
        <Row>
          <Col span={14} style={{ height: '159px', width: '203px', backgroundColor: '#fff' }}>
            {this.renderDays(employeeSecurity)}
          </Col>
          <Col span={10}>
            <Row className={styles.safeRig}>
              <div className={styles.LX1} />
              <div className={styles.safeRigTitle}>
                <span style={{ marginLeft: '15px' }}>0</span>
              </div>
            </Row>
            <Row className={styles.safeRig}>
              <div className={styles.LX2} />
              <div className={styles.safeRigTitle}>
                <span style={{ marginLeft: '15px' }}>1~3</span>
              </div>
            </Row>
            <Row className={styles.safeRig}>
              <div className={styles.LX3} />
              <div className={styles.safeRigTitle}>
                <span style={{ marginLeft: '15px' }}>3~5</span>
              </div>
            </Row>
            <Row className={styles.safeRig}>
              <div className={styles.LX4} />
              <div className={styles.safeRigTitle}>
                <span style={{ marginLeft: '15px' }}>5~7</span>
              </div>
            </Row>
            <Row className={styles.safeRig}>
              <div className={styles.LX5} />
              <div className={styles.safeRigTitle}>
                <span style={{ marginLeft: '15px' }}>&gt;7</span>
              </div>
            </Row>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
