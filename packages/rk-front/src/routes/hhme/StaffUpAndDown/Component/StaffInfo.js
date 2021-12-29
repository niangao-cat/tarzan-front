/*
 * @Description: 员工信息
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-05-28 17:09:40
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-08-16 14:53:11
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { PureComponent } from 'react';
import { Row, Col, Form, Select } from 'hzero-ui';
import { isFunction } from 'lodash';
import yg from '../../../../assets/stuffUpAndDown/yg.png';
import workCell from '../../../../assets/stuffUpAndDown/workCell.png';
import styles from '../index.less';

const { Option } = Select;

@Form.create({ fieldNameProp: null })
export default class StaffInfo extends PureComponent {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {
    };
  }

  render() {
    const { form, staffData, workcellLists = [], changeWorkcell } = this.props;
    const { getFieldDecorator } = form;
    const formLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 16,
      },
    };
    return (
      <Form>
        <Row>
          <Col span={24}>
            <Form.Item
              label={(
                <span>
                  <img src={yg} alt="" className={styles.staffUpAndDown_img} />
                  <span>员工</span>
                </span>
              )}
              {...formLayout}
            >
              {staffData.employeeName}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={(
                <span>
                  <img src={workCell} alt="" className={styles.staffUpAndDown_img} />
                  <span>工段</span>
                </span>
              )}
              {...formLayout}
            >
              {getFieldDecorator('workcellId', {
              })(
                <Select onChange={changeWorkcell}>
                  {workcellLists.map(item => (
                    <Option key={item.lineWorkcellId} value={item.lineWorkcellId}>
                      {item.lineWorkcellName}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
