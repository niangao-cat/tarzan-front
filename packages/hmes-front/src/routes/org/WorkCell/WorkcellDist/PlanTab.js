import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Select, Row, Col, InputNumber } from 'hzero-ui';
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
 * 计划属性
 * @extends {PureComponent} - React.PureComponent
 * @return React.element
 */

@connect(({ workcell }) => ({
  workcell,
}))
@formatterCollections({ code: ['tarzan.org.workcell'] }) // code 为 [服务].[功能]的字符串数组
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
    const { form, workcellId, editFlag, workcell = {} } = this.props;
    const { rateTypeList = [], planList = {} } = workcell;
    const { rateType = "", rate, activity } = planList;
    const { getFieldDecorator } = form;
    return (
      <Form>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
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
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.rate`).d('默认速率')}
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
              {...DRAWER_FORM_ITEM_LAYOUT}
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
