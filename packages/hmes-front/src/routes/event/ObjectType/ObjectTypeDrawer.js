/**
 * ObjectTypeDrawer 类型编辑抽屉
 * @date: 2019-7-30
 * @author: jrq <ruiqi.jiang01@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { Form, Input, Modal, Row, Col } from 'hzero-ui';
import intl from 'utils/intl';
import {
  FORM_COL_2_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
  EDIT_FORM_ITEM_LAYOUT_COL_3,
} from '@/utils/constants';
import formatterCollections from 'utils/intl/formatterCollections';

const modelPrompt = 'tarzan.event.objectType.model.objectType';

@formatterCollections({
  code: ['tarzan.event.objectType'], // code 为 [服务].[功能]的字符串数组
})
@Form.create({ fieldNameProp: null })
export default class ObjectTypeDrawer extends React.PureComponent {
  render() {
    const { form, initData, visible, onCancel } = this.props;
    const { objectTypeCode, description, eventTypeQuerySql } = initData;
    const { getFieldDecorator } = form;
    return (
      <Modal
        destroyOnClose
        title={intl.get('tarzan.event.objectType.title.objectPreview').d('对象展示预览')}
        visible={visible}
        onCancel={onCancel}
        onOk={onCancel}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        width={720}
      >
        <Form>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.objectTypeCode`).d('对象类型编码')}
              >
                {getFieldDecorator('objectTypeCode', {
                  initialValue: objectTypeCode,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.description`).d('对象类型描述')}
              >
                {getFieldDecorator('description', {
                  initialValue: description,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ margin: '0px 20px' }}>
            <Col span={24}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT_COL_3}
                label={intl.get(`${modelPrompt}.eventTypeQuerySql`).d('对象语句查询')}
              >
                {getFieldDecorator('eventTypeQuerySql', {
                  initialValue: eventTypeQuerySql,
                })(
                  <Input.TextArea
                    style={{ height: 400, marginLeft: 6, width: 'calc(100% - 6px)' }}
                    disabled
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
