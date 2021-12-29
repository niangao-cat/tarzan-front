import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, InputNumber, Input } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';
import Lov from 'components/Lov';
import {
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
} from '@/utils/constants';
import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();
const modelPrompt = 'tarzan.org.locator.model.locator';
/**
 * 基础属性表单数据展示
 * @extends {PureComponent} - React.PureComponent
 * @return React.element
 */

@connect(({ locator }) => ({
  locator,
}))
@Form.create({ fieldNameProp: null })
export default class BasicTab extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  componentDidMount() {
    const { form, locator } = this.props;
    const { displayList = {} } = locator;
    const { weightUomId, sizeUomId } = displayList;
    form.getFieldDecorator('weightUomId', { initialValue: weightUomId });
    form.getFieldDecorator('sizeUomId', { initialValue: sizeUomId });
  }

  @Bind
  setSizeUomDesc(_, record) {
    this.props.form.setFieldsValue({
      sizeUomDesc: record.uomName,
      sizeUomCode: record.uomCode,
      sizeUomId: record.uomId,
    });
  }

  @Bind
  setWeightUomDesc(_, record) {
    this.props.form.setFieldsValue({
      weightUomDesc: record.uomName,
      weightUomCode: record.uomCode,
      weightUomId: record.uomId,
    });
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const { form, locatorId, editFlag, locator } = this.props;
    const { displayList = {} } = locator;
    const {
      maxWeight,
      weightUomCode,
      weightUomDesc,
      maxCapacity,
      sizeUomCode,
      sizeUomDesc,
      length,
      width,
      height,
      weightUomId,
      sizeUomId,
    } = displayList;
    const { getFieldDecorator } = form;
    return (
      <Form>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.maxWeight`).d('最大承载重量')}
            >
              {getFieldDecorator('maxWeight', {
                initialValue: maxWeight,
              })(
                <InputNumber
                  style={{ width: '100%' }}
                  precision={6}
                  decimalSeparator={6}
                  min={0}
                  disabled={
                    locatorId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.weightUomCode`).d('重量单位')}
            >
              {getFieldDecorator('weightUomCode', {
                initialValue: weightUomCode,
              })(
                <Lov
                  code="MT.UOM"
                  textValue={weightUomCode}
                  onChange={this.setWeightUomDesc}
                  queryParams={{ tenantId, uomType: 'WEIGHT' }}
                  disabled={
                    locatorId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT} style={{ display: 'none' }}>
            <Form.Item {...DRAWER_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('weightUomId', { initialValue: weightUomId })(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.weightUomDesc`).d('重量单位描述')}
            >
              {getFieldDecorator('weightUomDesc', {
                initialValue: weightUomDesc,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.maxCapacity`).d('最大装载容量')}
            >
              {getFieldDecorator('maxCapacity', {
                initialValue: maxCapacity,
              })(
                <InputNumber
                  style={{ width: '100%' }}
                  precision={6}
                  min={0}
                  decimalSeparator={6}
                  disabled={
                    locatorId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.sizeUomCode`).d('尺寸单位')}
            >
              {getFieldDecorator('sizeUomCode', {
                initialValue: sizeUomCode,
              })(
                <Lov
                  code="MT.UOM"
                  textValue={sizeUomCode}
                  onChange={this.setSizeUomDesc}
                  queryParams={{ tenantId, uomType: 'LENGTH' }}
                  disabled={
                    locatorId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.sizeUomDesc`).d('尺寸单位描述')}
            >
              {getFieldDecorator('sizeUomDesc', {
                initialValue: sizeUomDesc,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT} style={{ display: 'none' }}>
            <Form.Item {...DRAWER_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('sizeUomId', { initialValue: sizeUomId })(<Input />)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.length`).d('库位长')}
            >
              {getFieldDecorator('length', {
                initialValue: length,
              })(
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  precision={6}
                  decimalSeparator={6}
                  disabled={
                    locatorId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.width`).d('库存宽')}
            >
              {getFieldDecorator('width', {
                initialValue: width,
              })(
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  precision={6}
                  decimalSeparator={6}
                  disabled={
                    locatorId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.height`).d('库位高')}
            >
              {getFieldDecorator('height', {
                initialValue: height,
              })(
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  precision={6}
                  decimalSeparator={6}
                  disabled={
                    locatorId !== 'create' ? (isUndefined(editFlag) ? true : editFlag) : false
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
