/**
 * InitDrawer 日历初始化抽屉
 * @date: 2019-12-4
 * @author: hdy <deying.huang@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, DatePicker, Select } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';

const modelPrompt = 'tarzan.calendar.working.model.working';
const FormItem = Form.Item;

@connect(({ working }) => ({
  working,
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: 'tarzan.calendar.working',
})
export default class InitDrawer extends React.PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'working/fetchShiftTypeList',
    });
  }

  @Bind()
  handleOK() {
    const { form, onOk = e => e, calendarId, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        dispatch({
          type: 'working/initCalendar',
          payload: {
            ...fieldsValue,
            shiftStartDate: fieldsValue.shiftStartDate.format(DEFAULT_DATE_FORMAT),
            shiftEndDate: fieldsValue.shiftEndDate.format(DEFAULT_DATE_FORMAT),
            calendarId,
          },
        }).then(res => {
          if (res && res.success) {
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
              message: res.message,
            });
          }
        });
      }
    });
  }

  render() {
    const {
      form,
      visible,
      onCancel,
      loading,
      working: { shiftTypeList = [], displayList = {} },
    } = this.props;
    const { calendarCode, calendarType, calendarTypeDesc } = displayList;
    const { getFieldDecorator } = form;
    return (
      <Modal
        destroyOnClose
        width={360}
        title={intl.get('tarzan.calendar.working.title.initCalendar').d('日历初始化')}
        visible={visible}
        onCancel={onCancel}
        onOk={this.handleOK}
        confirmLoading={loading}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Form>
          <FormItem
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.calendarCode`).d('日历编码')}
          >
            {getFieldDecorator('calendarCode', {
              initialValue: calendarCode,
            })(<Input disabled />)}
          </FormItem>
          <FormItem
            {...DRAWER_FORM_ITEM_LAYOUT}
            style={{ display: 'none' }}
            label={intl.get(`${modelPrompt}.calendarType`).d('日历类型')}
          >
            {getFieldDecorator('calendarType', {
              initialValue: calendarType,
            })(<Input disabled />)}
          </FormItem>
          <FormItem
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.calendarType`).d('日历类型')}
          >
            {getFieldDecorator('calendarTypeDesc', {
              initialValue: calendarTypeDesc,
            })(<Input disabled />)}
          </FormItem>
          <FormItem
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.shiftType`).d('排班策略')}
          >
            {getFieldDecorator('shiftType', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.shiftType`).d('排班策略'),
                  }),
                },
              ],
            })(
              <Select style={{ width: '100%' }} allowClear>
                {(shiftTypeList || []).map(item => {
                  return (
                    <Select.Option value={item.shiftType} key={item.shiftType}>
                      {item.shiftTypeDesc}
                    </Select.Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
          <FormItem
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.shiftStartDate`).d('开始日期')}
          >
            {getFieldDecorator('shiftStartDate', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.shiftStartDate`).d('开始日期'),
                  }),
                },
              ],
            })(<DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />)}
          </FormItem>
          <FormItem
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.shiftEndDate`).d('结束日期')}
          >
            {getFieldDecorator('shiftEndDate', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.shiftEndDate`).d('结束日期'),
                  }),
                },
              ],
            })(<DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
