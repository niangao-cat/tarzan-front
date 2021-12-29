import React, { Component } from 'react';
import { Form, Button, Row, Col, DatePicker, Select } from 'hzero-ui';
import moment from 'moment';
import { Bind, Throttle } from 'lodash-decorators';
import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import {
  DEBOUNCE_TIME,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  FORM_COL_4_LAYOUT,
  DEFAULT_DATETIME_FORMAT,
} from 'utils/constants';
import MultipleLovNew from '@/components/MultipleLov';

const tenantId = getCurrentOrganizationId();
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
      expandForm: true,
    };
  }

  /**
   * 表单重置
   */
  @Bind()
  handleFormReset() {
    const { form } = this.props;
    form.resetFields();
  }

  /**
   * 表单校验
   */
  @Bind()
  handleSearch() {
    const { onSearch, form } = this.props;
    if (onSearch) {
      form.validateFields((err, fieldsValue) => {
        if (!err) {
          onSearch(fieldsValue);
        }
      });
    }
  }

  @Throttle(DEBOUNCE_TIME)
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
    const { form, siteId } = this.props;
    const { expandForm } = this.state;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <Form>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="物料" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('materialIdList', {
                // rules: [
                //   {
                //     required: true,
                //     message: intl.get('hzero.common.validation.notNull', {
                //       name: intl.get(`materialIdList`).d('制单时间从'),
                //     }),
                //   },
                // ],
              })(
                <MultipleLovNew
                  code="QMS.IQC_00002"
                  queryParams={{ tenantId, siteId }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="供应商">
              {getFieldDecorator('supplierIdList', {
                // rules: [
                //   {
                //     required: true,
                //     message: intl.get('hzero.common.validation.notNull', {
                //       name: intl.get(`supplierIdList`).d('供应商'),
                //     }),
                //   },
                // ],
              })(
                <MultipleLovNew
                  code="Z.SUPPLIER"
                  queryParams={{ tenantId }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="合格率/不良率">
              {getFieldDecorator('okFlag', {
                // rules: [
                //   {
                //     required: true,
                //     message: intl.get('hzero.common.validation.notNull', {
                //       name: intl.get(`okFlag`).d('合格率/不良率'),
                //     }),
                //   },
                // ],
              })(
                <Select allowClear style={{ width: '100%' }}>
                  <Select.Option key='Y' value='Y'>
                    合格率
                  </Select.Option>
                  <Select.Option key='N' value='N'>
                    不良率
                  </Select.Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              {/* <Button onClick={this.toggleForm}>
                {expandForm
                  ? intl.get('hzero.common.button.collected').d('收起查询')
                  : intl.get(`hzero.common.button.viewMore`).d('更多查询')}
              </Button> */}
              <Button data-code="reset" icon="reload" onClick={this.handleFormReset}>
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
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="检验时间从" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('inspectionDateFrom', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`inspectionDateFrom`).d('检验时间从'),
                    }),
                  },
                ],
              })(
                <DatePicker
                  showTime
                  format={DEFAULT_DATETIME_FORMAT}
                  style={{ width: '100%' }}
                  disabledDate={currentDate =>
                    getFieldValue('inspectionDateTo') &&
                    moment(getFieldValue('inspectionDateTo')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="检验时间至" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('inspectionDateTo', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`inspectionDateTo`).d('检验时间至'),
                    }),
                  },
                ],
              })(
                <DatePicker
                  showTime
                  format={DEFAULT_DATETIME_FORMAT}
                  style={{ width: '100%' }}
                  disabledDate={currentDate =>
                    getFieldValue('inspectionDateFrom') &&
                    moment(getFieldValue('inspectionDateFrom')).isAfter(currentDate, 'second')
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

export default FilterForm;
