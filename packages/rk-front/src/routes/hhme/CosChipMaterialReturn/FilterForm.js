import React from 'react';
import intl from 'utils/intl';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import { Form, Col, Row, Input } from 'hzero-ui';
import Lov from 'components/Lov';

// 表单创建
@Form.create({ fieldNameProp: null })
export default class FilterForm extends React.PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  // 渲染
  render() {
    const {
      form,
      tenantId,
      workcellInfo,
      fetchWorkOrder,
      returnInfo,
    } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='工单'>
              {getFieldDecorator('workOrderId', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`fromSiteCode`).d('工单'),
                    }),
                  },
                ],
              })(
                <Lov
                  code="HME.RETURN_WORK_ORDER"
                  queryParams={{
                    tenantId,
                    proLineId: workcellInfo.prodLineId,
                  }}
                  onChange={(_value, item) => {
                    fetchWorkOrder(item);
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='站点'>
              {getFieldDecorator('siteName', {
                initialValue: returnInfo.siteName,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='工单类型'>
              {getFieldDecorator('workOrderType', {
                initialValue: returnInfo.workOrderTypeMeaning,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='工单状态'>
              {getFieldDecorator('status', {
                initialValue: returnInfo.statusMeaning,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='物料编码'>
              {getFieldDecorator('materialCode', {
                initialValue: returnInfo.materialCode,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='物料描述'>
              {getFieldDecorator('materialName', {
                initialValue: returnInfo.materialName,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='工单数量'>
              {getFieldDecorator('qty', {
                initialValue: returnInfo.qty,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='单位编码'>
              {getFieldDecorator('uomCode', {
                initialValue: returnInfo.uomCode,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='生产线编码'>
              {getFieldDecorator('productionLineCode', {
                initialValue: returnInfo.productionLineCode,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='装配清单编码'>
              {getFieldDecorator('bomName', {
                initialValue: returnInfo.bomName,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='工艺路线编码'>
              {getFieldDecorator('routerCode', {
                initialValue: returnInfo.routerCode,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='完工库位'>
              {getFieldDecorator('locatorCode', {
                initialValue: returnInfo.locatorCode,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
