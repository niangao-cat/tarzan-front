/**
 * ProductionAttrForm - 生产属性
 * @date 2019-12-18
 * @author 许碧婷 <biting.xu@hand-china.com>
 * @version 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Row, Col, Input, Select, DatePicker, InputNumber } from 'hzero-ui';
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

@connect(({ productionOrderMgt }) => ({
  productionOrderMgt,
}))
@Form.create()
export default class ProductionAttrForm extends Component {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  componentDidMount = () => {
    const { dispatch } = this.props;
    // 完工限制类型
    dispatch({
      type: 'productionOrderMgt/fetchSelectOption',
      payload: {
        module: 'ORDER',
        typeGroup: 'WO_TYPE',
        type: 'completeOptions', // 完工限制类型
      },
    });
  };

  setLovProdline = record => {
    const { form } = this.props;

    form.setFieldsValue({
      productionLineName: record.prodLineName,
    });
  };

  setLovLocator = record => {
    const { form } = this.props;

    form.setFieldsValue({
      locatorName: record.locatorName,
    });
  };

  render() {
    const {
      canEdit,
      form,
      productionOrderMgt: {
        workOrderDetail = {},
        controlTypeOptions = [], // 完工限制类型
      },
      // workOrderId,
      // detailPage,
    } = this.props;
    const { getFieldDecorator } = form;
    const {
      planStartTime,
      planEndTime,
      locatorCode,
      productionLineCode,
      productionLineName,
      locatorName,
      completeControlType,
      completeControlQty,
      bomName,
      routerName,
      productionLineId,
      locatorId,
      bomId,
      routerId,
    } = workOrderDetail;

    return (
      <Form>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.planStartTime`).d('计划开始时间')}
            >
              {getFieldDecorator('planStartTime', {
                initialValue: planStartTime ? moment(planStartTime) : null,
                rules: [
                  {
                    required: true,
                    // message: intl.get(`${modelPrompt}.notEmpty`, {
                    //   name: intl.get(`${modelPrompt}.planStartTime`).d('计划开始时间'),
                    // }),
                    message: '计划开始时间',
                  },
                ],
              })(
                <DatePicker
                  showTime={{ format: 'HH:mm:ss' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{ width: '100%' }}
                  disabled={!canEdit}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.planEndTime`).d('计划结束时间')}
            >
              {getFieldDecorator('planEndTime', {
                initialValue: planEndTime ? moment(planEndTime) : null,
                rules: [
                  {
                    required: true,
                    // message: intl.get(`${modelPrompt}.notEmpty`, {
                    //   name: intl.get(`${modelPrompt}.planEndTime`).d('计划结束时间'),
                    // }),
                    message: '计划结束时间',
                  },
                ],
              })(
                <DatePicker
                  showTime={{ format: 'HH:mm:ss' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{ width: '100%' }}
                  disabled={!canEdit}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.locatorCode`).d('默认完工库位编码')}
            >
              {getFieldDecorator('locatorId', {
                initialValue: locatorId,
              })(
                <Lov
                  code="MT.LOCATOR"
                  queryParams={{ tenantId }}
                  textValue={locatorCode}
                  disabled={!canEdit}
                  onChange={(val, record) => {
                    this.setLovLocator(record);
                  }}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.productionLineCode`).d('生产线编码')}
            >
              {getFieldDecorator('productionLineId', {
                initialValue: productionLineId,
                rules: [
                  {
                    required: true,
                    // message: intl.get(`${modelPrompt}.notEmpty`, {
                    //   name: intl.get(`${modelPrompt}.productionLineCode`).d('生产线编码'),
                    // }),
                    message: '生产线编码',
                  },
                ],
              })(
                <Lov
                  code="MT.PRODLINE"
                  queryParams={{ tenantId }}
                  textValue={productionLineCode}
                  disabled={!canEdit}
                  onChange={(val, record) => {
                    this.setLovProdline(record);
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.productionLineName`).d('生产线名称')}
            >
              {getFieldDecorator('productionLineName', {
                initialValue: productionLineName,
              })(<Input style={{ width: '100%' }} disabled />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.locatorName`).d('默认完工库位名称')}
            >
              {getFieldDecorator('locatorName', {
                initialValue: locatorName,
              })(<Input style={{ width: '100%' }} disabled />)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.completeControlType`).d('完工限制类型')}
            >
              {getFieldDecorator('completeControlType', {
                initialValue: completeControlType,
              })(
                // !(workOrderId === 'create' && detailPage)
                <Select style={{ width: '100%' }} allowClear disabled={!canEdit}>
                  {controlTypeOptions.map(wo => {
                    return (
                      <Select.Option value={wo.typeCode} key={wo.typeCode}>
                        {wo.description}
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
              label={intl.get(`${modelPrompt}.completeControlQty`).d('完工限制值')}
            >
              {getFieldDecorator('completeControlQty', {
                initialValue: completeControlQty,
              })(
                <InputNumber style={{ width: '100%' }} disabled={!canEdit} min={0} precision={2} />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.bomName`).d('装配清单编码')}
            >
              {getFieldDecorator('bomId', {
                initialValue: bomId,
              })(
                <Lov
                  code="MT.BOM_BASIC"
                  queryParams={{ tenantId }}
                  textValue={bomName}
                  disabled={!canEdit}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.routerName`).d('工艺路线编码')}
            >
              {getFieldDecorator('routerId', {
                initialValue: routerId,
              })(
                <Lov
                  code="MT.WO_ROUTER"
                  queryParams={{ tenantId }}
                  textValue={routerName}
                  disabled={!canEdit}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
