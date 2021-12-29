import React from 'react';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DEFAULT_DATE_FORMAT,
} from 'utils/constants';
import { Form, Button, Col, Row, Input, DatePicker } from 'hzero-ui';
import { isFunction } from 'lodash';
import Lov from 'components/Lov';
import moment from 'moment';
import cacheComponent, { deleteCache } from 'components/CacheComponent';
import { getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();


// 表单创建
@Form.create({ fieldNameProp: null })
@cacheComponent({ cacheKey: '/hwms/stock-age-report/list' })
export default class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {};
  }

  // 查询方法
  @Bind
  onSearch = () => {
    const { onSearch, form } = this.props;
    form.validateFields((errs) => {
      if (!errs) {
        onSearch();
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
    const { form } = this.props;
    form.resetFields();
    this.props.form.setFieldsValue({
      parentLocatorId: null,
      locatorId: null,
      materialId: null,
    });
    deleteCache('/hwms/stock-age-report/list');
  };

  render() {
    const { form, defaultSite } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { expandForm } = this.state;
    const {
      parentLocatorId = '',
      parentLocator = '',
      locatorId = '',
      locatorCode = '',
      materialId = '',
      materialCode = '',
    } = this.props.form.getFieldsValue();
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='工厂'
            >
              {getFieldDecorator('siteId', {
                initialValue: defaultSite.siteId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '工厂',
                    }),
                  },
                ],
              })(
                <Lov
                  code="MT.SITE"
                  queryParams={{ tenantId }}
                  textValue={defaultSite.siteCode}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='仓库'
            >
              {getFieldDecorator('parentLocatorId', {
                initialValue: parentLocatorId,
              })(
                <Lov
                  code="WMS.ADJUST_WAREHOUSE"
                  queryParams={{ tenantId, siteId: this.props.form.getFieldValue('siteId') }}
                  onChange={(value, item) => {
                    form.setFieldsValue({
                      parentLocator: item.locatorCode,
                    });
                  }}
                  textValue={parentLocator}
                />
              )}
            </Form.Item>
            <Form.Item style={{ display: 'none' }}>
              {getFieldDecorator('parentLocator', {})(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='货位'
            >
              {getFieldDecorator('locatorId', {
                initialValue: locatorId,
              })(
                <Lov
                  code="WMS.LOCATOR_LOV"
                  queryParams={{ tenantId, parentLocatorId: this.props.form.getFieldValue('warehouseId') }}
                  onChange={(value, item) => {
                    form.setFieldsValue({
                      locatorCode: item.locatorCode,
                    });
                  }}
                  textValue={locatorCode}
                />
              )}
            </Form.Item>
            <Form.Item style={{ display: 'none' }}>
              {getFieldDecorator('locatorCode', {})(
                <Input />
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
              <Button onClick={this.resetSearch}>
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
              label='物料编码'
            >
              {getFieldDecorator('materialId', {
                initialValue: materialId,
              })(
                <Lov
                  queryParams={{ tenantId }}
                  code="MT.MATERIAL"
                  textValue={materialCode}
                  onChange={(value, item) => {
                    form.setFieldsValue({
                      materialCode: item.materialCode,
                    });
                  }}
                />
              )}
            </Form.Item>
            <Form.Item style={{ display: 'none' }}>
              {getFieldDecorator('materialCode', {})(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='容器条码'
            >
              {getFieldDecorator('containerCode')(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='实物条码'
            >
              {getFieldDecorator('materialLotCode', {
              })(
                <Input />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='批次'
            >
              {getFieldDecorator('lot')(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='超期日期从'
            >
              {getFieldDecorator('beyondDateFrom')(
                <DatePicker
                  style={{ width: '100%' }}
                  format={DEFAULT_DATE_FORMAT}
                  disabledDate={currentDate =>
                    getFieldValue('beyondDateTo') &&
                    moment(getFieldValue('beyondDateTo')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='超期日期至'
            >
              {getFieldDecorator('beyondDateTo')(
                <DatePicker
                  style={{ width: '100%' }}
                  format={DEFAULT_DATE_FORMAT}
                  disabledDate={currentDate =>
                    getFieldValue('beyondDateFrom') &&
                    moment(getFieldValue('beyondDateFrom')).isAfter(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          {/* <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='库龄'
            >
              {getFieldDecorator('libraryAge')(
                <InputNumber />
              )}
            </Form.Item>
          </Col> */}
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='库龄从'
            >
              {getFieldDecorator('libraryAgeFrom')(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='库龄至'
            >
              {getFieldDecorator('libraryAgeTo')(
                <Input />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
