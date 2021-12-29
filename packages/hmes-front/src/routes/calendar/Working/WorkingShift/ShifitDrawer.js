/**
 * ShiftDrawer 班次信息新建编辑抽屉
 * @date: 2019-12-5
 * @author: hdy <deying.huang@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import {
  Modal,
  Form,
  Input,
  Row,
  Col,
  Switch,
  InputNumber,
  TimePicker,
  Select,
  DatePicker,
} from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import moment from 'moment';
import {
  FORM_COL_2_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
  DEFAULT_TIME_FORMAT,
  DEFAULT_DATE_FORMAT,
} from '@/utils/constants';
import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import Lov from 'components/Lov';

const modelPrompt = 'tarzan.calendar.working.model.working';

@connect(({ working }) => ({
  working,
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: 'tarzan.calendar.working',
})
export default class ShiftDrawer extends React.PureComponent {
  @Bind()
  handleOK() {
    const {
      dispatch,
      onOk,
      initData = {},
      working: { calendarShiftPagination = {} },
    } = this.props;
    const { calendarShiftId, calendarId } = initData;
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        dispatch({
          payload: {
            calendarShiftId,
            ...fieldsValue,
            shiftDate: fieldsValue.shiftDate.format(DEFAULT_DATE_FORMAT),
            calendarId: calendarId || fieldsValue.calendarId,
            shiftStartTime: `${fieldsValue.shiftDate.format(
              DEFAULT_DATE_FORMAT
            )} ${fieldsValue.shiftStartTime.format(DEFAULT_TIME_FORMAT)}`,
            shiftEndTime: `${fieldsValue.shiftDate.format(
              DEFAULT_DATE_FORMAT
            )} ${fieldsValue.shiftEndTime.format(DEFAULT_TIME_FORMAT)}`,
            enableFlag: fieldsValue.enableFlag ? 'Y' : 'N',
          },
          type: 'working/saveShift',
        }).then(res => {
          if (res && res.success) {
            notification.success();
            dispatch({
              type: 'working/fetchCalendarShiftList',
              payload: {
                page: {
                  ...calendarShiftPagination,
                },
              },
            });
            onOk();
          } else {
            notification.error({
              message: res.message,
            });
          }
        });
      }
    });
  }

  render() {
    const {
      visible,
      form,
      onCancel,
      initData,
      working: { capacityUnitList = [] },
    } = this.props;
    const {
      shiftDate,
      shiftCode,
      enableFlag,
      dayOfWeek,
      weekOfYear,
      sequence,
      shiftStartTime,
      shiftEndTime,
      restTime,
      utilizationRate,
      borrowingAbility,
      capacityUnit,
      standardCapacity,
      calendarCode,
      calendarId,
    } = initData;
    const { getFieldDecorator } = form;
    const tenantId = getCurrentOrganizationId();
    return (
      <Modal
        destroyOnClose
        width={720}
        title={intl.get('tarzan.calendar.working.title.shiftList').d('班次列表')}
        visible={visible}
        onCancel={onCancel}
        onOk={this.handleOK}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Form>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.calendarCode`).d('日历编码')}
              >
                {getFieldDecorator('calendarId', {
                  initialValue: calendarCode,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.calendarCode`).d('日历编码'),
                      }),
                    },
                  ],
                })(
                  <Lov
                    code="MT.CALENDAR"
                    queryParams={{ tenantId }}
                    textValue={calendarCode}
                    disabled={calendarId}
                    // onChange={this.changeCalendarCode}
                  />
                )}
              </Form.Item>
            </Col>
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
                })(<Input />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.shiftDate`).d('班次日期')}
              >
                {getFieldDecorator('shiftDate', {
                  initialValue: shiftDate && moment(shiftDate, 'YYYY-MM-DD'),
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.shiftDate`).d('班次日期'),
                      }),
                    },
                  ],
                })(<DatePicker style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.dayOfWeek`).d('星期')}
              >
                {getFieldDecorator('dayOfWeek', {
                  initialValue: dayOfWeek,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.weekOfYear`).d('周次')}
              >
                {getFieldDecorator('weekOfYear', {
                  initialValue: weekOfYear,
                })(<Input disabled />)}
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
                })(<InputNumber style={{ width: '100%' }} min={0} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.enableFlag`).d('启用状态')}
              >
                {getFieldDecorator('enableFlag', {
                  initialValue: enableFlag !== 'N',
                })(<Switch />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.shiftStartTime`).d('开始时间')}
              >
                {getFieldDecorator('shiftStartTime', {
                  initialValue: shiftStartTime && moment(shiftStartTime, 'HH:mm:ss'),
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.shiftStartTime`).d('开始时间'),
                      }),
                    },
                  ],
                })(<TimePicker format="HH:mm:ss" style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.shiftEndTime`).d('结束时间')}
              >
                {getFieldDecorator('shiftEndTime', {
                  initialValue: shiftEndTime && moment(shiftEndTime, 'HH:mm:ss'),
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.shiftEndTime`).d('结束时间'),
                      }),
                    },
                  ],
                })(<TimePicker format="HH:mm:ss" style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.restTime`).d('休息时间')}
              >
                {getFieldDecorator('restTime', {
                  initialValue: restTime,
                })(<InputNumber style={{ width: '100%' }} min={0} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.utilizationRate`).d('开动率')}
              >
                {getFieldDecorator('utilizationRate', {
                  initialValue: utilizationRate,
                })(<InputNumber style={{ width: '100%' }} min={0} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.borrowingAbility`).d('借用能力')}
              >
                {getFieldDecorator('borrowingAbility', {
                  initialValue: borrowingAbility,
                })(<InputNumber style={{ width: '100%' }} min={0} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.capacityUnit`).d('能力单位')}
              >
                {getFieldDecorator('capacityUnit', {
                  initialValue: capacityUnit,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.capacityUnit`).d('能力单位'),
                      }),
                    },
                  ],
                })(
                  <Select style={{ width: '100%' }} allowClear>
                    {(capacityUnitList || []).map(item => {
                      return (
                        <Select.Option value={item.typeCode} key={item.typeCode}>
                          {item.description}
                        </Select.Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.standardCapacity`).d('标准产量')}
              >
                {getFieldDecorator('standardCapacity', {
                  initialValue: standardCapacity,
                })(<InputNumber style={{ width: '100%' }} min={0} />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}
