import React, { Component } from 'react';
import { Button, Col, Form, Row, Select } from 'hzero-ui';
import { Bind, Throttle } from 'lodash-decorators';
import { isFunction, uniq } from 'lodash';
import intl from 'utils/intl';
import { getCurrentLanguage } from 'utils/utils';
import Lov from 'components/Lov';
import {
  DEBOUNCE_TIME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import MultipleLov from '@/components/MultipleLov';

/**
 *  页面搜索框
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} onSearch - 搜索方法
 * @return React.element
 */
@Form.create({ fieldNameProp: null })
class FilterForm extends Component {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {
      expandForm: false,
      lotCodeList: [],
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
    const { onSearch, form, dispatch } = this.props;
    dispatch({
      type: 'onhandQuery/updateState',
      payload: {
        dataList: [],
        pagination: false,
      },
    });
    if (onSearch) {
      form.validateFields(err => {
        if (!err) {
          const timer = setTimeout(() => {
            onSearch();
            clearTimeout(timer);
          }, 400);
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
    const modelPrompt = 'hwms.materialQuery.model.materialQuery';
    const { expandForm, lotCodeList } = this.state;
    const { form: { getFieldDecorator, getFieldValue, resetFields }, tenantId, siteList, enableMap, defaultSite } = this.props;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt}.site`).d('工厂')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('siteId', {
                initialValue: defaultSite.siteId,
              })(
                <Select
                  allowClear
                  onChange={() => {
                    resetFields(['warehouseId', 'locatorId']);
                  }}
                >
                  {siteList.map(item => (
                    <Select.Option key={item.siteId}>{item.siteName}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.warehouse`).d('仓库')}
            >
              {getFieldDecorator('warehouseId')(
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
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.locatorCode`).d('货位')}
            >
              {getFieldDecorator('locatorId')(
                <MultipleLov
                  queryParams={{
                    tenantId,
                    siteId: getFieldValue('siteId'),
                    warehouseId: getFieldValue('warehouseId'),
                  }}
                  code="WMS.LOCATOR_BATCH"
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              <Button onClick={this.toggleForm}>
                {expandForm
                  ? intl.get('hzero.common.button.collected').d('收起查询')
                  : intl.get('hzero.common.button.viewMore').d('更多查询')}
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
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt}.materialCode`).d('物料')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('materialId')(
                <MultipleLov
                  code="HME.SITE_MATERIAL"
                  queryParams={{ tenantId, local: getCurrentLanguage(), siteId: getFieldValue('siteId')}}
                  lovOptions={{ valueField: 'materialId' }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.lotCode`).d('批次')}
            >
              {getFieldDecorator('lotCodeList')(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  onBlur={val => this.handleOnSearch(val, 'lotCodeList')}
                  onChange={
                    val => {
                      if (val.length === 0) {
                        this.setState({ lotCodeList: [] });
                      }
                    }
                  }
                  allowClear
                  dropdownMatchSelectWidth={false}
                  maxTagCount={2}
                >
                  {lotCodeList.map(e => (
                    <Select.Option key={e} value={e}>
                      {e}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.visible`).d('是否显示备料区')}
            >
              {getFieldDecorator('visible', {
                initialValue: 'N',
              })(
                <Select allowClear>
                  {enableMap.map(item => (
                    <Select.Option key={item.value}>{item.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt}.itemGroupId`).d('物料组')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('itemGroupId')(
                <Lov
                  code="WMS.ITEM_GROUP"
                  queryParams={{ tenantId }}
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
