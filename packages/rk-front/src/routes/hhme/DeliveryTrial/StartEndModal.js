
import React, { Component } from 'react';
import { Modal, Form, DatePicker, Row, Col, Popconfirm, Button } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import moment from 'moment';
import styles from './index.less';

const prefixModel = `hmes.operationPlatform.model.operationPlatform`;

@Form.create({ fieldNameProp: null })
export default class StartEndModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }



  @Bind
  handleOK = () => {
    const { form, changeDate } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        changeDate(values);
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      visible,
      onCancel,
      changeDateLoading,
      woRecord,
    } = this.props;
    const DRAWER_FORM_ITEM_LAYOUT_MAX = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };
    // const now = moment().format("YYYY-MM-DD");
    return (
      <Modal
        destroyOnClose
        width={400}
        title='时间调整'
        visible={visible}
        onCancel={() => onCancel({}, false)}
        footer={[
          <Button onClick={() => onCancel({}, false)}>
            取消
          </Button>,
          <Popconfirm
            title='是否需要排期？'
            onConfirm={this.handleOK}
          >
            <Button type="primary" loading={changeDateLoading}>确定</Button>
          </Popconfirm>,
        ]}
        wrapClassName={styles['enter-modal']}
      >
        <Form>
          <Row>
            <Col span={20}>
              <Form.Item {...DRAWER_FORM_ITEM_LAYOUT_MAX} label="工单号">
                <span>{woRecord.workOrderNum}</span>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={20}>
              <Form.Item {...DRAWER_FORM_ITEM_LAYOUT_MAX} label="开始时间">
                {getFieldDecorator('dateFrom', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${prefixModel}.dateFrom`).d('开始时间'),
                      }),
                    },
                  ],
                  initialValue: woRecord.dateFrom && moment(woRecord.dateFrom),
                })(
                  <DatePicker
                    placeholder=""
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                    disabledDate={currentDate =>
                      currentDate < moment().startOf('day') || currentDate > moment().add(44, 'day')
                    }
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={20}>
              <Form.Item {...DRAWER_FORM_ITEM_LAYOUT_MAX} label="结束时间">
                {getFieldDecorator('dateTo', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${prefixModel}.dateTo`).d('结束时间'),
                      }),
                    },
                  ],
                  initialValue: woRecord.dateTo && moment(woRecord.dateTo),
                })(
                  <DatePicker
                    placeholder=""
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                    disabledDate={currentDate =>
                      currentDate < moment().startOf('day') || currentDate > moment().add(44, 'day')
                    }
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}
