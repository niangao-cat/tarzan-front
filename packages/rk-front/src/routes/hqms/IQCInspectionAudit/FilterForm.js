import React, { Component } from 'react';
import { Form, Button, Row, Col, Select, Input, DatePicker } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import moment from 'moment';
import {
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
} from 'utils/constants';
import Lov from 'components/Lov';
import { getCurrentOrganizationId } from 'utils/utils';

/**
 *  页面搜索框
 * @extends {Component} - React.Component
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} onSearch - 搜索方法
 * @return React.element
 */
@Form.create({ fieldNameProp: null })
class FilterForm extends Component {
  constructor(props) {
    super(props);
    const { onRef } = props;
    if (onRef) onRef(this);
    this.state = {
      expandForm: false,
    };
  }

  /**
   * 表单重置
   */
  @Bind()
  handleFormReset() {
    const { resetField } = this.props;
    const { form } = this.props;
    form.resetFields();

    // 重置数据
    resetField();
  }

  // 查询
  @Bind()
  handleSearch() {
    const { onSearch, form } = this.props;
    if (onSearch) {
      form.validateFields((err, values) => {
        if (!err) {
          // 如果验证成功,则执行onSearch
          onSearch(values);
        }
      });
    }
  }

  /**
  * 表单展开收起
  */
  @Bind()
  toggleForm() {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const { form, iqcDocStatus, docIdentification, iqcinspetionResult, finalDecision, initialData } = this.props;
    const { getFieldDecorator } = form;
    const { expandForm } = this.state;
    return (
      <Form>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="来源单号" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('instructionDocNum', {
                initialValue: initialData.instructionDocNum,
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="处理状态">
              {getFieldDecorator('inspectionStatus', {
                initialValue: initialData.searchFlag?initialData.inspectionStatus:'TBD',
              })(
                <Select allowClear>
                  {iqcDocStatus.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="检验结果">
              {getFieldDecorator('inspectionResult', {
                initialValue: initialData.searchFlag?initialData.inspectionResult:'NG',
              })(
                <Select allowClear>
                  {iqcinspetionResult.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.meaning}
                    </Select.Option>
                  ))}
                </Select>
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
              <Button data-code="reset" onClick={this.handleFormReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button
                data-code="search"
                type="primary"
                htmlType="submit"
                icon="search"
                onClick={this.handleSearch}
              >
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
            </Form.Item>
          </Col>
        </Row>
        {
          expandForm && (
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="审核结果">
                  {getFieldDecorator('finalDecision', {
                    initialValue: initialData.finalDecision,
                  })(
                    <Select allowClear>
                      {finalDecision.map(item => (
                        <Select.Option key={item.value} value={item.value}>
                          {item.meaning}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item label="物料编码" {...SEARCH_FORM_ITEM_LAYOUT}>
                  {getFieldDecorator('materialId', {
                    initialValue: initialData.materialId,
                  })(
                    <Lov
                      code="QMS.MATERIAL"
                      queryParams={{ tenantId: getCurrentOrganizationId() }}
                      textField="materialCode"
                      textValue={initialData.materialCode}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="是否加急">
                  {getFieldDecorator('identification', {
                    initialValue: initialData.identification,
                  })(
                    <Select allowClear>
                      {docIdentification.map(item => (
                        <Select.Option key={item.value} value={item.value}>
                          {item.meaning}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
          )}
        {
          expandForm && (
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="检验单号">
                  {getFieldDecorator('iqcNumber', {
                     initialValue: initialData.iqcNumber,
                  })(
                    <Input />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item label="供应商" {...SEARCH_FORM_ITEM_LAYOUT}>
                  {getFieldDecorator('supplierId', {
                    initialValue: initialData.supplierId,
                  })(
                    <Lov
                      code="MT.SUPPLIER"
                      queryParams={{ tenantId: getCurrentOrganizationId() }}
                      textField="supplierCode"
                      textValue={initialData.supplierCode}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="接收批次">
                  {getFieldDecorator('receiptLot', {
                    initialValue: initialData.receiptLot,
                  })(
                    <Input />
                  )}
                </Form.Item>
              </Col>
            </Row>
          )}
        {
          expandForm && (
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="仓库">
                  {getFieldDecorator('locatorCode', {
                    initialValue: initialData.locatorCode,
                  })(
                    <Input />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="建单时间从">
                  {getFieldDecorator('createdDateFrom', {
                    initialValue: initialData.createdDateFrom?moment(initialData.createdDateFrom):null,
                  })(
                    <DatePicker />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item label="建单时间至" {...SEARCH_FORM_ITEM_LAYOUT}>
                  {getFieldDecorator('createdDateTo', {
                    initialValue: initialData.createdDateTo? moment(initialData.createdDateTo):null,
                  })(
                    <DatePicker />
                  )}
                </Form.Item>
              </Col>
            </Row>
          )}
      </Form>
    );
  }
}

export default FilterForm;
