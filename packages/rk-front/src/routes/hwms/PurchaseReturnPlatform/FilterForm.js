/**
 * FilterForm - 搜索栏
 * @date: 2020-07-29
 * @author: ywj
 * @version: 0.0.1
 * @copyright Copyright (c) 2020, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Button, Row, Col, Input, Select, DatePicker} from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId } from 'utils/utils';
import Lov from 'components/Lov';
import moment from 'moment';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DEFAULT_DATETIME_FORMAT,
} from 'utils/constants';

const modelPrompt = 'hwms.model.purchaseReturnPlatform';

// 使用 Form.Item 组件
const FormItem = Form.Item;

/**
 * 搜索栏
 * @extends {Component} - React.Component
 * @reactProps {Object} purchaseReturnPlatform - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ purchaseReturnPlatform}) => ({
  purchaseReturnPlatform,
  tenantId: getCurrentOrganizationId(),
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: 'hwms.purchaseReturnPlatform',
})
export default class FilterForm extends React.Component {
  state = {
    expandForm: false,
    // productionLine: "",
  };

  // 查询条件展开/收起
  @Bind()
  toggleForm() {
    const { expandForm } = this.state;
    this.setState({ expandForm: !expandForm });
  }

  // 查询数据
  @Bind()
  fetchQueryList() {
    const { form, onSearch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        // 设置查询时间
        const fieldForm = { ...fieldsValue, demandTimeFrom: fieldsValue.demandTimeFrom
          ? moment(fieldsValue.demandTimeFrom).format(DEFAULT_DATETIME_FORMAT):null,
          demandTimeTo: fieldsValue.demandTimeTo
          ? moment(fieldsValue.demandTimeTo).format(DEFAULT_DATETIME_FORMAT): null,
        };
        onSearch(fieldForm);
      }
    });
  }

  // 查询按钮点击
  @Bind()
  queryValue() {
    this.fetchQueryList();
  }

  // 重置form表单
  @Bind()
  handleFormReset() {
    const { form, onResetSearch } = this.props;
    form.resetFields();
    onResetSearch();
  }

  // 更新生产线的值
  refreshProdLine = (_, record) => {
    // this.setState({ productionLine: record.prodLineCode });
    this.props.form.setFieldsValue({
      productionLine: record.prodLineCode,
    });
  };

  // 渲染方法
  render() {
    const { getFieldDecorator } = this.props.form;
    const { tenantId, instructionDocStatusList } = this.props;
    const { expandForm } = this.state;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.instructionDocNum`).d('单号')}
            >
              {getFieldDecorator('instructionDocNum')(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.siteId`).d('工厂')}
            >
              {getFieldDecorator('siteId')(
                <Lov code="MT.SITE" queryParams={{ tenantId }} />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.instructionDocStatus`).d('单据状态')}
            >
              {getFieldDecorator('instructionDocStatus', {})(
                <Select allowClear>
                  {instructionDocStatusList.map(item => (
                    <Select.Option key={item.value}>{item.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <FormItem>
              <Button onClick={this.toggleForm}>
                {expandForm
                  ? intl.get('hzero.common.button.collected').d('收起查询')
                  : intl.get(`hzero.common.button.viewMore`).d('更多查询')}
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button type="primary" htmlType="submit" onClick={this.queryValue}>
                {intl.get('tarzan.acquisition.transformation.button.search').d('查询')}
              </Button>
            </FormItem>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.supplierId`).d('供应商编码')}
            >
              {getFieldDecorator('supplierId', {})(
                <Lov
                  code="Z.SUPPLIER"
                  queryParams={{ tenantId }}
                  textField="SUPPLIER_CODE"
                  onChange={(value, records) => {
                    this.props.form.setFieldsValue({
                      supplierDes: records.supplierName,
                    });
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.supplierDes`).d('供应商描述')}
            >
              {getFieldDecorator('supplierDes', {})(<Input disabled trim />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt}.materialId`).d('物料编码')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('materialId', {})(
                <Lov
                  code="Z.MATERIALCODE"
                  queryParams={{ tenantId }}
                  onChange={(value, records) => {
                    this.props.form.setFieldsValue({
                      materialName: records.materialName,
                    });
                  }}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.materialName`).d('物料描述')}
            >
              {getFieldDecorator('materialName')(<Input disabled trim />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.demandTimeFrom`).d('退货时间从')}
            >
              {getFieldDecorator('demandTimeFrom', {
              })(
                <DatePicker
                  showTime={{ format: 'HH:mm:ss' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{ width: '100%' }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.demandTimeTo`).d('退货时间至')}
            >
              {getFieldDecorator('demandTimeTo', {
              })(
                <DatePicker
                  showTime={{ format: 'HH:mm:ss' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{ width: '100%' }}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
