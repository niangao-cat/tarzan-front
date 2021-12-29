import React from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  FORM_FIELD_CLASSNAME,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import { Form, Button, Col, Row, Input, Select, DatePicker } from 'hzero-ui';
import Lov from 'components/Lov';
import moment from 'moment';
import { getDateTimeFormat, getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

const { Option } = Select;

const modelPromt = 'tarzan.hmes.purchaseOrder';

// model 层连接
@formatterCollections({ code: 'tarzan.hmes.purchaseOrder' })
@connect(purchaseOrder => ({
  purchaseOrder,
}))
// 表单创建
@Form.create({ fieldNameProp: null })
export default class FilterForm extends React.Component {
  // 初始化状态
  state = {
    expandForm: false,
  };

  // 查询方法
  @Bind
  onSearch = () => {
    const { onSearch, form } = this.props;
    form.validateFields((errs, values) => {
      if (!errs) {
        onSearch(values);
      }
    });
  };

  // 查询条件展开/收起
  @Bind
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({ expandForm: !expandForm });
  };

  // 重置查询
  @Bind
  resetSearch = () => {
    const { form, resetSearch } = this.props;
    form.resetFields();
    resetSearch();
  };

  // 设置lov主键值
  @Bind
  setMaterialCode(val, record) {
    this.props.form.setFieldsValue({ materialId: record.materialId });
  }

  @Bind
  setSupplierCode(val, record) {
    this.props.form.setFieldsValue({ supplierId: record.supplierId });
  }

  // 渲染
  render() {
    // 获取整个表单
    const { form, instructionStatus, instructionDocType, poTypeMap } = this.props;

    // 获取表单的字段属性
    const { getFieldDecorator, getFieldValue } = form;

    // 获取更多查询状态
    const { expandForm } = this.state;

    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.instructionNum`).d('采购订单号')}
            >
              {getFieldDecorator('instructionNum')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.deliveryDocNum`).d('送货单号')}
            >
              {getFieldDecorator('deliveryDocNum')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.supplierId`).d('供应商编码')}
            >
              {getFieldDecorator('supplierId', {})(
                <Lov
                  code="Z.SUPPLIER"
                  queryParams={{ tenantId }}
                  textField="SUPPLIER_CODE"
                  onChange={(value, records) => {
                    form.setFieldsValue({
                      supplierDes: records.supplierName,
                    });
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              <Button onClick={this.toggleForm}>
                {expandForm
                  ? intl.get('hzero.common.button.collected').d('收起查询')
                  : intl.get(`hzero.common.button.viewMore`).d('更多查询')}
              </Button>
              <Button onClick={this.resetSearch.bind(this)}>
                {intl.get(`hzero.common.button.reset`).d('重置')}
              </Button>
              <Button type="primary" htmlType="submit" onClick={this.onSearch.bind(this)}>
                {intl.get(`hzero.common.button.search`).d('查询')}
              </Button>
            </Form.Item>
          </Col>
        </Row>

        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.supplierDes`).d('供应商描述')}
            >
              {getFieldDecorator('supplierDes', {})(<Input disabled trim />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.instructionDocType`).d('单据类型')}
            >
              {getFieldDecorator('instructionDocType')(
                <Select allowClear className={FORM_FIELD_CLASSNAME}>
                  {instructionDocType.map(n => (
                    <Option key={n.value} value={n.value}>
                      {n.meaning}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.instructionStatus`).d('单据状态')}
            >
              {getFieldDecorator('instructionStatus')(
                <Select allowClear className={FORM_FIELD_CLASSNAME}>
                  {instructionStatus
                    .filter(item => item.value !== 'org')
                    .map(n => (
                      <Option key={n.value} value={n.value}>
                        {n.meaning}
                      </Option>
                    ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>

        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPromt}.materialId`).d('物料编码')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('materialId', {})(
                <Lov
                  code="MT.MATERIAL"
                  queryParams={{ tenantId }}
                  onChange={(value, records) => {
                    form.setFieldsValue({
                      materialDes: records.materialName,
                    });
                  }}
                  textField="materialCode"
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.materialDes`).d('物料描述')}
            >
              {getFieldDecorator('materialDes', {})(<Input disabled trim />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.siteId`).d('工厂')}
            >
              {getFieldDecorator('siteId')(
                <Lov code="MT.MOD.SITE_MT_LOT" queryParams={{ tenantId }} textField="siteName" />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.demandTimeFrom`).d('到货时间从')}
            >
              {getFieldDecorator('demandTimeFrom')(
                <DatePicker
                  showTime
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateTimeFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('demandTimeTo') &&
                    moment(getFieldValue('demandTimeTo')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.demandTimeTo`).d('到货时间至')}
            >
              {getFieldDecorator('demandTimeTo', {})(
                <DatePicker
                  showTime
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateTimeFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('demandTimeFrom') &&
                    moment(getFieldValue('demandTimeFrom')).isAfter(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.poType`).d('订单类型')}
            >
              {getFieldDecorator('poType')(
                <Select allowClear className={FORM_FIELD_CLASSNAME}>
                  {poTypeMap
                    .filter(item => item.value !== 'org')
                    .map(n => (
                      <Option key={n.value} value={n.value}>
                        {n.meaning}
                      </Option>
                    ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
