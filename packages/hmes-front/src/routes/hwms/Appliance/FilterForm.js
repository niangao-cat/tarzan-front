/**
 * 物流器具
 *@date：2019/9/21
 *@author：junhui.liu <junhui.liu@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import React, { Component } from 'react';
import { Form, Button, Row, Col, Select, Input } from 'hzero-ui';
import cacheComponent from 'components/CacheComponent';
import { isFunction } from 'lodash';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import MultipleLov from '@/components/MultipleLov';
import { getCurrentLanguage } from 'utils/utils';
import {
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
} from 'utils/constants';

/**
 *  页面搜索框
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} onSearch - 搜索方法
 * @return React.element
 */
@Form.create({ fieldNameProp: null }) // 创建一个表单对象
@cacheComponent({ cacheKey: '/hwms/appliance/list' })
class FilterForm extends Component {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this); // 子组件form对象传到父组件对象中
    }
    this.state = {
      queryDetailsVisible: false, // 更多查询的收起与展开
    };
  }

  /**
   * 显示或隐藏更多查询条件
   */
  @Bind()
  handleQueryDetails() {
    this.setState({
      queryDetailsVisible: !this.state.queryDetailsVisible,
    });
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
      form.validateFields(err => {
        if (!err) {
          // const isEmpty = fieldsValues.isEmpty ? 'Y' : 'N';
          // const tempObj = {
          //   ...fieldsValues,
          //   isEmpty,
          // };
          onSearch();
        }
      });
    }
  }

  @Bind()
  handleChangeSiteId() {
    const { form } = this.props;
    form.resetFields([ 'wareHouseId', 'locatorId' ]);
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const commonModelPrompt = 'hwms.applianceCreation.model.applianceCreation';
    const { queryDetailsVisible } = this.state;
    const { form, tenantId, statusMap, isEmptyMap, siteList, defaultSite } = this.props;
    const { getFieldDecorator, getFieldValue, resetFields } = form;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${commonModelPrompt}.containerCode`).d('物流器具编码')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('containerCode')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${commonModelPrompt}.status`).d('状态')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('containerStatus')(
                <Select allowClear>
                  {statusMap.map(item => (
                    <Select.Option key={item.value}>{item.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.containerType`).d('物流器具类型')}
            >
              {getFieldDecorator('containerTypeId')(
                <Lov
                  queryParams={{ tenantId }}
                  code="Z.CONTAINER_TYPE"
                  textField="containerTypeCode"
                />
              )}
            </Form.Item>
          </Col>

          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              <Button style={{ marginLeft: 8 }} onClick={this.handleQueryDetails}>
                {queryDetailsVisible
                  ? intl.get('hzero.common.button.retractSearch').d('收起查询')
                  : intl.get('hzero.common.button.moreSearch').d('更多查询')}
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
        <Row
          {...SEARCH_FORM_ROW_LAYOUT}
          style={{ display: queryDetailsVisible ? 'block' : 'none' }}
        >
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.plant`).d('工厂')}
            >
              {getFieldDecorator('siteId', {
                initialValue: defaultSite.siteId,
              })(
                <Select onChange={this.handleChangeSiteId}>
                  {siteList.map(item => (
                    <Select.Option key={item.siteId} value={item.siteId}>
                      {item.siteName}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.warehouse`).d('仓库')}
            >
              {getFieldDecorator('wareHouseId')(
                <MultipleLov
                  code="WMS.WAREHOUSE_LOV"
                  queryParams={{ tenantId, siteId: getFieldValue('siteId') }}
                  onChange={() => {
                    resetFields(['locatorId']);
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${commonModelPrompt}.locator`).d('货位')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('locatorId')(
                <MultipleLov queryParams={{ tenantId, siteId: getFieldValue('siteId'), warehouseId: getFieldValue('wareHouseId') }} code="WMS.LOCATOR_BATCH" />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row
          {...SEARCH_FORM_ROW_LAYOUT}
          style={{ display: queryDetailsVisible ? 'block' : 'none' }}
        >
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.materialCode`).d('物料编码')}
            >
              {getFieldDecorator('materialId')(
                <MultipleLov
                  code="HME.SITE_MATERIAL"
                  queryParams={{ tenantId, local: getCurrentLanguage(), siteId: getFieldValue('siteId') }}
                  textField="materialCode"
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.materialLotCode`).d('物料批')}
            >
              {getFieldDecorator('materialLotCode')(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.isEmptyEquipment`).d('是否空物流器具')}
            >
              {getFieldDecorator('isEmpty')(
                <Select allowClear>
                  {isEmptyMap.map(item => (
                    <Select.Option key={item.value}>{item.meaning}</Select.Option>
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

export default FilterForm;
