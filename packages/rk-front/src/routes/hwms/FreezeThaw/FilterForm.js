/**
 * FilterForm - 搜索栏
 * @date: 2019-7-29
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';

import { Form, Button, Input, Row, Col, Select, DatePicker } from 'hzero-ui';
// import {isUndefined} from 'lodash';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import Lov from 'components/Lov';
import moment from 'moment';
import { getCurrentLanguage, getDateFormat, getCurrentOrganizationId } from 'utils/utils';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  FORM_FIELD_CLASSNAME,
} from 'utils/constants';
import { uniq } from 'lodash';
import MultipleLov from '../../../components/MultipleLov/index';
import ModalContainer, { registerContainer } from '../../../components/Modal/ModalContainer';

import { getSiteId } from '@/utils/utils';

const modelPrompt = 'tarzan.acquisition.transformation.model.transformation';

/**
 * 使用 Form.Item 组件
 */
const FormItem = Form.Item;

/**
 * 使用 Select 的 Option 组件
 */
const { Option } = Select;

/**
 * 搜索栏
 * @extends {Component} - React.Component
 * @reactProps {Object} transformation - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ freezeThaw, loading }) => ({
  freezeThaw,
  tenantId: getCurrentOrganizationId(),
  fetchMessageLoading: loading.effects['freezeThaw/queryList'],
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: 'tarzan.acquisition.transformation',
})
export default class FilterForm extends React.Component {
  state = {
    expandForm: false,
    selectedSiteId: '',
    materialLotCode: [],
  };

  // 查询条件展开/收起
  @Bind()
  toggleForm() {
    const { expandForm } = this.state;
    this.setState({ expandForm: !expandForm });
  }

  @Bind()
  handleOnSearch(value, dataListName) {
    const { [dataListName]: dataSource } = this.state;
    const { form } = this.props;
    const flag = value ? value.every(e => dataSource.includes(e)) : false;
    if (value && value.length > 0 && (!flag || dataSource.length === 0)) {
      const newList = value[value.length === 0 ? 0 : value.length - 1].split(/[ ]+/);
      const uniqueList = uniq(dataSource.concat(newList));
      this.setState({ [dataListName]: uniqueList });
      form.setFieldsValue({ [dataListName]: uniqueList });
    } else if (value && value.length > 0 && value.length === dataSource.length) {
      form.setFieldsValue({ [dataListName]: value });
    }
  }

  /**
   * 查询数据
   * @param {object} page 页面基本信息数据
   */
  @Bind()
  fetchQueryList() {
    const { form, onSearch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        onSearch(fieldsValue);
        // dispatch({
        //   type: 's/fetchMessageList',
        //   payload: {
        //     ...fieldsValue,
        //     page: pagination,
        //   },
        // });
      }
    });
  }

  /**
   * 查询按钮点击
   * @returns
   */
  @Bind()
  queryValue() {
    this.fetchQueryList();
  }

  // 设置货位下拉数据
  @Bind
  setWarehouseMap(value) {
    const { dispatch } = this.props;
    // 设置站点id
    this.setState({ selectedSiteId: value });
    dispatch({
      type: 'freezeThaw/queryWarehouseList',
      payload: {
        siteId: value,
      },
    });
  }

  // 设置货位下拉数据
  @Bind
  setLocatorMap(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'freezeThaw/queryLocatorList',
      payload: {
        locatorId: value,
      },
    });
  }

  /**
   * 重置form表单
   */
  @Bind()
  handleFormReset() {
    const { form, onResetSearch } = this.props;
    form.resetFields();
    onResetSearch();
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { expandForm, selectedSiteId, materialLotCode } = this.state;
    const {
      siteMap,
      tenantId,
      form,
      lotStatusMap,
      qualityStatusMap,
      // materialVersionMap,
      // locatorMap,
    } = this.props;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt}.site`).d('工厂')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('siteId', {
                initialValue: getSiteId(),
              })(
                <Select
                  allowClear
                  onChange={value => this.setWarehouseMap(value)}
                  className={FORM_FIELD_CLASSNAME}
                >
                  {siteMap
                    .filter(item => item.siteId !== 'org')
                    .map(n => (
                      <Option key={n.siteId} value={n.siteId}>
                        {n.siteCode}
                      </Option>
                    ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.warehouseCode`).d('仓库')}
            >
              {getFieldDecorator('warehouseId')(
                <MultipleLov
                  code="WMS.WAREHOUSE_LOV"
                  queryParams={{ tenantId, siteId: getFieldValue('siteId') }}
                />
                // <Select
                //   allowClear
                //   onChange={value => this.setLocatorMap(value)}
                //   className={FORM_FIELD_CLASSNAME}
                // >
                //   {warehouseMap
                //     .filter(item => item.warehouseId !== 'org')
                //     .map(n => (
                //       <Option key={n.warehouseId} value={n.warehouseId}>
                //         {n.warehouseCode}
                //       </Option>
                //     ))}
                // </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.locatorCode`).d('货位')}
            >
              {getFieldDecorator('locatorId')(
                <MultipleLov
                  queryParams={{
                    tenantId,
                    siteId: getFieldValue('siteId'),
                    warehouseId: getFieldValue('wareHouseId'),
                  }}
                  code="WMS.LOCATOR_BATCH"
                />
                // <Select allowClear className={FORM_FIELD_CLASSNAME}>
                //   {locatorMap
                //     .filter(item => item.locatorId !== 'org')
                //     .map(n => (
                //       <Option key={n.locatorId} value={n.locatorId}>
                //         {n.locatorCode}
                //       </Option>
                //     ))}
                // </Select>
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
              label={intl.get(`${modelPrompt}.materialLotCode`).d('条码')}
            >
              {getFieldDecorator('materialLotCode')(
                <Select
                  mode='tags'
                  style={{ width: '100%' }}
                  onBlur={val => this.handleOnSearch(val, 'materialLotCode')}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        this.setState({ materialLotCode: [] });
                      }
                    }
                  }
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {materialLotCode.map(e => (
                    <Select.Option key={e} value={e}>
                      {e}
                    </Select.Option>
                  ))}
                </Select>,
                // <Input trim />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.lotStatus`).d('状态')}
            >
              {getFieldDecorator('lotStatus')(
                <Select mode="multiple" allowClear className={FORM_FIELD_CLASSNAME}>
                  {lotStatusMap
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
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.qualityStatus`).d('质量状态')}
            >
              {getFieldDecorator('qualityStatus')(
                <Select mode="multiple" allowClear className={FORM_FIELD_CLASSNAME}>
                  {qualityStatusMap
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
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt}.materialCode`).d('物料编码')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('materialId', {})(
                <Lov
                  code="WMS.SITE_MATERIAL"
                  queryParams={{ tenantId, siteId: selectedSiteId, local: getCurrentLanguage() }}
                  onChange={(value, records) => {
                    form.setFieldsValue({
                      materialName: records.materialName,
                    });
                  }}
                />
              )}
            </Form.Item>
          </Col>
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
              label={intl.get(`${modelPrompt}.materialVersion`).d('版本')}
            >
              {getFieldDecorator('materialVersion')(
                <Input trim />
                // <Select allowClear className={FORM_FIELD_CLASSNAME}>
                //   {materialVersionMap
                //     .filter(item => item.value !== 'org')
                //     .map(n => (
                //       <Option key={n.value} value={n.value}>
                //         {n.meaning}
                //       </Option>
                //     ))}
                // </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.lotCode`).d('批次')}
            >
              {getFieldDecorator('lotCode')(<Input trim />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.supplierLotValue`).d('供应商批次')}
            >
              {getFieldDecorator('supplierLotValue')(
                <Input trim />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.supplierCode`).d('供应商')}
            >
              {getFieldDecorator('supplierId')(
                <Lov
                  onChange={this.setSupplierCode}
                  queryParams={{ tenantId }}
                  code="WMS.SUPPLIER"
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.freezeFlag`).d('冻结标识')}
            >
              {getFieldDecorator('freezeFlag')(
                <Select defaultValue="Y" style={{ width: '100%' }} allowClear>
                  <Select.Option value="Y">
                    {intl.get(`${modelPrompt}.enable`).d('是')}
                  </Select.Option>
                  <Select.Option value="N">
                    {intl.get(`${modelPrompt}.unable`).d('否')}
                  </Select.Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.soNumValue`).d('销售订单')}
            >
              {getFieldDecorator('soNumValue')(
                <Input trim />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.freezeDateFrom`).d('冻结时间从')}
            >
              {getFieldDecorator('freezeDateFrom', {})(
                <DatePicker
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('freezeDateTo') &&
                    moment(getFieldValue('freezeDateTo')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.freezeDateTo`).d('冻结时间至')}
            >
              {getFieldDecorator('freezeDateTo', {})(
                <DatePicker
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('freezeDateFrom') &&
                    moment(getFieldValue('freezeDateFrom')).isAfter(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <ModalContainer ref={registerContainer} />
      </Form>
    );
  }
}
