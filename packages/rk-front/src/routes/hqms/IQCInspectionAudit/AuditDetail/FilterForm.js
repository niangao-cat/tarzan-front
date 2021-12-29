import React, { Component } from 'react';
import { Form, Button, Input, Row, Col } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import {
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
} from 'utils/constants';
import styles from './index.less';

/**
 *  页面搜索框
 * @extends {Component} - React.Component
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} onSearch - 搜索方法
 * @return React.element
 */
@Form.create({ fieldNameProp: null })
class FilterForm extends Component {
  constructor(props) {
    super(props);
    const { onRef } = props;
    if (onRef) onRef(this);
    this.state = {
      // eslint-disable-next-line react/no-unused-state
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

  // 查询
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

  // 更多查询
  @Bind()
  handleMoreSearch() {
    const { handleMoreSearch } = this.props;
    handleMoreSearch(true);
  }

  // 头数据创建抽屉展开
  @Bind()
  createHeadDataDrawer(flag) {
    const { createHeadDataDrawer } = this.props;
    createHeadDataDrawer(flag);
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const { form } = this.props;
    // eslint-disable-next-line no-empty-pattern
    const {} = this.state;
    const { getFieldDecorator } = form;
    return (
      <Form className={styles.search}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="抽样条码" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('workOrderNum', {})(<Input />)}
            </Form.Item>
          </Col>
          <Col span={12} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              <Button
                data-code="search"
                type="primary"
                htmlType="submit"
                icon="search"
                // onClick={this.handleSearch}
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
