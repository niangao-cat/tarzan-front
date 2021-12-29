/**
 * WoSplitFormDrawer wo拆分抽屉
 * @date: 2019-12-23
 * @author: 许碧婷 <biting.xu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import React, { Component } from 'react';
import { Input, Modal, Form, InputNumber } from 'hzero-ui';
import { connect } from 'dva';
import notification from 'utils/notification';
import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';
import intl from 'utils/intl';

const modelPrompt = 'tarzan.workshop.productionOrderMgt.model.productionOrderMgt';
const FormItem = Form.Item;

@connect(({ productionOrderMgt }) => ({
  productionOrderMgt,
}))
@Form.create()
export default class WoSplitFormDrawer extends Component {
  componentDidMount = () => {
    const { dispatch, workOrderId } = this.props;
    // 查找详细信息
    dispatch({
      type: 'productionOrderMgt/fetchEoCreateDetail',
      payload: {
        workOrderId,
      },
    });
  };

  saveSplit = () => {
    const { form, dispatch, workOrderId, type, onCancel } = this.props;

    form.validateFieldsAndScroll({ force: true }, (err, values) => {
      if (!err) {
        dispatch({
          type: 'productionOrderMgt/saveWoSplitForm',
          payload: {
            workOrderId,
            splitQty: values.splitQty,
          },
        }).then(res => {
          if (res && res.success) {
            // 刷新整个页面
            notification.success();
            this.props.onRefresh(res.rows);
            onCancel(type);
          } else if (res && !res.success) {
            notification.error({
              message: res.message,
            });
          }
        });
      }
    });
  };

  render() {
    const {
      visible,
      onCancel,
      form,
      type,
      productionOrderMgt: {
        eoCreateDetail = {},
        // workOrderDetail = {}
      },
    } = this.props;
    const { getFieldDecorator } = form;
    const { workOrderNum, qty, completedQty, releasedQty } = eoCreateDetail;
    const notComplete = qty - releasedQty;

    return (
      <Modal
        destroyOnClose
        width={360}
        title={intl.get(`${modelPrompt}.splitWo`).d('WO拆分')}
        visible={visible}
        onCancel={() => onCancel(type)}
        onOk={this.saveSplit}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Form>
          <FormItem
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.workOrderNum`).d('WO编码')}
          >
            {getFieldDecorator('workOrderNum', {
              initialValue: workOrderNum,
            })(<Input disabled />)}
          </FormItem>
          <FormItem {...DRAWER_FORM_ITEM_LAYOUT} label={intl.get(`${modelPrompt}.qty`).d('WO数量')}>
            {getFieldDecorator('qty', {
              initialValue: qty,
            })(<Input disabled />)}
          </FormItem>
          <FormItem
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.releasedAreadyQty`).d('已下达数量')}
          >
            {getFieldDecorator('releasedQty', {
              initialValue: releasedQty,
            })(<Input disabled />)}
          </FormItem>
          <FormItem
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.notComplete`).d('未下达数量')}
          >
            {getFieldDecorator('notComplete', {
              initialValue: notComplete,
            })(<Input disabled />)}
          </FormItem>
          <FormItem
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.completedAreadyQty`).d('已完成数量')}
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
              rules: [
                {
                  required: true,
                  message: intl.get(`${modelPrompt}.splitNotEmptyMsg`).d('拆分数量不能为空'),
                },
              ],
            })(<InputNumber min={0} precision={2} style={{ width: '100%' }} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
