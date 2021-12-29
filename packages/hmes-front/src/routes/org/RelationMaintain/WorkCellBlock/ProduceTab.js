import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, InputNumber } from 'hzero-ui';
import { isUndefined } from 'lodash';
import {
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT_FORDRAWER,
  DRAWER_FORM_ITEM_LAYOUT_FORDRAWER,
} from '@/utils/constants';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';

const modelPrompt = 'tarzan.org.workcell.model.workcell';
/**
 * 生产属性表单数据展示
 * @extends {PureComponent} - React.PureComponent
 * @return React.element
 */

@connect(({ relationMaintainDrawer }) => ({
  relationMaintainDrawer,
}))
@formatterCollections({ code: 'tarzan.org.workcell' })
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
    const { form, workcellId, editFlag, relationMaintainDrawer = {} } = this.props;
    const { produceList = {} } = relationMaintainDrawer;
    const { backwardShiftNumber, forwardShiftNumber } = produceList;
    const { getFieldDecorator } = form;
    return (
      <Form>
        <Row {...SEARCH_FORM_ROW_LAYOUT_FORDRAWER}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT_FORDRAWER}
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
              {...DRAWER_FORM_ITEM_LAYOUT_FORDRAWER}
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
