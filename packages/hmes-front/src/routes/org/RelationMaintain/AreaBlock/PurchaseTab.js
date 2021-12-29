import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Select, Input } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import {
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT_FORDRAWER,
  DRAWER_FORM_ITEM_LAYOUT_FORDRAWER,
} from '@/utils/constants';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import Lov from 'components/Lov';
import { getCurrentOrganizationId } from 'utils/utils';

const modelPrompt = 'tarzan.org.area.model.area';
const tenantId = getCurrentOrganizationId();
/**
 * 生产属性表单数据展示
 * @extends {PureComponent} - React.PureComponent
 * @return React.element
 */

@connect(({ relationMaintainDrawer }) => ({
  relationMaintainDrawer,
}))
@formatterCollections({
  code: ['tarzan.org.area'], // code 为 [服务].[功能]的字符串数组
})
@Form.create({ fieldNameProp: null })
export default class PurchaseTab extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      selectedSupplierId: '',
    };
  }

  @Bind
  setSupplierName(_, value) {
    this.setState({
      selectedSupplierId: value.supplierId,
    });
    this.props.form.setFieldsValue({
      supplierName: value.supplierName,
      supplierSiteId: null,
      supplierSiteName: null,
    });
  }

  @Bind
  setSupplierSiteName(_, value) {
    this.props.form.setFieldsValue({
      supplierSiteName: value.supplierSiteName,
    });
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const { selectedSupplierId } = this.state;
    const {
      componentDisabled,
      form,
      relationMaintainDrawer: {
        areaDetailedInfo: { mtModAreaPurchaseDTO = {} },
      },
    } = this.props;
    const {
      insideFlag,
      supplierName,
      supplierId,
      supplierCode,
      supplierSiteId,
      supplierSiteCode,
      supplierSiteName,
    } = mtModAreaPurchaseDTO || {};
    const { getFieldDecorator } = form;
    return (
      <Form>
        <Row {...SEARCH_FORM_ROW_LAYOUT_FORDRAWER}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT_FORDRAWER}
              label={intl.get(`${modelPrompt}.supplierCode`).d('供应商编码')}
            >
              {getFieldDecorator('supplierId', {
                initialValue: supplierId,
              })(
                <Lov
                  queryParams={{ tenantId }}
                  textValue={supplierCode}
                  code="MT.SUPPLIER"
                  onChange={this.setSupplierName}
                  disabled={componentDisabled}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT_FORDRAWER}
              label={intl.get(`${modelPrompt}.supplierName`).d('供应商名称')}
            >
              {getFieldDecorator('supplierName', {
                initialValue: supplierName,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT_FORDRAWER}
              label={intl.get(`${modelPrompt}.insideFlag`).d('是否场内区域')}
            >
              {getFieldDecorator('insideFlag', {
                initialValue: insideFlag || undefined,
              })(
                <Select disabled={componentDisabled} allowClear>
                  <Select.Option value="Y" key="Y">
                    {intl.get(`${modelPrompt}.yes`).d('是')}
                  </Select.Option>
                  <Select.Option value="N" key="N">
                    {intl.get(`${modelPrompt}.no`).d('否')}
                  </Select.Option>
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT_FORDRAWER}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT_FORDRAWER}
              label={intl.get(`${modelPrompt}.supplierSiteCode`).d('供应商地点')}
            >
              {getFieldDecorator('supplierSiteId', {
                initialValue: supplierSiteId,
              })(
                <Lov
                  queryParams={{ tenantId, supplierId: selectedSupplierId }}
                  textValue={supplierSiteCode}
                  code="MT.SUPPLIER_SITE"
                  onChange={this.setSupplierSiteName}
                  disabled={componentDisabled || !selectedSupplierId}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT_FORDRAWER}
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
