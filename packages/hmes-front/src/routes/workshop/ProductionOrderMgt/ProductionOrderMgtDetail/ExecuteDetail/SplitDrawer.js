/**
 * SplitDrawer 拆分抽屉
 * @date: 2019-12-25
 * @author: hdy <deying.huang@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, InputNumber } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';

const modelPrompt = 'tarzan.workshop.execute.model.execute';
const FormItem = Form.Item;

@connect(({ execute }) => ({
  execute,
}))
@Form.create({ fieldNameProp: null })
export default class SplitDrawer extends React.Component {
  @Bind()
  handleOK() {
    const { form, onOk = e => e, eoId, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        dispatch({
          type: 'execute/splitExecute',
          payload: {
            ...fieldsValue,
            eoId,
          },
        }).then(res => {
          if (res && res.success) {
            onOk(res.rows);
            notification.success();
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
      execute: { displayList = {} },
    } = this.props;
    const { eoNum, qty, completedQty, splitQty } = displayList;
    const { getFieldDecorator } = form;
    return (
      <Modal
        destroyOnClose
        width={360}
        title={intl.get('tarzan.workshop.execute.title.split').d('EO拆分')}
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
            label={intl.get(`${modelPrompt}.eoNum`).d('EO编码')}
          >
            {getFieldDecorator('eoNum', {
              initialValue: eoNum,
            })(<Input disabled />)}
          </FormItem>
          <FormItem
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.eoQty`).d('EO数量')}
          >
            {getFieldDecorator('eoQty', {
              initialValue: qty,
            })(<Input disabled />)}
          </FormItem>
          <FormItem
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.completedQty`).d('已完成数量')}
          >
            {getFieldDecorator('completedQty', {
              initialValue: completedQty,
            })(<Input disabled />)}
          </FormItem>
          <FormItem
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.splitQty`).d('拆分数量')}
          >
            {getFieldDecorator('splitQty', {
              initialValue: splitQty,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.splitQty`).d('拆分数量'),
                  }),
                },
                {
                  validator: (rule, value, callback) => {
                    if (value <= 0) {
                      callback(
                        intl.get(`${modelPrompt}.validation.moreThanZero`).d('拆分数量必须大于0!')
                      );
                    }
                    callback();
                  },
                },
              ],
            })(<InputNumber style={{ width: '100%' }} precision={2} min={0} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
