/*
 * @Description: 编辑
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-03-27 17:27:06
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-07-11 15:16:59
 * @Copyright: Copyright (c) 2019 Hand
 */

import React from 'react';
import { Form, DatePicker, Input, Button } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { connect } from 'dva';
import moment from 'moment';
import SideBar from 'components/Modal/SideBar';
import styles from '../index.less';

@Form.create({ fieldNameProp: null })
@connect(({ supplierIntroduction }) => ({
  supplierIntroduction,
}))
export default class Drawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // eslint-disable-next-line react/no-unused-state
      attachmentUuid: '',
      // eslint-disable-next-line react/no-unused-state
      rules: false, // 重大事件必输标识
    };
  }

  componentDidMount() {}

  onRef = ref => {
    this.child = ref;
  };

  @Bind()
  handleOk() {
    const { record } = this.props;
    const { form, onOk } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        onOk(fieldsValue, record);
      }
    });
  }

  render() {
    const { record = {}, editorVisible, onCancel, form, loading } = this.props;
    return (
      <SideBar
        title="编辑"
        className={styles['editor-modal']}
        visible={editorVisible}
        onCancel={onCancel}
        onOk={this.handleOk}
        confirmLoading={loading}
        footer={[
          <Button
            key="reset"
            onClick={onCancel.bind(this)}
          >
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={this.handleOk}
          >
            确定
          </Button>,
        ]}
      >
        <Form className={styles['editor-modal-from']}>
          <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="工单备注">
            {form.getFieldDecorator('woRemark', {
              initialValue: record.woRemark,
            })(<Input className={styles['more-fields-input']} />)}
          </Form.Item>
          <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="交付时间">
            {form.getFieldDecorator('deliveryDate', {
              initialValue: record.deliveryDate&&moment(record.deliveryDate, 'YYYY-MM-DD HH:mm:ss'),
            })(<DatePicker className={styles['more-fields-date']} />)}
          </Form.Item>
        </Form>
      </SideBar>
    );
  }
}
