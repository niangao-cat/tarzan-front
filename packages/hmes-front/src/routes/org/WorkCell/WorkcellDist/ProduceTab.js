import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, InputNumber } from 'hzero-ui';
import { isUndefined } from 'lodash';
import {
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
} from '@/utils/constants';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';

const modelPrompt = 'tarzan.org.workcell.model.workcell';
/**
 * 生产属性表单数据展示
 * @extends {PureComponent} - React.PureComponent
 * @return React.element
 */

@connect(({ workcell }) => ({
  workcell,
}))
@formatterCollections({ code: ['tarzan.org.workcell'] }) // code 为 [服务].[功能]的字符串数组
@Form.create({ fieldNameProp: null })
export default class ProduceTab extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const { form, workcellId, editFlag, workcell = {} } = this.props;
    const { produceList = {} } = workcell;
    const { backwardShiftNumber, forwardShiftNumber } = produceList;
    const { getFieldDecorator } = form;
    return (
      <Form>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.backwardShiftNumber`).d('可向后操作班次数')}
            >
              {getFieldDecorator('backwardShiftNumber', {
                initialValue: backwardShiftNumber,
              })(
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  max={100}
                  disabled={
                    workcellId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.forwardShiftNumber`).d('可向前操作班次数')}
            >
              {getFieldDecorator('forwardShiftNumber', {
                initialValue: forwardShiftNumber,
              })(
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  max={100}
                  disabled={
                    workcellId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
                  }
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
