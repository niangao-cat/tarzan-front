import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Select, Row, Col, InputNumber } from 'hzero-ui';
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
 * 计划属性
 * @extends {PureComponent} - React.PureComponent
 * @return React.element
 */

@connect(({ relationMaintainDrawer }) => ({
  relationMaintainDrawer,
}))
@formatterCollections({ code: 'tarzan.org.workcell' })
@Form.create({ fieldNameProp: null })
export default class PlanTab extends PureComponent {
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
    const { rateTypeList = [], planList = {} } = relationMaintainDrawer;
    const { rateType, rate, activity } = planList;
    const { getFieldDecorator } = form;
    return (
      <Form>
        <Row {...SEARCH_FORM_ROW_LAYOUT_FORDRAWER}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT_FORDRAWER}
              label={intl.get(`${modelPrompt}.rateType`).d('速率类型')}
            >
              {getFieldDecorator('rateType', {
                initialValue: rateType || undefined,
              })(
                <Select
                  disabled={
                    workcellId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
                  }
                  allowClear
                  style={{ width: '100%' }}
                >
                  {rateTypeList instanceof Array &&
                    rateTypeList.length !== 0 &&
                    rateTypeList.map(item => {
                      return (
                        <Select.Option value={item.typeCode} key={item.typeCode}>
                          {item.description}
                        </Select.Option>
                      );
                    })}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT_FORDRAWER}
              label={intl.get(`${modelPrompt}.rate`).d('默认数率')}
            >
              {getFieldDecorator('rate', {
                initialValue: rate,
              })(
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  max={100}
                  precision={2}
                  decimalSeparator={2}
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
              label={intl.get(`${modelPrompt}.activity`).d('开动率')}
            >
              {getFieldDecorator('activity', {
                initialValue: activity || 100,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.activity`).d('开动率'),
                    }),
                  },
                ],
              })(
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  max={100}
                  precision={2}
                  decimalSeparator={2}
                  formatter={value => `${value}%`}
                  parser={value => value.replace('%', '')}
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
