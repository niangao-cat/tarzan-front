/**
 *送货单查询
 *@date：2019/9/22
 *@author：junhui.liu <junhui.liu@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import React, { Component } from 'react';
import { Form, Input, Row, Col } from 'hzero-ui';
import { isFunction } from 'lodash';
import { Bind } from 'lodash-decorators';
import {
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_CLASSNAME,
} from 'utils/constants';

/**
 *  页面搜索框
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} onSearch - 搜索方法
 * @return React.element
 */
@Form.create({ fieldNameProp: null }) // 创建一个表单对象
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
    form.validateFields(err => {
      if (!err) {
        onSearch();
      }
    });
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
   * render
   * @returns React.element
   */
  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="入库单号">
              {getFieldDecorator('status', {})(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} />
          <Col {...FORM_COL_4_LAYOUT} />
          <Col {...FORM_COL_4_LAYOUT} />
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="工厂" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('workshop', {})(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="事业部" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('workOrderNum', {})(<Input trim />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="车间" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('workOrderNum', {})(<Input trim />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="状态" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('workOrderNum', {})(<Input trim />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default FilterForm;
