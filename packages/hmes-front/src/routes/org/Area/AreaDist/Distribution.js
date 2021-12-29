import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Select, InputNumber, Switch } from 'hzero-ui';
import {
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
} from '@/utils/constants';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';

const modelPrompt = 'tarzan.org.area.model.area';
/**
 * 生产属性表单数据展示
 * @extends {PureComponent} - React.PureComponent
 * @return React.element
 */

@connect(({ area }) => ({
  area,
}))
@formatterCollections({
  code: ['tarzan.org.area'], // code 为 [服务].[功能]的字符串数组
})
@Form.create({ fieldNameProp: null })
export default class PurchaseTab extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  changeDistributionMode = val => {
    if (!val) {
      this.props.form.setFieldsValue({
        distributionCycle: null,
        businessType: null,
        instructCreatedByEo: null,
        pullTimeIntervalFlag: null,
      });
    }
  };

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      componentDisabled,
      form,
      area: {
        areaDetailedInfo: { mtModAreaDistributionDTO = {} },
        distributionModeList = [],
        businessTypeList = [],
      },
    } = this.props;
    const {
      distributionMode = '',
      distributionCycle = '',
      businessType = '',
      instructCreatedByEo = 'N',
      pullTimeIntervalFlag = 'N',
    } = mtModAreaDistributionDTO || {};
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <Form>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.distributionMode`).d('配送模式')}
            >
              {getFieldDecorator('distributionMode', {
                initialValue: distributionMode,
              })(
                <Select
                  allowClear
                  disabled={componentDisabled}
                  onChange={this.changeDistributionMode}
                >
                  {distributionModeList.map(ele => (
                    <Select.Option value={ele.typeCode}>{ele.description}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.distributionCycle`).d('配送周期(h)')}
            >
              {getFieldDecorator('distributionCycle', {
                initialValue: distributionCycle,
              })(
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  disabled={componentDisabled || !getFieldValue('distributionMode')}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.businessType`).d('指令业务类型')}
            >
              {getFieldDecorator('businessType', {
                initialValue: businessType,
              })(
                <Select
                  allowClear
                  disabled={componentDisabled || !getFieldValue('distributionMode')}
                >
                  {businessTypeList.map(ele => (
                    <Select.Option value={ele.typeCode}>{ele.description}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.instructCreatedByEo`).d('指令按照EO拆分')}
            >
              {getFieldDecorator('instructCreatedByEo', {
                initialValue: instructCreatedByEo || 'N',
              })(
                <Switch
                  checkedValue="Y"
                  unCheckedValue="N"
                  disabled={componentDisabled || !getFieldValue('distributionMode')}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.pullTimeIntervalFlag`).d('是否启用拉动时段')}
            >
              {getFieldDecorator('pullTimeIntervalFlag', {
                initialValue: pullTimeIntervalFlag || 'N',
              })(
                <Switch
                  checkedValue="Y"
                  unCheckedValue="N"
                  disabled={componentDisabled || !getFieldValue('distributionMode')}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
