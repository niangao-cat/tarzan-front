import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Row, Col, InputNumber, TimePicker, DatePicker } from 'hzero-ui';
import moment from 'moment';
import {
  FORM_COL_2_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
  DEFAULT_TIME_FORMAT,
  DEFAULT_DATE_FORMAT,
} from '@/utils/constants';
import intl from 'utils/intl';

const modelPrompt = 'tarzan.calendar.working.model.working';
/**
 * 表单数据展示
 * @extends {PureComponent} - React.PureComponent
 * @return React.element
 */

@connect(({ working }) => ({
  working,
}))
@Form.create({ fieldNameProp: null })
export default class ShiftForm extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'working/fetchCapacityUnitList',
      payload: {
        module: 'CALENDAR',
        typeGroup: 'CAPACITY_UNIT',
      },
    });
  }

  disabledDate = current => {
    const { shiftDate } = this.props;
    const endDay = moment(shiftDate, 'YYYY-MM-DD').add(2, 'd');
    return current < moment(shiftDate) || current > moment(endDay, 'YYYY-MM-DD');
  };

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      form,
      calendarShiftId,
      working: { shiftFormList = {} },
      editFlag,
      shiftDate,
    } = this.props;
    const {
      shiftCode,
      sequence,
      shiftStartTime,
      shiftEndTime,
      restTime,
      borrowingAbility,
      _status,
    } = shiftFormList;
    const { getFieldDecorator } = form;
    const start = form.getFieldValue('shiftStartTime')
      ? `${moment(shiftDate).format(DEFAULT_DATE_FORMAT)} ${form
          .getFieldValue('shiftStartTime')
          .format(DEFAULT_TIME_FORMAT)}`
      : undefined;
    return (
      <Form>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.shiftCode`).d('班次编码')}
            >
              {getFieldDecorator('shiftCode', {
                initialValue: shiftCode,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.shiftCode`).d('班次编码'),
                    }),
                  },
                ],
              })(<Input disabled={editFlag || (_status !== 'create' && calendarShiftId === '')} />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.sequence`).d('顺序')}
            >
              {getFieldDecorator('sequence', {
                initialValue: sequence,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.sequence`).d('顺序'),
                    }),
                  },
                ],
              })(
                <InputNumber
                  style={{ width: '100%' }}
                  disabled={editFlag || (_status !== 'create' && calendarShiftId === '')}
                  min={0}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.shiftStartTime`).d('开始时间')}
            >
              {getFieldDecorator('shiftStartTime', {
                initialValue: shiftStartTime && moment(shiftStartTime),
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.shiftStartTime`).d('开始时间'),
                    }),
                  },
                  {
                    validator: (rule, value, callback) => {
                      if (
                        form.getFieldValue('shiftEndTime') &&
                        `${moment(shiftDate).format(DEFAULT_DATE_FORMAT)} ${moment(
                          value._d,
                          'HH:mm:ss'
                        )}` >= form.getFieldValue('shiftEndTime')
                      ) {
                        callback(
                          intl
                            .get(`${modelPrompt}.validation.lessThanEnd`)
                            .d('开始时间必须小于结束时间!')
                        );
                      }
                      callback();
                    },
                  },
                ],
              })(
                <TimePicker
                  style={{ width: '100%' }}
                  disabled={editFlag || (_status !== 'create' && calendarShiftId === '')}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.shiftEndTime`).d('结束时间')}
            >
              {getFieldDecorator('shiftEndTime', {
                initialValue: shiftEndTime && moment(shiftEndTime),
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.shiftEndTime`).d('结束时间'),
                    }),
                  },
                  {
                    validator: (rule, value, callback) => {
                      if (start && value <= moment(start)) {
                        callback(
                          intl
                            .get(`${modelPrompt}.validation.moreThanStart`)
                            .d('结束时间必须大于开始时间!')
                        );
                      }
                      callback();
                    },
                  },
                ],
              })(
                <DatePicker
                  style={{ width: '100%' }}
                  disabled={editFlag || (_status !== 'create' && calendarShiftId === '')}
                  showTime={{ format: 'HH:mm:ss' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={this.disabledDate}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.restTime`).d('休息时间')}
            >
              {getFieldDecorator('restTime', {
                initialValue: restTime,
              })(
                <InputNumber
                  style={{ width: '100%' }}
                  disabled={editFlag || (_status !== 'create' && calendarShiftId === '')}
                  min={0}
                  formatter={value => `${value}h`}
                  parser={value => value.replace('h', '')}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.borrowingAbility`).d('借用能力')}
            >
              {getFieldDecorator('borrowingAbility', {
                initialValue: borrowingAbility,
              })(
                <InputNumber
                  style={{ width: '100%' }}
                  disabled={editFlag || (_status !== 'create' && calendarShiftId === '')}
                  min={0}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
