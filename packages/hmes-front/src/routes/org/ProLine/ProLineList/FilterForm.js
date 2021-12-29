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
import formatterCollections from 'utils/intl/formatterCollections';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';

const modelPrompt = 'tarzan.org.proline.model.proline';

/**
 * 使用 Form.Item 组件
 */
const FormItem = Form.Item;

/**
 * 使用 Select 的 Option 组件
 */
const { Option } = Select;

/**
 * 搜索框
 * @extends {Component} - React.Component
 * @reactProps {Object} workCellList - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ proline }) => ({
  proline,
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: 'tarzan.org.proline',
})
export default class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  state = {
    expandForm: false,
    proLineType: [],
  };

  componentDidMount() {
    this.fetchProLineType();
  }

  @Bind()
  fetchProLineType = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'proline/fetchProLineType',
      payload: {
        module: 'MODELING',
        typeGroup: 'PROD_LINE_TYPE',
      },
    }).then(res => {
      if (res && res.rows) {
        this.setState({
          proLineType: res.rows,
        });
      }
    });
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
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { expandForm, proLineType } = this.state;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.prodLineCode`).d('生产线编码')}
            >
              {getFieldDecorator('prodLineCode')(<Input trim />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.prodLineName`).d('生产线短描述')}
            >
              {getFieldDecorator('prodLineName')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.description`).d('生产线长描述')}
            >
              {getFieldDecorator('description')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <FormItem>
              <Button onClick={this.toggleForm}>
                {expandForm
                  ? intl.get('tarzan.org.proline.button.collected').d('收起查询')
                  : intl.get(`tarzan.org.proline.button.viewMore`).d('更多查询')}
              </Button>
              <Button onClick={this.handleFormReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button type="primary" htmlType="submit" onClick={this.queryValue}>
                {intl.get('tarzan.org.proline.button.search').d('查询')}
              </Button>
            </FormItem>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.prodLineTypeDesc`).d('生产线类型')}
            >
              {getFieldDecorator('prodLineType')(
                <Select allowClear style={{ width: '100%' }}>
                  {proLineType.map(ele => (
                    <Option value={ele.typeCode}>{ele.description}</Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.enableFlag`).d('启用状态')}
            >
              {getFieldDecorator('enableFlag')(
                <Select allowClear style={{ width: '100%' }}>
                  <Option value="Y">{intl.get(`${modelPrompt}.enable`).d('启用')}</Option>
                  <Option value="N">{intl.get(`${modelPrompt}.unable`).d('禁用')}</Option>
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
