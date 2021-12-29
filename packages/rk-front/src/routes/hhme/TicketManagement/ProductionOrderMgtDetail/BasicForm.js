/**
 * BasicForm - 基本属性
 * @date 2019-12-18
 * @author 许碧婷 <biting.xu@hand-china.com>
 * @version 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Input, Select } from 'hzero-ui';
import { isArray } from 'lodash';
import { getCurrentOrganizationId } from 'utils/utils';
import {
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
} from '@/utils/constants';
import Lov from 'components/Lov';
import intl from 'utils/intl';

const tenantId = getCurrentOrganizationId();
const modelPrompt = 'tarzan.workshop.productionOrderMgt.model.productionOrderMgt';

@connect(({ productionOrderMgt }) => ({
  productionOrderMgt,
}))
@Form.create()
export default class BasicForm extends Component {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  searchWoStatus = status => {
    const {
      productionOrderMgt: { workOrderStatusOptions = [] },
      workOrderId,
    } = this.props;

    let paramStatus = status;
    if (workOrderId === 'create') {
      paramStatus = 'NEW';
    }
    const desc = workOrderStatusOptions.filter(wo => wo.statusCode === paramStatus);
    if (isArray(desc) && desc.length > 0) {
      return desc[0].description;
    }
    return paramStatus;
  };

  setLovSite = record => {
    const { form } = this.props;

    form.setFieldsValue({
      siteName: record.siteName,
    });
  };

  render() {
    const {
      canEdit,
      form,
      productionOrderMgt: { workOrderTypeOptions = [], workOrderDetail = {} },
      workOrderId,
      detailPage,
    } = this.props;
    const { getFieldDecorator } = form;
    const {
      workOrderNum,
      siteId,
      siteCode,
      siteName,
      workOrderType,
      status,
      remark,
    } = workOrderDetail;

    return (
      <Form>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.workOrderNum`).d('WO编码')}
            >
              {getFieldDecorator('workOrderNum', {
                initialValue: workOrderNum,
              })(<Input style={{ width: '100%' }} disabled />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.siteCode`).d('站点编码')}
            >
              {getFieldDecorator('siteId', {
                initialValue: siteId,
                rules: [
                  {
                    required: true,
                    // message: intl.get(`${modelPrompt}.notEmpty`, {
                    //   name: intl.get(`${modelPrompt}.siteCode`).d('站点编码'),
                    // }),
                    message: '站点编码',
                  },
                ],
              })(
                <Lov
                  code="MT.SITE"
                  queryParams={{ tenantId }}
                  textValue={siteCode}
                  disabled={!(workOrderId === 'create' && detailPage)}
                  onChange={(val, record) => {
                    this.setLovSite(record);
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.siteName`).d('站点名称')}
            >
              {getFieldDecorator('siteName', {
                initialValue: siteName,
              })(<Input style={{ width: '100%' }} disabled />)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.workOrderType`).d('WO类型')}
            >
              {getFieldDecorator('workOrderType', {
                initialValue: workOrderType,
                rules: [
                  {
                    required: true,
                    // message: intl.get(`${modelPrompt}.notEmpty`, {
                    //   name: intl.get(`${modelPrompt}.workOrderType`).d('WO类型'),
                    // }),
                    message: 'WO类型',
                  },
                ],
              })(
                <Select
                  style={{ width: '100%' }}
                  allowClear
                  disabled={!(workOrderId === 'create' && detailPage)}
                >
                  {workOrderTypeOptions.map(wo => {
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
              label={intl.get(`${modelPrompt}.status`).d('WO状态')}
            >
              {getFieldDecorator('status', {
                initialValue: this.searchWoStatus(status),
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.remark`).d('备注')}
            >
              {getFieldDecorator('remark', {
                initialValue: remark,
              })(<Input disabled={!canEdit} />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
