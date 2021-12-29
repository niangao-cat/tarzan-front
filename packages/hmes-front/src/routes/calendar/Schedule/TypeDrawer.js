/**
 * MessageDrawer 类型编辑抽屉
 * @date: 2019-7-30
 * @author: hdy <deying.huang@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Switch, InputNumber, TimePicker, Row, Col } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
// import formatterCollections from 'utils/intl/formatterCollections';
import {
  DRAWER_FORM_ITEM_LAYOUT,
  FORM_COL_2_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from '@/utils/constants';
import moment from 'moment';

const modelPrompt = 'tarzan.calendar.schedule.model.schedule';
const FormItem = Form.Item;

@connect(({ loading, schedule }) => ({
  loading: loading.effects['schedule/saveType'],
  schedule,
}))
@Form.create({ fieldNameProp: null })
// @formatterCollections({
//   code: 'tarzan.calendar.schedule',
// })
export default class TypeDrawer extends React.PureComponent {
  @Bind()
  handleOK() {
    const {
      form,
      onOk = e => e,
      initData: { shiftId },
    } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        onOk({
          ...fieldsValue,
          sequence: !fieldsValue.sequence ? 0 : fieldsValue.sequence,
          enableFlag: fieldsValue.enableFlag ? 'Y' : 'N',
          shiftId,
          shiftEndTime: fieldsValue.shiftEndTime
            ? moment(fieldsValue.shiftEndTime).format('HH:mm:ss')
            : undefined,
          shiftStartTime: fieldsValue.shiftStartTime
            ? moment(fieldsValue.shiftStartTime).format('HH:mm:ss')
            : undefined,
        });
      }
    });
  }

  render() {
    const { form, initData, visible, onCancel, loading } = this.props;
    const {
      shiftCode,
      shiftType,
      shiftStartTime,
      shiftEndTime,
      restTime,
      borrowingAbility,
      enableFlag,
      sequence,
      // _token,
      shiftId,
    } = initData;
    const { getFieldDecorator } = form;
    return (
      <Modal
        destroyOnClose
        width={720}
        title={
          shiftId
            ? intl.get('tarzan.calendar.schedule.title.edit').d('编辑班次模板')
            : intl.get('tarzan.calendar.schedule.title.create').d('新建班次模板')
        }
        visible={visible}
        onCancel={onCancel}
        onOk={this.handleOK}
        confirmLoading={loading}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Form>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_2_LAYOUT}>
              <FormItem
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.shiftCode`).d('班次编码')}
              >
                {getFieldDecorator('shiftCode', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.shiftCode`).d('班次编码'),
                      }),
                    },
                  ],
                  initialValue: shiftCode,
                })(<Input />)}
              </FormItem>
            </Col>
            <Col {...FORM_COL_2_LAYOUT}>
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
                  initialValue: shiftType,
                })(<Input trim typeCase="upper" />)}
              </FormItem>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_2_LAYOUT}>
              <FormItem
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.shiftStartTime`).d('开始时间')}
              >
                {getFieldDecorator('shiftStartTime', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.shiftStartTime`).d('开始时间'),
                      }),
                    },
                  ],
                  initialValue: shiftStartTime ? moment(shiftStartTime, 'HH:mm:ss') : undefined,
                })(<TimePicker style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col {...FORM_COL_2_LAYOUT}>
              <FormItem
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.shiftEndTime`).d('结束时间')}
              >
                {getFieldDecorator('shiftEndTime', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.shiftEndTime`).d('结束时间'),
                      }),
                    },
                  ],
                  initialValue: shiftEndTime ? moment(shiftEndTime, 'HH:mm:ss') : undefined,
                })(<TimePicker style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_2_LAYOUT}>
              <FormItem
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.restTime`).d('休息时间')}
              >
                {getFieldDecorator('restTime', {
                  initialValue: restTime,
                })(<InputNumber style={{ width: '100%' }} min={0} />)}
              </FormItem>
            </Col>
            <Col {...FORM_COL_2_LAYOUT}>
              <FormItem
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.borrowingAbility`).d('借用能力')}
              >
                {getFieldDecorator('borrowingAbility', {
                  initialValue: borrowingAbility,
                })(<InputNumber style={{ width: '100%' }} min={0} />)}
              </FormItem>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_2_LAYOUT}>
              <FormItem
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
              </FormItem>
            </Col>
            <Col {...FORM_COL_2_LAYOUT}>
              <FormItem
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.enableFlag`).d('启用状态')}
              >
                {getFieldDecorator('enableFlag', {
                  initialValue: enableFlag !== 'N',
                })(<Switch />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}
