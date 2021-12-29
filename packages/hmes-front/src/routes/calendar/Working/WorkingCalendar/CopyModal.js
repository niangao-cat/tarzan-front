/**
 * CopyModal 复制弹窗
 * @date: 2019-12-5
 * @author: hdy <deying.huang@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, DatePicker, Tooltip, Icon } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import moment from 'moment';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';
import { getCurrentOrganizationId } from 'utils/utils';
import Lov from 'components/Lov';

const modelPrompt = 'tarzan.calendar.working.model.working';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { confirm } = Modal;

@connect(({ working }) => ({
  working,
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: 'tarzan.calendar.working',
})
export default class CopyModal extends React.PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'working/fetchShiftTypeList',
    });
  }

  @Bind()
  handleOK() {
    const {
      form,
      onOk = e => e,
      calendarId,
      dispatch,
      working: { displayList = {} },
    } = this.props;
    const { calendarType } = displayList;
    form.validateFields((err, fieldsValue) => {
      const { sourceShiftDate, targetShiftDate } = fieldsValue;
      let sourceDate = {};
      const sourceShiftStartDate =
        sourceShiftDate && sourceShiftDate[0].format(DEFAULT_DATE_FORMAT);
      const sourceShiftEndDate = sourceShiftDate && sourceShiftDate[1].format(DEFAULT_DATE_FORMAT);
      if (sourceShiftDate) {
        sourceDate = {
          sourceShiftStartDate,
          sourceShiftEndDate,
        };
      }
      let targetDate = {};
      const targetShiftStartDate =
        targetShiftDate && targetShiftDate[0].format(DEFAULT_DATE_FORMAT);
      const targetShiftEndDate = targetShiftDate && targetShiftDate[1].format(DEFAULT_DATE_FORMAT);
      if (targetShiftDate) {
        targetDate = {
          targetShiftStartDate,
          targetShiftEndDate,
        };
      }
      if (!err) {
        dispatch({
          type: 'working/copyShiftCheck',
          payload: {
            ...sourceDate,
            ...targetDate,
            targetCalendarId: calendarId,
            sourceCalendarType: calendarType,
            sourceCalendarId: fieldsValue.sourceCalendarId,
          },
        }).then(res => {
          if (res && res.success && res.rows === 'Y') {
            dispatch({
              type: 'working/copyShift',
              payload: {
                ...sourceDate,
                ...targetDate,
                targetCalendarId: calendarId,
                sourceCalendarType: calendarType,
                sourceCalendarId: fieldsValue.sourceCalendarId,
              },
            }).then(response => {
              if (response && response.success) {
                onOk();
                notification.success();
                dispatch({
                  type: 'working/fetchShiftList',
                  payload: {
                    calendarId,
                  },
                });
              } else {
                notification.error({
                  message: response.message,
                });
              }
            });
          } else {
            confirm({
              title: res.message,
              okText: '确定',
              okType: 'danger',
              cancelText: '取消',
              onOk() {
                dispatch({
                  type: 'working/copyShift',
                  payload: {
                    ...sourceDate,
                    ...targetDate,
                    targetCalendarId: calendarId,
                    sourceCalendarType: calendarType,
                    sourceCalendarId: fieldsValue.sourceCalendarId,
                  },
                }).then(response => {
                  if (response && response.success) {
                    onOk();
                    notification.success();
                    dispatch({
                      type: 'working/fetchShiftList',
                      payload: {
                        calendarId,
                      },
                    });
                  } else {
                    notification.error({
                      message: response.message,
                    });
                  }
                });
              },
            });
          }
        });
      }
    });
  }

  disabledDate = current => {
    return current < moment().subtract('days', 1);
  };

  render() {
    const {
      form,
      visible,
      onCancel,
      working: { displayList = [] },
    } = this.props;
    const { getFieldDecorator } = form;
    const { calendarCode } = displayList;
    const tenantId = getCurrentOrganizationId();
    return (
      <Modal
        destroyOnClose
        width={600}
        title={intl.get('tarzan.calendar.working.title.copyShift').d('复制班次')}
        visible={visible}
        onCancel={onCancel}
        onOk={this.handleOK}
        okText={intl.get('tarzan.calendar.working.button.copy').d('复制')}
      >
        <Form>
          <FormItem
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.sourceCalendarId`).d('来源日历')}
          >
            {getFieldDecorator('sourceCalendarId', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.shiftStartDate`).d('来源日历'),
                  }),
                },
              ],
              initialValue: calendarCode,
            })(<Lov code="MT.CALENDAR" queryParams={{ tenantId }} />)}
          </FormItem>
          <FormItem
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.sourceShiftDate`).d('复制来源日期')}
          >
            {getFieldDecorator('sourceShiftDate', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.sourceShiftDate`).d('复制来源日期'),
                  }),
                },
              ],
            })(<RangePicker format="YYYY-MM-DD" style={{ width: '100%' }} />)}
          </FormItem>
          <FormItem
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.calendarCode`).d('目标日历')}
          >
            {getFieldDecorator('targetCalendarId', {
              initialValue: calendarCode,
            })(<Input disabled />)}
          </FormItem>
          <FormItem
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.targetShiftDate`).d('复制目标日期')}
          >
            {getFieldDecorator('targetShiftDate', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.targetShiftDate`).d('复制目标日期'),
                  }),
                },
              ],
            })(
              <RangePicker
                format="YYYY-MM-DD"
                style={{ width: '100%' }}
                disabledDate={this.disabledDate}
              />
            )}
            <Tooltip
              placement="topLeft"
              title={intl.get(`${modelPrompt}.copyInfo`).d(
                `复制规则:
1.短时间段复制到长时间段，例如：来源日期为2019-12-01~2019-12-03，目标日期为2019-12-04~2019-12-10，则将来源日期的数据按顺序循环复制到目标日期，目标4~6、7~9为来源1~3，目标10为来源1
2.长时间段复制到短时间段，例如：来源日期为2019-12-01~2019-12-10，目标日期为2019-12-04~2019-12-10，则目标4~10为来源1~7，来源8~10不在本次复制范围内
3.若时间段相同，无特殊规则，将来源直接复制到目标`
              )}
            >
              <Icon
                type="question-circle"
                style={{
                  position: 'absolute',
                  theme: 'outlined',
                  top: 2,
                  right: '-20px',
                  fontSize: 14,
                }}
              />
            </Tooltip>
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
