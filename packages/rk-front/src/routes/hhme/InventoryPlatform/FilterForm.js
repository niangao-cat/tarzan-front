import React, { Component } from 'react';
import { Form, Button, Row, Col, Input, DatePicker, Select } from 'hzero-ui';
import cacheComponent from 'components/CacheComponent';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { isFunction } from 'lodash';
import {
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  FORM_COL_4_LAYOUT,
} from 'utils/constants';
import { getCurrentOrganizationId, getDateTimeFormat } from 'utils/utils';
import Lov from 'components/Lov';
import moment from 'moment';

@Form.create({ fieldNameProp: null })
@cacheComponent({ cacheKey: '/hwms/barcode/list' })
class FilterForm extends Component {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {};
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
    const { form, tenantId, statusCodeList } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { expandForm } = this.state;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="盘点单号">
              {getFieldDecorator('stocktakeNum')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="单据状态">
              {getFieldDecorator('stocktakeStatus', {
                initialValue: statusCodeList.filter(item => ['NEW', 'RELEASED'].includes(item.value) ).map(e => e.value),
              })(
                <Select mode="multiple" allowClear>
                  {statusCodeList.map(e => (
                    <Select.Option value={e.value} key={e.value}>
                      {e.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="是否明盘">
              {getFieldDecorator('openFlag')(
                <Select allowClear>
                  <Select.Option value="Y" key="Y">
                    是
                  </Select.Option>
                  <Select.Option value="N" key="N">
                    否
                  </Select.Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              <Button onClick={this.toggleForm}>
                {expandForm ? '收起' : '更多'}
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
            </Form.Item>
          </Col>
        </Row>
        {expandForm && (
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item label="工厂" {...SEARCH_FORM_ITEM_LAYOUT}>
                {getFieldDecorator('siteId')(
                  <Lov
                    code="MT.SITE"
                    queryParams={{ tenantId }}
                  />
              )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="部门">
                {getFieldDecorator('areaId')(
                  <Lov
                    code="HME.BUSINESS_AREA"
                    queryParams={{ tenantId }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='物料'
              >
                {getFieldDecorator('materialCode')(
                  <Lov code="QMS.MATERIAL" queryParams={{ tenantId }} lovOptions={{ valueField: 'materialCode' }} />
                )}
              </Form.Item>
            </Col>
          </Row>
        )}
        {expandForm && (
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='物料描述'
              >
                {getFieldDecorator('materialName')(<Input />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item label='产线' {...SEARCH_FORM_ITEM_LAYOUT}>
                {getFieldDecorator('prodLineId')(
                  <Lov
                    code="HME.STOCKTAKE_PRODLINE"
                    allowClear
                    queryParams={{
                      tenantId: getCurrentOrganizationId(),
                      workShopId: getFieldValue('workShopId'),
                    }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="工序">
                {getFieldDecorator('workcellId')(
                  <Lov
                    code="HME.STOCKTAKE_PROCESS"
                    allowClear
                    queryParams={{
                      tenantId: getCurrentOrganizationId(),
                      typeFlag: 'PROCESS',
                      lineId: getFieldValue('lineId'),
                    }}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
        )}
        {expandForm && (
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label='创建人'
              >
                {getFieldDecorator('userId')(<Lov code="HME.USER" queryParams={{ tenantId }} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="创建时间从">
                {getFieldDecorator('createdDateFrom')(
                  <DatePicker
                    showTime
                    placeholder={null}
                    style={{ width: '100%' }}
                    format={getDateTimeFormat()}
                    disabledDate={currentDate =>
                    getFieldValue('createdDateTo') &&
                    (moment(getFieldValue('createdDateTo')).isBefore(currentDate, 'second') ||
                    moment(getFieldValue('createdDateTo')).subtract('days', 7).isAfter(currentDate, 'second'))
                  }
                  />
              )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item label="创建时间至" {...SEARCH_FORM_ITEM_LAYOUT}>
                {getFieldDecorator('createdDateTo')(
                  <DatePicker
                    showTime
                    placeholder={null}
                    style={{ width: '100%' }}
                    format={getDateTimeFormat()}
                    disabledDate={currentDate =>
                    getFieldValue('createdDateFrom') &&
                    (moment(getFieldValue('createdDateFrom')).subtract('days', -7).isBefore(currentDate, 'second')||
                    moment(getFieldValue('createdDateFrom')).isAfter(currentDate, 'second'))
                  }
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
