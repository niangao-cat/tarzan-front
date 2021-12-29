/**
 * FilterForm - 搜索框
 * @date: 2019-8-9
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Button, Input, Row, Col, Select } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import { getCurrentOrganizationId } from 'utils/utils';
import cacheComponent from 'components/CacheComponent';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';

const modelPrompt = 'tarzan.badCode.defectCode.model.defectCode';

/**
 * 使用 Form.Item 组件
 */
const FormItem = Form.Item;
const { Option } = Select;

/**
 * 搜索框
 * @extends {Component} - React.Component
 * @reactProps {Object} workCellList - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ defectCode }) => ({
  defectCode,
}))
@Form.create({ fieldNameProp: null })
@cacheComponent({ cacheKey: '/hmes/badcode/defect-code/list' })
export default class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    props.onRefs(this);
  }

  state = {
    expandForm: false,
    // typeDesc: '',
  };

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

  /**
   * 重置form表单
   */
  @Bind()
  handleFormReset() {
    const { form, resetSearch } = this.props;
    form.resetFields();
    resetSearch();
  }

  // 查询条件展开/收起
  @Bind()
  toggleForm() {
    const { expandForm } = this.state;
    this.setState({ expandForm: !expandForm });
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      form,
      defectCode: { ncTypeList = [] },
    } = this.props;
    const { getFieldDecorator } = form;
    const { expandForm } = this.state;
    const tenantId = getCurrentOrganizationId();
    const {
      siteCode = '',
      ncGroupCode = '',
    } = this.props.form.getFieldsValue();
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.siteId`).d('站点')}
            >
              {getFieldDecorator('siteId')(
                <Lov
                  code="MT.SITE"
                  queryParams={{ tenantId }}
                  // onChange={this.changeCode}
                  textValue={siteCode}
                  onChange={(value, item) => {
                    // this.setState({ typeDesc: item.siteCode });
                    form.setFieldsValue({
                      siteCode: item.siteCode,
                    });
                  }}
                />
              )}
            </Form.Item>
            <Form.Item
              style={{ display: 'none' }}
            >
              {getFieldDecorator('siteCode')(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.ncType`).d('不良代码类型')}
            >
              {getFieldDecorator('ncType')(
                <Select allowClear>
                  {ncTypeList.map(ele => (
                    <Option value={ele.typeCode}>{ele.description}</Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.ncCode`).d('不良代码编码')}
            >
              {getFieldDecorator('ncCode')(<Input trim inputChinese={false} />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <FormItem>
              <Button onClick={this.toggleForm}>
                {expandForm
                  ? intl.get('tarzan.common.button.lessQueries').d('收起查询')
                  : intl.get(`tarzan.common.button.moreQueries`).d('更多查询')}
              </Button>
              <Button onClick={this.handleFormReset}>
                {intl.get('tarzan.common.button.reset').d('重置')}
              </Button>
              <Button type="primary" htmlType="submit" onClick={this.queryValue}>
                {intl.get('tarzan.common.button.search').d('查询')}
              </Button>
            </FormItem>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.ncCodeDesc`).d('不良代码描述')}
            >
              {getFieldDecorator('description')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.ncGroupDesc`).d('不良代码组')}
            >
              {getFieldDecorator('ncGroupId')(
                <Lov
                  code="MT.NC_GROUP"
                  queryParams={{ tenantId }}
                  textValue={ncGroupCode}
                  onChange={(value, item) => {
                    // this.setState({ typeDesc: item.siteCode });
                    form.setFieldsValue({
                      ncGroupCode: item.ncGroupCode,
                    });
                  }}
                />
              )}
            </Form.Item>
            <Form.Item
              style={{ display: 'none' }}
            >
              {getFieldDecorator('ncGroupCode')(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get('tarzan.common.label.enableFlag').d('启用状态')}
            >
              {getFieldDecorator('enableFlag')(
                <Select style={{ width: '100%' }} allowClear>
                  <Option value="Y">{intl.get('tarzan.common.label.enable').d('启用')}</Option>
                  <Option value="N">{intl.get('tarzan.common.label.disable').d('禁用')}</Option>
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
