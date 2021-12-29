import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Input } from 'hzero-ui';
import Lov from 'components/Lov';
import { getCurrentOrganizationId } from 'utils/utils';
import {
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
} from '@/utils/constants';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { Bind } from 'lodash-decorators';

const modelPrompt = 'tarzan.org.proline.model.proline';
/**
 * 计划属性
 * @extends {PureComponent} - React.PureComponent
 * @return React.element
 */

@connect(({ proline }) => ({
  proline,
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: 'tarzan.org.proline',
})
export default class BasicTab extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  @Bind()
  changeSupplierName = (_, record) => {
    const { form } = this.props;
    form.setFieldsValue({
      supplierName: record.supplierName,
      supplierSiteId: undefined,
      supplierSiteName: undefined,
    });
  };

  @Bind()
  changeSupplierSiteName = (_, record) => {
    const { form } = this.props;
    form.setFieldsValue({
      supplierSiteName: record.supplierSiteName,
    });
  };

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      form,
      proline: { productionLine = {} },
      canEdit,
    } = this.props;
    const {
      supplierCode,
      supplierName,
      supplierSiteId,
      supplierSiteCode,
      supplierSiteName,
      supplierId,
    } = productionLine;
    const { getFieldDecorator, getFieldValue } = form;
    const tenantId = getCurrentOrganizationId();
    return (
      <Form>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.supplierCode`).d('供应商编码')}
            >
              {getFieldDecorator('supplierId', {
                initialValue: supplierId,
              })(
                <Lov
                  code="MT.SUPPLIER"
                  disabled={!canEdit}
                  textValue={supplierCode}
                  // textValue={typeGroup}
                  // onChange={this.changeTypeGroup}
                  queryParams={{ tenantId }}
                  onChange={this.changeSupplierName}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.supplierName`).d('供应商名称')}
            >
              {getFieldDecorator('supplierName', {
                initialValue: supplierName,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.supplierSiteCode`).d('供应商地点编码')}
            >
              {getFieldDecorator('supplierSiteId', {
                initialValue: supplierSiteId,
              })(
                <Lov
                  code="MT.SUPPLIER_SITE"
                  disabled={!canEdit || !getFieldValue('supplierId')}
                  textValue={supplierSiteCode}
                  queryParams={{ tenantId, supplierId: getFieldValue('supplierId') }}
                  onChange={this.changeSupplierSiteName}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.supplierSiteName`).d('供应商地点描述')}
            >
              {getFieldDecorator('supplierSiteName', {
                initialValue: supplierSiteName,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
