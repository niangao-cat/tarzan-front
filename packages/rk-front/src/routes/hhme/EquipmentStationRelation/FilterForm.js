import React, { Component } from 'react';
import { Form, Button, Row, Col, Input } from 'hzero-ui';
import cacheComponent from 'components/CacheComponent';
import { Bind } from 'lodash-decorators';
import Lov from 'components/Lov';
import intl from 'utils/intl';
import { isFunction } from 'lodash';
import { getCurrentOrganizationId } from 'utils/utils';
import {
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  FORM_COL_4_LAYOUT,
} from 'utils/constants';

const FormItem = Form.Item;
@Form.create({ fieldNameProp: null })
@cacheComponent({ cacheKey: '/hwms/barcode/list' })
class FilterForm extends Component {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
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

  /**
   * 表单校验
   */
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
    const { form } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { expandForm } = this.state;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label='设备编码'
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('assetEncoding', {})(<Input trim />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label='工位'
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('stationId', {})(
                <Lov
                  code="HME.WORKCELL"
                  allowClear
                  queryParams={{
                    lineId: getFieldValue('processId'),
                    typeFlag: 'STATION',
                    tenantId: getCurrentOrganizationId(),
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME} style={{paddingRight: '7px', textAlign: 'end'}}>
            <FormItem>
              <Button style={{ marginLeft: 8, display: 'inline-block' }} onClick={this.toggleForm}>
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
                onClick={this.handleSearch}
              >
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
            </FormItem>
          </Col>
        </Row>
        {
          expandForm && (
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  label='部门'
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('businessId', {})(
                    <Lov
                      allowClear
                      code="HME.BUSINESS_AREA "
                      queryParams={{
                        tenantId: getCurrentOrganizationId(),
                      }}
                    />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  label='车间'
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('workShopId', {})(
                    <Lov
                      code="HME_WORK_SHOP"
                      allowClear
                      queryParams={{
                        tenantId: getCurrentOrganizationId(),
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  label='产线'
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('prodLineId', {})(
                    <Lov
                      code="Z.PRODLINE"
                      allowClear
                      queryParams={{
                        tenantId: getCurrentOrganizationId(),
                        workShopId: getFieldValue('workShopId'),
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
          )}
        {
          expandForm && (
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  label='工段'
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('lineId', {})(
                    <Lov
                      code="HME.WORKCELL"
                      allowClear
                      queryParams={{
                        prodLineId: getFieldValue('prodLineId'),
                        tenantId: getCurrentOrganizationId(),
                        typeFlag: 'LINE',
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  label='工序'
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('processId', {})(
                    <Lov
                      code="HME.WORKCELL"
                      allowClear
                      queryParams={{
                        lineId: getFieldValue('lineId'),
                        typeFlag: 'PROCESS',
                        tenantId: getCurrentOrganizationId(),
                      }}
                    />
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
