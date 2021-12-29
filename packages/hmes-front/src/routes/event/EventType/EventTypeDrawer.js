/**
 * EventTypeDrawer 类型编辑抽屉
 * @date: 2019-7-31
 * @author: hdy <deying.huang@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { Form, Input, Modal, Spin, Switch, Select } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import TLEditor from '@/components/TLEditor';
import intl from 'utils/intl';
import { isUndefined } from 'lodash';
import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';

const modelPrompt = 'tarzan.event.type.model.type';
const FormItem = Form.Item;

@Form.create({ fieldNameProp: null })
export default class EventTypeDrawer extends React.PureComponent {
  state = {
    newOnhandChangeType: undefined,
  };

  @Bind()
  handleOK() {
    const { form, initData, onOk = e => e } = this.props;
    const { eventTypeId } = initData;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        const enableFlag = fieldsValue.enableFlag ? 'Y' : 'N';
        const defaultEventTypeFlag = fieldsValue.defaultEventTypeFlag ? 'Y' : 'N';
        const onhandChangeFlag = fieldsValue.onhandChangeFlag ? 'Y' : 'N';
        onOk({ ...fieldsValue, enableFlag, onhandChangeFlag, defaultEventTypeFlag, eventTypeId });
      }
    });
  }

  @Bind
  onhandChangeFlag(checked) {
    this.setState({
      newOnhandChangeType: checked,
    });
  }

  render() {
    const { form, initData, visible, onCancel, onhandChangeTypeList } = this.props;
    const {
      eventTypeCode,
      onhandChangeType,
      description,
      enableFlag,
      defaultEventTypeFlag,
      onhandChangeFlag,
      eventTypeId,
    } = initData;
    const { newOnhandChangeType } = this.state;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <Modal
        destroyOnClose
        width={360}
        title={
          initData.eventTypeId
            ? intl.get('tarzan.event.type.title.edit').d('编辑事件类型')
            : intl.get('tarzan.event.type.title.create').d('新建事件类型')
        }
        visible={visible}
        onCancel={onCancel}
        onOk={this.handleOK}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Spin spinning={false}>
          <Form>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.eventTypeCode`).d('事件类型编码')}
            >
              {getFieldDecorator('eventTypeCode', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.eventTypeCode`).d('事件类型编码'),
                    }),
                  },
                ],
                initialValue: eventTypeCode,
              })(<Input />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.description`).d('事件类型描述')}
            >
              {getFieldDecorator('description', {
                initialValue: description,
              })(
                <TLEditor
                  label={intl.get(`${modelPrompt}.description`).d('事件类型描述')}
                  field="description"
                  dto="tarzan.general.domain.entity.MtEventType"
                  pkValue={{ eventTypeId: eventTypeId || null }}
                />
              )}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.enableFlag`).d('启用状态')}
            >
              {getFieldDecorator('enableFlag', {
                initialValue: enableFlag !== 'N',
              })(<Switch />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.defaultEventTypeFlag`).d('系统初始事件标识')}
            >
              {getFieldDecorator('defaultEventTypeFlag', {
                initialValue: defaultEventTypeFlag === 'Y',
              })(<Switch />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.onhandChangeFlag`).d('影响库存标识')}
            >
              {getFieldDecorator('onhandChangeFlag', {
                initialValue: onhandChangeFlag === 'Y',
              })(<Switch onChange={this.onhandChangeFlag} />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.onhandChangeType`).d('影响库存方向')}
            >
              {getFieldDecorator('onhandChangeType', {
                initialValue: onhandChangeType,
              })(
                <Select
                  style={{ width: '100%' }}
                  allowClear
                  disabled={
                    !getFieldValue('onhandChangeFlag') ||
                    (isUndefined(newOnhandChangeType)
                      ? onhandChangeFlag === 'N'
                      : !newOnhandChangeType)
                  }
                >
                  {onhandChangeTypeList instanceof Array &&
                    onhandChangeTypeList.length !== 0 &&
                    onhandChangeTypeList.map(item => {
                      return (
                        <Select.Option value={item.typeCode} key={item.typeCode}>
                          {item.description}
                        </Select.Option>
                      );
                    })}
                </Select>
              )}
            </FormItem>
          </Form>
        </Spin>
      </Modal>
    );
  }
}
