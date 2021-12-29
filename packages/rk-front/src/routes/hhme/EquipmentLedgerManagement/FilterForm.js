/*
 * @Description: 台账管理-查询
 * @version: 0.0.1
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-06-02 10:19:17
 */
import React, { Component } from 'react';
import { Form, Button, Row, Col, Input, Select } from 'hzero-ui';
import cacheComponent from 'components/CacheComponent';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { isFunction, uniq } from 'lodash';
import {
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  FORM_COL_4_LAYOUT,
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
} from 'utils/constants';

const { Option } = Select;


/**
 *  页面搜索框
 * @extends {Component} - React.Component
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} onSearch - 搜索方法
 * @return React.element
 */
@Form.create({ fieldNameProp: null })
@cacheComponent({ cacheKey: '/hhme/equipment-LedgerManagement/list' })
class FilterForm extends Component {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {
      assetEncoding: [],
    };
  }

  // 查询条件展开/收起
  // @Bind()
  // toggleForm() {
  //   const { expandForm } = this.state;
  //   this.setState({ expandForm: !expandForm });
  // }

  /**
   * 表单重置
   */
  @Bind()
  handleFormReset() {
    const { form, clearMoreSearchCache } = this.props;
    form.resetFields();
    clearMoreSearchCache();
  }

  /**
   * 表单校验
   */
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

  // 查询条件展开/收起
  @Bind()
  toggleForm() {
    const { handleMoreSearch } = this.props;
    handleMoreSearch(true);
  }

  @Bind()
  handleOnSearch(value, dataListName) {
    const { [dataListName]: dataSource } = this.state;
    const { form } = this.props;
    const flag = value ? value.every(e => dataSource.includes(e)) : false;
    if (value && value.length > 0 && !flag) {
      const newList = [].concat(...value.map(e => e.split(/[ ]+/)));
      const uniqueList = uniq(dataSource.concat(newList));
      this.setState({ [dataListName]: uniqueList });
      form.setFieldsValue({ [dataListName]: uniqueList });
    }
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const { form, ledgerType, equipmentStatus, equipmentType, managementModeList, applyTypeList } = this.props;
    const { getFieldDecorator } = form;
    const { assetEncoding } = this.state;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col span={18}>
            <Row>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="资产编码">
                  {getFieldDecorator('assetEncoding')(
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      onBlur={val => this.handleOnSearch(val, 'assetEncoding')}
                      onChange={
                        val => {
                          if (val.length === 0) {
                            this.setState({ assetEncoding: [] });
                          }
                        }
                      }
                      allowClear
                      dropdownMatchSelectWidth={false}
                      maxTagCount={2}
                    >
                      {assetEncoding.map(e => (
                        <Select.Option key={e} value={e}>
                          {e}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="资产名称">
                  {getFieldDecorator('assetName')(<Input />)}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`ledgerTypeList`).d('台账类别')}
                >
                  {getFieldDecorator('ledgerTypeList', {
                  })(
                    <Select mode="multiple" allowClear>
                      {ledgerType.map(ele => (
                        <Option value={ele.value} key={ele.value}>{ele.meaning}</Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`equipmentStatusList`).d('设备状态')}
                >
                  {getFieldDecorator('equipmentStatusList', {
                    initialValue: "KY",
                  })(
                    <Select mode="multiple" allowClear>
                      {equipmentStatus.map(ele => (
                        <Option value={ele.value} key={ele.value}>{ele.meaning}</Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`equipmentTypeList`).d('设备类型')}
                >
                  {getFieldDecorator('equipmentTypeList')(
                    <Select mode="multiple" allowClear>
                      {equipmentType.map(ele => (
                        <Option value={ele.value} key={ele.value}>{ele.meaning}</Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`equipmentStatusList`).d('管理模式')}
                >
                  {getFieldDecorator('attribute1')(
                    <Select allowClear>
                      {managementModeList.map(ele => (
                        <Option value={ele.value} key={ele.value}>{ele.meaning}</Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_3_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label={intl.get(`equipmentStatusList`).d('应用类型')}
                >
                  {getFieldDecorator('applyType')(
                    <Select allowClear>
                      {applyTypeList.map(ele => (
                        <Option value={ele.value} key={ele.value}>{ele.meaning}</Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              <Button onClick={this.toggleForm}>
                {intl.get(`tarzan.calendar.working.button.viewMore`).d('更多查询')}
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
      </Form>
    );
  }
}

export default FilterForm;
