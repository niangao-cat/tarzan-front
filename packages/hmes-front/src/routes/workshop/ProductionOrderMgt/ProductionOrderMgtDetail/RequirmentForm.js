/**
 * RequirementForm - 需求属性
 * @date 2019-12-18
 * @author 许碧婷 <biting.xu@hand-china.com>
 * @version 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Input, InputNumber } from 'hzero-ui';
import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import {
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
} from '@/utils/constants';
import Lov from 'components/Lov';

const tenantId = getCurrentOrganizationId();
const modelPrompt = 'tarzan.workshop.productionOrderMgt.model.productionOrderMgt';

// 表单
export const FORM_LAYOUT_COL_SPECIAL = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 19,
  },
};

@connect(({ productionOrderMgt }) => ({
  productionOrderMgt,
}))
@Form.create()
export default class RequirementForm extends Component {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  componentDidMount = () => {
    const { dispatch } = this.props;
    // WO类型
    dispatch({
      type: 'productionOrderMgt/fetchSelectOption',
      payload: {
        module: 'ORDER',
        typeGroup: 'WO_TYPE',
        type: 'workOrderTypeOptions',
      },
    });
  };

  setLovCustomer = record => {
    const { form } = this.props;

    form.setFieldsValue({
      customerName: record.customerName,
    });
  };

  setLoveMaterial = record => {
    const { form } = this.props;

    form.setFieldsValue({
      materialName: record.materialName,
      uomCode: record.uomCode,
      uomName: record.uomName,
      uomId: record.uomId,
    });
  };

  render() {
    const {
      canEdit,
      form,
      productionOrderMgt: { workOrderDetail = {} },
      detailPage,
      workOrderId,
    } = this.props;
    const { getFieldDecorator } = form;
    const {
      materialCode,
      qty,
      uomCode,
      materialName,
      materialId,
      uomName,
      customerCode,
      customerName,
      source,
      customerId,
      uomId,
    } = workOrderDetail;

    return (
      <Form>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.materialCode`).d('物料编码')}
            >
              {getFieldDecorator('materialId', {
                initialValue: materialId,
                rules: [
                  {
                    required: true,
                    // message: intl.get(`${modelPrompt}.notEmpty`, {
                    //   name: intl.get(`${modelPrompt}.materialCode`).d('物料编码'),
                    // }),
                    message: '物料编码',
                  },
                ],
              })(
                <Lov
                  code="MT.MATERIAL"
                  queryParams={{ tenantId }}
                  textValue={materialCode}
                  disabled={!(workOrderId === 'create' && detailPage)}
                  onChange={(val, record) => {
                    this.setLoveMaterial(record);
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.onlyQty`).d('数量')}
            >
              {getFieldDecorator('qty', {
                initialValue: qty,
                rules: [
                  {
                    required: true,
                    // message: intl.get(`${modelPrompt}.notEmpty`, {
                    //   name: intl.get(`${modelPrompt}.qty`).d('数量'),
                    // }),
                    message: '数量',
                  },
                ],
              })(
                <InputNumber disabled={!(workOrderId === 'create' && detailPage)} style={{ width: '100%' }} min={0} precision={2} />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.uomCode`).d('单位编码')}
            >
              {getFieldDecorator('uomCode', {
                initialValue: uomCode,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.materialName`).d('物料名称')}
            >
              {getFieldDecorator('materialName', {
                initialValue: materialName,
              })(<Input disabled style={{ width: 'calc(271% + 12px)' }} />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT} />
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.uomName`).d('单位描述')}
            >
              {getFieldDecorator('uomName', {
                initialValue: uomName,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.customerCode`).d('客户编码')}
            >
              {getFieldDecorator('customerId', {
                initialValue: customerId,
              })(
                <Lov
                  code="MT.CUSTOMER"
                  queryParams={{ tenantId }}
                  textValue={customerCode}
                  disabled={!canEdit}
                  onChange={(val, record) => {
                    this.setLovCustomer(record);
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.customerName`).d('客户名称')}
            >
              {getFieldDecorator('customerName', {
                initialValue: customerName,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.source`).d('来源制造订单')}
            >
              {getFieldDecorator('source', {
                initalValue: source,
              })(<Lov code="MT.CUSTOMER" queryParams={{ tenantId }} disabled />)}
            </Form.Item>
          </Col>
        </Row>
        <Row style={{ display: 'none' }}>
          <Col>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.uomId`).d('单位Id')}
            >
              {getFieldDecorator('uomId', {
                initialValue: uomId,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
