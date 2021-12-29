/*
 * @Description: 工段-班次查询
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-09 17:56:29
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-08-18 20:06:56
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Form, Row, Col, Divider, Button, Select, DatePicker } from 'hzero-ui';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';
import { isFunction } from 'lodash';
import moment from 'moment';
import styles from '../index.less';

const formItemLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 16,
  },
};

const line = [];
@Form.create({ fieldNameProp: null })
export default class SectionAndShift extends Component {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {};
  }

  @Bind()
  checkLineData() {
    if (line.length === 0) {
      notification.warning({ message: '请通过【用户权限】功能，维护员工可操作工段' });
    }
  }

  /**
   * 表单重置
   */
  @Bind()
  handleFormReset() {
    const { form } = this.props;
    form.resetFields();
  }

  /**
   * 表单校验
   */
  @Bind()
  handleSearch() {
    const { onSearch, form } = this.props;
    if (onSearch) {
      form.validateFields((err, values) => {
        if (!err) {
          // 如果验证成功,则执行onSearch
          onSearch(values);
        }
      });
    }
  }

  /**
   * 结班撤回
   */
  @Bind()
  handleRollback() {
    const { onRollback, form } = this.props;
    if (onRollback) {
      form.validateFields((err, values) => {
        if (!err) {
          // 如果验证成功,则执行onSearch
          onRollback(values);
        }
      });
    }
  }

  render() {
    const {
      form,
      startClass,
      stopClass,
      resetShift,
      lineList = [],
      shiftList = [],
      fetchShiftList,
      onSelectShift,
      openEndShift = {},
      lineShift = {},
      loading,
    } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const now = moment().format('YYYY-MM-DD');
    return (
      <div className={styles.SectionAndShift}>
        <Form>
          <Row>
            <Col span={12}>
              <Form.Item label="日期" {...formItemLayout}>
                {getFieldDecorator('date', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: '日期',
                      }),
                    },
                  ],
                  initialValue: now && moment(now),
                })(
                  <DatePicker
                    placeholder=""
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                    disabledDate={currentDate => moment(now).isBefore(currentDate, 'second')}
                    onChange={() => {
                      form.resetFields();
                    }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={12} className={styles.button}>
              <Form.Item>
                <Button
                  data-code="reload"
                  icon="reload"
                  onClick={this.handleFormReset}
                  className={styles.buttonRefresh}
                >
                  刷新
                </Button>
                <Button
                  // data-code="search"
                  type="primary"
                  htmlType="submit"
                  icon="search"
                  onClick={() => this.handleSearch()}
                  className={styles.buttonSearch}
                >
                  {intl.get('hzero.common.button.search').d('查询')}
                </Button>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="工段" {...formItemLayout}>
                {getFieldDecorator('lineWorkcellId', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: '工段',
                      }),
                    },
                  ],
                })(
                  <Select
                    allowClear
                    onChange={values => {
                      form.resetFields(['shiftCode']);
                      fetchShiftList(values, getFieldValue('date'));
                    }}
                  >
                    {lineList.map(item => (
                      <Select.Option key={item.lineWorkcellId}>
                        {item.lineWorkcellName}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="班次" {...formItemLayout}>
                {getFieldDecorator('shiftCode', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: '班次',
                      }),
                    },
                  ],
                })(
                  <Select
                    allowClear
                    disabled={!getFieldValue('lineWorkcellId')}
                    // onFocus={() => fetchShiftList(getFieldValue('lineWorkcellId'), getFieldValue('date'))}
                    onChange={values => {
                      onSelectShift({ shiftCode: values });
                    }}
                  >
                    {shiftList.map(item => (
                      <Select.Option key={item.shiftCode}>{item.shiftCode}</Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <div>
          <Row>
            <Col span={19}>
              <span>
                未结班班次：
                <a onClick={() => resetShift(lineShift)}>{lineShift.shiftDateAndCode}</a>
              </span>
            </Col>
            <Col span={5}>
              <Button
                type="primary"
                onClick={() => this.handleRollback()}
                className={styles.buttonSearch}
                loading={loading}
                disabled={
                  (lineShift.shiftDateAndCode
                    ? lineShift.shiftDateAndCode !== '不存在未结班班次'
                    : true) || !openEndShift.shiftActualEndTime
                }
              >
                {intl.get('hzero.common.button.rollback').d('结班撤回')}
              </Button>
            </Col>
          </Row>
        </div>
        <Divider
          dashed
          style={{ borderTop: '1px dashed rgba(133,155,255,1)', margin: '14px 0px' }}
        />
        <div>
          <Row>
            <Col span={2} />
            <Col span={9} style={{ textAlign: 'center', height: '28px' }}>
              计划时间
            </Col>
            <Col span={9} style={{ textAlign: 'center', height: '28px' }}>
              实际时间
            </Col>
            <Col span={4} />
          </Row>
          <Row>
            <Col span={2} className={styles.col}>
              开班
            </Col>
            <Col span={9} className={styles.col} style={{ color: 'rgba(102,102,102,1)' }}>
              {openEndShift.shiftStartTime}
            </Col>
            <Col span={9} className={styles.col} style={{ color: 'rgba(102,102,102,1)' }}>
              {openEndShift.shiftActualStartTime}
            </Col>
            <Col span={4}>
              <Button
                style={{
                  backgroundColor: openEndShift.shiftActualStartTime
                    ? 'rgba(172,177,186,1)'
                    : 'rgba(39,190,206,1)',
                  color: openEndShift.shiftActualStartTime ? '#333' : '#fff',
                }}
                onClick={() => startClass()}
                disabled={openEndShift.shiftActualStartTime || !(shiftList.length > 0)}
              >
                开班
              </Button>
            </Col>
          </Row>
          <Row>
            <Col span={2} className={styles.col}>
              结班
            </Col>
            <Col span={9} className={styles.col} style={{ color: 'rgba(102,102,102,1)' }}>
              {openEndShift.shiftEndTime}
            </Col>
            <Col span={9} className={styles.col} style={{ color: 'rgba(102,102,102,1)' }}>
              {openEndShift.shiftActualEndTime}
            </Col>
            <Col span={4}>
              <Button
                style={{
                  backgroundColor: openEndShift.shiftActualEndTime
                    ? 'rgba(172,177,186,1)'
                    : 'rgba(39,190,206,1)',
                  color: openEndShift.shiftActualEndTime ? '#333' : '#fff',
                }}
                onClick={() => stopClass()}
                disabled={openEndShift.shiftActualEndTime || !(shiftList.length > 0)}
              >
                结班
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
