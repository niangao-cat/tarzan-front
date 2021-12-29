import React, { Component } from 'react';
import { Form, Button, Row, Col, Select, Checkbox, DatePicker } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import {
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
} from 'utils/constants';
import Lov from 'components/Lov';
import moment from 'moment';
// import { getCurrentOrganizationId } from 'utils/utils';

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
    const { form } = this.props;
    form.resetFields();
  }

  // 查询
  @Bind()
  handleSearch() {
    const { onSearch, form } = this.props;
    if (onSearch) {
      form.validateFields((err) => {
        if (!err) {
          // 如果验证成功,则执行onSearch
          onSearch();
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
    const {
      form,
      tenantId,
      wmsDistribution,
    } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { expandForm } = this.state;
    const now = moment().format("YYYY-MM-DD");
    return (
      <Form>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="产线">
              {getFieldDecorator('prodLineId', {
                rules: [
                  {
                    required: !getFieldValue('workcellId'),
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '产线',
                    }),
                  },
                ],
              })(
                <Lov
                  code="Z.PRODLINE"
                  queryParams={{ tenantId, siteId: form.getFieldValue('siteId') }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="工段">
              {getFieldDecorator('workcellId', {
                rules: [
                  {
                    required: !getFieldValue('prodLineId'),
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '工段',
                    }),
                  },
                ],
              })(
                <Lov
                  code="HME.WORKCELL"
                  allowClear
                  queryParams={{
                    prodLineId: getFieldValue('prodLineId'),
                    tenantId,
                    typeFlag: 'LINE',
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="配送班次">
              {getFieldDecorator('startDate', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '配送班次',
                    }),
                  },
                ],
                initialValue: now && moment(now),
              })(
                <DatePicker
                  placeholder=""
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                // disabledDate={currentDate =>
                //   moment(now).isBefore(currentDate, 'second')
                // }
                // onChange={() => {
                //   form.resetFields();
                // }}
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
                <Form.Item label="工厂" {...SEARCH_FORM_ITEM_LAYOUT}>
                  {getFieldDecorator('siteId', {})(
                    <Lov
                      code="MT.SITE"
                      queryParams={{ tenantId }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="工单号">
                  {getFieldDecorator('workOrderId')(
                    <Lov code="MT.WORK_ORDER_NUM" queryParams={{ tenantId }} />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="组件物料">
                  {getFieldDecorator('materialId')(
                    <Lov code="MT.MATERIAL" queryParams={{ tenantId }} />
                  )}
                </Form.Item>
              </Col>
            </Row>
          )}
        {
          expandForm && (
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item label="配送策略" {...SEARCH_FORM_ITEM_LAYOUT}>
                  {getFieldDecorator('distributionType', {})(
                    <Select allowClear>
                      {wmsDistribution.map(item => (
                        <Select.Option key={item.value} value={item.value}>
                          {item.meaning}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="需配送数据">
                  {getFieldDecorator('onlyDistributionData')(
                    <Checkbox />
                  )}
                </Form.Item>
              </Col>
            </Row>
          )
        }
      </Form>
    );
  }
}

export default FilterForm;
