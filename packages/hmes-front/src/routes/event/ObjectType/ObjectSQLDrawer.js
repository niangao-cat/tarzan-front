/**
 * ObjectSQLDrawer 对象SQL查看抽屉
 * @date: 2019-7-30
 * @author: jrq <ruiqi.jiang01@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { Form, Input, Modal, Spin } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';
import formatterCollections from 'utils/intl/formatterCollections';

const modelPrompt = 'tarzan.event.objectType.model.objectType';
const FormItem = Form.Item;

@formatterCollections({
  code: ['tarzan.event.objectType'], // code 为 [服务].[功能]的字符串数组
})
@Form.create({ fieldNameProp: null })
export default class ObjectSQLDrawer extends React.PureComponent {
  @Bind()
  handleOK() {
    const { form, onOk = e => e } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        onOk(fieldsValue);
      }
    });
  }

  render() {
    const { form, initData, visible, onCancel } = this.props;
    const { tableName, whereClause } = initData;
    const { getFieldDecorator } = form;
    return (
      <Modal
        destroyOnClose
        title={intl.get('tarzan.event.objectType.title.objectQuerySQL').d('对象语句查询')}
        visible={visible}
        onCancel={onCancel}
        onOk={this.handleOK}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        width={720}
      >
        <Spin spinning={false}>
          <Form>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.tableName`).d('对象查询表信息')}
            >
              {getFieldDecorator('tableName', {
                initialValue: tableName,
              })(<Input.TextArea style={{ height: 120 }} />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.whereClause`).d('对象查询语句')}
            >
              {getFieldDecorator('whereClause', {
                initialValue: whereClause,
              })(<Input.TextArea style={{ height: 120 }} />)}
            </FormItem>
          </Form>
        </Spin>
      </Modal>
    );
  }
}
